// api/click.js — Vercel Serverless Function
// Tracks unique link clicks (deduplicated per IP + link label) and notifies via Telegram.
//
// Uses the same env vars as api/pageview.js:
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
//   KV_REST_API_URL, KV_REST_API_TOKEN (optional — for persistent counts)

// ── Bot filter (same as pageview) ────────────────────────────────────────────
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
    return !!BOT_KEYWORDS.find(k => ua.includes(k))
}

// ── IP Geo lookup ─────────────────────────────────────────────────────────────
async function getGeoInfo(ip) {
    if (!ip || ip === 'unknown' || ip.startsWith('192.168') || ip.startsWith('10.') || ip === '127.0.0.1') return null
    try {
        const res = await fetch(
            `http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,isp,org`,
            { signal: AbortSignal.timeout(3000) }
        )
        if (!res.ok) return null
        const data = await res.json()
        return data.status === 'success' ? data : null
    } catch { return null }
}

// ── KV helpers ────────────────────────────────────────────────────────────────
async function kvIncr(key) {
    const url = process.env.KV_REST_API_URL
    const token = process.env.KV_REST_API_TOKEN
    if (!url || !token) return null
    const res = await fetch(`${url}/incr/${key}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    return (await res.json()).result ?? null
}

// Dedup: same IP clicking the same label on the same day = 1 count
async function isAlreadyClicked(ip, label) {
    const url = process.env.KV_REST_API_URL
    const token = process.env.KV_REST_API_TOKEN
    if (!url || !token) return false

    const today   = new Date().toISOString().slice(0, 10)
    const safeLabel = label.replace(/[^a-z0-9]/gi, '_').slice(0, 40)
    const seenKey  = `portfolio:click:seen:${today}:${ip}:${safeLabel}`

    const getRes = await fetch(`${url}/get/${seenKey}`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    const json = await getRes.json()
    if (json.result) return true

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

function countryFlag(code) {
    if (!code || code.length !== 2) return '🌍'
    return [...code.toUpperCase()].map(c => String.fromCodePoint(0x1F1E0 - 65 + c.charCodeAt(0))).join('')
}

// In-memory: prevent same IP clicking same label within 60 seconds
const recentClicks = new Map()
const COOLDOWN_MS = 60 * 1000

export default async function handler(req, res) {
    // ── CORS: restrict to your domain ────────────────────────
    const ALLOWED_ORIGINS = new Set([
        'https://scott-ux-lab.vercel.app',
        'https://www.scott-ux-lab.vercel.app',
    ])
    const origin = req.headers.origin || ''
    if (ALLOWED_ORIGINS.has(origin) || origin.startsWith('http://localhost')) {
        res.setHeader('Access-Control-Allow-Origin', origin)
        res.setHeader('Vary', 'Origin')
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') return res.status(200).end()
    if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' })

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID   = process.env.TELEGRAM_CHAT_ID
    if (!BOT_TOKEN || !CHAT_ID) return res.status(500).json({ error: 'Server misconfigured' })

    try {
        const { label = 'Unknown Link' } = req.body || {}
        const ip = getClientIP(req)
        const ua = req.headers['user-agent'] || 'unknown'

        // ── 1. Bot filter ─────────────────────────────────────────
        if (isBot(req)) return res.status(200).json({ ok: true, skipped: 'bot' })

        // ── 2. In-memory cooldown (60s per IP+label) ──────────────
        const cooldownKey = `${ip}::${label}`
        const lastClick = recentClicks.get(cooldownKey) || 0
        if (Date.now() - lastClick < COOLDOWN_MS) {
            return res.status(200).json({ ok: true, skipped: 'cooldown' })
        }
        recentClicks.set(cooldownKey, Date.now())

        // ── 3. KV daily dedup (same IP + label = 1 count/day) ─────
        const alreadyClicked = await isAlreadyClicked(ip, label)
        if (alreadyClicked) {
            return res.status(200).json({ ok: true, skipped: 'already_counted' })
        }

        // ── 4. Increment and get count ──────────────────────────
        const hasKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
        const safeLabel = label.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 40)

        let linkTotal = null
        const [kvTotal, cApiResult, geo] = await Promise.all([
            hasKV ? kvIncr(`portfolio:clicks:${safeLabel}`) : Promise.resolve(null),
            // countapi.xyz: free persistent counter, no auth needed
            fetch(`https://api.countapi.xyz/hit/scott-ux-lab/${safeLabel}`)
                .then(r => r.ok ? r.json() : null)
                .catch(() => null),
            getGeoInfo(ip),
        ])
        // KV takes priority; countapi.xyz is the fallback
        linkTotal = kvTotal ?? cApiResult?.value ?? null

        // ── 5. Device / browser ───────────────────────────────────
        let device  = '🖥️ Desktop'
        if (/mobile|android|iphone|ipad/i.test(ua)) device = '📱 Mobile'
        let browser = 'Unknown'
        if      (/edg\//i.test(ua))    browser = 'Edge'
        else if (/opr\//i.test(ua))    browser = 'Opera'
        else if (/chrome/i.test(ua))   browser = 'Chrome'
        else if (/safari/i.test(ua))   browser = 'Safari'
        else if (/firefox/i.test(ua))  browser = 'Firefox'

        // ── 6. Telegram notification ──────────────────────────────
        const time = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Bangkok',
            dateStyle: 'medium',
            timeStyle: 'short',
        })

        const countLine = linkTotal !== null
            ? `📊 *Unique clicks on this link:* ${linkTotal}\n`
            : ''

        let locationBlock = ''
        if (geo) {
            const flag = countryFlag(geo.countryCode)
            locationBlock =
                `\n📍 *Location*\n` +
                `${flag} ${geo.city}, ${geo.regionName}, ${geo.country}\n` +
                `🌐 *ISP:* ${geo.isp || geo.org || 'Unknown'}\n`
        }

        const text =
            `🔗 *Link Clicked!*\n\n` +
            `📎 *Link:* ${label}\n` +
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

        if (!tgRes.ok) console.error('[click] Telegram error:', await tgRes.text())

        console.log(`[click] ✅ ${label} — IP: ${ip} — count: ${linkTotal}`)
        return res.status(200).json({ ok: true, count: linkTotal })
    } catch (err) {
        console.error('[click] error:', err.message)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
