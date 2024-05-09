// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@myturborepo/ui',
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate'],
      },
    ],
    '@pinia-plugin-persistedstate/nuxt',
  ],
  css: [
    '@/assets/css/tailwind.css',
    // 'style.css',
    // '@myturborepo/ui/assets/css/tailwind.css',
  ],
  imports: {
    dirs: ['api', 'utils/**/*'],
    presets: [{
      from: 'zod',
      imports: ['z', {
        name: 'infer',
        as: 'ZodInfer',
        type: true,
      }],
    }, {
      from: 'vue-sonner',
      imports: ['toast'],
    }, {
      from: 'vue-waterfall-plugin-next',
      imports: ['LazyImg', 'Waterfall'],
    },
    {
      from: 'vue3-seamless-scroll',
      imports: ['Vue3SeamlessScroll '],
    }],
  },

  components: [{
    path: '~/components/common',
    // pathPrefix: false
  }],
  pinia: {
    storesDirs: ['composables/stores'],
  },
  colorMode: {
    classSuffix: '',
    preference: 'dark',
  },
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://user.jwanfs.beijing.3000y.store/api',
        // target: 'http://ocloud.ihep.ac.cn:18000/api', // 这里是接口地址
        changeOrigin: true,
        prependPath: true,

      },
    },
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },
})
