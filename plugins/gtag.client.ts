// plugins/gtag.client.ts
export default defineNuxtPlugin(() => {
  // DataLayer + gtag functie klaarzetten
  ;(window as any).dataLayer = (window as any).dataLayer || []

  function gtag(...args: any[]) {
    ;(window as any).dataLayer.push(args)
  }

  ;(window as any).gtag = gtag

  gtag('js', new Date())

  // Google Ads config
  gtag('config', 'AW-17758447312')

  // (optioneel) Google Analytics 4:
 gtag('config', 'G-7WCYLFMN9L')
})

