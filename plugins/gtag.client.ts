export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return;

  // Load GA4 script dynamically
  const script = document.createElement('script');
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-W4K1B0FNL2";
  document.head.appendChild(script);

  // Initialize datalayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', 'G-W4K1B0FNL2', { send_page_view: false });

  console.log('GA4 LOADED');
});
