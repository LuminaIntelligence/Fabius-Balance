/* Fabius Balance — dezente Reveal-Animation beim Scrollen.
   Respektiert prefers-reduced-motion (zeigt Inhalte sofort). */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function reveal(el) { el.classList.add('is-visible'); }

  function init() {
    var els = document.querySelectorAll('.fb-reveal:not(.is-visible)');
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(reveal);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    els.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);

  // Im Theme-Editor neu initialisieren, wenn Sections nachgeladen werden.
  document.addEventListener('shopify:section:load', init);
})();
