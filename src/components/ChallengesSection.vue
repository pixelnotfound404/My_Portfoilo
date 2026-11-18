<template>
  <section class="challenges" id="challenges">
    <div class="section-header">
      <span class="section-tag">// CHALLENGES I CHASE</span>
      <h2 class="section-title">WHERE DESIGN<br/>MEETS QUALITY</h2>
    </div>

    <div class="challenges__list">
      <div
        v-for="(item, i) in items"
        :key="item.id"
        class="challenges__item"
        :class="{ 'is-active': activeIndex === i }"
        @mouseenter="activeIndex = i"
        @mouseleave="activeIndex = null"
      >
        <span class="challenges__num">{{ String(i + 1).padStart(2, '0') }}</span>

        <div class="challenges__body">
          <h3 class="challenges__title">{{ item.title }}</h3>
          <div class="challenges__cols">
            <div class="challenges__col">
              <span class="challenges__col-label">THE PROBLEM</span>
              <p class="challenges__col-text">{{ item.problem }}</p>
            </div>
            <div class="challenges__col">
              <span class="challenges__col-label">MY APPROACH</span>
              <p class="challenges__col-text">{{ item.approach }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const activeIndex = ref(null)

const items = [
  {
    id: 'ch-1',
    title: 'BROKEN USER FLOWS',
    problem: 'Apps ship with flows that look fine on a spec sheet but break the moment a real user touches them.',
    approach: 'Walk every path myself first. If I can get lost in it, users will too — I document it and fix it before anyone else sees it.',
  },
  {
    id: 'ch-2',
    title: 'DESIGN–DEV GAPS',
    problem: 'What looks pixel-perfect in Figma often arrives in production with misaligned spacing, wrong colours, and missing states.',
    approach: 'Stay close to the build. I cross-check every screen against the design and report deviations directly to the dev team with clear before/after evidence.',
  },
  {
    id: 'ch-3',
    title: 'SILENT EDGE CASES',
    problem: 'The bugs that never appear in demos — empty states, slow networks, back-button quirks — are the ones users hit every day.',
    approach: 'Test the unhappy paths as hard as the happy ones. I deliberately break things so the product holds up when real life does it instead.',
  },
  {
    id: 'ch-4',
    title: 'CLUTTERED INTERFACES',
    problem: 'Too many features, too little hierarchy. Users freeze when they can\'t tell what to do next.',
    approach: 'Strip back to what matters. Clear visual hierarchy, guided flow, and just enough friction to feel intentional — not overwhelming.',
  },
]
</script>
