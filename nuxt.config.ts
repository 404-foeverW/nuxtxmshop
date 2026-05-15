// https://nuxt.com/docs/api/configuration/nuxt-config
// const baseUrl = import.meta.env.NUXT_REQUEST_BASEURL;
// console.log(baseUrl);
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/global.css'],
  modules: ['@pinia/nuxt', '@nuxtjs/mdc', ['@element-plus/nuxt', {
    elementPlus: {
      importStyle: 'css',
      installMethods: ['ElNotification']
    },
  }], '@nuxtjs/mdc'],
  runtimeConfig: {
    public: {
      baseUrl: 'http://localhost:3000'
    }
  },
  devServer: {
    port: 3030
  },
  nitro: {
    // devProxy: {
    //   '/api': {
    //     target: import.meta.env.NUXT_PUBLIC_BASE_URL,
    //     changeOrigin: true,
    //     secure: false
    //   }
    // },
    routeRules: {
      '/api': {
        proxy: import.meta.env.NUXT_PUBLIC_BASE_URL
      },
      '/public/**': {
        proxy: import.meta.env.NUXT_PUBLIC_BASE_URL
      }
    },
    // logLevel: 'verbose'
  }
})