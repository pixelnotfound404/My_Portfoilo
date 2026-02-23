<template>
  <section class="trusted" id="trusted">
    <p class="trusted__label">TRUSTED BY FORWARD THINKING TEAMS</p>
    <div class="trusted__logos">
      <span v-for="logo in logos" :key="logo.id" class="trusted__logo" :id="logo.id">{{ logo.name }}</span>
    </div>
  </section>
</template>

<script setup>
const logos = [
  { id: 'logo-1', name: 'BRAND'   },
  { id: 'logo-2', name: 'STUDIO'  },
  { id: 'logo-3', name: 'AGENCY'  },
  { id: 'logo-4', name: 'STARTUP' },
  { id: 'logo-5', name: 'CORP'    },
]
</script>
