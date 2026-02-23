<template>
  <div id="page-loader" :class="{ hidden: isHidden }" aria-hidden="true">
    <div class="loader__logo">✦ SCOTT <span>UX</span> &amp; UI LAB</div>
    <div class="loader__bar"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { splitWords } from '@/composables/useAnimations'

const isHidden = ref(false)

onMounted(() => {
  // Split hero headline words before loader hides
  document.querySelectorAll('.hero__headline .hero__line').forEach(splitWords)
  document.querySelectorAll('.section-title').forEach(splitWords)

  setTimeout(() => {
    isHidden.value = true
    // Remove from DOM after transition so it never blocks clicks
    setTimeout(() => {
      document.getElementById('page-loader')?.remove()
    }, 800)

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
