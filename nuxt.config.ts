// https://nuxt.com/docs/api/configuration/nuxt-config
// const baseUrl = import.meta.env.NUXT_REQUEST_BASEURL;
// console.log(baseUrl);
// import { visualizer } from "rollup-plugin-visualizer";
// import UnpluginUnused from 'unplugin-unused/vite';
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/global.css'],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/mdc',
    '@element-plus/nuxt',
    '@nuxtjs/mdc',
    '@nuxtjs/seo'
  ],
  elementPlus: {
    importStyle: 'css',
    noStylesComponents: ['ElNotification'],
    // installMethods: ['ElNotification']
  },
  runtimeConfig: {
    public: {
      baseUrl: 'http://localhost:3000'
    }
  },
  sitemap: {
    urls: [
      {
        loc: '/index',
        lastmod: '2026-05-26',
        changefreq: 'weekly',
        priority: 1
      },
      {
        loc: '/collect',
        lastmod: '2026-05-26',
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: '/about',
        lastmod: '2026-05-26',
        changefreq: 'weekly',
        priority: 0.8
      }
    ]
  },
  robots: {
    allow: '/',
    disallow: ['/order', '/good', '/ConfirmOrder', '/shoppingCart'],
    sitemap: 'https://location:3030/sitemap.xml'
  },
  devServer: {
    port: 3030
  },
  nitro: {
    routeRules: {
      '/api': {
        proxy: import.meta.env.NUXT_PUBLIC_BASE_URL
      },
      '/public/**': {
        proxy: import.meta.env.NUXT_PUBLIC_BASE_URL
      }
    },
    compressPublicAssets: {
      gzip: true,
      brotli: true
    }
    // logLevel: 'verbose'
  }
})