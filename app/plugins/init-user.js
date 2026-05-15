import { userStore } from "~/store/user";

export default defineNuxtPlugin((nuxtApp) => {
    const userInfo = userStore();
    userInfo.initUser();
})