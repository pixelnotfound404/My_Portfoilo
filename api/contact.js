// api/contact.js — Vercel Serverless Function
// Runs on the SERVER. The bot token is NEVER sent to the browser.

export default async function handler(req, res) {
    // CORS headers – allow the front-end origin
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
        const { name, email, telegram, type, message } = req.body || {}

        // Basic server-side validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID

        if (!BOT_TOKEN || !CHAT_ID) {
            console.error('Missing env vars — TELEGRAM_BOT_TOKEN:', !!BOT_TOKEN, 'TELEGRAM_CHAT_ID:', !!CHAT_ID)
            return res.status(500).json({ error: 'Server misconfigured — missing environment variables' })
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
            `💬 *Message:*\n${message}`

        const tgUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

        const tgRes = await fetch(tgUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text,
                parse_mode: 'Markdown',
            }),
        })

        const data = await tgRes.json()

        if (!tgRes.ok) {
            console.error('Telegram API error:', JSON.stringify(data))
            return res.status(502).json({ error: 'Telegram error', detail: data })
        }

        return res.status(200).json({ ok: true })
    } catch (err) {
        console.error('Serverless function error:', err.message, err.stack)
        return res.status(500).json({ error: 'Internal server error', detail: err.message })
    }
}
