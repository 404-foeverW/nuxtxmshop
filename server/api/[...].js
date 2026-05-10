export default defineEventHandler(async (event) => {
    console.log('--------evnet---------');
    const config = useRuntimeConfig();
    // console.log(config.public.baseUrl);
    const targetBaseUrl = config.public.baseUrl || 'http://localhost:3000'

    const path = event.path.replace(/^\/api/, '');
    // const path = event.path;
    console.log('原始请求路径:', event.path)
    const targetUrl = `${targetBaseUrl}${path}`;
    try {
        return await proxyRequest(event, targetUrl, {
            // 转发所有请求头
            headers: {
                'Content-Type': event.headers.get('content-type') || 'application/json'
            }
        });
    } catch (error) {
        console.log('--error--', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || '服务器请求失败'
        })
    }
})