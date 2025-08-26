// src/analytics.js
export const trackPageview = (url) => {
  // GA4
  if (window.gtag) {
    window.gtag("config", "G-CYQ678Z5QR", { page_path: url }); // replace
  }
  // GTM
  if (window.dataLayer) {
    window.dataLayer.push({ event: "pageview", page_path: url });
  }
};
