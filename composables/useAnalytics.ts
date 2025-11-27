export const useAnalytics = () => {
  const trackEvent = (name: string, params: Record<string, any> = {}) => {
    if (import.meta.client && window.gtag) {
      window.gtag('event', name, params)
    }
  }
  return { trackEvent }
}
