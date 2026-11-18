<template>
  <section class="hero" id="hero">
    <div class="hero__bg-text" aria-hidden="true">UX LAB</div>

    <!-- 3D Robot — positioned BEHIND the card, half-body visible -->
    <div class="spline-container spline-container--behind" id="spline-hero" ref="splineContainer">
      <!-- Stylish placeholder while Spline loads -->
      <div v-if="!splineReady" class="spline-hero-placeholder">
        <div class="spline-hero-placeholder__grid" aria-hidden="true">
          <span v-for="n in 16" :key="n"></span>
        </div>
        <div class="spline-hero-placeholder__pulse"></div>
        <span class="spline-hero-placeholder__label">// LOADING 3D</span>
      </div>
      <!-- Spline is injected dynamically after the page loader finishes -->
    </div>

    <!-- Hero Card — floating over the robot -->
    <div class="hero-card">
      <div class="hero-card__inner">
        <!-- Left: Text Content -->
        <div class="hero-card__content">
          <span class="hero-card__location">
            <span class="hero-card__location-dot"></span>
            PHNOM PENH, CAMBODIA — TAKING FREELANCE WORK
          </span>

          <p class="hero-card__greeting">&gt; Hello! I'm</p>
          <h1 class="hero-card__name">
            <span class="hero-card__name-line">SAM</span>
            <span class="hero-card__name-line">SOKUNTHEA</span>
          </h1>

          <p class="hero-card__bio">
            I design seamless interfaces and rigorously test every interaction 
            from wireframe to Play Store release, making sure the experience feels right.
          </p>

          <div class="hero-card__title">
            <span class="hero-card__title-tag">&gt; A Detail-Oriented</span>
            <h2 class="hero-card__role">
              <span class="hero-card__role-accent">UX/UI</span>
              <span class="hero-card__role-main">&amp; QA TESTER</span>
            </h2>
          </div>

          <div class="hero-card__actions">
            <a href="#work" class="hero-card__btn hero-card__btn--primary" @click.prevent="scrollTo('work')">View work</a>
            <a href="/Sam-Sokunthea-CV.pdf" target="_blank" rel="noopener noreferrer" class="hero-card__btn hero-card__btn--outline">Resume ↗</a>
          </div>
        </div>

        <!-- Right: Profile Photo Card -->
        <div class="hero-card__photo-wrapper">
          <div class="hero-card__photo-card">
            <div class="hero-card__photo-header">
              <span>PROFILE</span>
              <span>PHOTO</span>
            </div>
            <div class="hero-card__photo-frame">
              <img
                src="/assets/images/profile/490446589_3202793183192845_5020337764931861736_n.jpg"
                alt="Sam Sokunthea"
                loading="eager"
              />
            </div>
            <div class="hero-card__photo-label">UX/UI &amp; QA TESTER</div>
          </div>
        </div>
      </div>
    </div>

    <div class="hero__scroll" id="scroll-indicator">
      <div class="hero__scroll-line"></div>
      <span>SCROLL</span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onActivated, onDeactivated } from 'vue'

const SPLINE_URL = 'https://prod.spline.design/lUcUV001z-rB7bct/scene.splinecode'

const splineContainer = ref(null)
const splineReady = ref(false)
let splineViewer = null
let fallbackTimer = null

function scrollTo(id) {
  const target = document.getElementById(id)
  if (!target) return
  const navH = document.getElementById('nav')?.offsetHeight || 70
  const top = target.getBoundingClientRect().top + window.scrollY - navH
  window.scrollTo({ top, behavior: 'smooth' })
}

onMounted(() => {
  // Inject the Spline scene IMMEDIATELY so it loads behind the loader screen.
  injectSpline()

  // Hero headline hover skew
  document.querySelectorAll('.hero-card__name-line').forEach(line => {
    line.style.transition = 'transform 0.35s cubic-bezier(0.22,1,0.36,1)'
    line.addEventListener('mouseenter', () => { line.style.transform = 'skewX(-4deg) translateX(6px)' })
    line.addEventListener('mouseleave', () => { line.style.transform = 'none' })
  })
})

// ── KeepAlive lifecycle: hide/show Spline instead of destroying it ──
onDeactivated(() => {
  if (splineViewer) {
    splineViewer.style.visibility = 'hidden'
  }
})

onActivated(() => {
  if (splineViewer) {
    splineViewer.style.visibility = 'visible'
  }
})

// Final cleanup
onBeforeUnmount(() => {
  if (fallbackTimer) clearTimeout(fallbackTimer)
  if (splineViewer && splineViewer.parentNode) {
    splineViewer.parentNode.removeChild(splineViewer)
  }
  splineViewer = null
})

function injectSpline() {
  if (!splineContainer.value) return

  const viewer = document.createElement('spline-viewer')
  viewer.setAttribute('url', SPLINE_URL)
  viewer.setAttribute('loading-anim-type', 'spinner-small-dark')

  splineViewer = viewer

  viewer.style.opacity = '0'
  viewer.style.transition = 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)'

  splineContainer.value.appendChild(viewer)

  let notified = false
  function onSplineReady() {
    if (notified) return
    notified = true
    viewer.style.opacity = '1'
    splineReady.value = true
    window.dispatchEvent(new CustomEvent('spline-scene-ready', { detail: 'hero' }))
  }

  viewer.addEventListener('load', onSplineReady)
  fallbackTimer = setTimeout(onSplineReady, 12000)
}
</script>
