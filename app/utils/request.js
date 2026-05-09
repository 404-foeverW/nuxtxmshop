import { userStore } from '~/store/user.js';
const store = userStore();
export const request = () => {
    const runtimeCofig = process.server ? useRuntimeConfig() : null;
    // const token = useCookie('token');
    const router = useRouter();
    console.log('runtimeCofig', runtimeCofig);
    return $fetch.create({
        // baseURL: runtimeCofig?.public.baseUrl || 'http://localhost:3000',
        timeout: 15000,
        // credentials: 'include',
        async onRequest({options}) {
            options.headers = new Headers(options.headers);

            if(options.tokens) {
                options.headers.set('Authorization', `Bearer ${options.tokens}`);
            }

            if(!options.headers.has('content-type') && !(options.body instanceof FormData)) {
                options.headers.set('content-type', 'application/json');
            }
        },
        async onRequestError({ error }) {
            console.log(error);
            router.push('/error');
        },
        async onResponse({ response }) {
            const result = response._data;
            if(result.code === "401") {
                ElNotification.error({
                    message: result.msg
                })
                userStore.setShowLogin(true);
            }
            if(result.code === '500') {
                router.push('/error');
            }
            return result;
        },
        async onResponseError({ error }) {
            console.log(error);
            router.push('/error');
        }
    })
}