<template>
  <!-- Tall spacer creates vertical scroll room for the horizontal pan -->
  <div class="hflow" ref="wrapper">
    <!-- Sticky viewport: pins while user scrolls through the spacer -->
    <div class="hflow__sticky">
      <!-- Horizontal track: translates left based on scroll progress -->
      <div class="hflow__track" :style="{ transform: `translateX(${-scrollX}px)` }">

        <!-- Each element fades in based on scroll progress -->
        <div v-for="(el, i) in elements" :key="i"
             class="hflow__item"
             :class="[
               el.type,
               { 'hflow__item--in': progress >= el.at }
             ]">

          <!-- Node -->
          <template v-if="el.type === 'node'">
            <div class="hflow__node" :class="el.cls">
              <span v-if="el.icon" class="hflow__icon">{{ el.icon }}</span>
              <span class="hflow__label">{{ el.label }}</span>
              <span v-if="el.sub" class="hflow__sub">{{ el.sub }}</span>
              <div v-if="el.chips" class="hflow__chips">
                <span v-for="c in el.chips" :key="c.text"
                      class="hflow__chip" :class="c.cls">{{ c.text }}</span>
              </div>
            </div>
          </template>

          <!-- Arrow -->
          <template v-if="el.type === 'arrow'">
            <svg class="hflow__arrow" viewBox="0 0 80 40">
              <line x1="0" y1="20" x2="62" y2="20"/>
              <polygon points="58,10 80,20 58,30"/>
            </svg>
          </template>

          <!-- Pill (start/end) -->
          <template v-if="el.type === 'pill'">
            <div class="hflow__pill" :class="el.cls">
              <span class="hflow__pill-dot" :class="el.dotCls"></span>
              <span class="hflow__pill-text" :class="el.textCls">{{ el.label }}</span>
            </div>
          </template>

          <!-- Diamond decision -->
          <template v-if="el.type === 'decision'">
            <div class="hflow__decision">
              <!-- NO branch: error/waiting node on top -->
              <div class="hflow__branch-no">
                <div class="hflow__node hflow__node--sm" :class="el.noCls">
                  <span class="hflow__icon">{{ el.noIcon }}</span>
                  <span class="hflow__label">{{ el.noLabel }}</span>
                  <span class="hflow__sub">{{ el.noSub }}</span>
                </div>
              </div>

              <!-- RED upward arrow with NO badge -->
              <div class="hflow__no-arrow-wrap">
                <span class="hflow__badge hflow__badge--no">NO</span>
                <svg class="hflow__arrow-no" viewBox="0 0 40 70">
                  <line x1="20" y1="70" x2="20" y2="18"/>
                  <polygon points="8,24 20,0 32,24"/>
                </svg>
              </div>

              <!-- Diamond bounding area (170x170 = rotated 120x120) -->
              <div class="hflow__diamond-area">
                <div class="hflow__diamond">
                  <span v-html="el.label"></span>
                </div>
              </div>

              <!-- GREEN right arrow with YES badge -->
              <div class="hflow__yes-arrow-wrap">
                <svg class="hflow__arrow-yes" viewBox="0 0 100 40">
                  <line x1="0" y1="20" x2="76" y2="20"/>
                  <polygon points="70,8 100,20 70,32"/>
                </svg>
                <span class="hflow__badge hflow__badge--yes">YES</span>
              </div>
            </div>
          </template>

          <!-- Status dot -->
          <template v-if="el.type === 'status'">
            <div class="hflow__status" :class="el.cls"
                 @mouseenter="hovered = i" @mouseleave="hovered = -1"
                 :style="{ '--hover': hovered === i ? 1 : 0 }">
              <div class="hflow__status-dot" :class="el.dotCls"></div>
              <span class="hflow__status-label">{{ el.label }}</span>
              <span class="hflow__status-sub">{{ el.sub }}</span>
            </div>
          </template>

          <!-- Divider label -->
          <template v-if="el.type === 'divider'">
            <div class="hflow__divider">
              <span class="hflow__divider-line"></span>
              <span class="hflow__divider-text">{{ el.label }}</span>
              <span class="hflow__divider-line"></span>
            </div>
          </template>

        </div>
      </div>

      <!-- Scroll progress bar -->
      <div class="hflow__progress-bar">
        <div class="hflow__progress-fill" :style="{ width: (progress * 100) + '%' }"></div>
      </div>

      <!-- Flow summary: fades in when scroll completes -->
      <div class="hflow__summary" :class="{ 'hflow__summary--visible': progress >= 0.95 }">
        <div class="hflow__summary-card">
          <h3 class="hflow__summary-title">FLOW OVERVIEW</h3>
          <div class="hflow__summary-grid">
            <div class="hflow__summary-stat">
              <span class="hflow__summary-num">12</span>
              <span class="hflow__summary-label">Steps</span>
            </div>
            <div class="hflow__summary-stat">
              <span class="hflow__summary-num">2</span>
              <span class="hflow__summary-label">Decisions</span>
            </div>
            <div class="hflow__summary-stat">
              <span class="hflow__summary-num">6</span>
              <span class="hflow__summary-label">Tracking Stages</span>
            </div>
            <div class="hflow__summary-stat">
              <span class="hflow__summary-num">~3 min</span>
              <span class="hflow__summary-label">Avg. Completion</span>
            </div>
          </div>
          <div class="hflow__summary-legend">
            <div class="hflow__legend-item">
              <span class="hflow__legend-shape hflow__legend-shape--rect"></span>
              <span>Action Step</span>
            </div>
            <div class="hflow__legend-item">
              <span class="hflow__legend-shape hflow__legend-shape--diamond"></span>
              <span>Decision Point</span>
            </div>
            <div class="hflow__legend-item">
              <span class="hflow__legend-shape hflow__legend-shape--dot hflow__legend-shape--green"></span>
              <span>Success Path</span>
            </div>
            <div class="hflow__legend-item">
              <span class="hflow__legend-shape hflow__legend-shape--dot hflow__legend-shape--red"></span>
              <span>Error / Retry</span>
            </div>
          </div>
          <!-- Figma link button -->
          <a class="hflow__figma-btn"
             href="https://www.figma.com/board/9EhMjJYNq2ukgImolPKyWg/DIGI-User-flow?node-id=0-1&t=QZrcmF2grgbK51BT-1"
             target="_blank" rel="noopener noreferrer">
            <svg class="hflow__figma-icon" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
              <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
              <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
              <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
              <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
            </svg>
            View Full Flow in Figma
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'

