<template>
  <PageLoader />
  <RoboCursor />
  <NavBar />
  <main>
    <HeroSection />
    <MarqueeSection />
    <WorkSection />
    <ServicesSection />
    <AboutSection />
    <TrustedSection />
    <ContactSection />
  </main>
  <AppFooter />
</template>

<script setup>
import PageLoader    from '@/components/PageLoader.vue'
import RoboCursor   from '@/components/RoboCursor.vue'
import NavBar       from '@/components/NavBar.vue'
import HeroSection  from '@/components/HeroSection.vue'
import MarqueeSection from '@/components/MarqueeSection.vue'
import WorkSection  from '@/components/WorkSection.vue'
import ServicesSection from '@/components/ServicesSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import TrustedSection from '@/components/TrustedSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import AppFooter    from '@/components/AppFooter.vue'

import { onMounted } from 'vue'
import { useScrollProgress } from '@/composables/useScrollProgress'
import { useActiveNav }      from '@/composables/useActiveNav'
import { useAnimations }     from '@/composables/useAnimations'
import { killSplineBadge }   from '@/composables/useSpline'

onMounted(() => {
  useScrollProgress()
  useActiveNav()
  useAnimations()
  killSplineBadge()
})
</script>
