// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],

  supabase: {
    redirectOptions: {
      login: '',
      callback: '',
      include: undefined,
      exclude: ['/*'],
      cookieRedirect: false,
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'effort-memo',
      meta: [
        { name: 'description', content: '日々の努力を可視化して、目標達成を加速させるツール' },
      ],
    },
  },
})
