// Sends a click event to /api/click for tracking.
// Fails silently — never blocks navigation.
export async function trackClick(label) {
    try {
        await fetch('/api/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ label }),
        })
    } catch {
        // silently ignore network errors
    }
}
