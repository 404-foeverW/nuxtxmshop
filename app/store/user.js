export const userStore = defineStore('user', () => {
    const user = ref(null);
    const showLogin = ref(false);

    const getUser = computed(() => user.value);
    const getShowLogin = computed(() => showLogin.value);

    function setUser(data) {
        user.value = data;
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