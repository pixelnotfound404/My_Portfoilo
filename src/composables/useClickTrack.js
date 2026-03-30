// Sends a click event to /api/click and returns the updated count.
export async function trackClick(label) {
    try {
        const res = await fetch('/api/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ label }),
            keepalive: true,
        })
        const data = await res.json()
        return data.count ?? null   // returns the updated total count
    } catch {
        return null
    }
}

// Fetches the current click count for a label (used on page load).
export async function fetchClickCount(label) {
    try {
        const res = await fetch(`/api/click-count?label=${encodeURIComponent(label)}`)
        const data = await res.json()
        return data.count ?? null
    } catch {
        return null
    }
}
