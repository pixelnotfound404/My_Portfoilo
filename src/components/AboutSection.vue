<template>
  <section class="about" id="about">
    <div class="about__bg-text" aria-hidden="true">SCOTT</div>
    <div class="about__content">
      <div class="about__left">
        <span class="section-tag">// ABOUT</span>
        <div class="about__portrait" id="spline-portrait">
          <spline-viewer
            url="https://prod.spline.design/yQ8yalre4fRtZ5yC/scene.splinecode"
            loading-anim-type="spinner-small-dark"
          />
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
const stats = [
  { id: 'stat-1', value: '2',  label: 'Projects Shipped' },
  { id: 'stat-2', value: '5+', label: 'Happy Clients' },
  { id: 'stat-3', value: '1+', label: 'Years Experience' },
]

function scrollToContact() {
  const target = document.getElementById('contact')
  if (!target) return
  const navH = document.getElementById('nav')?.offsetHeight || 70
  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' })
}
</script>
