import { userStore } from "~/store/user";
export default defineNuxtRouteMiddleware((to, from) => {
    const store = userStore();
    const loginuser = store.user;
    if(to.meta.requireAuth) {
        if (!loginuser) {
            // 没有登录，显示登录组件
            userStore.setShowLogin(true);
            if (from.name == null) {
                //此时，是在页面没有加载，直接在地址栏输入链接，进入需要登录验证的页面
                return navigateTo("/");
            }
            // 终止导航
            abortNavigation();
            return;
        }
    }
})