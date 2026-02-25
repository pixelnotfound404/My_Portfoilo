<template>
  <!-- Loader is now rendered inline in index.html for instant display -->
  <!-- This component just controls when it hides -->
</template>

<script setup>
import { onMounted } from 'vue'
import { splitWords } from '@/composables/useAnimations'

onMounted(() => {
  // Split hero headline words while loader is still visible
  document.querySelectorAll('.hero__headline .hero__line').forEach(splitWords)
  document.querySelectorAll('.section-title').forEach(splitWords)

  // Give the page a moment to settle, then reveal
  setTimeout(() => {
    const loader = document.getElementById('page-loader')
    if (loader) {
      loader.style.transition = 'opacity 0.6s ease, visibility 0.6s ease'
      loader.style.opacity = '0'
      loader.style.visibility = 'hidden'
      // Re-enable scroll
      document.body.style.overflow = ''

      setTimeout(() => loader.remove(), 700)
    }

    // Kick off hero entrance
    const hero = document.querySelector('.hero')
    if (hero) hero.classList.add('hero--ready')

    setTimeout(() => {
      document.querySelectorAll('.hero__headline .hero__line').forEach(l => {
        l.classList.add('words-visible')
      })
    }, 200)
  }, 1800)
})
</script>
