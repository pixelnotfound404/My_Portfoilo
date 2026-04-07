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
