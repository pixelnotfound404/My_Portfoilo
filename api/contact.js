// api/contact.js — Vercel Serverless Function
// Runs on the SERVER. The bot token is NEVER sent to the browser.
export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { name, email, telegram, type, message } = req.body

    // Basic server-side validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' })
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID

    if (!BOT_TOKEN || !CHAT_ID) {
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
        `💬 *Message:*\n${message}`

    try {
        const tgRes = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' }),
            }
        )
        const data = await tgRes.json()
        if (!tgRes.ok) return res.status(502).json({ error: 'Telegram error', data })
        return res.status(200).json({ ok: true })
    } catch (err) {
        return res.status(500).json({ error: 'Internal error' })
    }
}
