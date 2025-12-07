// https://nuxt.com/docs/4.x/getting-started/configuration
export default defineNuxtConfig({
  compatibilityDate: '2025-12-07',
  
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  css: [
    '@/assets/css/globals.css'
  ],

  app: {
    head: {
      title: 'Math Practice Hub - Master Your Skills',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Interactive math practice with problem generation and multiplication tables. Perfect for students to improve their math skills.' 
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4
  }
})

