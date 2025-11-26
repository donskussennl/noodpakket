export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'page_view', {
        page_location: window.location.href,
        page_path: window.location.pathname,
        page_title: document.title
      })
    }
  })
})
