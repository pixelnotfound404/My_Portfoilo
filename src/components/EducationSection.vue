<template>
  <section class="education" id="education">
    <div class="section-header">
      <span class="section-tag">// WHERE I LEARNED</span>
      <h2 class="section-title">EDUCATION</h2>
    </div>

    <div class="edu-cards">
      <article v-for="edu in education" :key="edu.id" class="edu-card" :id="edu.id">

        <!-- Status badge -->
        <span v-if="edu.graduated" class="edu-card__status">
          <span class="edu-card__status-dot"></span>
          GRADUATED
        </span>

        <!-- Left panel -->
        <div class="edu-card__left">
          <div class="edu-card__icon-wrap">
            <!-- Graduation cap — RUPP -->
            <svg v-if="edu.iconType === 'cap'" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="edu-card__icon" aria-hidden="true">
              <path d="M32 10L4 24l28 14 28-14L32 10z" fill="currentColor" opacity="0.9"/>
              <path d="M16 31v14c0 4 7.2 9 16 9s16-5 16-9V31" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7"/>
              <path d="M56 24v14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              <circle cx="56" cy="40" r="3" fill="currentColor" opacity="0.8"/>
            </svg>
            <!-- Paint palette & brush — ANT Design -->
            <svg v-else-if="edu.iconType === 'design'" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="edu-card__icon" aria-hidden="true">
              <!-- Palette body -->
              <path d="M32 8C19.3 8 9 17.4 9 29c0 7.2 4.1 13.5 10.3 17.1 1.5.9 2.4 2.5 2.2 4.2-.2 2.1 1.2 4.1 3.4 4.6C26.5 55.3 29.2 56 32 56c12.7 0 23-9.4 23-21S44.7 8 32 8z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.8"/>
              <!-- Paint dots on palette -->
              <circle cx="22" cy="24" r="3.5" fill="currentColor" opacity="0.9"/>
              <circle cx="32" cy="18" r="3.5" fill="currentColor" opacity="0.9"/>
              <circle cx="42" cy="24" r="3.5" fill="currentColor" opacity="0.9"/>
              <circle cx="44" cy="36" r="3.5" fill="currentColor" opacity="0.9"/>
              <!-- Thumb hole -->
              <circle cx="22" cy="38" r="4" stroke="currentColor" stroke-width="2" fill="none" opacity="0.6"/>
            </svg>
          </div>
          <div class="edu-card__school-info">
            <h3 class="edu-card__school">{{ edu.school }}</h3>
            <span class="edu-card__abbr">{{ edu.abbr }}</span>
          </div>
        </div>

        <!-- Right panel -->
        <div class="edu-card__right">
          <div class="edu-card__role-header">
            <div>
              <h4 class="edu-card__degree">{{ edu.degree }}</h4>
              <p class="edu-card__major">{{ edu.major }}</p>
            </div>
            <span class="edu-card__date">{{ edu.date }}</span>
          </div>

          <p class="edu-card__desc">{{ edu.desc }}</p>

          <div v-if="edu.topics?.length" class="edu-card__topics">
            <span class="edu-card__topics-label">// COURSEWORK</span>
            <div class="edu-card__topics-list">
              <span v-for="t in edu.topics" :key="t" class="edu-card__topic">{{ t }}</span>
            </div>
          </div>

          <div class="edu-card__highlights">
            <span v-for="h in edu.highlights" :key="h" class="edu-card__highlight">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                <polygon points="5,0 6.5,3.5 10,4 7.3,6.7 8,10 5,8.3 2,10 2.7,6.7 0,4 3.5,3.5"/>
              </svg>
              {{ h }}
            </span>
          </div>
        </div>

      </article>
    </div>
  </section>
</template>

<script setup>
const education = [
  {
    id: 'edu-1',
    school: 'Royal University of Phnom Penh',
    abbr: 'RUPP',
    degree: 'Bachelor of Science',
    major: 'Computer Science',
    date: '2021 — 2025',
    graduated: true,
    iconType: 'cap',
    desc: 'Studied core principles of software engineering, algorithms, data structures, and system design. Developed a strong technical foundation while applying design thinking and user-centered methodologies — bridging the gap between engineering and product experience.',
    highlights: [],
    topics: ['Algorithms', 'Data Structures', 'Software Engineering', 'System Design', 'Database', 'Web Development', 'OOP', 'Networking'],
  },
  {
    id: 'edu-2',
    school: 'ANT Training Center',
    abbr: 'ANT',
    degree: 'UX/UI Design',
    major: 'Full Scholarship Program',
    date: '2024 — 2025',
    graduated: true,
    iconType: 'design',
    desc: 'Completed an intensive UX/UI design program on a full merit-based scholarship. Covered end-to-end product design — user research, wireframing, prototyping, and high-fidelity UI using Figma — with a focus on mobile-first and real-world application design.',
    highlights: ['ANT Scholarship Recipient', 'Full Scholarship — UX/UI Design'],
    topics: ['User Research', 'Wireframing', 'Prototyping', 'Figma', 'Mobile UI', 'Design Systems', 'Usability Testing', 'Visual Design'],
  },
]
</script>
