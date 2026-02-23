<template>
  <section class="services" id="services">
    <div class="section-header">
      <span class="section-tag">// WHAT I DO</span>
      <h2 class="section-title">SERVICES</h2>
    </div>
    <div class="services__grid">
      <div v-for="s in services" :key="s.id" class="service-item" :id="s.id">
        <span class="service-item__num">{{ s.num }}</span>
        <h3 class="service-item__title" v-html="s.title"></h3>
        <p class="service-item__desc">{{ s.desc }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const services = [
  { id: 'service-1', num: '01', title: 'UX RESEARCH<br/>& STRATEGY',     desc: 'Deep user interviews, journey mapping, and data-driven insights that anchor every design decision.' },
  { id: 'service-2', num: '02', title: 'PRODUCT<br/>DESIGN',             desc: 'End-to-end UI/UX design — wireframes to polished, pixel-perfect interfaces ready for development.' },
  { id: 'service-3', num: '03', title: 'DESIGN<br/>SYSTEMS',             desc: 'Scalable component libraries and token-based systems that keep teams aligned and ship faster.' },
  { id: 'service-4', num: '04', title: 'INTERACTIVE<br/>PROTOTYPING',    desc: 'High-fidelity prototypes and 3D interactive experiences that bring ideas to life before a single line of code.' },
]
</script>
