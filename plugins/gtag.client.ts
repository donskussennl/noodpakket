export default defineNuxtPlugin(() => {
  // Alleen in de browser
  if (typeof window === 'undefined') return;

  const id = 'G-W4K1B0FNL2';

  // Script-tag aanmaken
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;

  script.onload = () => {
    console.log('✅ gtag.js succesvol geladen');
  };

  script.onerror = (err) => {
    console.error('❌ gtag.js kon niet geladen worden', err);
  };

  document.head.appendChild(script);

  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function (...args: any[]) {
    w.dataLayer.push(args);
  };

  w.gtag('js', new Date());
  // Laat send_page_view AAN voor debugging
  w.gtag('config', id);

  console.log('🚀 GA4 plugin geïnitialiseerd met ID', id);
});
