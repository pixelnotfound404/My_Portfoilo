<template>
  <section class="about" id="about">
    <div class="about__bg-text" aria-hidden="true">SCOTT</div>
    <div class="about__content">
      <div class="about__left">
        <span class="section-tag">// ABOUT</span>
        <div class="about__portrait" id="spline-portrait" ref="portraitContainer">
          <!-- Spline is injected immediately during load screen -->
          <div v-if="!splineLoaded" class="spline-placeholder">
            <div class="spline-spinner"></div>
          </div>
        </div>
      </div>
      <div class="about__right">
        <h2 class="about__headline">I DESIGN<br/>EXPERIENCES<br/><em>PEOPLE LOVE.</em></h2>
        <p class="about__body">
          With 1+ years designing for startups and enterprise teams alike, I bridge the gap between
          complex systems and the humans using them. I believe great UX is invisible — it just works.
        </p>
        <div class="about__stats">
          <div v-for="stat in stats" :key="stat.id" class="stat" :id="stat.id">
            <span class="stat__num">{{ stat.value }}</span>
            <span class="stat__label">{{ stat.label }}</span>
          </div>
        </div>
        <a href="#contact" class="btn-primary" id="about-cta" @click.prevent="scrollToContact">WORK WITH ME →</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onActivated, onDeactivated } from 'vue'

const SPLINE_URL = 'https://prod.spline.design/yQ8yalre4fRtZ5yC/scene.splinecode'

const stats = [
  { id: 'stat-1', value: '2',  label: 'Projects Shipped' },
  { id: 'stat-2', value: '5+', label: 'Happy Clients' },
  { id: 'stat-3', value: '1+', label: 'Years Experience' },
]

const portraitContainer = ref(null)
const splineLoaded = ref(false)
let splineViewerEl = null

onMounted(() => {
  // Inject the Spline viewer IMMEDIATELY so it loads behind the loader screen.
  // The PageLoader will wait for all scenes before revealing the site.
  injectSpline()
})

function injectSpline() {
  if (!portraitContainer.value) return

  const viewer = document.createElement('spline-viewer')
  viewer.setAttribute('url', SPLINE_URL)
  viewer.setAttribute('loading-anim-type', 'spinner-small-dark')

  // Start invisible, fade in when ready
  viewer.style.opacity = '0'
  viewer.style.transition = 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)'

  const placeholder = portraitContainer.value?.querySelector('.spline-placeholder')
  if (placeholder) placeholder.remove()
  portraitContainer.value?.appendChild(viewer)

  // Keep reference for KeepAlive hide/show
  splineViewerEl = viewer

  let revealed = false
  function reveal() {
    if (revealed) return
    revealed = true
    splineLoaded.value = true
    viewer.style.opacity = '1'
    // Notify PageLoader that another scene is ready
    window.dispatchEvent(new CustomEvent('spline-scene-ready', { detail: 'about-portrait' }))
  }

  viewer.addEventListener('load', reveal)
  // Fallback: if the load event never fires, still report ready after 14s
  setTimeout(reveal, 14000)
}

// ── KeepAlive lifecycle: hide/show Spline instead of destroying it ──
onDeactivated(() => {
  if (splineViewerEl) splineViewerEl.style.visibility = 'hidden'
})

onActivated(() => {
  if (splineViewerEl) splineViewerEl.style.visibility = 'visible'
})

function scrollToContact() {
  const target = document.getElementById('contact')
  if (!target) return
  const navH = document.getElementById('nav')?.offsetHeight || 70
  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' })
}
</script>
