// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  app: {
    head: {
      meta: [
        { name: 'google-site-verification', content: 'a7MTrBQVFydgpWB6HiuKPdLZZX3oB9Csc5giiHxMiRY' }
      ],
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=AW-17758447312',
          async: true,
        },
      ],
    },
  },

  runtimeConfig: {
    mollieApiKey: process.env.MOLLIE_API_KEY,
    mollieRedirectUrl: process.env.MOLLIE_REDIRECT_URL,
    mollieWebhookUrl: process.env.MOLLIE_WEBHOOK_URL,

    resendApiKey: process.env.RESEND_API_KEY,
    emailFrom: process.env.EMAIL_FROM || 'no-reply@noodpakket-op-maat.nl',
  },
})
