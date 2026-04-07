<template>
  <div class="case-study">
    <!-- ── HERO BANNER ── -->
    <section class="cs-hero">
      <router-link to="/" class="cs-back" id="cs-back-top">
        <span class="cs-back__arrow">←</span>
        <span>BACK TO HOME</span>
      </router-link>

      <div class="cs-hero__content">
        <div class="cs-hero__meta">
          <span class="cs-hero__tag">// CASE STUDY 01</span>
          <span class="cs-hero__year">2024 — 2025</span>
        </div>
        <h1 class="cs-hero__title">DIGI<br/><span class="cs-hero__title--accent">EXPRESS</span></h1>
        <p class="cs-hero__subtitle">A cross-border shopping & delivery app helping users in Cambodia buy products from China and receive them locally.</p>
        <div class="cs-hero__pills">
          <span class="cs-pill">LEAD UX & UI</span>
          <span class="cs-pill">MOBILE APP</span>
          <span class="cs-pill">TEAM OF 3</span>
          <span class="cs-pill">5–7 MONTHS</span>
        </div>
      </div>

      <div class="cs-hero__visual">
        <img src="/assets/images/digi-express-logo.jpg" alt="DIGI Express Logo" class="cs-hero__logo" />
      </div>
    </section>

    <!-- ── OVERVIEW ── -->
    <section class="cs-section" id="cs-overview">
      <div class="cs-section__grid">
        <div class="cs-section__label">
          <span class="cs-tag">// 01</span>
          <h2 class="cs-heading">OVERVIEW</h2>
        </div>
        <div class="cs-section__body">
          <p class="cs-text">
            DIGI Express is a cross-border shopping and delivery app that helps users in Cambodia buy products from China and receive them locally. The platform acts as a trusted middleman — handling ordering, international shipping, and last-mile delivery in one seamless experience.
          </p>
          <div class="cs-stats-row">
            <div class="cs-stat">
              <span class="cs-stat__num">3</span>
              <span class="cs-stat__label">Team Members</span>
            </div>
            <div class="cs-stat">
              <span class="cs-stat__num">5–7</span>
              <span class="cs-stat__label">Months Duration</span>
            </div>
            <div class="cs-stat">
              <span class="cs-stat__num">1</span>
              <span class="cs-stat__label">App Published</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── THE PROBLEM ── -->
    <section class="cs-section cs-section--dark" id="cs-problem">
      <div class="cs-section__grid">
        <div class="cs-section__label">
          <span class="cs-tag">// 02</span>
          <h2 class="cs-heading">THE<br/>PROBLEM</h2>
        </div>
        <div class="cs-section__body">
          <p class="cs-text">
            Users in Cambodia faced major friction when trying to buy products from Chinese platforms like Taobao and 1688. The experience was fragmented, confusing, and often risky.
          </p>
          <div class="cs-pain-grid">
            <div class="cs-pain-card">
              <span class="cs-pain-card__icon">🌐</span>
              <h3 class="cs-pain-card__title">Language Barrier</h3>
              <p class="cs-pain-card__desc">Chinese-only interfaces made browsing and ordering nearly impossible for Cambodian users.</p>
            </div>
            <div class="cs-pain-card">
              <span class="cs-pain-card__icon">💳</span>
              <h3 class="cs-pain-card__title">Payment Difficulty</h3>
              <p class="cs-pain-card__desc">No local payment methods supported — requiring international cards most users don't have.</p>
            </div>
            <div class="cs-pain-card">
              <span class="cs-pain-card__icon">📦</span>
              <h3 class="cs-pain-card__title">Complex Shipping</h3>
              <p class="cs-pain-card__desc">Cross-border logistics with multiple handoffs, unclear timelines, and hidden fees.</p>
            </div>
            <div class="cs-pain-card">
              <span class="cs-pain-card__icon">❓</span>
              <h3 class="cs-pain-card__title">No Tracking</h3>
              <p class="cs-pain-card__desc">Once an order was placed through agents, users had zero visibility on delivery status.</p>
            </div>
            <div class="cs-pain-card">
              <span class="cs-pain-card__icon">😰</span>
              <h3 class="cs-pain-card__title">Trust Issues</h3>
              <p class="cs-pain-card__desc">Fear of scams, unreliable sellers, and shady agents operating via Telegram and Facebook.</p>
            </div>
            <div class="cs-pain-card">
              <span class="cs-pain-card__icon">💰</span>
              <h3 class="cs-pain-card__title">Hidden Costs</h3>
              <p class="cs-pain-card__desc">No transparent pricing — users couldn't estimate total cost before committing.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── RESEARCH & DISCOVERY ── -->
    <section class="cs-section" id="cs-research">
      <div class="cs-section__grid">
        <div class="cs-section__label">
          <span class="cs-tag">// 03</span>
          <h2 class="cs-heading">RESEARCH &<br/>DISCOVERY</h2>
        </div>
        <div class="cs-section__body">
          <p class="cs-text">
            I conducted informal user interviews with real users and friends in Cambodia who regularly buy from China. I also analyzed competitor apps and observed how users currently workaround the problem — typically by copying product links and sending them to agents on Telegram or Facebook.
          </p>

          <div class="cs-research-methods">
            <div class="cs-method">
              <span class="cs-method__num">01</span>
              <h3 class="cs-method__title">User Interviews</h3>
              <p class="cs-method__desc">Informal conversations with friends and real users to understand their buying behavior, pain points, and expectations.</p>
            </div>
            <div class="cs-method">
              <span class="cs-method__num">02</span>
              <h3 class="cs-method__title">Competitor Analysis</h3>
              <p class="cs-method__desc">Studied local logistics and shopping agency apps to identify UX gaps and opportunities for differentiation.</p>
            </div>
            <div class="cs-method">
              <span class="cs-method__num">03</span>
              <h3 class="cs-method__title">Behavioral Observation</h3>
              <p class="cs-method__desc">Observed how users currently copy links, manually message agents, and track orders through chat — fragmented and frustrating.</p>
            </div>
          </div>

          <div class="cs-insight-box">
            <span class="cs-insight-box__label">// KEY INSIGHT</span>
            <p class="cs-insight-box__text">Users already had a natural behavior of copying product links. The design needed to embrace this — not fight it. The whole UX should revolve around "paste a link, get your product."</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── USER FLOW ── -->
    <section class="cs-section cs-section--dark" id="cs-flow">
      <div class="cs-section__grid">
        <div class="cs-section__label">
          <span class="cs-tag">// 04</span>
          <h2 class="cs-heading">USER<br/>FLOW</h2>
        </div>
        <div class="cs-section__body">
          <p class="cs-text">
            I designed the core user journey to be as frictionless as possible — from pasting a product link to receiving the delivery. Every step was optimized to reduce cognitive load for non-technical users.
          </p>
        </div>
      </div>
      <DigiUserFlow />
    </section>

    <!-- ── DESIGN SOLUTION ── -->
    <section class="cs-section" id="cs-solution">
      <div class="cs-section__grid">
        <div class="cs-section__label">
          <span class="cs-tag">// 05</span>
          <h2 class="cs-heading">DESIGN<br/>SOLUTION</h2>
        </div>
        <div class="cs-section__body">
          <p class="cs-text">
            The design centers around three core principles that directly address user pain points: simplicity, transparency, and trust.
          </p>
          <div class="cs-solution-cards">
            <div class="cs-solution-card">
              <div class="cs-solution-card__num">01</div>
              <h3 class="cs-solution-card__title">PASTE LINK TO ORDER</h3>
              <p class="cs-solution-card__desc">The primary action is a single "Paste product link" input — embracing users' existing behavior of copying links from Taobao/1688. No need to browse or search within the app.</p>
              <span class="cs-solution-card__challenge">Challenge: Complex ordering process</span>
            </div>
            <div class="cs-solution-card">
              <div class="cs-solution-card__num">02</div>
              <h3 class="cs-solution-card__title">TRANSPARENT PRICING</h3>
              <p class="cs-solution-card__desc">Live price estimation shows product cost + shipping fee + service fee upfront. No hidden charges. Users know exactly what they'll pay before committing.</p>
              <span class="cs-solution-card__challenge">Challenge: Building user trust</span>
            </div>
            <div class="cs-solution-card">
              <div class="cs-solution-card__num">03</div>
              <h3 class="cs-solution-card__title">REAL-TIME TRACKING</h3>
              <p class="cs-solution-card__desc">Clear order status timeline (Ordered → Processing → Shipping → Delivered) with visual progress indicators. Users always know exactly where their package is.</p>
              <span class="cs-solution-card__challenge">Challenge: Non-tech user accessibility</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FINAL SCREENS ── -->
    <section class="cs-section cs-section--dark" id="cs-screens">
      <div class="cs-section__grid">
        <div class="cs-section__label">
          <span class="cs-tag">// 06</span>
          <h2 class="cs-heading">FINAL<br/>SCREENS</h2>
        </div>
        <div class="cs-section__body">
          <p class="cs-text">
            The final UI uses a clean, minimal design optimized for clarity and ease of use. Key screens include the home dashboard, paste-link ordering flow, product detail, search, and order creation.
          </p>
        </div>
      </div>
      <div class="cs-full-image cs-full-image--screens">
        <img src="/assets/images/case-studies/Mockup copy.jpg" alt="DIGI Express Final UI Screens" loading="lazy" />
      </div>
    </section>

    <!-- ── MY ROLE & TOOLS ── -->
    <section class="cs-section" id="cs-role">
      <div class="cs-section__grid">
        <div class="cs-section__label">
          <span class="cs-tag">// 07</span>
          <h2 class="cs-heading">MY ROLE<br/>& TOOLS</h2>
        </div>
        <div class="cs-section__body">
          <div class="cs-role-grid">
            <div class="cs-role-block">
              <h3 class="cs-role-block__title">WHAT I DID</h3>
              <ul class="cs-role-list">
                <li><span class="cs-role-list__icon">🔍</span> Conducted user research</li>
                <li><span class="cs-role-list__icon">🧠</span> Created user personas & flows</li>
                <li><span class="cs-role-list__icon">✏️</span> Designed wireframes (lo → hi fi)</li>
                <li><span class="cs-role-list__icon">🎨</span> Built the UI design system</li>
                <li><span class="cs-role-list__icon">📱</span> Designed all mobile screens</li>
                <li><span class="cs-role-list__icon">🔁</span> Iterated based on feedback</li>
              </ul>
            </div>
            <div class="cs-role-block">
              <h3 class="cs-role-block__title">TEAM</h3>
              <ul class="cs-role-list">
                <li><span class="cs-role-list__icon">👨‍🎨</span> Sam Sokunthea — UX/UI Designer</li>
                <li><span class="cs-role-list__icon">👨‍💻</span> Yong Bungleng — Flutter (Frontend)</li>
                <li><span class="cs-role-list__icon">👨‍💻</span> Koy Yutraboth — Laravel (Backend)</li>
              </ul>
            </div>
            <div class="cs-role-block">
              <h3 class="cs-role-block__title">TOOLS</h3>
              <div class="cs-tools-grid">
                <span class="cs-tool">Figma</span>
                <span class="cs-tool">FigJam</span>
                <span class="cs-tool">Flutter</span>
                <span class="cs-tool">Laravel</span>
                <span class="cs-tool">AWS</span>
                <span class="cs-tool">Microsoft SQL Server</span>
              </div>
            </div>
          </div>

          <div class="cs-timeline">
            <h3 class="cs-timeline__title">PROJECT TIMELINE</h3>
            <div class="cs-timeline__track">
              <div class="cs-timeline__phase" style="--phase-width: 15%">
                <div class="cs-timeline__bar"></div>
                <span class="cs-timeline__label">Research & Planning</span>
                <span class="cs-timeline__duration">2–3 weeks</span>
              </div>
              <div class="cs-timeline__phase" style="--phase-width: 25%">
                <div class="cs-timeline__bar"></div>
                <span class="cs-timeline__label">UX/UI Design</span>
                <span class="cs-timeline__duration">4–6 weeks</span>
              </div>
              <div class="cs-timeline__phase" style="--phase-width: 40%">
                <div class="cs-timeline__bar"></div>
                <span class="cs-timeline__label">Development</span>
                <span class="cs-timeline__duration">2–3 months</span>
              </div>
              <div class="cs-timeline__phase" style="--phase-width: 20%">
                <div class="cs-timeline__bar"></div>
                <span class="cs-timeline__label">Testing & Launch</span>
                <span class="cs-timeline__duration">2–3 weeks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── RESULTS & LEARNINGS ── -->
    <section class="cs-section cs-section--dark" id="cs-results">
      <div class="cs-section__grid">
        <div class="cs-section__label">
          <span class="cs-tag">// 08</span>
          <h2 class="cs-heading">RESULTS &<br/>LEARNINGS</h2>
        </div>
        <div class="cs-section__body">
          <div class="cs-results-grid">
            <div class="cs-result-card cs-result-card--highlight">
              <span class="cs-result-card__icon">📱</span>
              <h3 class="cs-result-card__title">Published on Play Store</h3>
              <p class="cs-result-card__desc">Successfully launched the app on Google Play Store with all core features functional.</p>
            </div>
            <div class="cs-result-card">
              <span class="cs-result-card__icon">👥</span>
              <h3 class="cs-result-card__title">Real User Testing</h3>
              <p class="cs-result-card__desc">Early-stage users tested the app and provided valuable feedback for future iterations.</p>
            </div>
            <div class="cs-result-card">
              <span class="cs-result-card__icon">✅</span>
              <h3 class="cs-result-card__title">Core Features Working</h3>
              <p class="cs-result-card__desc">Complete ordering and tracking flow functional end-to-end.</p>
            </div>
          </div>

          <div class="cs-learnings">
            <h3 class="cs-learnings__title">KEY LEARNINGS</h3>
            <div class="cs-learning-list">
              <div class="cs-learning">
                <span class="cs-learning__num">01</span>
                <div>
                  <h4 class="cs-learning__title">Simplicity is critical</h4>
                  <p class="cs-learning__desc">For non-technical users, every extra tap or screen is a potential drop-off. The "paste link" approach reduced friction dramatically.</p>
                </div>
              </div>
              <div class="cs-learning">
                <span class="cs-learning__num">02</span>
                <div>
                  <h4 class="cs-learning__title">Trust = Transparency</h4>
                  <p class="cs-learning__desc">Real-time tracking and upfront pricing were the two biggest trust-builders. Users needed to see their money and products at every step.</p>
                </div>
              </div>
              <div class="cs-learning">
                <span class="cs-learning__num">03</span>
                <div>
                  <h4 class="cs-learning__title">Design with behavior, not against it</h4>
                  <p class="cs-learning__desc">Users already copy-paste links. Instead of forcing them to learn a new flow, we embraced their existing habit — and it worked.</p>
                </div>
              </div>
              <div class="cs-learning">
                <span class="cs-learning__num">04</span>
                <div>
                  <h4 class="cs-learning__title">Cross-functional collaboration matters</h4>
                  <p class="cs-learning__desc">Working closely with the dev team from day one meant fewer handoff surprises and a design that was technically feasible.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA / PROTOTYPE ── -->
    <section class="cs-section cs-cta-section" id="cs-prototype">
      <div class="cs-cta">
        <span class="cs-tag">// TRY IT YOURSELF</span>
        <h2 class="cs-cta__title">VIEW THE<br/><span class="cs-cta__title--accent">PROTOTYPE</span></h2>
        <p class="cs-cta__desc">Experience the full interactive prototype built in Figma.</p>
        <a href="https://www.figma.com/proto/loR9c6xd0fRd7mNWi3WshE/DIGI-Express?page-id=5918%3A17286&node-id=5972-18236&p=f&viewport=1769%2C-126%2C0.87&t=mo66sejkXtz3IxF1-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=5972%3A18236&show-proto-sidebar=1"
           target="_blank" class="cs-cta__btn" id="cs-figma-link">
          OPEN IN FIGMA ↗
        </a>
      </div>
    </section>

    <!-- ── NEXT PROJECT ── -->
    <section class="cs-next">
      <span class="cs-tag">// NEXT PROJECT</span>
      <router-link to="/case/kork-app" class="cs-next__link" id="cs-next-project">
        <span class="cs-next__title">KORK APP</span>
        <span class="cs-next__arrow">→</span>
      </router-link>
    </section>

    <!-- ── FOOTER ── -->
    <footer class="footer">
      <span class="footer__logo"><span style="color:#e0ff00;text-shadow:0 0 8px #e0ff00">✦</span> SCOTT UX &amp; UI LAB</span>
      <span class="footer__copy">© 2026 — ALL RIGHTS RESERVED</span>
      <span class="footer__loc">BASED GLOBALLY</span>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { killSplineBadge } from '@/composables/useSpline'
import DigiUserFlow from '@/components/DigiUserFlow.vue'

onMounted(() => {
  killSplineBadge()

  // Animate elements on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('cs-visible')
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

  document.querySelectorAll('.cs-section, .cs-pain-card, .cs-method, .cs-solution-card, .cs-result-card, .cs-learning, .cs-stat').forEach(el => {
    observer.observe(el)
  })
})
</script>
