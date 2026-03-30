// api/click-count.js — GET endpoint to fetch current click count for a link label
// Used by the frontend to display the count on page load.
//
// Query: GET /api/click-count?label=View+Case%3A+DIGI+Express

function makeKey(label) {
    return label.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 40)
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

    if (req.method === 'OPTIONS') return res.status(200).end()

    const label = req.query.label || ''
    if (!label) return res.json({ count: 0 })

    const key = makeKey(label)

    try {
        // Try KV first if available
        const kvUrl   = process.env.KV_REST_API_URL
        const kvToken = process.env.KV_REST_API_TOKEN
        if (kvUrl && kvToken) {
            const kvRes = await fetch(`${kvUrl}/get/portfolio:clicks:${key}`, {
                headers: { Authorization: `Bearer ${kvToken}` },
            })
            if (kvRes.ok) {
                const data = await kvRes.json()
                return res.json({ count: parseInt(data.result || '0', 10) })
            }
        }

        // Fallback: countapi.xyz (free, no auth needed)
        const cRes = await fetch(`https://api.countapi.xyz/get/scott-ux-lab/${key}`)
        if (!cRes.ok) return res.json({ count: 0 })
        const cData = await cRes.json()
        return res.json({ count: cData.value ?? 0 })
    } catch {
        return res.json({ count: 0 })
    }
}
