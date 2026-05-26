import { userStore } from '~/store/user.js';
export const request = () => {
    const store = userStore();
    const runtimeConfig  = useRuntimeConfig();
    // const token = useCookie('token');
    const router = useRouter();
    const baseURL = import.meta.client ? '' : runtimeConfig.public.baseUrl;
    // const baseURL = 'http://localhost:3000';
    // console.log('最终使用的 baseURL:', baseURL);
    const rawFetch = $fetch.create({
        baseURL: baseURL,
        timeout: 15000,
        // credentials: 'include',
        async onRequest({request, options}) {
            console.log("options", options);
            options.headers = new Headers(options.headers);

            if(options.tokens) {
                options.headers.set('Authorization', `Bearer ${options.tokens}`);
            }

            if(!options.headers.has('content-type') && !(options.body instanceof FormData)) {
                options.headers.set('content-type', 'application/json');
            }
            if(import.meta.server) {
                options.headers.set('Cookie', useRequestEvent().node.req.headers.cookie);
            }
        },
        async onRequestError({ error }) {
            console.error(`[${import.meta.client ? '客户端' : '服务器端'}] 请求失败: ${error}`);
            // console.log(error);
            if (import.meta.client) {
                router.push('/error');
            }
            // router.push('/error');
        },
        async onResponse({ response }) {
            // console.log(`[${import.meta.client ? '客户端' : '服务器端'}] 响应成功:`, response.status);
            // console.log('response', response);
            const result = response._data;
            if(result.code === "401") {
                if (import.meta.client) {
                    // ElNotification.error({
                    //     message: result.msg
                    // })
                    await useElNotification.error({
                        message: result.msg
                    })
                }
                store.setShowLogin(true);
            }
            if(result.code === '500') {
                router.push('/error');
            }
            return result;
        },
        async onResponseError({ response }) {
            console.error(`[${import.meta.client ? '客户端' : '服务器端'}] 响应失败:`, response.status);
            if (import.meta.client) {
                router.push('/error');
            }
        }
    })
     const processUrl = (url) => {
        if (import.meta.client) {
            // 客户端：保持原路径不变
            return url;
        }

        // 服务器端：
        if (url.startsWith('/api')) {
            // Nuxt 自有接口：保持 /api 前缀，请求 Nuxt 自己
            return url.replace(/^\/api/, '');
        } else {
            // 其他请求：保持原路径
            return url;
        }
    };
    const wrappedFetch = (url, options = {}) => {
        let finalUrl = url;
         if (import.meta.server && finalUrl.startsWith('/api')) {
            finalUrl = processUrl(finalUrl);
            // console.log('修改后的路径:', finalUrl);
        }
        return rawFetch(finalUrl, options);
    }
    ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'].forEach(method => {
        wrappedFetch[method] = (url, options = {}) => {
            let finalUrl = url;
            if (import.meta.server && finalUrl.startsWith('/api')) {
                finalUrl = processUrl(finalUrl);
                // console.log(`修改后的 ${method.toUpperCase()} 路径:`, finalUrl);
            }
            return rawFetch(finalUrl, {
                ...options,
                method: method.toUpperCase()
            });
        };
    });
    wrappedFetch.raw = (url, options = {}) => {
        let finalUrl = url;
        if (import.meta.server && finalUrl.startsWith('/api')) {
            finalUrl = processUrl(finalUrl);
        }
        return rawFetch.raw(finalUrl, options);
    };
    return wrappedFetch;
}