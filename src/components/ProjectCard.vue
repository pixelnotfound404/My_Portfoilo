<template>
  <article class="project-card" :id="id">
    <div class="project-card__spline" ref="splineContainer">
      <!-- Spline is injected immediately during load screen -->
      <div v-if="!splineLoaded" class="project-card__spline-placeholder">
        <div class="spline-spinner"></div>
      </div>
    </div>
    <div class="project-card__info">
      <div class="project-card__header">
        <span class="project-card__num">{{ num }}</span>
        <div class="project-card__logo-wrap">
          <img :src="logo" :alt="logoAlt" class="project-card__logo" :id="logoId" loading="lazy" />
        </div>
      </div>
      <h3 class="project-card__title" v-html="title"></h3>
      <p class="project-card__desc">{{ desc }}</p>
      <div class="project-card__meta">
        <span v-for="pill in pills" :key="pill" class="project-card__pill">{{ pill }}</span>
      </div>
      <p class="project-card__tags">{{ tags }}</p>
    </div>
    <a :href="link" target="_blank" class="project-card__link" :id="linkId"
       @click="handleLinkClick">VIEW CASE →</a>
    <span class="project-card__views">
      👁 {{ clickCount }} {{ clickCount === 1 ? 'view' : 'views' }}
    </span>
  </article>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { trackClick, fetchClickCount } from '@/composables/useClickTrack'

const props = defineProps({
  id: String, num: String, logo: String, logoAlt: String, logoId: String,
  splineUrl: String, title: String, desc: String,
  pills: Array, tags: String, link: String, linkId: String,
})

const splineContainer = ref(null)
const splineLoaded    = ref(false)
const clickCount      = ref(0)

onMounted(() => {
  // Inject the Spline viewer IMMEDIATELY so it loads behind the loader screen.
  // The PageLoader will wait for all scenes before revealing the site.
  injectSpline()

  // Fetch existing click count on mount
  const label = 'View Case: ' + (props.title || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  fetchClickCount(label).then(count => { clickCount.value = count })
})

function injectSpline() {
  if (!splineContainer.value || !props.splineUrl) return

  const viewer = document.createElement('spline-viewer')
  viewer.setAttribute('url', props.splineUrl)
  viewer.setAttribute('loading-anim-type', 'spinner-small-dark')

  // Start invisible, fade in when ready
  viewer.style.opacity = '0'
  viewer.style.transition = 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)'

  // Remove placeholder and append viewer
  const placeholder = splineContainer.value?.querySelector('.project-card__spline-placeholder')
  if (placeholder) placeholder.remove()
  splineContainer.value?.appendChild(viewer)

  let revealed = false
  function reveal() {
    if (revealed) return
    revealed = true
    splineLoaded.value = true
    viewer.style.opacity = '1'
    // Notify PageLoader that another scene is ready
    window.dispatchEvent(new CustomEvent('spline-scene-ready', { detail: props.id }))
  }

  viewer.addEventListener('load', reveal)
  // Fallback: if the load event never fires, still report ready after 14s
  setTimeout(reveal, 14000)
}

// Strip HTML from title prop and fire click tracking
async function handleLinkClick() {
  const raw = props.title || ''
  const cleanTitle = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const label = 'View Case: ' + cleanTitle
  const updated = await trackClick(label)
  if (updated !== null) clickCount.value = updated
}
</script>
