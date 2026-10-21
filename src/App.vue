<script setup>
import { ref, onMounted } from 'vue'
import HeroBanner from './components/HeroBanner.vue'
import MarqueeBar from './components/MarqueeBar.vue'
import DiskCards from './components/DiskCards.vue'
import SiteFooter from './components/SiteFooter.vue'

const BASE = import.meta.env.BASE_URL || './'

const site = ref({
  title: '网盘导航',
  subtitle: '',
  hero: './img/hero.jpg',
  showTitle: true,
  contact: '',
  copyright: '',
  news: [],
  invite: null
})
const disks = ref([])
const articles = ref([])
const error = ref('')

async function getJSON(file) {
  const res = await fetch(`${BASE}data/${file}`, { cache: 'no-cache' })
  if (!res.ok) throw new Error(`${file} → HTTP ${res.status}`)
  return res.json()
}

onMounted(async () => {
  const jobs = [
    getJSON('site.json')
      .then((v) => { site.value = { ...site.value, ...v } })
      .catch((e) => { error.value = e.message }),
    getJSON('disks.json')
      .then((v) => { disks.value = (v.disks || []).filter((d) => d.enabled !== false) })
      .catch((e) => { error.value = e.message }),
    getJSON('articles.json')
      .then((v) => { articles.value = v.articles || [] })
      .catch((e) => { error.value = e.message })
  ]
  await Promise.all(jobs)

  if (site.value.title) document.title = site.value.title
  if (site.value.themeColor) {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', site.value.themeColor)
  }
})
</script>

<template>
  <main class="page">
    <HeroBanner
      :src="site.hero"
      :title="site.title"
      :subtitle="site.subtitle"
      :show-title="site.showTitle !== false"
    />

    <MarqueeBar v-if="site.news && site.news.length" :items="site.news" />

    <DiskCards :list="disks" />

    <p v-if="error" class="load-error">数据加载异常：{{ error }}</p>

    <SiteFooter
      :articles="articles"
      :articles-title="site.articlesTitle"
      :contact="site.contact"
      :copyright="site.copyright"
      :invite="site.invite"
    />
  </main>
</template>
