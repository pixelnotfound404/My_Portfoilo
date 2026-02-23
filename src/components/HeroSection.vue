<template>
  <section class="hero" id="hero">
    <div class="hero__bg-text" aria-hidden="true">UX LAB</div>

    <div class="spline-container" id="spline-hero">
      <spline-viewer
        url="https://prod.spline.design/lUcUV001z-rB7bct/scene.splinecode"
        loading-anim-type="spinner-small-dark"
      />
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
import { onMounted } from 'vue'

onMounted(() => {
  // Card tilt effect
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
</script>
