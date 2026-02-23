/* ══════════════════════════════════════════════════
   SCOTT UX LAB — JavaScript
   ══════════════════════════════════════════════════ */

// ── Robotic custom cursor ────────────────────────
(function initRoboCursor() {

  // ── Touch / mobile detection — bail out early ──
  // Both conditions must be true: pointer is coarse (finger-based)
  // AND the device has real touch points — avoids false positives
  // on Windows PCs that report maxTouchPoints > 0 via drivers.
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const isTouchDevice = isCoarse && navigator.maxTouchPoints > 0;
  if (isTouchDevice) {
    document.body.classList.add('touch-device');
    return;
  }
  // Catch first actual touch on hybrid devices (Surface, etc.)
  window.addEventListener('touchstart', () => {
    document.body.classList.add('touch-device');
  }, { once: true, passive: true });

  // Build cursor DOM
  const el = document.createElement('div');
  el.id = 'robo-cursor';
  el.innerHTML = `
    <!-- Robotic arrow SVG -->
    <svg class="cursor-arrow" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none">
      <!-- main arrow body -->
      <polygon
        points="3,2 3,24 9,18 14,28 17.5,26.5 12.5,16.5 20,16.5"
        fill="#e0ff00"
        stroke="#ffffff"
        stroke-width="1.8"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
      <!-- robotic accent: small notch cut on arrow body -->
      <line x1="3" y1="7" x2="6" y2="7" stroke="#080808" stroke-width="1.2"/>
      <!-- tiny crosshair dot at tip -->
      <circle cx="3" cy="2" r="1" fill="#ffffff" opacity="0.9"/>
    </svg>
    <!-- scan-frame bracket corners -->
    <div class="cursor-brackets">
      <span></span><span></span><span></span><span></span>
    </div>
  `;
  document.body.appendChild(el);

  let mx = -100, my = -100;   // raw mouse
  let cx = -100, cy = -100;   // smoothed position

  // Track raw mouse
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  // Smooth follow via rAF
  // Arrow tip is at SVG coord (3,2) inside the 32×32 viewBox
  // so shift the div left 3px and up 2px to put that exact pixel on the mouse
  (function loop() {
    cx += (mx - cx) * 0.75;   // lerp — snappy, slight smoothing
    cy += (my - cy) * 0.75;
    el.style.transform = `translate(${cx - 3}px, ${cy - 2}px)`;
    requestAnimationFrame(loop);
  })();

  // Hover detection on interactive elements
  const hoverTargets = 'a, button, [role="button"], input, select, textarea, label, .project-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      el.classList.add('is-hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      el.classList.remove('is-hovering');
    }
  });

  // Click states + ripple
  document.addEventListener('mousedown', (e) => {
    el.classList.add('is-clicking');
    // spawn ripple at click position
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
  document.addEventListener('mouseup', () => {
    el.classList.remove('is-clicking');
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => { el.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { el.style.opacity = '1'; });
})();


// ── Nav scroll effect ────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ══════════════════════════════════════════════════
// ── ANIMATION SYSTEM ──────────────────────────────
// ══════════════════════════════════════════════════

// ── 1. Page Loader ───────────────────────────────
const loader = document.getElementById('page-loader');
if (loader) {
  // Hide after 1.8s — enough for the bar animation to finish
  setTimeout(() => {
    loader.classList.add('hidden');
    // Remove from DOM after transition so it never blocks clicks
    setTimeout(() => loader.remove(), 800);
    // Kick off hero entrance
    const heroSection = document.querySelector('.hero');
    if (heroSection) heroSection.classList.add('hero--ready');
    // Trigger hero headline words after a beat
    setTimeout(() => {
      document.querySelectorAll('.hero__headline .hero__line').forEach(line => {
        line.classList.add('words-visible');
      });
    }, 200);
  }, 1800);
}

// ── 2. Word-split helper ─────────────────────────
// Wraps each word in a span for slide-up reveal
function splitWords(el) {
  const text = el.textContent.trim();
  el.textContent = '';
  el.classList.add('word-split');
  text.split(' ').forEach((word, i) => {
    const outer = document.createElement('span');
    outer.className = 'word';
    const inner = document.createElement('span');
    inner.className = 'word-inner';
    inner.textContent = word;
    outer.appendChild(inner);
    el.appendChild(outer);
    if (i < text.split(' ').length - 1) {
      el.appendChild(document.createTextNode(' '));
    }
  });
}

// Split hero headline lines
document.querySelectorAll('.hero__headline .hero__line').forEach(line => {
  splitWords(line);
});

// Split section titles
document.querySelectorAll('.section-title').forEach(title => {
  splitWords(title);
});

// ── 3. Intersection Observer: scroll reveals ─────
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;

    // Word-split titles
    if (el.classList.contains('word-split')) {
      el.classList.add('words-visible');
      io.unobserve(el);
      return;
    }

    // Section tags — draw the underline
    if (el.classList.contains('section-tag')) {
      el.classList.add('tag-revealed');
      io.unobserve(el);
      return;
    }

    // Stats counter
    if (el.classList.contains('stat__num')) {
      animateCount(el);
      io.unobserve(el);
      return;
    }

    // Generic reveal — stagger siblings
    const siblings = [...el.parentElement.children];
    const idx = siblings.indexOf(el);
    el.style.transitionDelay = `${idx * 0.09}s`;
    el.classList.add('visible');
    io.unobserve(el);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

// Register all reveal targets
document.querySelectorAll(
  '.reveal, .reveal-stagger, .project-card, .service-item, .stat, .trusted__logo, .section-title, .section-tag, .stat__num'
).forEach(el => {
  if (!el.classList.contains('reveal') &&
    !el.classList.contains('section-title') &&
    !el.classList.contains('section-tag') &&
    !el.classList.contains('stat__num')) {
    el.classList.add('reveal');
  }
  io.observe(el);
});

// ── 4. Animated stats counter ────────────────────
function animateCount(el) {
  const raw = el.textContent.trim();               // e.g. "40+"
  const suffix = raw.replace(/[0-9]/g, '');        // "+"
  const target = parseInt(raw.replace(/\D/g, ''), 10);
  const duration = 1400;
  const start = performance.now();

  (function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  })(start);
}

// ── 5. Hero headline hover skew (kept + enhanced) ─
document.querySelectorAll('.hero__headline .hero__line').forEach(line => {
  line.style.transition = 'transform 0.35s cubic-bezier(0.22,1,0.36,1)';
  line.style.display = 'block';
  line.addEventListener('mouseenter', () => { line.style.transform = 'skewX(-4deg) translateX(6px)'; });
  line.addEventListener('mouseleave', () => { line.style.transform = 'none'; });
});

// ── 6. Project card 3D tilt ───────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  const spline = card.querySelector('.project-card__spline');
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 → 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
    if (spline) spline.style.transform = `translateX(${x * 12}px) translateY(${y * 8}px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s, border-color 0.3s';
    card.style.transform = 'none';
    if (spline) { spline.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1)'; spline.style.transform = 'none'; }
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s linear, box-shadow 0.4s, border-color 0.3s';
    if (spline) spline.style.transition = 'transform 0.1s linear';
  });
});

// ── 7. Parallax on decorative bg-text ────────────
const bgTexts = document.querySelectorAll('.hero__bg-text, .about__bg-text, .contact__bg-text');
if (bgTexts.length) {
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    bgTexts.forEach(el => {
      const rect = el.closest('section').getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      const ratio = mid / window.innerHeight - 0.5;
      el.style.transform = `translateY(${ratio * -60}px)`;
    });
  }, { passive: true });
}

// ── 8. Scroll progress bar on nav ────────────────
(function addScrollBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px;
    background: var(--clr-accent); z-index: 99999;
    width: 0%; transform-origin: left;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${(window.scrollY / total) * 100}%`;
  }, { passive: true });
})();

