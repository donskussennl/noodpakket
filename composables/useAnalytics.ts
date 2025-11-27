// composables/useAnalytics.ts
export const useAnalytics = () => {
  const trackEvent = (
    name: string,
    params: Record<string, any> = {}
  ) => {
    if (
      import.meta.client &&
      typeof window !== 'undefined' &&
      typeof window.gtag === 'function'
    ) {
      window.gtag('event', name, params)
    }
  }

  return { trackEvent }
}
