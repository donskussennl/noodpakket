// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Keep Tailwind; remove GA modules to avoid duplicate / inconsistent injection.
  modules: ['@nuxtjs/tailwindcss'],

  // ✅ GA4 (hard-coded) — this guarantees the gtag script is present in the HTML.
  app: {
    head: {
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-W4K1B0FNL2',
          async: true
        },
        {
          type: 'text/javascript',
          hid: 'ga4-inline',
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-W4K1B0FNL2', { send_page_view: false });
          `
        }
      ],
      __dangerouslyDisableSanitizersByTagID: {
        'ga4-inline': ['innerHTML']
      },
      meta: [
        { name: 'google-site-verification', content: 'a7MTrBQVFydgpWB6HiuKPdLZZX3oB9Csc5giiHxMiRY' },

        // Open Graph defaults
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Noodpakket op Maat' },
        {
          property: 'og:image',
          content: 'https://www.noodpakket-op-maat.nl/images/noodpakket/noodpakket-compleet.jpg'
        },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:image',
          content: 'https://www.noodpakket-op-maat.nl/images/noodpakket/noodpakket-compleet.jpg'
        }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=2' }]
    }
  },

  runtimeConfig: {
    mollieApiKey: process.env.MOLLIE_API_KEY,
    mollieRedirectUrl: process.env.MOLLIE_REDIRECT_URL,
    mollieWebhookUrl: process.env.MOLLIE_WEBHOOK_URL,

    resendApiKey: process.env.RESEND_API_KEY,
    emailFrom: process.env.EMAIL_FROM || 'no-reply@noodpakket-op-maat.nl'
  }
})
