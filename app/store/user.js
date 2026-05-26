export const userStore = defineStore('user', () => {
    const cookieOptons = {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'Lax',
        secure: false
    }

    const safeParseCookie = (cookie) => {
        if(!cookie) return null;
        try {
            return JSON.parse(cookie);
        } catch (e) {
            console.log('cookie解析失败',  e);
            return null;
        }
    }

    // 服务端数据保存
    // const cookie = useCookie('user');
    const user = ref(null);
    // user.value = cookie.value ? JSON.parse(cookie.value) : null;
    // user.value = null;
    const showLogin = ref(false);

    const getUser = computed(() => user.value);
    const getShowLogin = computed(() => showLogin.value);

    function setUser(data) {
        user.value = data;
        const cookie = useCookie('user', cookieOptons);
        cookie.value = JSON.stringify(data);
    }

    function setShowLogin(data) {
        showLogin.value = data;
    }

    function initUserCookie() {
        const cookie = useCookie('user', cookieOptons);
        user.value = safeParseCookie(cookie.value);
    }

    function initUserStorage() {
        if (!import.meta.client) {
            return;
        }
        try {
            const userInfo = localStorage.getItem('user');
            if(userInfo) user.value = JSON.parse(userInfo);
        } catch (error) {
            console.log('本地初始化失败', error);
        }
    }

    function initUser() {
        initUserStorage();
        initUserCookie();
    }
    return {
        user,
        showLogin,
        getUser,
        getShowLogin,
        setUser,
        setShowLogin,
        initUser
    }
})