const wrapper = ref(null)
const progress = ref(0)
const scrollX = ref(0)
const hovered = ref(-1)
let raf = null

// Define all flow elements in order with their reveal timing (0 to 1)
const elements = reactive([
  // ── ONBOARDING ──
  { type: 'divider', label: 'ONBOARDING', at: 0.01 },
  { type: 'pill', label: 'START', cls: '', dotCls: '', textCls: '', at: 0.02 },
  { type: 'arrow', at: 0.04 },
  { type: 'node', icon: '📱', label: 'Open App', sub: null, cls: '', at: 0.06 },
  { type: 'arrow', at: 0.08 },
  { type: 'node', icon: '🔐', label: 'Login', sub: 'Phone + OTP', cls: '', at: 0.10 },
  { type: 'arrow', at: 0.12 },
  { type: 'node', icon: '🏠', label: 'Home Screen', sub: null, cls: '', at: 0.14,
    chips: [
      { text: '📋 Paste Product Link', cls: 'hflow__chip--cta' },
      { text: '💰 Wallet', cls: '' }
    ]
  },

  // ── PLACE ORDER ──
  { type: 'divider', label: 'PLACE ORDER', at: 0.18 },
  { type: 'arrow', at: 0.20 },
  { type: 'node', icon: '🔗', label: 'Paste Link', sub: 'Taobao / 1688', cls: '', at: 0.22 },
  { type: 'arrow', at: 0.24 },
  { type: 'node', icon: '⚙️', label: 'Fetch Details', sub: 'System loads info', cls: '', at: 0.26 },
  { type: 'arrow', at: 0.28 },
  { type: 'node', icon: '✅', label: 'Confirm Order', sub: 'Review & submit', cls: '', at: 0.30 },

  // ── PAYMENT ──
  { type: 'divider', label: 'PAYMENT', at: 0.34 },
  { type: 'arrow', at: 0.36 },
  { type: 'node', icon: '💳', label: 'Pricing', sub: 'Product + Ship + Fee', cls: '', at: 0.38 },
  { type: 'arrow', at: 0.40 },
  { type: 'node', icon: '🔑', label: 'Enter PIN', sub: 'Wallet payment', cls: '', at: 0.42 },
  { type: 'arrow', at: 0.44 },

  // Decisions
  { type: 'decision', label: 'PIN<br/>Correct?', at: 0.44,
    noIcon: '❌', noLabel: 'Error', noSub: 'Retry PIN', noCls: 'hflow__node--err' },
  { type: 'arrow', at: 0.48 },
  { type: 'decision', label: 'Balance<br/>OK?', at: 0.50,
    noIcon: '⏳', noLabel: 'Waiting Payment', noSub: 'Top up wallet', noCls: 'hflow__node--warn' },
  { type: 'arrow', at: 0.54 },
  { type: 'node', icon: '🎉', label: 'Payment OK', sub: null, cls: 'hflow__node--ok', at: 0.56 },

  // ── ORDER TRACKING ──
  { type: 'divider', label: 'ORDER TRACKING', at: 0.59 },
  { type: 'arrow', at: 0.60 },
  { type: 'status', label: 'Waiting Payment', sub: 'Pending', cls: '', dotCls: 'hflow__status-dot--warn', at: 0.62 },
  { type: 'status', label: 'In Process', sub: 'Confirmed', cls: '', dotCls: '', at: 0.64 },
  { type: 'status', label: 'Transit Check', sub: 'Verify', cls: '', dotCls: '', at: 0.67 },
  { type: 'status', label: 'Transit Fee', sub: 'Fee OK', cls: '', dotCls: '', at: 0.70 },
  { type: 'status', label: 'CN Warehouse', sub: 'China', cls: '', dotCls: '', at: 0.73 },
  { type: 'status', label: 'Int\'l Ship', sub: 'Transit', cls: '', dotCls: '', at: 0.76 },
  { type: 'status', label: 'DIGI WH', sub: 'Local', cls: '', dotCls: '', at: 0.79 },
  { type: 'status', label: 'Pickup', sub: 'Ready', cls: '', dotCls: '', at: 0.82 },
  { type: 'status', label: 'Received', sub: 'Done ✓', cls: '', dotCls: 'hflow__status-dot--end', at: 0.85 },

  // ── DELIVERY ──
  { type: 'divider', label: 'DELIVERY', at: 0.89 },
  { type: 'arrow', at: 0.90 },
  { type: 'node', icon: '📍', label: 'Check Status', sub: 'Manual tracking', cls: '', at: 0.92 },
  { type: 'arrow', at: 0.94 },
  { type: 'node', icon: '📋', label: 'View Timeline', sub: 'Progress history', cls: '', at: 0.96 },
  { type: 'arrow', at: 0.97 },
  { type: 'pill', label: 'RECEIVED ✓', cls: 'hflow__pill--end', dotCls: 'hflow__pill-dot--green', textCls: 'hflow__pill-text--green', at: 0.98 },
])

