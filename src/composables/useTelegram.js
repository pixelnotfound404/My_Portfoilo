const BOT_TOKEN = '8748171041:AAE5kJGAp-z8CAJex9THcEYQIajUZny79k4'
const CHAT_ID = '869070906'

export function sendToTelegram(name, email, type, message) {
    const text =
        `📬 *New message from Scott UX Lab*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📧 *Email:* ${email}\n` +
        `🎯 *Project type:* ${type || 'Not specified'}\n\n` +
        `💬 *Message:*\n${message}`

    return fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' })
    })
}