// ── Smooth anchor scroll ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') { e.preventDefault(); return; }  // bare # → do nothing
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navH = document.getElementById('nav')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Active nav link on scroll ─────────────────────
(function trackActiveNav() {
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  const navH = document.getElementById('nav')?.offsetHeight || 70;

  function setActive(id) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  }

  function updateActive() {
    const scrollY = window.scrollY + navH + 10;
    const sections = [...document.querySelectorAll('section[id]')];
    let current = sections[0];
    sections.forEach(s => { if (s.offsetTop <= scrollY) current = s; });
    if (current) setActive(current.id);
  }

  setActive('hero');  // default on load
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();


// ── Marquee pause on hover ───────────────────────
const marqueeTrack = document.querySelector('.marquee__track');
if (marqueeTrack) {
  const marqueeEl = document.querySelector('.marquee');
  marqueeEl.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeEl.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

// ── Magnetic effect on CTA buttons ──────────────
document.querySelectorAll('.btn-primary, .nav__cta, .project-card__link').forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
  });
  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'transform 0.1s linear';
  });
});

// ── Noise overlay (subtle texture) ──────────────
(function addNoise() {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  canvas.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100vw; height: 100vh;
    pointer-events: none; z-index: 9998;
    opacity: 0.025;
    mix-blend-mode: overlay;
  `;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(200, 200);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const v = Math.random() * 255 | 0;
    imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = v;
    imageData.data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  document.body.appendChild(canvas);
})();

console.log(
  '%c✦ SCOTT UX LAB',
  'font-size:18px; font-weight:900; letter-spacing:4px; color:#e0ff00; background:#080808; padding:8px 16px;'
);
console.log('%c// Website built for forward-thinking teams.', 'color:#aaa; font-size:12px;');

// ══════════════════════════════════════════════════
// ── TELEGRAM CONTACT FORM ─────────────────────────
// ══════════════════════════════════════════════════
const TELEGRAM_BOT_TOKEN = '8748171041:AAE5kJGAp-z8CAJex9THcEYQIajUZny79k4';
const TELEGRAM_CHAT_ID = '869070906';

function sendToTelegram(name, email, type, message) {
  const text =
    `📬 *New message from Scott UX Lab*\n\n` +
    `👤 *Name:* ${name}\n` +
    `📧 *Email:* ${email}\n` +
    `🎯 *Project type:* ${type || 'Not specified'}\n\n` +
    `💬 *Message:*\n${message}`;

  return fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'Markdown'
    })
  });
}

// ── Toast notification helper ────────────────────
function showToast(msg, isError = false) {
  const existing = document.getElementById('ux-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'ux-toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 2.5rem; left: 50%; transform: translateX(-50%) translateY(20px);
    background: ${isError ? '#ff4d4d' : '#e0ff00'}; color: #080808;
    font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    padding: 0.85rem 2rem; z-index: 99999;
    opacity: 0; transition: opacity 0.3s, transform 0.3s;
    pointer-events: none; white-space: nowrap;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ── Form submit handler  (with rate limiting) ────
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('contact-submit');

// ── Rate-limit config ────────────────────────────
const RL_COOLDOWN_MS = 60 * 1000;   // 60 s between submissions
const RL_WINDOW_MS = 60 * 60 * 1000; // 1 hour rolling window
const RL_MAX_PER_HOUR = 3;             // max sends per hour

function rlGetLog() {
  try { return JSON.parse(localStorage.getItem('_ux_rl') || '[]'); }
  catch { return []; }
}
function rlSaveLog(log) {
  localStorage.setItem('_ux_rl', JSON.stringify(log));
}
function rlCheck() {
  const now = Date.now();
  let log = rlGetLog().filter(t => now - t < RL_WINDOW_MS); // prune old entries

  // 1. Per-minute cooldown
  const last = log[log.length - 1];
  if (last && now - last < RL_COOLDOWN_MS) {
    const secs = Math.ceil((RL_COOLDOWN_MS - (now - last)) / 1000);
    return { blocked: true, reason: `// Slow down! Try again in ${secs}s` };
  }

  // 2. Hourly cap
  if (log.length >= RL_MAX_PER_HOUR) {
    const oldest = log[0];
    const minsLeft = Math.ceil((RL_WINDOW_MS - (now - oldest)) / 60000);
    return { blocked: true, reason: `// Limit reached. Try again in ~${minsLeft} min` };
  }

  return { blocked: false, log };
}
function rlRecord(log) {
  log.push(Date.now());
  rlSaveLog(log);
}