// Track width = total elements * average width
const TRACK_WIDTH = 5800

function onScroll() {
  if (!wrapper.value) return
  const rect = wrapper.value.getBoundingClientRect()
  const wrapperH = wrapper.value.offsetHeight
  const vh = window.innerHeight

  // Progress: 0 when wrapper top hits viewport bottom, 1 when wrapper bottom hits viewport top
  const rawProgress = (-rect.top) / (wrapperH - vh)
  progress.value = Math.max(0, Math.min(1, rawProgress))

  // Map progress to horizontal scroll position
  const maxScroll = TRACK_WIDTH - window.innerWidth + 120
  scrollX.value = progress.value * Math.max(0, maxScroll)
}

function loop() {
  onScroll()
  raf = requestAnimationFrame(loop)
}

onMounted(() => { raf = requestAnimationFrame(loop) })
onUnmounted(() => { if (raf) cancelAnimationFrame(raf) })
</script>

<style scoped>
.hflow {
  /* Tall spacer to create scroll room for the horizontal pan */
  height: 550vh;
  position: relative;
}

.hflow__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* ── Horizontal track ── */
.hflow__track {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 60px;
  will-change: transform;
  transition: transform 0.08s linear;
}

/* ── Element reveal ── */
.hflow__item {
  opacity: 0;
  transform: scale(0.85) translateX(20px);
  transition: opacity 0.5s cubic-bezier(0.22,1,0.36,1),
              transform 0.5s cubic-bezier(0.22,1,0.36,1);
  flex-shrink: 0;
}
.hflow__item--in {
  opacity: 1;
  transform: none;
}

