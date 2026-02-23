import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    // treat spline-viewer as a native web component, not a Vue component
                    isCustomElement: (tag) => tag === 'spline-viewer'
                }
            }
        })
    ],
    resolve: {
        alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
    }
})
