<template>
  <!-- Loader is rendered inline in index.html for instant display -->
  <!-- This component controls when it hides, based on Spline asset readiness -->
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { splitWords } from '@/composables/useAnimations'

let cleanupFn = null

onMounted(() => {
  const loader = document.getElementById('page-loader')
  const progressFill = document.getElementById('loader-progress-fill')
  const progressText = document.getElementById('loader-progress-text')

  if (!loader) return

  // Pre-split hero headline words while loader is still visible
  document.querySelectorAll('.hero__headline .hero__line').forEach(splitWords)
  document.querySelectorAll('.section-title').forEach(splitWords)

  // ── Simulated progress bar (eases toward 90%, waits for Spline) ──
  let progress = 0
  const progressInterval = setInterval(() => {
    const remaining = 90 - progress
    progress += remaining * 0.04
    const val = Math.round(Math.min(progress, 90))
    if (progressFill) progressFill.style.width = `${val}%`
    if (progressText) progressText.textContent = `${val}%`
  }, 100)

  // ── Reveal logic ──
  const mountedAt = performance.now()
  const MIN_DISPLAY_MS = 1500 // don't flash the loader too briefly
  let revealed = false

  function revealSite() {
    if (revealed) return
    revealed = true
    clearInterval(progressInterval)

    // How long has the loader been visible?
    const elapsed = performance.now() - mountedAt
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)

    // Wait until minimum time passes, then do the reveal
    setTimeout(() => {
      // Snap to 100%
      if (progressFill) progressFill.style.width = '100%'
      if (progressText) progressText.textContent = '100%'

      // Brief pause at 100% for visual satisfaction
      setTimeout(() => {
        loader.style.transition = 'opacity 0.6s ease, visibility 0.6s ease'
        loader.style.opacity = '0'
        loader.style.visibility = 'hidden'
        document.body.classList.remove('is-loading')

        setTimeout(() => loader.remove(), 700)

        // Kick off hero entrance animations
        const hero = document.querySelector('.hero')
        if (hero) hero.classList.add('hero--ready')

        setTimeout(() => {
          document.querySelectorAll('.hero__headline .hero__line').forEach(l => {
            l.classList.add('words-visible')
          })
        }, 200)
      }, 400)
    }, remaining)
  }

  // Listen for the custom event from HeroSection when the Spline scene is ready
  window.addEventListener('spline-hero-ready', revealSite)

  // Fallback: if Spline takes too long (slow network / blocked), reveal after 15s
  const fallbackTimer = setTimeout(revealSite, 15000)

  cleanupFn = () => {
    clearInterval(progressInterval)
    clearTimeout(fallbackTimer)
    window.removeEventListener('spline-hero-ready', revealSite)
  }
})

onUnmounted(() => {
  if (cleanupFn) cleanupFn()
})
</script>
