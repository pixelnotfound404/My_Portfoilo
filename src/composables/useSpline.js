// Kills the Spline watermark by injecting CSS into each spline-viewer shadow root
export function killSplineBadge() {
    let attempts = 0
    const poll = setInterval(() => {
        attempts++
        const viewers = document.querySelectorAll('spline-viewer')
        let allDone = !!viewers.length
        viewers.forEach(viewer => {
            const root = viewer.shadowRoot
            if (!root) { allDone = false; return }
            if (!root.querySelector('#spline-kill-style')) {
                const style = document.createElement('style')
                style.id = 'spline-kill-style'
                style.textContent = `#logo,a[href*="spline.design"],a[href*="spline"]{display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;}`
                root.appendChild(style)
            }
        })
        if (allDone || attempts > 75) clearInterval(poll)
    }, 200)
}
