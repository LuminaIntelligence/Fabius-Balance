/* Fabius Balance — Hero-Video.
   Lädt und spielt das Video nur, wenn Bewegung erlaubt ist und keine
   Datensparsamkeit aktiv ist. Sonst bleibt das Standbild (Poster) sichtbar. */
(function () {
  function allowMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    var c = navigator.connection;
    if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) return false;
    return true;
  }

  function initHero(hero) {
    if (hero.dataset.fbHeroInit) return;
    hero.dataset.fbHeroInit = '1';

    var video = hero.querySelector('.fb-hero__video');
    if (!video) return;
    if (!allowMotion()) return;

    var mp4 = video.getAttribute('data-mp4');
    var webm = video.getAttribute('data-webm');
    if (!mp4 && !webm) return;

    if (webm) addSource(video, webm, 'video/webm');
    if (mp4) addSource(video, mp4, 'video/mp4');

    video.addEventListener('canplay', function () {
      video.classList.add('is-playing');
    }, { once: true });

    video.load();
    var p = video.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function () { /* Autoplay blockiert → Poster bleibt */ });
    }
  }

  function addSource(video, src, type) {
    var s = document.createElement('source');
    s.src = src;
    s.type = type;
    video.appendChild(s);
  }

  function init() {
    document.querySelectorAll('[data-fb-hero]').forEach(initHero);
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('shopify:section:load', init);
})();
