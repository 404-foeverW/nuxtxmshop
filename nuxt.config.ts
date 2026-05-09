// https://nuxt.com/docs/api/configuration/nuxt-config
const baseUrl = import.meta.env.NUXT_REQUEST_BASEURL;
console.log(baseUrl);
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/global.css'],
  modules: ['@pinia/nuxt', ['@element-plus/nuxt', {
    elementPlus: {
      importStyle: 'css',
      installMethods: ['ElNotification']
    },
  }]],
  runtimeConfig: {
    public: {
      baseUrl
    }
  },
  devServer: {
    port: 3030
  },
  nitro: {
    // devProxy: {
    //   '/api/**': {
    //     target: baseUrl,
    //     changeOrigin: true,
    //     secure: false
    //   }
    // },
    routeRules: {
      '/api/**': {
        proxy: baseUrl
      },
      '/public/**': {
        proxy: baseUrl
      }
    },
    logLevel: 'verbose'
  }
})
