export const userStore = defineStore('user', () => {
    // 服务端数据保存
    const cookie = useCookie('user');
    const user = ref(null);
    user.value = cookie.value ? JSON.parse(cookie.value) : null;
    const showLogin = ref(false);

    const getUser = computed(() => user.value);
    const getShowLogin = computed(() => showLogin.value);

    function setUser(data) {
        user.value = data;
        cookie.value = JSON.stringify(data);
    }

    function setShowLogin(data) {
        showLogin.value = data;
    }

    return {
        user,
        showLogin,
        getUser,
        getShowLogin,
        setUser,
        setShowLogin
    }
})