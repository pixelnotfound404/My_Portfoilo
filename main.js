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
// 🔒 REMOVED: Bot token + client-side Telegram sending
// The Vue app (ContactSection.vue + useTelegram.js) now handles
// form submissions securely through the /api/contact serverless endpoint.
// The bot token lives ONLY on the server — never in the browser.
// ══════════════════════════════════════════════════


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