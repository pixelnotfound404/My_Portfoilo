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
    <a v-if="isRoute" :href="link" class="project-card__link" :id="linkId"
       @click.prevent="handleRouteClick">VIEW CASE →</a>
    <a v-else :href="link" target="_blank" class="project-card__link" :id="linkId"
       @click="handleLinkClick">VIEW CASE →</a>
    <span class="project-card__views">
      👁 {{ clickCount }} {{ clickCount === 1 ? 'view' : 'views' }}
    </span>
  </article>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onActivated, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import { trackClick, fetchClickCount } from '@/composables/useClickTrack'

const router = useRouter()

const props = defineProps({
  id: String, num: String, logo: String, logoAlt: String, logoId: String,
  splineUrl: String, title: String, desc: String,
  pills: Array, tags: String, link: String, linkId: String,
  isRoute: { type: Boolean, default: false },
})

const splineContainer = ref(null)
const splineLoaded    = ref(false)
const clickCount      = ref(0)
let splineViewer      = null
let fallbackTimer     = null

onMounted(() => {
  // Inject the Spline viewer IMMEDIATELY so it loads behind the loader screen.
  // The PageLoader will wait for all scenes before revealing the site.
  injectSpline()

  // Fetch existing click count on mount
  const label = 'View Case: ' + (props.title || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  fetchClickCount(label).then(count => { clickCount.value = count })
})

// ── KeepAlive lifecycle: hide/show Spline instead of destroying it ──
onDeactivated(() => {
  if (splineViewer) splineViewer.style.visibility = 'hidden'
})

onActivated(() => {
  if (splineViewer) splineViewer.style.visibility = 'visible'
})

// Final cleanup: only runs when the component is truly destroyed
onBeforeUnmount(() => {
  if (fallbackTimer) clearTimeout(fallbackTimer)
  if (splineViewer && splineViewer.parentNode) {
    splineViewer.parentNode.removeChild(splineViewer)
  }
  splineViewer = null
})

function injectSpline() {
  if (!splineContainer.value || !props.splineUrl) return

  const viewer = document.createElement('spline-viewer')
  viewer.setAttribute('url', props.splineUrl)
  viewer.setAttribute('loading-anim-type', 'spinner-small-dark')

  // Keep a reference for cleanup
  splineViewer = viewer

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
  fallbackTimer = setTimeout(reveal, 14000)
}

// For internal route links: navigate via router.
// With KeepAlive, HomePage stays alive — no unmount crash to worry about.
function handleRouteClick() {
  fireClickTracking()
  router.push(props.link)
}

// For external links: just fire analytics
function handleLinkClick() {
  fireClickTracking()
}

function fireClickTracking() {
  const raw = props.title || ''
  const cleanTitle = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const label = 'View Case: ' + cleanTitle
  trackClick(label).then(updated => {
    if (updated !== null) clickCount.value = updated
  })
}
</script>

