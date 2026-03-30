// api/pageview.js — Vercel Serverless Function
// Counts unique daily visitors and notifies via Telegram with geo-location.
//
// Required env vars (Vercel Dashboard > Settings > Environment Variables):
//   TELEGRAM_BOT_TOKEN   — your bot token
//   TELEGRAM_CHAT_ID     — your chat/user ID
//
// Optional (add after enabling Vercel KV store):
//   KV_REST_API_URL      — auto-added by Vercel when you connect a KV store
//   KV_REST_API_TOKEN    — auto-added by Vercel when you connect a KV store

const VISIT_TOTAL_KEY = 'portfolio:visits:total'

// ── Bot / crawler detection ───────────────────────────────────────────────────
const BOT_KEYWORDS = [
    'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'slurp', 'baiduspider',
    'facebot', 'ia_archiver', 'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot',
    'seznambot', 'sogou', 'exabot', 'facebookexternalhit', 'twitterbot',
    'linkedinbot', 'applebot', 'petalbot', 'headlesschrome', 'phantomjs',
    'prerender', 'lighthouse', 'pagespeed', 'vercel-screenshot', 'vercel-edge',
    'pingdom', 'uptimerobot', 'statuscake', 'site24x7', 'wget', 'libcurl',
    'go-http-client', 'python-requests', 'python-urllib', 'node-fetch',
    'undici', 'postman', 'okhttp', 'insomnia',
]

function isBot(req) {
    const ua = (req.headers['user-agent'] || '').toLowerCase()
    if (!ua) return true
    const matched = BOT_KEYWORDS.find(k => ua.includes(k))
    if (matched) {
        console.log(`[pageview] bot blocked — keyword: "${matched}" | UA: ${ua.slice(0, 100)}`)
        return true
    }
    return false
}

// ── IP Geolocation via ip-api.com (free, no key needed, 45 req/min) ──────────
async function getGeoInfo(ip) {
    // Skip for private/local IPs
    if (!ip || ip === 'unknown' || ip.startsWith('192.168') || ip.startsWith('10.') || ip === '127.0.0.1') {
        return null
    }
    try {
        const res = await fetch(
            `http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,isp,org,lat,lon,timezone`,
            { signal: AbortSignal.timeout(3000) } // 3s timeout so it never hangs
        )
        if (!res.ok) return null
        const data = await res.json()
        if (data.status !== 'success') return null
        return data
    } catch {
        return null // silently fail — geo is optional
    }
}

// ── Tiny KV REST client ───────────────────────────────────────────────────────
async function kvIncr(key) {
    const url   = process.env.KV_REST_API_URL
    const token = process.env.KV_REST_API_TOKEN
    if (!url || !token) return null
    const res = await fetch(`${url}/incr/${key}`, {
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

    const today   = new Date().toISOString().slice(0, 10)
    const seenKey = `portfolio:seen:${today}:${ip}`

    const getRes = await fetch(`${url}/get/${seenKey}`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    const json = await getRes.json()
    if (json.result) return true

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

// Flag emoji from country code (e.g. "TH" → 🇹🇭)
function countryFlag(code) {
    if (!code || code.length !== 2) return '🌍'
    return [...code.toUpperCase()].map(c => String.fromCodePoint(0x1F1E0 - 65 + c.charCodeAt(0))).join('')
}

// In-memory cooldown — 5 minutes between notifications from the same IP
const recentIPs = new Map()
const COOLDOWN_MS = 5 * 60 * 1000

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') return res.status(200).end()
    if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' })

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID   = process.env.TELEGRAM_CHAT_ID

    if (!BOT_TOKEN || !CHAT_ID) {
        console.error('[pageview] missing env vars')
        return res.status(500).json({ error: 'Server misconfigured' })
    }

    try {
        const ip = getClientIP(req)
        const ua = req.headers['user-agent'] || 'unknown'

        // ── 1. Bot filter ─────────────────────────────────────────
        if (isBot(req)) {
            return res.status(200).json({ ok: true, skipped: 'bot' })
        }

        // ── 2. Per-IP cooldown (5 min) ────────────────────────────
        const lastSeen = recentIPs.get(ip) || 0
        const elapsed  = Date.now() - lastSeen
        if (elapsed < COOLDOWN_MS) {
            console.log(`[pageview] cooldown — IP: ${ip} (${Math.round(elapsed / 1000)}s ago)`)
            return res.status(200).json({ ok: true, skipped: 'cooldown' })
        }
        recentIPs.set(ip, Date.now())
        console.log(`[pageview] ✅ real visitor — IP: ${ip} | UA: ${ua.slice(0, 100)}`)

        // ── 3. KV daily dedup ─────────────────────────────────────
        const alreadyCounted = await isAlreadyCounted(ip)
        if (alreadyCounted) {
            console.log(`[pageview] already counted today — IP: ${ip}`)
            return res.status(200).json({ ok: true, skipped: 'already_counted' })
        }

        // ── 4. Geo lookup & total counter (run in parallel) ───────
        const [geo, total] = await Promise.all([
            getGeoInfo(ip),
            (async () => {
                const hasKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
                return hasKV ? await kvIncr(VISIT_TOTAL_KEY) : null
            })(),
        ])

        // ── 5. Detect device type from UA ─────────────────────────
        let device = '🖥️ Desktop'
        if (/mobile|android|iphone|ipad|ipod/i.test(ua)) device = '📱 Mobile'
        else if (/tablet|ipad/i.test(ua)) device = '📟 Tablet'

        let browser = 'Unknown'
        if (/edg\//i.test(ua))       browser = 'Edge'
        else if (/opr\//i.test(ua))  browser = 'Opera'
        else if (/chrome/i.test(ua)) browser = 'Chrome'
        else if (/safari/i.test(ua)) browser = 'Safari'
        else if (/firefox/i.test(ua)) browser = 'Firefox'

        // ── 6. Build Telegram message ─────────────────────────────
        const time = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Bangkok',
            dateStyle: 'medium',
            timeStyle: 'short',
        })

        const countLine = total !== null ? `📊 *Total visits:* ${total}\n` : ''

        let locationBlock = ''
        if (geo) {
            const flag = countryFlag(geo.countryCode)
            locationBlock =
                `\n📍 *Location*\n` +
                `${flag} ${geo.city}, ${geo.regionName}, ${geo.country}\n` +
                `🌐 *ISP:* ${geo.isp || geo.org || 'Unknown'}\n` +
                `🗺️ *Coords:* [${geo.lat}, ${geo.lon}](https://www.google.com/maps?q=${geo.lat},${geo.lon})\n`
        }

        const text =
            `👁️ *Someone is viewing your portfolio!*\n` +
            countLine +
            `🕐 *Time (BKK):* ${time}\n` +
            `\n🔌 *Network*\n` +
            `🌐 *IP:* \`${ip}\`\n` +
            locationBlock +
            `\n💻 *Device*\n` +
            `${device} · ${browser}\n` +
            `\n_Scott UX Lab_`

        const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' }),
        })

        if (!tgRes.ok) {
            const errBody = await tgRes.text()
            console.error('[pageview] Telegram error:', errBody)
        }

        return res.status(200).json({ ok: true, total })
    } catch (err) {
        console.error('[pageview] error:', err.message)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
