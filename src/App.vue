<template>
  <RoboCursor />
  <router-view v-slot="{ Component, route }">
    <!-- KeepAlive preserves the HomePage (with all Spline 3D viewers)
         in memory when navigating to case studies, so coming back is instant. -->
    <KeepAlive :include="['HomePage']">
      <component :is="Component" :key="route.path" />
    </KeepAlive>
  </router-view>
</template>

<script setup>
import RoboCursor from '@/components/RoboCursor.vue'
</script>
