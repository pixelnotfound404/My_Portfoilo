<template>
  <section class="experience" id="experience">
    <div class="section-header">
      <span class="section-tag">// WHERE I'VE WORKED</span>
      <h2 class="section-title">EXPERIENCE</h2>
    </div>

    <div class="exp-cards">
      <article v-for="job in jobs" :key="job.id" class="exp-card" :id="job.id">
        <!-- Left: company info -->
        <div class="exp-card__left">
          <div class="exp-card__logo-wrap">
            <img :src="job.logo" :alt="job.company + ' logo'" class="exp-card__logo" />
          </div>
          <div class="exp-card__company-info">
            <h3 class="exp-card__company">{{ job.company }}</h3>
            <span class="exp-card__location">{{ job.location }}</span>
          </div>
        </div>

        <!-- Right: role details -->
        <div class="exp-card__right">
          <div class="exp-card__role-header">
            <h4 class="exp-card__role">{{ job.role }}</h4>
            <span class="exp-card__date">{{ job.date }}</span>
          </div>

          <ul class="exp-card__tasks">
            <li v-for="(task, i) in job.tasks" :key="i">{{ task }}</li>
          </ul>

          <div class="exp-card__tools">
            <span v-for="tool in job.tools" :key="tool" class="exp-card__tool">{{ tool }}</span>
          </div>
        </div>

        <!-- Status badge -->
        <span v-if="job.current" class="exp-card__status">
          <span class="exp-card__status-dot"></span>
          CURRENT
        </span>
      </article>
    </div>
  </section>
</template>

<script setup>
const jobs = [
  {
    id: 'exp-1',
    company: 'DIGI EXPRESS',
    logo: '/assets/images/digi-express-logo.jpg',
    role: 'UX/UI Designer & QA Tester',
    date: 'MAY 2025 — PRESENT',
    location: 'Stung Meanchey, Phnom Penh',
    current: true,
    tasks: [
      'Design and iterate on mobile app interfaces using Figma, from wireframes to high-fidelity screens for the cross-border shopping experience.',
      'Conduct manual QA testing across Android devices, verifying user flows including product browsing, cart, checkout, and shipment tracking.',
      'Identify, document, and report bugs directly to the development team with detailed reproduction steps and screenshots.',
      'Collaborate with developers to ensure design-to-code accuracy and resolve UI inconsistencies before each release.',
      'Validate end-to-end purchase and delivery flows to guarantee a smooth user experience from order to doorstep.',
    ],
    tools: ['FIGMA', 'MANUAL TESTING', 'BUG REPORTING', 'ANDROID', 'TEAM COLLABORATION'],
  },
]
</script>
