export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  const sendPageView = (path: string) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title
      })
    }
  }

  // ✅ initial pageview
  nuxtApp.hook('app:mounted', () => {
    sendPageView(router.currentRoute.value.fullPath)
  })

  // ✅ SPA navigations
  router.afterEach((to) => {
    sendPageView(to.fullPath)
  })
})
