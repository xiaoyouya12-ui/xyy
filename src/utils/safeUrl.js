/**
 * 容错地把「用户填的链接」变成可用 URL。
 *
 * 解决三种常见填法：
 *   1. 正常链接            https://pan.baidu.com/s/xxxx?pwd=28P5   → 原样用
 *   2. 整段分享文案        "通过百度网盘分享的文件：xxx 链接：https://... 提取码：28P5 复制这段内容…"
 *      → 自动从中抽出真正的链接（否则浏览器会把它当相对路径，跳到 404）
 *   3. 链接没带提取码，但文案里有 → 自动补上 ?pwd=xxxx
 */
export function safeUrl(raw) {
  const s = String(raw ?? '').trim()
  if (!s) return '#'

  // 抽出第一个 http(s) 链接（排除空格和中文标点）
  const m = s.match(/https?:\/\/[^\s"'<>，。、）)]+/i)
  let url
  if (m) {
    url = m[0]
  } else {
    // 站内路径（./help/x.html、../x.html、/help/x.html）→ 原样用，别当乱填处理
    if (/^(?:\.{0,2}\/|\/)/.test(s)) return s

    // 没写协议但像域名（如 pan.baidu.com/s/xxx）→ 自动补 https://
    const d = s.match(/^[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?$/i)
    if (d) url = 'https://' + s
    else return '#' // 其他乱填内容 → 不跳转，避免点了变 404
  }

  // 链接里没有 pwd 参数，就从原文里找 4 位提取码补上
  if (!/[?&]pwd=/i.test(url)) {
    const p = s.match(/(?:提取码|密码|pwd)\s*[:：]?\s*([0-9a-zA-Z]{4})/i)
    if (p) url += (url.includes('?') ? '&' : '?') + 'pwd=' + p[1]
  }

  return url
}
