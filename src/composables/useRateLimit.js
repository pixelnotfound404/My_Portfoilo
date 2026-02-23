// Rate limiting + spam ban via localStorage
// After maxPerHour submissions in windowMs, the user is hard-banned for BAN_MS (24h)
const BAN_KEY = '_ux_ban'   // { until: timestamp, strikes: number }
const LOG_KEY = '_ux_rl'    // array of timestamps
const BAN_MS = 24 * 60 * 60 * 1000  // 24 hours

export function useRateLimit({ cooldownMs, windowMs, maxPerHour, onTick, onReady }) {

    // ── Ban helpers ────────────────────────────────────────────────
    function getBan() {
        try { return JSON.parse(localStorage.getItem(BAN_KEY) || 'null') }
        catch { return null }
    }
    function setBan(strikes) {
        localStorage.setItem(BAN_KEY, JSON.stringify({
            until: Date.now() + BAN_MS,
            strikes,
        }))
    }
    function clearBan() { localStorage.removeItem(BAN_KEY) }

    function checkBan() {
        const ban = getBan()
        if (!ban) return { banned: false }
        if (Date.now() < ban.until) {
            const hrs = Math.ceil((ban.until - Date.now()) / 3_600_000)
            return {
                banned: true,
                reason: `// You've been blocked for spamming. Try again in ~${hrs}h.`,
            }
        }
        // Ban expired — clean up
        clearBan()
        return { banned: false }
    }

    // ── Log helpers ────────────────────────────────────────────────
    function getLog() {
        try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]') }
        catch { return [] }
    }
    function saveLog(log) { localStorage.setItem(LOG_KEY, JSON.stringify(log)) }

    // ── Main check ─────────────────────────────────────────────────
    function check() {
        // 1. Hard ban check first
        const banState = checkBan()
        if (banState.banned) return { blocked: true, reason: banState.reason, banned: true }

        const now = Date.now()
        const log = getLog().filter(t => now - t < windowMs)

        // 2. Per-message cooldown (60s between messages)
        const last = log[log.length - 1]
        if (last && now - last < cooldownMs) {
            const secs = Math.ceil((cooldownMs - (now - last)) / 1000)
            return { blocked: true, reason: `// Slow down! Wait ${secs}s before sending again.` }
        }

        // 3. Hourly cap — if exceeded, issue a 24h ban
        if (log.length >= maxPerHour) {
            const ban = getBan()
            const strikes = (ban?.strikes ?? 0) + 1
            setBan(strikes)
            saveLog([])   // reset log so ban message is clean
            return {
                blocked: true,
                banned: true,
                reason: `// Spam detected. You've been blocked for 24 hours.`,
            }
        }

        return { blocked: false, log }
    }

    function record(log) { log.push(Date.now()); saveLog(log) }

    // ── Countdown timer (updates button label) ─────────────────────
    let timer = null
    function startCountdown() {
        if (timer) return
        timer = setInterval(() => {
            const { blocked, banned } = check()
            if (!blocked) {
                clearInterval(timer); timer = null; onReady?.()
            } else if (banned) {
                onTick?.('BLOCKED')
                clearInterval(timer); timer = null   // no point ticking — 24h ban
            } else {
                const log = getLog()
                const last = log[log.length - 1]
                const secs = Math.ceil((cooldownMs - (Date.now() - last)) / 1000)
                onTick?.(secs > 0 ? secs : '…')
            }
        }, 1000)
    }

    return { check, record, startCountdown }
}
