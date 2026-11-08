// Meta (Facebook) Pixel. Disabled unless REACT_APP_META_PIXEL_ID is set at build time.
const PIXEL_ID = process.env.REACT_APP_META_PIXEL_ID;
export const CURRENCY = "TND";

export const initMetaPixel = () => {
  if (!PIXEL_ID || typeof window === "undefined" || window.fbq) return;

  // Official Meta loader snippet: queues calls until fbevents.js has loaded.
  const fbq = function () {
    fbq.callMethod
      ? fbq.callMethod.apply(fbq, arguments)
      : fbq.queue.push(arguments);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", PIXEL_ID);
};

// Standard events: https://developers.facebook.com/docs/meta-pixel/reference
export const trackEvent = (event, params, options) => {
  if (!PIXEL_ID || !window.fbq) return;
  window.fbq("track", event, params, options);
};

export const trackPageView = () => trackEvent("PageView");
