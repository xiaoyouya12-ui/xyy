# 网盘聚合导航

一个静态聚合首页：把 **百度 / 夸克 / 迅雷** 三家网盘入口放在一页里，用户点卡片直接跳转。
Vue 3 + Vite + PWA（可"添加到主屏幕"）。

---

## 一、本地跑起来

```bash
npm install
npm start
```
跑起来会自动打开浏览器（默认 http://localhost:5173）。

> ⚠️ **`npm start` 和 `npm run preview` 别搞混，这是最容易踩的坑：**
>
> | 命令 | 读的是哪份数据 | 改完 JSON 后 |
> |---|---|---|
> | **`npm start`**（开发模式，5173） | 直接读 `public/data/` | **刷新页面就生效** ✅ |
> | `npm run build` → `npm run preview`（4173） | 读 `dist/` **构建产物** | **必须重新 `npm run build`** 才更新 ⚠️ |
>
> **本地改内容，一直用 `npm start` 就对了**，别用 preview。
>
> 判断自己开的是哪个：看地址栏端口 —— **5173 = 开发模式**，4173 = 预览构建产物。

---

## 二、改内容（不用懂代码）

> ## ⚠️ 只改 `public/data/`，千万别改 `dist/data/`！
> **`dist/` 是构建产物，每次 `npm run build` 都会被整个清空重建 —— 你在 `dist/data/` 里填的东西必丢。**
>
> - **本地填数据** → `public/data/` ✅（改完刷新页面就生效）
> - `dist/data/` → ❌ 别碰，会被下一次 build 覆盖掉
>
> （唯一例外：**上线部署到服务器之后**，那时候改服务器上的 `dist/data/` 才有效 —— 因为服务器上没有源代码，也不会再 build。）

所有内容都在 **`public/data/`** 下的三个 JSON 里，改完刷新页面就生效：

| 文件 | 管什么 |
|---|---|
| `site.json` | 站名、副标题、顶部大图、跑马灯消息、联系方式、版权 |
| `disks.json` | 网盘列表（名称 / 一句话说明 / 跳转地址 / 主题色） |
| `articles.json` | 底部「技术支持」列表（3 篇帮助文章，指向 `./help/` 下的静态页） |

### 加一家网盘
在 `disks.json` 的 `disks` 数组里加一条，照葫芦画瓢：

```json
{
  "id": "ali",
  "name": "阿里云盘",
  "title": "不限速 · 空间大",
  "url": "https://www.alipan.com/",
  "color": "#ff6a00",
  "icon": "",
  "enabled": true
}
```
保存 → 刷新 → 首页自动多出一张卡片。

- `color`：卡片图标的底色（十六进制）
- `icon`：想用图片图标就填路径（如 `./img/ali.svg`），留空则用名称首字做图标
- `enabled`：**临时下架**改成 `false` 即可（别删，方便随时放回来）

### URL 怎么填？（重要）
`url` 字段容错，下面三种填法都行，程序会自动纠正：

| 你填的 | 实际跳转 |
|---|---|
| `https://pan.baidu.com/s/xxxx?pwd=28P5` | 原样跳 ✅ **推荐这样填** |
| 整段分享文案：`通过百度网盘分享的文件：xxx 链接：https://... 提取码：28P5 复制这段内容后打开百度网盘手机App` | 自动抽出链接 + 补上提取码 ✅ |
| `pan.baidu.com/s/xxxx`（漏了 `https://`） | 自动补成 `https://...` ✅ |

- 填成别的东西（比如"待补充"）会变成**不跳转的空链接**，点了不会 404。
- ⚠️ 一段文案里**有多个链接**时只会取第一个；提取码必须是 **4 位**（字母或数字）才能被识别。
- 逻辑在 `src/utils/safeUrl.js`，改完要重新 `npm run build`。

### 改 / 加帮助文章（底部「技术支持」）
底部那 3 篇是**本站自己的静态页面**，放在 `public/help/`：

```
public/help/
├── style.css                 # 三篇共用的样式
├── netdisk-first.html        # 第一次用网盘？先看这篇
├── fake-resources.html       # 怎么避免下载到假资源
└── link-expired.html         # 常见问题：链接失效怎么办
```