/* ── Arrows ── */
.hflow__arrow {
  width: 80px;
  height: 40px;
  flex-shrink: 0;
}
.hflow__arrow line {
  stroke: #e0ff00;
  stroke-width: 3;
}
.hflow__arrow polygon {
  fill: #e0ff00;
}

/* ── Nodes ── */
.hflow__node {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 30px 20px;
  border: 1px solid rgba(224,255,0,0.15);
  border-radius: 14px;
  background: rgba(255,255,255,0.025);
  min-width: 150px;
  transition: border-color .3s, box-shadow .3s, transform .3s;
}
.hflow__node:hover {
  border-color: rgba(224,255,0,0.45);
  box-shadow: 0 0 20px rgba(224,255,0,0.08);
  transform: translateY(-3px);
}
.hflow__node--sm { min-width: 100px; padding: 14px 18px; }
.hflow__node--err { border-color: rgba(255,77,77,0.3); }
.hflow__node--warn { border-color: rgba(255,169,77,0.3); }
.hflow__node--ok { border-color: rgba(81,207,102,0.35); background: rgba(81,207,102,0.04); }

.hflow__icon { font-size: 2.2rem; line-height: 1; margin-bottom: 8px; }
.hflow__label {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700; font-size: 1.15rem;
  letter-spacing: .04em; color: #fff;
  line-height: 1.2; white-space: nowrap;
}
.hflow__sub {
  font-family: 'Inter', sans-serif;
  font-size: .8rem; font-weight: 300;
  color: rgba(255,255,255,0.4); margin-top: 3px;
  white-space: nowrap;
}

