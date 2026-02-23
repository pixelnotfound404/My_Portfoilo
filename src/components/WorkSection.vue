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
    pills: ['// ROLE: LEAD UX & UI', '// PLATFORM: MOBILE', '// TEAM PROJECT'],
    tags: 'UX & UI Design · Research · Prototype · E-Commerce',
    link: 'https://www.figma.com/proto/loR9c6xd0fRd7mNWi3WshE/DIGI-Express?page-id=5918%3A17286&node-id=5972-18236&p=f&viewport=1769%2C-126%2C0.87&t=mo66sejkXtz3IxF1-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=5972%3A18236&show-proto-sidebar=1',
    linkId: 'project-link-1',
  },
  {
    id: 'project-2',
    num: '02',
    logo: '/assets/images/kork-logo.png',
    logoAlt: 'KORK App Logo',
    logoId: 'logo-kork',
    splineUrl: 'https://prod.spline.design/PsSaYhTqq5EPaGvX/scene.splinecode',
    title: 'KORK<br/>APP',
    desc: 'An event platform that empowers anyone to host or discover events and purchase tickets seamlessly. Designed during my studies as an ANT scholarship recipient, KORK APP focuses on frictionless event creation, attendee management, and a smooth ticket-booking experience.',
    pills: ['// ROLE: UX DESIGNER', '// PLATFORM: MOBILE', '// ANT SCHOLARSHIP'],
    tags: 'Product Design · Systems · Event Tech',
    link: 'https://www.figma.com/proto/Ras11j82yKgmRwDEzuEDAb/Project_korrk?page-id=201%3A375&node-id=437-186&viewport=2273%2C798%2C0.45&t=dT9iLUETQ2HJXNSD-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1309%3A2320&show-proto-sidebar=1',
    linkId: 'project-link-2',
  },
]
</script>
