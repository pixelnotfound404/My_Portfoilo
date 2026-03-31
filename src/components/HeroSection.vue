<template>
  <section class="hero" id="hero">
    <div class="hero__bg-text" aria-hidden="true">UX LAB</div>

    <div class="spline-container" id="spline-hero" ref="splineContainer">
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

    <div class="hero__content">
      <p class="hero__eyebrow">// EXPERIENCE DESIGN STUDIO</p>
      <h1 class="hero__headline">
        <span class="hero__line">CRAFT</span>
        <span class="hero__line hero__line--accent">BOLD</span>
        <span class="hero__line">UX.</span>
      </h1>
      <div class="hero__sub">
        <p>// I'M SCOTT — A UX DESIGNER &amp; STRATEGIST<br />
          TURNING COMPLEX PROBLEMS INTO<br />
          CLEAN, INTUITIVE EXPERIENCES.</p>
      </div>
    </div>

    <div class="hero__descriptor">
      <span>// DESIGN THAT</span>
      <span>MOVES PEOPLE</span>
    </div>

    <div class="hero__scroll" id="scroll-indicator">
      <div class="hero__scroll-line"></div>
      <span>SCROLL</span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const SPLINE_URL = 'https://prod.spline.design/lUcUV001z-rB7bct/scene.splinecode'

const splineContainer = ref(null)
const splineReady = ref(false)
let loaderTimeout = null

onMounted(() => {
  // Wait for the page loader to finish (1800ms) + a small buffer
  // so the hero entrance animations play smoothly first,
  // THEN inject the Spline viewer to avoid competing for GPU/CPU
  loaderTimeout = setTimeout(() => {
    injectSpline()
  }, 2400) // 1800ms loader + 600ms for hero animations to settle

  // Card tilt effect (unchanged)
  document.querySelectorAll('.project-card').forEach(card => {
    const spline = card.querySelector('.project-card__spline')
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width  - 0.5
      const y = (e.clientY - r.top)  / r.height - 0.5
      card.style.transform = `perspective(900px) rotateY(${x*6}deg) rotateX(${-y*4}deg)`
      if (spline) spline.style.transform = `translateX(${x*12}px) translateY(${y*8}px)`
    })
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1),box-shadow 0.4s'
      card.style.transform = 'none'
      if (spline) { spline.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1)'; spline.style.transform = 'none' }
    })
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s linear,box-shadow 0.4s'
      if (spline) spline.style.transition = 'transform 0.1s linear'
    })
  })

  // Hero headline hover skew
  document.querySelectorAll('.hero__headline .hero__line').forEach(line => {
    line.style.transition = 'transform 0.35s cubic-bezier(0.22,1,0.36,1)'
    line.addEventListener('mouseenter', () => { line.style.transform = 'skewX(-4deg) translateX(6px)' })
    line.addEventListener('mouseleave', () => { line.style.transform = 'none' })
  })
})

onUnmounted(() => {
  if (loaderTimeout) clearTimeout(loaderTimeout)
})

function injectSpline() {
  if (!splineContainer.value) return

  const viewer = document.createElement('spline-viewer')
  viewer.setAttribute('url', SPLINE_URL)
  viewer.setAttribute('loading-anim-type', 'spinner-small-dark')

  // Start invisible, fade in when the 3D scene is ready
  viewer.style.opacity = '0'
  viewer.style.transition = 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)'

  splineContainer.value.appendChild(viewer)

  // The spline-viewer fires a 'load' event when the scene finishes rendering.
  // If that doesn't fire within 6s, show it anyway.
  let revealed = false
  function reveal() {
    if (revealed) return
    revealed = true
    viewer.style.opacity = '1'
    splineReady.value = true
  }

  viewer.addEventListener('load', reveal)
  // Fallback: if the load event never fires (some Spline versions don't),
  // reveal after the scene has had time to initialize
  setTimeout(reveal, 6000)
}
</script>
