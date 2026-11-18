<template>
  <nav class="nav" :class="{ scrolled: isScrolled }" id="nav">
    <a href="#hero" class="nav__logo" @click.prevent="scrollTo('hero')">
      <span style="color:#60a5fa;text-shadow:0 0 8px #60a5fa">✦</span> SAM SOKUNTHEA
    </a>

    <ul class="nav__links">
      <li v-for="link in links" :key="link.id">
        <a
          :href="`#${link.id}`"
          :id="`nav-${link.id}`"
          :class="{ active: activeSection === link.id }"
          @click.prevent="scrollTo(link.id)"
        >{{ link.label }}</a>
      </li>
    </ul>

    <div class="nav__right">
      <!-- Theme toggle -->
      <button class="nav__theme-toggle" @click="toggleTheme" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        <!-- Sun — shown in dark mode -->
        <svg v-if="isDark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
        <!-- Moon — shown in light mode -->
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

      <a href="#contact" class="nav__cta" id="nav-hire" @click.prevent="scrollTo('contact')">
        <span>// LET'S TALK ↗</span>
      </a>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const isScrolled    = ref(false)
const activeSection = ref('hero')
const { isDark, toggleTheme } = useTheme()

const links = [
  { id: 'hero',       label: 'HOME'       },
  { id: 'work',       label: 'WORK'       },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'about',      label: 'ABOUT'      },
]

function scrollTo(id) {
  const target = document.getElementById(id)
  if (!target) return
  const navH = document.getElementById('nav')?.offsetHeight || 70
  const top  = target.getBoundingClientRect().top + window.scrollY - navH
  window.scrollTo({ top, behavior: 'smooth' })
}

function updateActive() {
  const navH    = document.getElementById('nav')?.offsetHeight || 70
  const scrollY = window.scrollY + navH + 10
  const sections = [...document.querySelectorAll('section[id]')]
  let current = sections[0]
  sections.forEach(s => { if (s.offsetTop <= scrollY) current = s })
  if (current) activeSection.value = current.id
}

function onScroll() {
  isScrolled.value = window.scrollY > 60
  updateActive()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  updateActive()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>
