// api/contact.js — Vercel Serverless Function
// Runs on the SERVER. The bot token is NEVER sent to the browser.
//
// Anti-spam layers (VPN-proof):
//   1. Global message cap    — max N messages/hour across ALL IPs (via KV)
//   2. Per-IP rate limit     — max 3 messages/hour per IP (in-memory + KV)
//   3. Per-email dedup       — same email = max 2 messages/day (via KV)
//   4. Cloudflare Turnstile  — invisible CAPTCHA (optional, enable by setting TURNSTILE_SECRET)
//   5. Honeypot field        — traps naive bots
//   6. Input validation      — length limits, email format, Markdown escaping

// ═══════════════════════════════════════════════════════════════
// Config
// ═══════════════════════════════════════════════════════════════
const MAX_FIELD_LENGTH        = 2000
const GLOBAL_HOURLY_CAP       = 10     // total messages to Telegram per hour (all IPs)
const PER_IP_HOURLY_CAP       = 3      // per-IP limit
const PER_EMAIL_DAILY_CAP     = 2      // same email, max 2/day
const COOLDOWN_MS             = 30_000 // 30s between messages from same IP
const BAN_THRESHOLD           = 6      // auto-ban IP after this many attempts
const BAN_DURATION_MS         = 24 * 60 * 60 * 1000 // 24h ban

// Allowed origins (restrict CORS)
const ALLOWED_ORIGINS = new Set([
    'https://scott-ux-lab.vercel.app',
    'https://www.scott-ux-lab.vercel.app',
    // Add your custom domain here:
    // 'https://scottuxlab.com',
])

// ═══════════════════════════════════════════════════════════════
// In-memory rate limiter (backup when KV is unavailable)
// ═══════════════════════════════════════════════════════════════
const rateLimitMap = new Map()
const globalLog    = []  // timestamps of all messages sent this instance

function getClientIP(req) {
    return (
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress ||
        'unknown'
    )
}

function checkInMemoryRateLimit(ip) {
    const now = Date.now()
    let entry = rateLimitMap.get(ip)

    if (!entry) {
        entry = { timestamps: [], bannedUntil: 0 }
        rateLimitMap.set(ip, entry)
    }

    // Check ban
    if (entry.bannedUntil > now) {
        const retryAfter = Math.ceil((entry.bannedUntil - now) / 1000)
        return { allowed: false, reason: 'Too many requests — temporarily banned', retryAfter }
    }

    // Clean old entries
    const WINDOW = 60 * 60 * 1000
    entry.timestamps = entry.timestamps.filter(t => now - t < WINDOW)

    // Cooldown
    const last = entry.timestamps[entry.timestamps.length - 1]
    if (last && now - last < COOLDOWN_MS) {
        const wait = Math.ceil((COOLDOWN_MS - (now - last)) / 1000)
        return { allowed: false, reason: `Please wait ${wait}s before sending again`, retryAfter: wait }
    }

    // Hourly cap
    if (entry.timestamps.length >= PER_IP_HOURLY_CAP) {
        if (entry.timestamps.length >= BAN_THRESHOLD) {
            entry.bannedUntil = now + BAN_DURATION_MS
            entry.timestamps = []
            return { allowed: false, reason: 'Spam detected — blocked for 24 hours', retryAfter: 86400 }
        }
        return { allowed: false, reason: 'Hourly message limit reached', retryAfter: 3600 }
    }

    entry.timestamps.push(now)
    return { allowed: true }
}

// ═══════════════════════════════════════════════════════════════
// KV-based persistent rate limiting (survives cold starts + VPN)
// ═══════════════════════════════════════════════════════════════
async function kvCommand(path, method = 'GET') {
    const url   = process.env.KV_REST_API_URL
    const token = process.env.KV_REST_API_TOKEN
    if (!url || !token) return null
    try {
        const res = await fetch(`${url}${path}`, {
            method,
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(3000),
        })
        if (!res.ok) return null
        return (await res.json()).result ?? null
    } catch { return null }
}

const hasKV = () => !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)

// Global cap: total messages per hour across all IPs
async function checkGlobalCapKV() {
    if (!hasKV()) return { allowed: true }
    const key = 'portfolio:contact:global:hour'
    const count = await kvCommand(`/incr/${key}`, 'POST')
    if (count === 1) {
        await kvCommand(`/expire/${key}/3600`, 'POST') // expire in 1h
    }
    if (count !== null && count > GLOBAL_HOURLY_CAP) {
        return { allowed: false, reason: 'Service is busy — please try again later', retryAfter: 3600 }
    }
    return { allowed: true }
}