// ── Countdown on button while on cooldown ─────────
let countdownTimer = null;
function startCooldownUI() {
  if (countdownTimer) return;
  countdownTimer = setInterval(() => {
    const { blocked } = rlCheck();
    if (!blocked) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'SEND MESSAGE';
      }
    } else {
      const log = rlGetLog();
      const last = log[log.length - 1];
      const secs = Math.ceil((RL_COOLDOWN_MS - (Date.now() - last)) / 1000);
      if (submitBtn) {
        submitBtn.querySelector('span').textContent = `WAIT ${secs}s…`;
      }
    }
  }, 1000);
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('field-name')?.value.trim();
    const email = document.getElementById('field-email')?.value.trim();
    const type = document.getElementById('field-type')?.value;
    const message = document.getElementById('field-message')?.value.trim();

    if (!name || !email || !message) {
      showToast('// Please fill in all required fields', true);
      return;
    }

    if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
      showToast('// Set your Telegram bot token in main.js first!', true);
      return;
    }

    // ── Rate limit check ──────────────────────────
    const { blocked, reason, log } = rlCheck();
    if (blocked) {
      showToast(reason, true);
      submitBtn.disabled = true;
      startCooldownUI();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'SENDING…';

    try {
      const res = await sendToTelegram(name, email, type, message);
      if (!res.ok) throw new Error('API error');

      rlRecord(log);   // log only on success
      showToast('✦ Message sent! I\'ll get back to you soon.');
      contactForm.reset();

      // Start cooldown countdown on the button
      startCooldownUI();

    } catch {
      showToast('// Failed to send. Try emailing me directly.', true);
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'SEND MESSAGE';
    }
  });
}


// ══════════════════════════════════════════════════
// ── EMAIL: open Gmail compose + copy to clipboard ─
// ══════════════════════════════════════════════════
const emailLink = document.getElementById('contact-email');
if (emailLink) {
  emailLink.addEventListener('click', (e) => {
    e.preventDefault();
    const address = 'sokuntheasom0@gmail.com';

    // Open Gmail compose in a new tab
    window.open(`https://mail.google.com/mail/?view=cm&to=${address}`, '_blank');

    // Copy to clipboard as fallback
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address).then(() => {
        showToast('// Email copied to clipboard ✦');
      }).catch(() => { });
    }
  });
}