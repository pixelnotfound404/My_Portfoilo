// Pings /api/pageview once when the app mounts.
// Fails silently — never affects the user experience.
export async function usePageView() {
    try {
        await fetch('/api/pageview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
    } catch {
        // Network error — silently ignore
    }
}
