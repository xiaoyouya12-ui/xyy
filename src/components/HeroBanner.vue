<script setup>
import { ref } from 'vue'

defineProps({
  src: { type: String, default: './img/hero.svg' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  showTitle: { type: Boolean, default: true }
})

const broken = ref(false)
</script>

<template>
  <header class="hero">
    <img v-if="!broken" :src="src" :alt="title || '顶部图'" @error="broken = true" />
    <div v-else class="hero-fallback"></div>

    <div v-if="showTitle && title" class="hero-caption">
      <h1>{{ title }}</h1>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
  </header>
</template>