/* ── Chips ── */
.hflow__chips { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; justify-content: center; }
.hflow__chip {
  font-family: 'Inter', sans-serif; font-size: .72rem; font-weight: 500;
  padding: 5px 12px; border-radius: 16px;
  border: 1px solid rgba(224,255,0,0.15); color: rgba(255,255,255,0.4);
  white-space: nowrap;
}
.hflow__chip--cta { border-color: #e0ff00; color: #e0ff00; background: rgba(224,255,0,0.08); }

/* ── Pill (start/end) ── */
.hflow__pill {
  display: flex; align-items: center; gap: 12px;
  border: 2px solid #e0ff00;
  border-radius: 50px; padding: 16px 36px;
}
.hflow__pill--end { border-color: #51cf66; }

.hflow__pill-dot {
  width: 12px; height: 12px; border-radius: 50%;
  background: #e0ff00;
  box-shadow: 0 0 12px #e0ff00, 0 0 24px rgba(224,255,0,0.3);
}
.hflow__pill-dot--green { background: #51cf66; box-shadow: 0 0 10px #51cf66, 0 0 20px rgba(81,207,102,0.3); }

.hflow__pill-text {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700; font-size: 1.1rem;
  letter-spacing: .18em; color: #e0ff00;
}
.hflow__pill-text--green { color: #51cf66; }

/* ── Decision diamond ── */
.hflow__decision {
  display: flex; flex-direction: column;
  align-items: center;
  gap: 0;
  margin: 0 12px;
  flex-shrink: 0;
}

.hflow__branch-no {
  display: flex; flex-direction: column;
  align-items: center;
  margin-bottom: 4px;
}

/* Bounding area: 120*sqrt(2) ≈ 170px, matches visual bounds of rotated diamond */
.hflow__diamond-area {
  width: 170px; height: 170px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.hflow__diamond {
  width: 120px; height: 120px;
  border: 2px solid #e0ff00;
  background: rgba(224,255,0,0.025);
  transform: rotate(45deg);
  display: flex; align-items: center; justify-content: center;
  transition: box-shadow .3s;
}
.hflow__diamond:hover { box-shadow: 0 0 30px rgba(224,255,0,0.25); }
.hflow__diamond span {
  transform: rotate(-45deg);
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700; font-size: .9rem;
  letter-spacing: .04em; color: #e0ff00;
  text-align: center; line-height: 1.3;
}

/* ── NO arrow (upward, red) ── */
.hflow__no-arrow-wrap {
  display: flex; align-items: center;
  gap: 8px;
}
.hflow__arrow-no {
  width: 40px; height: 70px; flex-shrink: 0;
  display: block;
}
.hflow__arrow-no line {
  stroke: #ff4d4d; stroke-width: 4;
}
.hflow__arrow-no polygon {
  fill: #ff4d4d;
}

/* ── YES arrow (right, green) ── */
.hflow__yes-arrow-wrap {
  display: flex; align-items: center;
  gap: 8px;
}
.hflow__arrow-yes {
  width: 100px; height: 40px; flex-shrink: 0;
  display: block;
}
.hflow__arrow-yes line {
  stroke: #51cf66; stroke-width: 4;
}
.hflow__arrow-yes polygon {
  fill: #51cf66;
}

/* ── Badge labels (NO/YES) ── */
.hflow__badge {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800; font-size: 1rem;
  letter-spacing: .15em;
  padding: 4px 12px;
  border-radius: 6px;
  white-space: nowrap;
}
.hflow__badge--no {
  color: #ff4d4d;
  background: rgba(255,77,77,0.12);
  border: 2px solid rgba(255,77,77,0.4);
}
.hflow__badge--yes {
  color: #51cf66;
  background: rgba(81,207,102,0.12);
  border: 2px solid rgba(81,207,102,0.4);
}

/* ── Status dots ── */
.hflow__status {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; min-width: 100px; padding: 0 10px;
  cursor: default; transition: transform .3s;
}
.hflow__status:hover { transform: translateY(-3px); }

.hflow__status-dot {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2.5px solid #e0ff00; background: transparent;
  transition: background .3s, box-shadow .3s;
}
.hflow__status:hover .hflow__status-dot {
  background: #e0ff00;
  box-shadow: 0 0 12px #e0ff00, 0 0 24px rgba(224,255,0,0.3);
}
.hflow__status-dot--end {
  background: #51cf66 !important; border-color: #51cf66 !important;
  box-shadow: 0 0 10px #51cf66 !important;
}
.hflow__status-dot--warn {
  border-color: #ffa94d;
}

.hflow__status-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700; font-size: .9rem;
  letter-spacing: .03em; color: #fff;
  margin-top: 10px; line-height: 1.15;
  transition: color .3s;
}
.hflow__status:hover .hflow__status-label { color: #e0ff00; }
.hflow__status-sub {
  font-family: 'Inter', sans-serif;
  font-size: .7rem; font-weight: 300; color: rgba(255,255,255,0.35);
}

/* ── Divider labels ── */
.hflow__divider {
  display: flex; flex-direction: column; align-items: center;
  gap: 8px; margin: 0 28px; flex-shrink: 0;
}
.hflow__divider-line {
  width: 1.5px; height: 28px;
  background: linear-gradient(to bottom, transparent, rgba(224,255,0,0.3));
}
.hflow__divider-text {
  font-family: 'Inter', sans-serif;
  font-size: .68rem; font-weight: 600;
  letter-spacing: .22em; color: #e0ff00;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  white-space: nowrap;
  opacity: 0.6;
}

/* ── Progress bar ── */
.hflow__progress-bar {
  position: absolute;
  bottom: 24px; left: 10%; right: 10%;
  height: 3px;
  background: rgba(255,255,255,0.06);
  border-radius: 4px;
  overflow: hidden;
}
.hflow__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #e0ff00, #51cf66);
  border-radius: 4px;
  transition: width 0.1s linear;
  box-shadow: 0 0 8px rgba(224,255,0,0.4);
}

/* ── Flow Summary Overlay ── */
.hflow__summary {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.6s ease;
  z-index: 10;
  background: rgba(12,12,16,0.92);
}
.hflow__summary--visible {
  opacity: 1;
  pointer-events: auto;
}

.hflow__summary-card {
  background: rgba(22,22,28,0.95);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(224,255,0,0.2);
  border-radius: 20px;
  padding: 48px 56px;
  max-width: 620px;
  width: 90%;
  text-align: center;
  transform: scale(0.9);
  transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
  box-shadow: 0 0 60px rgba(224,255,0,0.06), 0 20px 60px rgba(0,0,0,0.4);
}
.hflow__summary--visible .hflow__summary-card {
  transform: scale(1);
}

.hflow__summary-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: 1.4rem;
  letter-spacing: .2em;
  color: #e0ff00;
  margin: 0 0 28px 0;
}

.hflow__summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.hflow__summary-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.hflow__summary-num {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  font-size: 1.8rem;
  color: #e0ff00;
  line-height: 1;
}

.hflow__summary-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 500;
  font-size: .8rem;
  color: rgba(255,255,255,0.5);
  letter-spacing: .08em;
  text-transform: uppercase;
}

.hflow__summary-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.hflow__legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 500;
  font-size: .8rem;
  color: rgba(255,255,255,0.6);
  letter-spacing: .04em;
}

.hflow__legend-shape {
  flex-shrink: 0;
}
.hflow__legend-shape--rect {
  width: 18px; height: 14px;
  border: 1.5px solid rgba(224,255,0,0.6);
  border-radius: 3px;
  background: rgba(224,255,0,0.05);
}
.hflow__legend-shape--diamond {
  width: 14px; height: 14px;
  border: 1.5px solid #e0ff00;
  transform: rotate(45deg);
  background: rgba(224,255,0,0.05);
}
.hflow__legend-shape--dot {
  width: 12px; height: 12px;
  border-radius: 50%;
}
.hflow__legend-shape--green {
  background: #51cf66;
  box-shadow: 0 0 6px rgba(81,207,102,0.5);
}
.hflow__legend-shape--red {
  background: #ff4d4d;
  box-shadow: 0 0 6px rgba(255,77,77,0.5);
}

/* ── Figma button ── */
.hflow__figma-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
  padding: 12px 28px;
  border: 2px solid rgba(224,255,0,0.4);
  border-radius: 12px;
  background: rgba(224,255,0,0.06);
  color: #e0ff00;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: .12em;
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
}
.hflow__figma-btn:hover {
  background: rgba(224,255,0,0.12);
  border-color: #e0ff00;
  box-shadow: 0 0 24px rgba(224,255,0,0.2);
  transform: translateY(-2px);
}
.hflow__figma-icon {
  width: 18px;
  height: 27px;
  flex-shrink: 0;
}
</style>

