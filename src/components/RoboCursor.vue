<template>
  <div id="robo-cursor" ref="cursorEl">
    <svg class="cursor-arrow" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none">
      <polygon
        points="3,2 3,24 9,18 14,28 17.5,26.5 12.5,16.5 20,16.5"
        fill="#e0ff00"
        stroke="#ffffff"
        stroke-width="1"
        stroke-linejoin="round"
      />
    </svg>
    <div class="cursor-brackets">
      <span></span><span></span><span></span><span></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const cursorEl = ref(null)
let mx = -100, my = -100, cx = -100, cy = -100
let rafId = null

onMounted(() => {
  // Touch detection — disable on coarse pointer devices
  const isCoarse = window.matchMedia('(pointer: coarse)').matches
  const isTouchDevice = isCoarse && navigator.maxTouchPoints > 0
  if (isTouchDevice) {
    document.body.classList.add('touch-device')
    return
  }

  window.addEventListener('touchstart', () => {
    document.body.classList.add('touch-device')
  }, { once: true, passive: true })

  const el = cursorEl.value

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY
    el.style.opacity = '1'
  })
  document.addEventListener('mouseleave', () => { el.style.opacity = '0' })
  document.addEventListener('mouseenter', () => { el.style.opacity = '1' })

  // rAF loop — arrow tip at SVG (3,2)
  const loop = () => {
    cx += (mx - cx) * 0.75
    cy += (my - cy) * 0.75
    el.style.transform = `translate(${cx - 3}px, ${cy - 2}px)`
    rafId = requestAnimationFrame(loop)
  }
  loop()

  // Hover detection
  const hoverTargets = 'a, button, [role="button"], input, select, textarea, label, .project-card'
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) el.classList.add('is-hovering')
  })
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) el.classList.remove('is-hovering')
  })

  // Click ripple + state
  document.addEventListener('mousedown', () => {
    el.classList.add('is-clicking')
    const ripple = document.createElement('div')
    ripple.className = 'cursor-ripple'
    ripple.style.left = `${mx}px`
    ripple.style.top  = `${my}px`
    document.body.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)
  })
  document.addEventListener('mouseup', () => el.classList.remove('is-clicking'))
})

onUnmounted(() => { if (rafId) cancelAnimationFrame(rafId) })
</script>
