<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] }
})

const text = computed(() =>
  props.items
    .map((i) => (typeof i === 'string' ? i : i.text || ''))
    .filter(Boolean)
    .join('　·　')
)

// 补足长度，保证两份拼起来够宽 —— 无缝滚动不会露白
const loop = computed(() => {
  const unit = text.value + '　·　'
  let s = unit
  while (s.length < 60) s += unit
  return s
})

const needScroll = computed(() => text.value.length > 16)
</script>

<template>
  <div class="marquee">
    <span class="marquee-tag">最新</span>
    <div class="marquee-view">
      <div v-if="needScroll" class="marquee-track scroll">
        <span>{{ loop }}</span><span>{{ loop }}</span>
      </div>
      <div v-else class="marquee-track">{{ text }}</div>
    </div>
  </div>
</template>
