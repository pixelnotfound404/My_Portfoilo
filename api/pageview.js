// api/pageview.js — Vercel Serverless Function
// Counts unique daily visitors and notifies via Telegram.
//
// Storage: Vercel KV (optional).
//   - If KV env vars are present  → persists a total + deduplicates by IP+date
//   - If KV env vars are absent   → still fires the Telegram ping (no count)
//
// Required env vars (Vercel Dashboard > Settings > Environment Variables):
//   TELEGRAM_BOT_TOKEN   — your bot token
//   TELEGRAM_CHAT_ID     — your chat/user ID
//
// Optional env vars (add after enabling Vercel KV):
//   KV_REST_API_URL      — auto-added by Vercel when you connect a KV store
//   KV_REST_API_TOKEN    — auto-added by Vercel when you connect a KV store

const VISIT_TOTAL_KEY = 'portfolio:visits:total'

// ── Bot / crawler detection ──────────────────────────────────────────────────
// Matches Vercel bots, deployment crawlers, headless browsers, SEO tools, etc.
const BOT_UA_PATTERN = /bot|crawler|spider|crawling|prerender|headless|vercel|lighthouse|screenshot|googlebot|bingbot|slurp|duckduck|baidu|yandex|sogou|facebot|ia_archiver|semrush|ahrefs|moz|pingdom|uptime|monitor|checker|curl|wget|python|java|go-http|axios|node-fetch|undici/i

function isBot(req) {
    const ua = req.headers['user-agent'] || ''
    // No user-agent at all → almost certainly a bot/automated request
    if (!ua) return true
    return BOT_UA_PATTERN.test(ua)
}

// Only accept requests that come from the actual portfolio site
// (Referer or Origin must contain the site's domain or be from Vercel preview)
function hasValidOrigin(req) {
    const origin  = req.headers['origin']  || ''
    const referer = req.headers['referer'] || ''
    const combined = origin + referer

    // Allow any Vercel deployment of this project, localhost dev, or custom domain
    return (
        combined.includes('pixelnotfound404') ||
        combined.includes('localhost') ||
        combined.includes('127.0.0.1') ||
        combined.includes('scott-ux-lab') ||
        combined.includes('vercel.app')
    )
}

// ── Tiny KV REST client (no npm package needed) ──────────────────────────────
async function kvIncr(key) {
    const url   = process.env.KV_REST_API_URL
    const token = process.env.KV_REST_API_TOKEN
    if (!url || !token) return null
    const res  = await fetch(`${url}/incr/${key}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.result ?? null
}

// Check if this IP has already been counted today (KV-based)
async function isAlreadyCounted(ip) {
    const url   = process.env.KV_REST_API_URL
    const token = process.env.KV_REST_API_TOKEN
    if (!url || !token) return false

    const today  = new Date().toISOString().slice(0, 10)       // "YYYY-MM-DD"
    const seenKey = `portfolio:seen:${today}:${ip}`

    const getRes = await fetch(`${url}/get/${seenKey}`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    const json = await getRes.json()
    if (json.result) return true // already seen today

    // Mark as seen for 25 hours
    await fetch(`${url}/set/${seenKey}/1/ex/90000`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    })
    return false
}

function getClientIP(req) {
    return (
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress ||
        'unknown'
    )
}

// In-memory cooldown — prevents the same IP spamming within 30s
// (resets on cold start, which is fine for a portfolio)
const recentIPs = new Map()
const COOLDOWN_MS = 30 * 1000

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') return res.status(200).end()
    if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' })

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID   = process.env.TELEGRAM_CHAT_ID

    if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({ error: 'Server misconfigured' })
    }

    try {
        const ip = getClientIP(req)

        // ── 1. Block bots & crawlers ──────────────────────────────
        if (isBot(req)) {
            console.log(`[pageview] bot skipped — UA: ${req.headers['user-agent']} | IP: ${ip}`)
            return res.status(200).json({ ok: true, skipped: 'bot' })
        }

        // ── 2. Validate origin (must come from the portfolio site) ─
        if (!hasValidOrigin(req)) {
            console.log(`[pageview] invalid origin skipped — IP: ${ip}`)
            return res.status(200).json({ ok: true, skipped: 'origin' })
        }

        // ── 3. In-memory per-IP cooldown (30s) ───────────────────
        const lastSeen = recentIPs.get(ip) || 0
        if (Date.now() - lastSeen < COOLDOWN_MS) {
            return res.status(200).json({ ok: true, skipped: 'cooldown' })
        }
        recentIPs.set(ip, Date.now())

        // ── 4. KV daily deduplication (same IP = 1 visit/day) ────
        const alreadyCounted = await isAlreadyCounted(ip)
        if (alreadyCounted) {
            return res.status(200).json({ ok: true, skipped: 'already_counted' })
        }

        // ── 5. Increment total ────────────────────────────────────
        const hasKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
        let total = null
        if (hasKV) total = await kvIncr(VISIT_TOTAL_KEY)

        // ── 6. Send Telegram notification ─────────────────────────
        const countLine = total !== null ? `📊 *Total visits:* ${total}\n` : ''
        const time = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Bangkok',
            dateStyle: 'medium',
            timeStyle: 'short',
        })

        const text =
            `👁️ *Someone is viewing your portfolio!*\n\n` +
            `🌐 *IP:* \`${ip}\`\n` +
            `🕐 *Time (BKK):* ${time}\n` +
            countLine +
            `\n_Scott UX Lab_`

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' }),
        })

        return res.status(200).json({ ok: true, total })
    } catch (err) {
        console.error('[pageview] error:', err.message)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
