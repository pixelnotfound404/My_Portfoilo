import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// ── Dev-only plugin: serves /api/contact locally so the form works ──
function devApiPlugin() {
    return {
        name: 'dev-api-contact',
        configureServer(server) {
            server.middlewares.use('/api/contact', async (req, res) => {
                if (req.method !== 'POST') {
                    res.statusCode = 405
                    res.end(JSON.stringify({ error: 'Method not allowed' }))
                    return
                }

                // Read request body
                let body = ''
                for await (const chunk of req) body += chunk
                const { name, email, telegram, type, message } = JSON.parse(body)

                if (!name || !email || !message) {
                    res.statusCode = 400
                    res.end(JSON.stringify({ error: 'Missing required fields' }))
                    return
                }

                // Load env vars (same ones Vercel uses in production)
                const env = loadEnv('development', process.cwd(), '')
                const BOT_TOKEN = env.TELEGRAM_BOT_TOKEN
                const CHAT_ID = env.TELEGRAM_CHAT_ID

                if (!BOT_TOKEN || !CHAT_ID) {
                    res.statusCode = 500
                    res.end(JSON.stringify({ error: 'Missing TELEGRAM env vars in .env' }))
                    return
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
                    res.setHeader('Content-Type', 'application/json')
                    if (!tgRes.ok) {
                        res.statusCode = 502
                        res.end(JSON.stringify({ error: 'Telegram error', data }))
                    } else {
                        res.statusCode = 200
                        res.end(JSON.stringify({ ok: true }))
                    }
                } catch (err) {
                    res.statusCode = 500
                    res.end(JSON.stringify({ error: 'Internal error' }))
                }
            })
        },
    }
}

export default defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    // treat spline-viewer as a native web component, not a Vue component
                    isCustomElement: (tag) => tag === 'spline-viewer'
                }
            }
        }),
        devApiPlugin(),
    ],
    resolve: {
        alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
    }
})