// Per-IP cap via KV (persistent across cold starts)
async function checkIpCapKV(ip) {
    if (!hasKV()) return { allowed: true }
    const key = `portfolio:contact:ip:${ip}`
    const count = await kvCommand(`/incr/${key}`, 'POST')
    if (count === 1) {
        await kvCommand(`/expire/${key}/3600`, 'POST')
    }
    if (count !== null && count > PER_IP_HOURLY_CAP) {
        // Auto-ban persistent abusers
        if (count > BAN_THRESHOLD) {
            const banKey = `portfolio:contact:ban:${ip}`
            await kvCommand(`/set/${banKey}/1/ex/86400`, 'POST') // 24h ban
            return { allowed: false, reason: 'Spam detected — blocked for 24 hours', retryAfter: 86400 }
        }
        return { allowed: false, reason: 'Hourly message limit reached', retryAfter: 3600 }
    }
    return { allowed: true }
}

// Check if IP is banned
async function isIpBannedKV(ip) {
    if (!hasKV()) return false
    const result = await kvCommand(`/get/portfolio:contact:ban:${ip}`)
    return !!result
}

// Per-email daily dedup
async function checkEmailCapKV(email) {
    if (!hasKV()) return { allowed: true }
    const safeEmail = email.toLowerCase().trim()
    const today = new Date().toISOString().slice(0, 10)
    const key = `portfolio:contact:email:${today}:${safeEmail}`
    const count = await kvCommand(`/incr/${key}`, 'POST')
    if (count === 1) {
        await kvCommand(`/expire/${key}/90000`, 'POST') // 25h
    }
    if (count !== null && count > PER_EMAIL_DAILY_CAP) {
        return { allowed: false, reason: 'You\'ve already sent messages today — please try again tomorrow', retryAfter: 86400 }
    }
    return { allowed: true }
}

// ═══════════════════════════════════════════════════════════════
// Cloudflare Turnstile verification (optional)
// ═══════════════════════════════════════════════════════════════
async function verifyTurnstile(token, ip) {
    const secret = process.env.TURNSTILE_SECRET
    if (!secret) return true // skip if not configured

    if (!token) return false // token required when Turnstile is enabled

    try {
        const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ secret, response: token, remoteip: ip }),
            signal: AbortSignal.timeout(5000),
        })
        const data = await res.json()
        return data.success === true
    } catch {
        return true // fail open — don't block real users if Turnstile is down
    }
}

// ═══════════════════════════════════════════════════════════════
// Markdown escaping — prevent injection in Telegram messages
// ═══════════════════════════════════════════════════════════════
function esc(text) {
    if (!text) return ''
    return String(text).replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1')
}

// ═══════════════════════════════════════════════════════════════
// Cleanup stale in-memory entries every 5 min
// ═══════════════════════════════════════════════════════════════
setInterval(() => {
    const now = Date.now()
    for (const [ip, entry] of rateLimitMap) {
        const recent = entry.timestamps.filter(t => now - t < 3600_000)
        if (recent.length === 0 && entry.bannedUntil < now) rateLimitMap.delete(ip)
    }
}, 5 * 60 * 1000)


