// Sends form data to our OWN serverless function (/api/contact)
// The bot token lives on the server — it is NEVER exposed to the browser.
export function sendToTelegram(name, email, telegram, type, message) {
    return fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, telegram, type, message }),
    })
}
