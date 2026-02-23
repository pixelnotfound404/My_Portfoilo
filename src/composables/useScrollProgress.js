// Scroll progress bar at the top of the page
export function useScrollProgress() {
    const bar = document.createElement('div')
    bar.style.cssText = `position:fixed;top:0;left:0;height:2px;background:var(--clr-accent);
    z-index:99999;width:0%;transition:width 0.1s linear;pointer-events:none;`
    document.body.appendChild(bar)
    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight
        bar.style.width = `${(window.scrollY / total) * 100}%`
    }, { passive: true })
}
