import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
app.use(router)

// Catch component-level errors (especially Spline viewer unmount crashes)
// so they don't propagate and kill the router's component swap.
app.config.errorHandler = (err, instance, info) => {
  console.warn('[Vue] Error caught:', info, err)
}

// Prevent uncaught errors from aborting route navigation.
router.onError((err) => {
  console.warn('[Router] Navigation error caught:', err)
})


app.mount('#app')

// ── Register Spline asset cache service worker ──
// Caches .splinecode files after first download so revisits are instant.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/spline-sw.js', { scope: '/' })
      .then(reg => {
        console.log('[SplineSW] Registered — scope:', reg.scope)
      })
      .catch(err => {
        console.warn('[SplineSW] Registration failed:', err)
      })
  })
}
