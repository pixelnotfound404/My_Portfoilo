<template>
  <div class="marquee" aria-hidden="true">
    <div class="marquee__track">
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
const items = ['UX DESIGN','PRODUCT STRATEGY','INTERACTION DESIGN','DESIGN SYSTEMS','USER RESEARCH','PROTOTYPING']
</script>
