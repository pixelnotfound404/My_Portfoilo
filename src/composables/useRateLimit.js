// Rate limiting via localStorage
export function useRateLimit({ cooldownMs, windowMs, maxPerHour, onTick, onReady }) {
    const KEY = '_ux_rl'

    function getLog() {
        try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
        catch { return [] }
    }
    function saveLog(log) { localStorage.setItem(KEY, JSON.stringify(log)) }

    function check() {
        const now = Date.now()
        const log = getLog().filter(t => now - t < windowMs)
        const last = log[log.length - 1]
        if (last && now - last < cooldownMs) {
            const secs = Math.ceil((cooldownMs - (now - last)) / 1000)
            return { blocked: true, reason: `// Slow down! Try again in ${secs}s` }
        }
        if (log.length >= maxPerHour) {
            const minsLeft = Math.ceil((windowMs - (now - log[0])) / 60000)
            return { blocked: true, reason: `// Limit reached. Try again in ~${minsLeft} min` }
        }
        return { blocked: false, log }
    }

    function record(log) { log.push(Date.now()); saveLog(log) }

    let timer = null
    function startCountdown() {
        if (timer) return
        timer = setInterval(() => {
            const { blocked } = check()
            if (!blocked) {
                clearInterval(timer); timer = null; onReady?.()
            } else {
                const log = getLog()
                const last = log[log.length - 1]
                const secs = Math.ceil((cooldownMs - (Date.now() - last)) / 1000)
                onTick?.(secs)
            }
        }, 1000)
    }

    return { check, record, startCountdown }
}
