(function () {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }

  const gtag = window.gtag;
  function trackEvent(eventName, params) {
    gtag("event", eventName, params || {});
  }

  function getTrackableTarget(target) {
    if (!(target instanceof Element)) return null;
    return target.closest("[data-analytics-event], button, a");
  }

  function inferEventName(element) {
    const explicit = element.getAttribute("data-analytics-event");
    if (explicit) return explicit;

    if (element instanceof HTMLAnchorElement) return "link_click";
    if (element instanceof HTMLButtonElement) return "button_click";
    return "element_click";
  }

  document.addEventListener("click", function (event) {
    const element = getTrackableTarget(event.target);
    if (!element) return;

    const eventName = inferEventName(element);
    const params = {
      tag: element.tagName.toLowerCase(),
      text: (element.textContent || "").trim().slice(0, 80),
    };

    if (element instanceof HTMLAnchorElement && element.href) {
      params.href = element.href;
    }

    trackEvent(eventName, params);
  });

  window.analytics = { trackEvent: trackEvent };
})();

(function () {
  // Strip utm_* params from the address bar AFTER analytics capture them
  // (gtag/Clarity read the URL on their first hit; the delay protects
  // that). Visitors arriving via short links (systemai.co.uk/<id>) end up
  // seeing a clean URL.
  function cleanUrl() {
    try {
      const url = new URL(window.location.href);
      let dirty = false;
      ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(function (p) {
        if (url.searchParams.has(p)) {
          url.searchParams.delete(p);
          dirty = true;
        }
      });
      if (!dirty) return;
      const qs = url.searchParams.toString();
      window.history.replaceState(
        window.history.state,
        document.title,
        url.pathname + (qs ? "?" + qs : "") + url.hash
      );
    } catch (e) {
      /* never break the page over cosmetics */
    }
  }

  if (document.readyState === "complete") {
    setTimeout(cleanUrl, 1200);
  } else {
    window.addEventListener("load", function () {
      setTimeout(cleanUrl, 1200);
    });
  }
})();
