<template>
  <article class="project-card" :id="id">
    <div class="project-card__spline" ref="splineContainer">
      <!-- Spline is injected only when the card scrolls into view -->
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
    <a :href="link" target="_blank" class="project-card__link" :id="linkId">VIEW CASE →</a>
  </article>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  id: String, num: String, logo: String, logoAlt: String, logoId: String,
  splineUrl: String, title: String, desc: String,
  pills: Array, tags: String, link: String, linkId: String,
})

const splineContainer = ref(null)
const splineLoaded = ref(false)
let observer = null

onMounted(() => {
  // Use IntersectionObserver to lazy-load the Spline viewer
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !splineLoaded.value) {
        splineLoaded.value = true
        // Create the spline-viewer element dynamically
        const viewer = document.createElement('spline-viewer')
        viewer.setAttribute('url', props.splineUrl)
        viewer.setAttribute('loading-anim-type', 'spinner-small-dark')
        // Remove placeholder and append viewer
        const placeholder = splineContainer.value?.querySelector('.project-card__spline-placeholder')
        if (placeholder) placeholder.remove()
        splineContainer.value?.appendChild(viewer)
        observer.disconnect()
      }
    })
  }, {
    rootMargin: '200px 0px', // Start loading 200px before it's visible
    threshold: 0
  })

  if (splineContainer.value) {
    observer.observe(splineContainer.value)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>
