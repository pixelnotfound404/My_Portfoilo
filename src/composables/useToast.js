export function showToast(msg, isError = false) {
    document.getElementById('ux-toast')?.remove()
    const toast = document.createElement('div')
    toast.id = 'ux-toast'
    toast.textContent = msg
    toast.style.cssText = `
    position:fixed;bottom:2.5rem;left:50%;transform:translateX(-50%) translateY(20px);
    background:${isError ? '#ff4d4d' : '#e0ff00'};color:#080808;
    font-family:'Inter',sans-serif;font-size:0.7rem;font-weight:700;
    letter-spacing:0.15em;text-transform:uppercase;
    padding:0.85rem 2rem;z-index:999999;
    opacity:0;transition:opacity 0.3s,transform 0.3s;
    pointer-events:none;white-space:nowrap;
  `
    document.body.appendChild(toast)
    requestAnimationFrame(() => {
        toast.style.opacity = '1'
        toast.style.transform = 'translateX(-50%) translateY(0)'
    })
    setTimeout(() => {
        toast.style.opacity = '0'
        toast.style.transform = 'translateX(-50%) translateY(20px)'
        setTimeout(() => toast.remove(), 300)
    }, 4000)
}