// ═══════════════════════════════════════════════════════════════
// Handler
// ═══════════════════════════════════════════════════════════════
export default async function handler(req, res) {
    // ── CORS: restrict to your domain ────────────────────────
    const origin = req.headers.origin || ''
    if (ALLOWED_ORIGINS.has(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin)
        res.setHeader('Vary', 'Origin')
    }
    // Also allow localhost for dev
    if (origin.startsWith('http://localhost')) {
        res.setHeader('Access-Control-Allow-Origin', origin)
        res.setHeader('Vary', 'Origin')
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') return res.status(200).end()
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    try {
        const clientIP = getClientIP(req)

        // ── 1. Check KV ban first ────────────────────────────
        if (await isIpBannedKV(clientIP)) {
            res.setHeader('Retry-After', '86400')
            console.warn(`[BANNED] IP ${clientIP} is KV-banned`)
            return res.status(429).json({ error: 'Spam detected — blocked for 24 hours' })
        }

        // ── 2. In-memory rate limit (fast, first line of defense) ──
        const memCheck = checkInMemoryRateLimit(clientIP)
        if (!memCheck.allowed) {
            res.setHeader('Retry-After', String(memCheck.retryAfter || 60))
            console.warn(`[RATE LIMIT] IP ${clientIP}: ${memCheck.reason}`)
            return res.status(429).json({ error: memCheck.reason })
        }

        // ── 3. Parse & validate body ─────────────────────────
        const { name, email, telegram, type, message, website, turnstileToken } = req.body || {}

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        if (
            name.length > MAX_FIELD_LENGTH ||
            email.length > MAX_FIELD_LENGTH ||
            message.length > MAX_FIELD_LENGTH ||
            (telegram && telegram.length > 200) ||
            (type && type.length > 200)
        ) {
            return res.status(400).json({ error: 'Field too long' })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' })
        }

        // ── 4. Honeypot check ────────────────────────────────
        if (website) {
            console.warn(`[HONEYPOT] Bot caught from IP ${clientIP}`)
            return res.status(200).json({ ok: true }) // trick the bot
        }

        // ── 5. Cloudflare Turnstile (if configured) ──────────
        const turnstileOk = await verifyTurnstile(turnstileToken, clientIP)
        if (!turnstileOk) {
            console.warn(`[TURNSTILE] Failed verification — IP ${clientIP}`)
            return res.status(403).json({ error: 'Verification failed — please try again' })
        }

        // ── 6. KV-based global cap (VPN-proof) ──────────────
        const globalCheck = await checkGlobalCapKV()
        if (!globalCheck.allowed) {
            res.setHeader('Retry-After', String(globalCheck.retryAfter || 3600))
            console.warn(`[GLOBAL CAP] Limit reached — IP ${clientIP}`)
            return res.status(429).json({ error: globalCheck.reason })
        }

        // ── 7. KV-based IP cap (persistent) ──────────────────
        const ipCheck = await checkIpCapKV(clientIP)
        if (!ipCheck.allowed) {
            res.setHeader('Retry-After', String(ipCheck.retryAfter || 3600))
            console.warn(`[KV IP LIMIT] IP ${clientIP}: ${ipCheck.reason}`)
            return res.status(429).json({ error: ipCheck.reason })
        }

        // ── 8. KV-based email dedup (VPN-proof) ─────────────
        const emailCheck = await checkEmailCapKV(email)
        if (!emailCheck.allowed) {
            res.setHeader('Retry-After', String(emailCheck.retryAfter || 86400))
            console.warn(`[EMAIL LIMIT] ${email} — IP ${clientIP}`)
            return res.status(429).json({ error: emailCheck.reason })
        }

        // ── 9. Send to Telegram ──────────────────────────────
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
        const CHAT_ID   = process.env.TELEGRAM_CHAT_ID

        if (!BOT_TOKEN || !CHAT_ID) {
            console.error('Missing env vars — TELEGRAM_BOT_TOKEN:', !!BOT_TOKEN, 'TELEGRAM_CHAT_ID:', !!CHAT_ID)
            return res.status(500).json({ error: 'Server misconfigured' })
        }

        const tgLine = telegram
            ? `📲 *Telegram:* @${esc(telegram.replace(/^@/, ''))}\n`
            : ''

        const text =
            `📬 *New message from Scott UX Lab*\n\n` +
            `👤 *Name:* ${esc(name)}\n` +
            `📧 *Email:* ${esc(email)}\n` +
            tgLine +
            `🎯 *Project type:* ${esc(type || 'Not specified')}\n\n` +
            `💬 *Message:*\n${esc(message)}\n\n` +
            `🌐 *IP:* \`${clientIP}\``

        const tgRes = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text,
                    parse_mode: 'Markdown',
                }),
            }
        )

        if (!tgRes.ok) {
            const errData = await tgRes.json().catch(() => ({}))
            console.error('[contact] Telegram API error:', JSON.stringify(errData))
            // Don't leak Telegram error details to client
            return res.status(502).json({ error: 'Message delivery failed — please try again' })
        }

        console.log(`[contact] ✅ Message sent — IP: ${clientIP}, email: ${email}`)
        return res.status(200).json({ ok: true })
    } catch (err) {
        console.error('Serverless function error:', err.message, err.stack)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
