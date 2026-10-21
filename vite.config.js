import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// base 用相对路径 —— 无论挂在域名根目录还是子目录（如 /pan/）都能跑
export default defineConfig({
  base: './',

  // 本地开发：127.0.0.1 / localhost / 局域网 IP 全都能访问（手机也能连），并自动开浏览器
  server: {
    port: 5173,
    host: true,
    open: true
  },

  // 本地预览构建产物
  preview: {
    port: 4173,
    host: true,
    strictPort: true
  },

  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'img/hero.svg'],
      manifest: {
        name: '网盘导航',
        short_name: '网盘导航',
        description: '聚合百度网盘、夸克网盘、迅雷云盘入口',
        lang: 'zh-CN',
        theme_color: '#2b6cff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,ico,json,webmanifest}'],
        // 让 /help/ 下的静态文章页走真实文件，别被 SPA 的导航回退改写成首页
        navigateFallbackDenylist: [/^\/help\//],
        runtimeCaching: [
          {
            // 数据 JSON 走「网络优先」：改了服务器上的 JSON 立刻生效，断网时用缓存兜底
            urlPattern: /\/data\/.*\.json$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pan-nav-data',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 7 }
            }
          }
        ]
      }
    })
  ]
})
