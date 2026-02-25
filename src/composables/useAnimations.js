// Word-split: wraps each word in overflow-hidden spans for slide-up reveal
export function splitWords(el) {
    if (el.dataset.split) return
    el.dataset.split = '1'
    const text = el.textContent.trim()
    el.textContent = ''
    el.classList.add('word-split')
    text.split(' ').forEach((word, i, arr) => {
        const outer = document.createElement('span')
        outer.className = 'word'
        const inner = document.createElement('span')
        inner.className = 'word-inner'
        inner.textContent = word
        outer.appendChild(inner)
        el.appendChild(outer)
        if (i < arr.length - 1) el.appendChild(document.createTextNode(' '))
    })
}

// Main animation bootstrap — call once after mount
export function useAnimations() {
    // Scroll-reveal observer
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return
            const el = entry.target

            if (el.classList.contains('word-split')) {
                el.classList.add('words-visible'); io.unobserve(el); return
            }
            if (el.classList.contains('section-tag')) {
                el.classList.add('tag-revealed'); io.unobserve(el); return
            }
            if (el.classList.contains('stat__num')) {
                animateCount(el); io.unobserve(el); return
            }

            const siblings = [...el.parentElement.children]
            el.style.transitionDelay = `${siblings.indexOf(el) * 0.09}s`
            el.classList.add('visible')
            io.unobserve(el)
        })
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })

    document.querySelectorAll(
        '.reveal,.reveal-stagger,.project-card,.service-item,.stat,.trusted__logo,.section-title,.section-tag,.stat__num'
    ).forEach(el => {
        if (!el.classList.contains('reveal') &&
            !el.classList.contains('section-title') &&
            !el.classList.contains('section-tag') &&
            !el.classList.contains('stat__num')) {
            el.classList.add('reveal')
        }
        io.observe(el)
    })

    // Magnetic buttons — only on non-touch devices
    if (!window.matchMedia('(pointer: coarse)').matches) {
        document.querySelectorAll('.btn-primary,.nav__cta,.project-card__link').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect()
                btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.18}px)`
            })
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0,0)'
                btn.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)'
            })
            btn.addEventListener('mouseenter', () => { btn.style.transition = 'transform 0.1s linear' })
        })
    }

    // Noise overlay — deferred to avoid blocking initial render
    requestAnimationFrame(() => {
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 128 // smaller = faster to generate
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;opacity:0.025;mix-blend-mode:overlay;'
        const ctx = canvas.getContext('2d')
        const img = ctx.createImageData(128, 128)
        for (let i = 0; i < img.data.length; i += 4) {
            const v = Math.random() * 255 | 0
            img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255
        }
        ctx.putImageData(img, 0, 0)
        document.body.appendChild(canvas)
    })
}

function animateCount(el) {
    const raw = el.textContent.trim()
    const suffix = raw.replace(/[0-9]/g, '')
    const target = parseInt(raw.replace(/\D/g, ''), 10)
    const start = performance.now()
        ; (function tick(now) {
            const p = Math.min((now - start) / 1400, 1)
            el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix
            if (p < 1) requestAnimationFrame(tick)
        })(start)
}
