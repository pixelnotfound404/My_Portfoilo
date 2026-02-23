<template>
  <div class="marquee" aria-hidden="true">
    <div class="marquee__track" ref="track">
      <!-- Duplicate set for seamless loop -->
      <template v-for="n in 2" :key="n">
        <template v-for="item in items" :key="`${n}-${item}`">
          <span>{{ item }}</span>
          <span class="marquee__dot">✦</span>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const track = ref(null)
const items = ['UX DESIGN','PRODUCT STRATEGY','INTERACTION DESIGN','DESIGN SYSTEMS','USER RESEARCH','PROTOTYPING']

let el = null
const pause  = () => { if (el) el.style.animationPlayState = 'paused' }
const resume = () => { if (el) el.style.animationPlayState = 'running' }

onMounted(() => {
  el = track.value
  track.value?.closest('.marquee')?.addEventListener('mouseenter', pause)
  track.value?.closest('.marquee')?.addEventListener('mouseleave', resume)
})
onUnmounted(() => {
  track.value?.closest('.marquee')?.removeEventListener('mouseenter', pause)
  track.value?.closest('.marquee')?.removeEventListener('mouseleave', resume)
})
</script>
