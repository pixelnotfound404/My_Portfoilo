<template>
  <section class="about" id="about">
    <div class="about__bg-text" aria-hidden="true">SCOTT</div>
    <div class="about__content">
      <div class="about__left">
        <span class="section-tag">// ABOUT</span>
        <div class="about__portrait" id="spline-portrait" ref="portraitContainer">
          <!-- Lazy-loaded: Spline viewer is injected when section scrolls into view -->
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
import { ref, onMounted, onUnmounted } from 'vue'

const SPLINE_URL = 'https://prod.spline.design/yQ8yalre4fRtZ5yC/scene.splinecode'

const stats = [
  { id: 'stat-1', value: '2',  label: 'Projects Shipped' },
  { id: 'stat-2', value: '5+', label: 'Happy Clients' },
  { id: 'stat-3', value: '1+', label: 'Years Experience' },
]

const portraitContainer = ref(null)
const splineLoaded = ref(false)
let observer = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !splineLoaded.value) {
        splineLoaded.value = true
        const viewer = document.createElement('spline-viewer')
        viewer.setAttribute('url', SPLINE_URL)
        viewer.setAttribute('loading-anim-type', 'spinner-small-dark')
        const placeholder = portraitContainer.value?.querySelector('.spline-placeholder')
        if (placeholder) placeholder.remove()
        portraitContainer.value?.appendChild(viewer)
        observer.disconnect()
      }
    })
  }, {
    rootMargin: '300px 0px',
    threshold: 0
  })

  if (portraitContainer.value) {
    observer.observe(portraitContainer.value)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

function scrollToContact() {
  const target = document.getElementById('contact')
  if (!target) return
  const navH = document.getElementById('nav')?.offsetHeight || 70
  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' })
}
</script>
