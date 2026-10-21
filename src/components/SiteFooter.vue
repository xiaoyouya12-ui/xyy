<script setup>
import { safeUrl } from '../utils/safeUrl.js'

// 站内文章（./help/x.html）用本页跳转；站外链接才开新窗口
const isExternal = (u) => /^https?:\/\//i.test(safeUrl(u))

defineProps({
  articles: { type: Array, default: () => [] },
  contact: { type: String, default: '' },
  copyright: { type: String, default: '' },
  articlesTitle: { type: String, default: '技术支持' },
  invite: { type: Object, default: null }
})
</script>

<template>
  <footer class="site-footer">
    <div class="divider"></div>

    <a
      v-if="invite && invite.enabled !== false && invite.url"
      class="invite"
      :href="safeUrl(invite.url)"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img v-if="invite.img" class="invite-logo" :src="invite.img" alt="" />
      <span class="invite-body">
        <span class="invite-title">{{ invite.title }}</span>
        <span v-if="invite.desc" class="invite-desc">{{ invite.desc }}</span>
      </span>
      <span class="invite-cta">{{ invite.cta || '免费下载' }}</span>
    </a>

    <section v-if="articles.length" class="foot-sec">
      <h4>{{ articlesTitle }}</h4>
      <ul class="art-list">
        <li v-for="(a, i) in articles" :key="i">
          <a
            :href="safeUrl(a.url)"
            :target="isExternal(a.url) ? '_blank' : '_self'"
            rel="noopener noreferrer"
          >
            <span class="art-title">{{ a.title }}</span>
            <span v-if="a.date" class="art-date">{{ a.date }}</span>
          </a>
        </li>
      </ul>
    </section>

    <section v-if="contact" class="foot-sec">
      <h4>联系我们</h4>
      <p class="contact">{{ contact }}</p>
    </section>

    <p v-if="copyright" class="copyright">{{ copyright }}</p>
  </footer>
</template>
