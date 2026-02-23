<template>
  <nav class="nav" :class="{ scrolled: isScrolled }" id="nav">
    <a href="#hero" class="nav__logo" @click.prevent="scrollTo('hero')">
      <span style="color:#e0ff00;text-shadow:0 0 8px #e0ff00">✦</span> SCOTT UX &amp; UI LAB
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

    <a href="#contact" class="nav__cta" id="nav-hire" @click.prevent="scrollTo('contact')">
      // LET'S TALK ↗
    </a>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled     = ref(false)
const activeSection  = ref('hero')

const links = [
  { id: 'hero',     label: 'HOME'     },
  { id: 'work',     label: 'WORK'     },
  { id: 'services', label: 'SERVICES' },
  { id: 'about',    label: 'ABOUT'    },
  { id: 'contact',  label: 'CONTACT'  },
]

function scrollTo(id) {
  const target = document.getElementById(id)
  if (!target) return
  const navH = document.getElementById('nav')?.offsetHeight || 70
  const top  = target.getBoundingClientRect().top + window.scrollY - navH
  window.scrollTo({ top, behavior: 'smooth' })
}

function updateActive() {
  const navH   = document.getElementById('nav')?.offsetHeight || 70
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
