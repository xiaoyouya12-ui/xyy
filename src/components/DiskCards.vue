<script setup>
import { safeUrl } from '../utils/safeUrl.js'

defineProps({
  list: { type: Array, default: () => [] }
})

function tint(hex, alpha = 0.12) {
  const raw = (hex || '#2b6cff').replace('#', '')
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
</script>

<template>
  <section class="cards">
    <a
      v-for="d in list"
      :key="d.id"
      class="card"
      :href="safeUrl(d.url)"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div class="card-icon" :style="{ background: tint(d.color), color: d.color || '#2b6cff' }">
        <img v-if="d.icon" :src="d.icon" :alt="d.name" />
        <span v-else>{{ (d.name || '?').slice(0, 1) }}</span>
      </div>
      <div class="card-body">
        <h3>{{ d.name }}</h3>
        <p>{{ d.title }}</p>
      </div>
      <span class="card-arrow">›</span>
    </a>
  </section>
</template>