| 想做什么 | 怎么做 |
|---|---|
| 只改文字 | 直接编辑对应的 `.html` 文件 |
| 加第 4 篇 | 复制一个 html 改成新内容 → 在 `articles.json` 加一条 `{ "title": "标题", "url": "./help/新文件.html" }` |
| 下架某一篇 | 从 `articles.json` 里删掉那一条即可（html 文件留着不碍事） |

> ⚠️ `articles.json` 里的 url 用 **`./` 开头**的站内相对路径（如 `./help/xxx.html`）。
> 别写完整域名 —— 写相对路径的话，换域名、挂到子目录都不会坏。
>
> 这三篇是**独立静态页**（不走 Vue），所以打开快，也能被搜索引擎单独收录。

### 换顶部大图
把自己的图丢进 `public/img/`（建议 **1280×560**，jpg / png / svg 都行），
再把 `site.json` 里的 `"hero"` 改成 `"./img/你的图.jpg"`。

### 改跑马灯
`site.json` 里的 `news` 数组，加一条 `{ "text": "你的消息" }`。

### 改底部推广位（WorkBuddy 邀请）
`site.json` 里的 `invite` 块控制底部那条推广卡片：

```json
"invite": {
  "enabled": true,
  "img": "./img/workbuddy.svg",
  "title": "用 WorkBuddy，把重复的活儿交给 AI",
  "desc": "免费下载 · 桌面端 AI 助手",
  "cta": "免费下载",
  "url": "https://www.workbuddy.cn/events/invite?inviteCode=c6eq200qu2"
}
```

| 想做什么 | 怎么改 |
|---|---|
| 换图标 | 图丢进 `public/img/`，改 `img`（显示 42×42，建议正方形） |
| 换文案 | 改 `title`（主标题）/ `desc`（副标题）/ `cta`（按钮字） |
| 换邀请码 | 改 `url` 结尾的 `inviteCode=xxxx` |
| 不想要了 | `"enabled": false` |

点击整条卡片都会跳转（新窗口打开）。

---

## 三、打包发布

```bash
npm run build
```
产物在 **`dist/`**，把 `dist/` 里的**全部内容**上传到网站目录就行。

- ⚠️ **PWA（添加到主屏幕）要求 HTTPS**，http 下不生效（页面本身照常能看）。
- 部署在**子目录**（如 `example.com/pan/`）也没问题，已用相对路径。

### 上线之后还能改吗？
**能，而且不用重新打包。**
JSON 放在 `public/` 里，构建时会原样复制到 `dist/data/`。
→ 上线后直接改**服务器上**的 `dist/data/disks.json`（或 site / articles）就生效。


## 四、目录结构

```
├── index.html
├── vite.config.js          # 构建 + PWA 配置
├── public/                 # 这里的东西原样进 dist
│   ├── data/               # ★ 你要改的三个 JSON 都在这
│   ├── icons/              # PWA 图标
│   └── img/                # hero.jpg / hero.svg 顶部大图、workbuddy.svg 推广位图标
└── src/
    ├── App.vue             # 页面骨架（加载 JSON → 往下传）
    ├── assets/style.css    # 全部样式
    ├── utils/safeUrl.js    # 链接容错（自动抽链接 + 补提取码）
    └── components/
        ├── HeroBanner.vue  # 顶部大图 + 标题
        ├── MarqueeBar.vue  # 最新消息跑马灯
        ├── DiskCards.vue   # 三家网盘卡片
        └── SiteFooter.vue  # 技术支持 / 联系我们 / 版权
```

---

## 五、以后想加东西

| 想加什么 | 怎么做 |
|---|---|
| 第 4、5 家网盘 | `disks.json` 加一条 |
| 更多文章 | `articles.json` 加一条 |
| 新栏目（公告 / 常见问题） | `src/components/` 加个组件，`App.vue` 挂上，数据仍走 JSON |
| 搜索、分类筛选 | 在 `DiskCards.vue` 上加过滤逻辑，数据不用动 |

---

## 六、小提示

- 首屏体积：gzip 后约 40KB，秒开。
- 断网也能打开首页（service worker 缓存了页面和 JSON），点卡片跳转需要联网。
- 顶部图、图标想换成自己的设计，直接覆盖 `public/img/` 和 `public/icons/` 同名文件即可。