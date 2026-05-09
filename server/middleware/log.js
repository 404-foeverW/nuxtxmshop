export default defineEventHandler((event) => {
  console.log('[REQUEST]', event.method, event.path)
  // 不返回任何内容，让请求继续流转
})