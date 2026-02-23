<template>
  <section class="contact" id="contact">
    <div class="contact__bg-text" aria-hidden="true">HELLO</div>
    <div class="contact__content">

      <!-- LEFT -->
      <div class="contact__left">
        <span class="section-tag">// GET IN TOUCH</span>
        <h2 class="contact__headline">LET'S BUILD<br/>SOMETHING<br/><span class="contact__accent">GREAT.</span></h2>
        <div class="contact__links">
          <a href="mailto:sokuntheasom0@gmail.com" class="contact__email" id="contact-email" @click.prevent="handleEmail">
            sokuntheasom0@gmail.com ↗
          </a>
          <div class="contact__socials">
            <a href="https://www.linkedin.com/in/sam-sokunthea-759549253/" target="_blank" id="social-linkedin">LINKEDIN</a>
            <a href="https://www.facebook.com/dongkvANGTHANH"             target="_blank" id="social-facebook">FACEBOOK</a>
            <a href="https://t.me/pixel404notfound"                        target="_blank" id="social-telegram">TELEGRAM</a>
          </div>
        </div>
      </div>

      <!-- RIGHT: Form -->
      <div class="contact__right">
        <div class="contact__avail" id="availability-badge">
          <span class="contact__avail-dot"></span>
          <span>AVAILABLE FOR NEW PROJECTS</span>
        </div>

        <form class="contact__form" id="contact-form" @submit.prevent="handleSubmit">
          <div class="contact__form-row">
            <div class="contact__field">
              <label class="contact__label" for="field-name">// YOUR NAME</label>
              <input class="contact__input" type="text" id="field-name" v-model="form.name" placeholder="Sam Sokunthea" autocomplete="off" />
            </div>
            <div class="contact__field">
              <label class="contact__label" for="field-email">// YOUR EMAIL</label>
              <input class="contact__input" type="email" id="field-email" v-model="form.email" placeholder="hello@example.com" autocomplete="off" />
            </div>
          </div>

          <div class="contact__field">
            <label class="contact__label" for="field-telegram">// TELEGRAM USERNAME <span style="opacity:0.4;font-size:0.65rem">(optional — so I can reach you directly)</span></label>
            <input class="contact__input" type="text" id="field-telegram" v-model="form.telegram"
              placeholder="@username" autocomplete="off" />
          </div>

          <div class="contact__field">
            <label class="contact__label" for="field-type">// PROJECT TYPE</label>
            <select class="contact__input contact__select" id="field-type" v-model="form.type">
              <option value="" disabled>Select a service…</option>
              <option value="ux">UX Research &amp; Strategy</option>
              <option value="product">Product Design</option>
              <option value="system">Design System</option>
              <option value="prototype">Interactive Prototype</option>
              <option value="other">Something Else</option>
            </select>
          </div>

          <div class="contact__field">
            <label class="contact__label" for="field-message">// TELL ME MORE</label>
            <textarea class="contact__input contact__textarea" id="field-message" v-model="form.message" rows="5" placeholder="Describe your project, timeline, and goals…"></textarea>
          </div>

          <button type="submit" class="contact__submit" id="contact-submit" :disabled="btnDisabled">
            <span>{{ btnLabel }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </form>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRateLimit } from '@/composables/useRateLimit'
import { sendToTelegram } from '@/composables/useTelegram'
import { showToast } from '@/composables/useToast'

const form = ref({ name: '', email: '', telegram: '', type: '', message: '' })
const btnLabel    = ref('SEND MESSAGE')
const btnDisabled = ref(false)

const { check, record, startCountdown } = useRateLimit({
  cooldownMs:  60 * 1000,
  windowMs:    60 * 60 * 1000,
  maxPerHour:  3,
  onTick: (secs) => {
    if (secs === 'BLOCKED') {
      btnLabel.value = '🚫 BLOCKED (24h)'; btnDisabled.value = true
    } else {
      btnLabel.value = `WAIT ${secs}s…`; btnDisabled.value = true
    }
  },
  onReady: () => { btnLabel.value = 'SEND MESSAGE'; btnDisabled.value = false },
})

// Check ban status immediately on page load
onMounted(() => {
  const { blocked, banned, reason } = check()
  if (blocked && banned) {
    btnLabel.value    = '🚫 BLOCKED (24h)'
    btnDisabled.value = true
  } else if (blocked) {
    startCountdown()
  }
})

async function handleSubmit() {
  const { name, email, telegram, type, message } = form.value
  if (!name || !email || !message) {
    showToast('// Please fill in all required fields', true); return
  }
  const { blocked, banned, reason, log } = check()
  if (blocked) {
    showToast(reason, true)
    if (!banned) startCountdown()
    return
  }

  btnDisabled.value = true
  btnLabel.value    = 'SENDING…'

  try {
    const res = await sendToTelegram(name, email, telegram, type, message)
    if (!res.ok) throw new Error()
    record(log)
    showToast('✦ Message sent! I\'ll get back to you soon.')
    form.value = { name: '', email: '', telegram: '', type: '', message: '' }
    startCountdown()
  } catch {
    showToast('// Failed to send. Try emailing me directly.', true)
    btnDisabled.value = false
    btnLabel.value    = 'SEND MESSAGE'
  }
}

function handleEmail(e) {
  const addr = 'sokuntheasom0@gmail.com'
  window.open(`https://mail.google.com/mail/?view=cm&to=${addr}`, '_blank')
  navigator.clipboard?.writeText(addr).then(() => showToast('// Email copied to clipboard ✦'))
}
</script>
