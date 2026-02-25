// Sends form data to our OWN serverless function (/api/contact)
// The bot token lives on the server — it is NEVER exposed to the browser.
export async function sendToTelegram(name, email, telegram, type, message) {
    const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, telegram, type, message }),
    })

    // Log response details in dev for debugging
    if (!res.ok) {
        const errorBody = await res.text().catch(() => '(no body)')
        console.error(`[useTelegram] API responded ${res.status}:`, errorBody)
    }

    return res
}
