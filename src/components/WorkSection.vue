<template>
  <section class="work" id="work">
    <div class="section-header">
      <span class="section-tag">// SELECTED WORK</span>
      <h2 class="section-title">PROJECTS</h2>
    </div>
    <div class="projects-grid">
      <ProjectCard v-for="project in projects" :key="project.id" v-bind="project" />
    </div>
  </section>
</template>

<script setup>
import ProjectCard from './ProjectCard.vue'

const projects = [
  {
    id: 'project-1',
    num: '01',
    logo: '/assets/images/digi-express-logo.jpg',
    logoAlt: 'DIGI Express Logo',
    logoId: 'logo-digi',
    splineUrl: 'https://prod.spline.design/Spfmnt1XPQQEb0nv/scene.splinecode',
    title: 'DIGI<br/>Express',
    desc: 'A cross-border shopping agency app that lets users easily buy products directly from China. Built collaboratively with my team, DIGI Express handles the full purchase-to-delivery flow — from product browsing and order management to real-time shipment tracking.',
    pills: ['// ROLE: LEAD UX & UI', '// QA TESTING', '// PLATFORM: MOBILE', '// TEAM PROJECT'],
    tags: 'UX & UI Design · QA Testing · Research · Prototype · E-Commerce',
    link: '/case/digi-express',
    isRoute: true,
    linkId: 'project-link-1',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.excellence.digi_express',
  },
]
</script>
