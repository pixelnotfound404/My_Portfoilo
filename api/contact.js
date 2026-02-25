// api/contact.js — Vercel Serverless Function
// Runs on the SERVER. The bot token is NEVER sent to the browser.

// ═══════════════════════════════════════════════════════════════
// In-memory rate limiter (per serverless instance).
// Vercel serverless functions are ephemeral, so this map resets
// on cold starts. For a portfolio site this is more than enough
// to stop casual spam. For heavier protection, use Vercel KV.
// ═══════════════════════════════════════════════════════════════
const rateLimitMap = new Map()

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000  // 1 hour window
const MAX_REQUESTS_PER_WINDOW = 5             // max 5 msgs per IP per hour
const COOLDOWN_MS = 30 * 1000                 // min 30s between messages
const MAX_FIELD_LENGTH = 2000                 // prevent giant payloads
const BLOCKED_IPS = new Set()                 // permanent blocks (optional)
const BAN_THRESHOLD = 15                      // auto-ban after this many in window
const BAN_DURATION_MS = 24 * 60 * 60 * 1000   // 24h ban

function getClientIP(req) {
    // Vercel provides the real client IP in these headers
    return (
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress ||
        'unknown'
    )
}

function checkRateLimit(ip) {
    const now = Date.now()

    // Check permanent block
    if (BLOCKED_IPS.has(ip)) {
        return { allowed: false, reason: 'IP is blocked', retryAfter: 86400 }
    }

    let entry = rateLimitMap.get(ip)

    if (!entry) {
        entry = { timestamps: [], bannedUntil: 0 }
        rateLimitMap.set(ip, entry)
    }

    // Check if IP is banned
    if (entry.bannedUntil > now) {
        const retryAfter = Math.ceil((entry.bannedUntil - now) / 1000)
        return { allowed: false, reason: 'Too many requests — temporarily banned', retryAfter }
    }

    // Clean old entries outside the window
    entry.timestamps = entry.timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS)

    // Check cooldown (time between messages)
    const lastRequest = entry.timestamps[entry.timestamps.length - 1]
    if (lastRequest && now - lastRequest < COOLDOWN_MS) {
        const waitSecs = Math.ceil((COOLDOWN_MS - (now - lastRequest)) / 1000)
        return { allowed: false, reason: `Please wait ${waitSecs}s before sending again`, retryAfter: waitSecs }
    }

    // Check hourly limit
    if (entry.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
        // If they've hit the limit many times, issue a longer ban
        if (entry.timestamps.length >= BAN_THRESHOLD) {
            entry.bannedUntil = now + BAN_DURATION_MS
            entry.timestamps = []
            return { allowed: false, reason: 'Spam detected — blocked for 24 hours', retryAfter: 86400 }
        }
        return { allowed: false, reason: 'Hourly message limit reached — try again later', retryAfter: 3600 }
    }

    // Record this request
    entry.timestamps.push(now)
    return { allowed: true }
}

// Periodically clean up stale entries to prevent memory leaks
setInterval(() => {
    const now = Date.now()
    for (const [ip, entry] of rateLimitMap) {
        const recent = entry.timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS)
        if (recent.length === 0 && entry.bannedUntil < now) {
            rateLimitMap.delete(ip)
        }
    }
}, 5 * 60 * 1000) // cleanup every 5 minutes


export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        // ── Rate limit check ──────────────────────────────────────
        const clientIP = getClientIP(req)
        const rateCheck = checkRateLimit(clientIP)

        if (!rateCheck.allowed) {
            res.setHeader('Retry-After', String(rateCheck.retryAfter || 60))
            console.warn(`[RATE LIMIT] IP ${clientIP} blocked: ${rateCheck.reason}`)
            return res.status(429).json({ error: rateCheck.reason })
        }

        const { name, email, telegram, type, message } = req.body || {}

        // ── Validation ────────────────────────────────────────────
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        // Sanitize — reject oversized payloads
        if (
            name.length > MAX_FIELD_LENGTH ||
            email.length > MAX_FIELD_LENGTH ||
            message.length > MAX_FIELD_LENGTH ||
            (telegram && telegram.length > 200) ||
            (type && type.length > 200)
        ) {
            return res.status(400).json({ error: 'Field too long' })
        }

        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' })
        }

        // ── Honeypot check ────────────────────────────────────────
        // If the request includes a "website" field, it's a bot
        // (real form doesn't have this field)
        if (req.body.website) {
            console.warn(`[HONEYPOT] Bot caught from IP ${clientIP}`)
            // Return 200 to trick the bot into thinking it succeeded
            return res.status(200).json({ ok: true })
        }

        // ── Send to Telegram ──────────────────────────────────────
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID

        if (!BOT_TOKEN || !CHAT_ID) {
            console.error('Missing env vars — TELEGRAM_BOT_TOKEN:', !!BOT_TOKEN, 'TELEGRAM_CHAT_ID:', !!CHAT_ID)
            return res.status(500).json({ error: 'Server misconfigured' })
        }

        const tgLine = telegram
            ? `📲 *Telegram:* @${telegram.replace(/^@/, '')}\n`
            : ''

        const text =
            `📬 *New message from Scott UX Lab*\n\n` +
            `👤 *Name:* ${name}\n` +
            `📧 *Email:* ${email}\n` +
            tgLine +
            `🎯 *Project type:* ${type || 'Not specified'}\n\n` +
            `💬 *Message:*\n${message}\n\n` +
            `🌐 *IP:* ${clientIP}`

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

        const data = await tgRes.json()

        if (!tgRes.ok) {
            console.error('Telegram API error:', JSON.stringify(data))
            return res.status(502).json({ error: 'Telegram error', detail: data })
        }

        return res.status(200).json({ ok: true })
    } catch (err) {
        console.error('Serverless function error:', err.message, err.stack)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
