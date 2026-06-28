/* Fabius Balance — Produktfinder (Quiz → Empfehlung → Warenkorb). Ohne App. */
(function () {
  function init(root) {
    if (root.dataset.finderInit) return;
    root.dataset.finderInit = '1';

    var dataEl = root.querySelector('[data-fb-finder-products]');
    var products = [];
    try { products = JSON.parse(dataEl.textContent.trim()); } catch (e) { products = []; }
    var byArea = {};
    products.forEach(function (p) { byArea[p.area] = p; });

    var screens = {
      start: root.querySelector('[data-screen="start"]'),
      quiz: root.querySelector('[data-screen="quiz"]'),
      result: root.querySelector('[data-screen="result"]')
    };
    var stepEl = root.querySelector('[data-finder-step]');
    var backBtn = root.querySelector('[data-finder-back]');
    var barFill = root.querySelector('[data-finder-bar]');
    var progLabel = root.querySelector('[data-finder-progress-label]');

    var answers = {};
    var current = 0;

    var steps = [
      { type: 'text', key: 'name', q: function () { return 'Wie heißt dein Pferd?'; }, placeholder: 'Deine Antwort …', required: true },
      { type: 'single', key: 'geschlecht', q: function (n) { return 'Verrate uns das Geschlecht von ' + n; }, options: ['Stute', 'Wallach', 'Hengst'] },
      { type: 'single', key: 'alter', q: function (n) { return 'Wie alt ist ' + n + '?'; }, options: ['Jungpferd (bis 4 Jahre)', 'Erwachsen (5–15 Jahre)', 'Senior (16+ Jahre)'] },
      { type: 'single', key: 'typ', q: function (n) { return 'Welcher Typ ist ' + n + '?'; }, options: ['Pony', 'Kleinpferd', 'Großpferd'] },
      { type: 'single', key: 'gewicht', q: function (n) { return 'Wie schwer ist ' + n + ' ungefähr?'; }, options: ['unter 400 kg', '400–600 kg', 'über 600 kg'] },
      { type: 'single', key: 'haltung', q: function (n) { return 'Wie wird ' + n + ' gehalten?'; }, options: ['Offenstall', 'Box', 'Weide / Robusthaltung', 'Gemischt'] },
      { type: 'single', key: 'aktiv', q: function (n) { return 'Wie aktiv ist ' + n + ' im Alltag?'; }, options: ['Eher ruhig', 'Normal', 'Sehr aktiv'] },
      {
        type: 'multi', key: 'bereiche', max: 2,
        q: function (n) { return 'Wobei können wir ' + n + ' unterstützen?'; },
        sub: 'Wähle bis zu 2',
        options: [
          { label: 'Atemwege (Husten, Staub, Pollen)', area: 'atem' },
          { label: 'Verdauung & Darm', area: 'darm' },
          { label: 'Stoffwechsel & Energie', area: 'metabol' },
          { label: 'Allgemeine Balance', area: 'all' }
        ]
      },
      {
        type: 'email', key: 'email', required: true, nextLabel: 'Futterberatung erhalten',
        q: function (n) { return 'Wohin dürfen wir ' + n + 's Futterberatung schicken?'; },
        sub: 'Wir senden Dir Deine persönliche Futterberatung als PDF — und die Empfehlung per Mail. Mit dem Absenden stimmst Du der Datenschutzerklärung zu.'
      }
    ];

    function horseName() { return (answers.name && answers.name.trim()) ? answers.name.trim() : 'Deinem Pferd'; }

    function show(name) {
      Object.keys(screens).forEach(function (k) { if (screens[k]) screens[k].hidden = (k !== name); });
    }

    function setProgress() {
      var pct = Math.round((current / steps.length) * 100);
      if (barFill) barFill.style.width = pct + '%';
      if (progLabel) progLabel.textContent = pct + ' % abgeschlossen';
    }

    function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

    function renderStep() {
      var step = steps[current];
      stepEl.innerHTML = '';
      backBtn.hidden = current === 0;
      setProgress();

      var q = el('p', 'fb-finder__q', step.q(horseName()));
      stepEl.appendChild(q);
      if (step.sub) stepEl.appendChild(el('p', 'fb-finder__qsub', step.sub));

      if (step.type === 'text' || step.type === 'email') {
        var input = el('input', 'fb-finder__input');
        input.type = step.type === 'email' ? 'email' : 'text';
        input.placeholder = step.placeholder || (step.type === 'email' ? 'deine@email.de' : '');
        input.value = answers[step.key] || '';
        var next = el('button', 'fb-btn fb-btn--primary fb-finder__next', step.nextLabel || 'weiter');
        function validEmail(v) { return /.+@.+\..+/.test(v); }
        function sync() {
          if (step.type === 'email') next.disabled = step.required && !validEmail(input.value.trim());
          else next.disabled = step.required && !input.value.trim();
        }
        input.addEventListener('input', function () { answers[step.key] = input.value; sync(); });
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !next.disabled) { e.preventDefault(); next.click(); } });
        next.addEventListener('click', advance);
        sync();
        stepEl.appendChild(input);
        stepEl.appendChild(next);
        setTimeout(function () { input.focus(); }, 30);

      } else if (step.type === 'single') {
        var wrap = el('div', 'fb-finder__options');
        step.options.forEach(function (opt) {
          var b = el('button', 'fb-finder__opt'); b.type = 'button';
          b.appendChild(el('span', 'fb-finder__opt-mark'));
          b.appendChild(el('span', null, opt));
          if (answers[step.key] === opt) b.classList.add('is-selected');
          b.addEventListener('click', function () { answers[step.key] = opt; advance(); });
          wrap.appendChild(b);
        });
        stepEl.appendChild(wrap);

      } else if (step.type === 'multi') {
        var sel = answers[step.key] ? answers[step.key].slice() : [];
        var wrap2 = el('div', 'fb-finder__options');
        step.options.forEach(function (opt) {
          var b = el('button', 'fb-finder__opt'); b.type = 'button';
          b.appendChild(el('span', 'fb-finder__opt-mark'));
          b.appendChild(el('span', null, opt.label));
          if (sel.indexOf(opt.area) > -1) b.classList.add('is-selected');
          b.addEventListener('click', function () {
            var i = sel.indexOf(opt.area);
            if (i > -1) { sel.splice(i, 1); }
            else {
              if (opt.area === 'all') { sel = ['all']; }
              else { sel = sel.filter(function (a) { return a !== 'all'; }); if (sel.length < step.max) sel.push(opt.area); }
            }
            answers[step.key] = sel;
            renderStep();
          });
          wrap2.appendChild(b);
        });
        stepEl.appendChild(wrap2);
        var next2 = el('button', 'fb-btn fb-btn--primary fb-finder__next', 'weiter');
        next2.disabled = sel.length === 0;
        next2.addEventListener('click', advance);
        stepEl.appendChild(next2);
      }
    }

    function advance() {
      if (current < steps.length - 1) { current++; renderStep(); }
      else { finish(); }
    }

    function recommend() {
      var sel = answers.bereiche || [];
      var order = ['atem', 'darm', 'metabol'];
      var primary = [];
      if (sel.length === 0 || sel.indexOf('all') > -1) {
        order.forEach(function (a) { if (byArea[a]) primary.push(byArea[a]); });
        return { primary: primary, secondary: [] };
      }
      // primär = ausgewählte Bereiche (in fester Reihenfolge)
      order.forEach(function (a) { if (sel.indexOf(a) > -1 && byArea[a]) primary.push(byArea[a]); });
      if (primary.length === 0) { order.forEach(function (a) { if (byArea[a]) primary.push(byArea[a]); }); return { primary: primary, secondary: [] }; }
      // sekundär = die übrigen Produkte
      var secondary = products.filter(function (p) { return primary.indexOf(p) < 0; });
      return { primary: primary, secondary: secondary };
    }

    function subscribeEmail() {
      if (!answers.email || answers.email.indexOf('@') < 0) return;
      try {
        var fd = new FormData();
        fd.append('form_type', 'customer');
        fd.append('utf8', '✓');
        fd.append('contact[email]', answers.email.trim());
        fd.append('contact[tags]', 'newsletter,produktfinder');
        fetch('/contact', { method: 'POST', body: fd, credentials: 'same-origin' }).catch(function () {});
      } catch (e) {}
    }

    function makeCard(p) {
      var c = el('article', 'fb-finder__card');
      var media = el('a', 'fb-finder__card-media'); media.href = p.url; media.setAttribute('aria-hidden', 'true'); media.tabIndex = -1;
      if (p.image) { var img = el('img'); img.src = p.image; img.alt = p.title; img.loading = 'lazy'; media.appendChild(img); }
      c.appendChild(media);
      var body = el('div', 'fb-finder__card-body');
      var h = el('h3', 'fb-finder__card-title'); var ha = el('a', null, p.title); ha.href = p.url; ha.style.textDecoration = 'none'; ha.style.color = 'inherit'; h.appendChild(ha);
      body.appendChild(h);
      body.appendChild(el('p', 'fb-finder__card-price', p.priceFmt));
      var add = el('button', 'fb-btn fb-btn--primary'); add.type = 'button'; add.textContent = 'In den Warenkorb';
      add.addEventListener('click', function () {
        add.disabled = true; add.textContent = '…';
        addToCart([{ id: p.variantId, quantity: 1 }], function (ok) {
          add.textContent = ok ? '✓ Im Warenkorb' : 'Erneut versuchen'; add.disabled = !ok;
        });
      });
      body.appendChild(add);
      c.appendChild(body);
      return c;
    }

    function finish() {
      subscribeEmail();
      var rec = recommend();
      var name = horseName();
      root.querySelector('[data-finder-result-title]').textContent = 'Unsere Empfehlung für ' + name;
      var subBase = rec.primary.length > 1
        ? 'Diese Produkte aus dem Fabius Balance System passen zu ' + name + '.'
        : 'Das passt am besten zu ' + name + '.';
      if (answers.email) subBase += ' Deine ausführliche Futterberatung schicken wir an ' + answers.email + '.';
      root.querySelector('[data-finder-result-sub]').textContent = subBase;

      var cards = root.querySelector('[data-finder-cards]');
      cards.innerHTML = '';
      rec.primary.forEach(function (p) { cards.appendChild(makeCard(p)); });

      var secWrap = root.querySelector('[data-finder-secondary]');
      var secCards = root.querySelector('[data-finder-sec-cards]');
      secCards.innerHTML = '';
      if (rec.secondary.length > 0) {
        rec.secondary.forEach(function (p) { secCards.appendChild(makeCard(p)); });
        secWrap.hidden = false;
      } else {
        secWrap.hidden = true;
      }

      var all = rec.primary.concat(rec.secondary);
      root.querySelector('[data-finder-addall]').onclick = function () {
        var items = all.map(function (p) { return { id: p.variantId, quantity: 1 }; });
        addToCart(items, function (ok) { if (ok) window.location.href = '/cart'; });
      };

      show('result');
    }

    function addToCart(items, cb) {
      fetch('/cart/add.js', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin',
        body: JSON.stringify({ items: items })
      }).then(function (r) { cb(r.ok); }).catch(function () { cb(false); });
    }

    root.querySelector('[data-finder-start]').addEventListener('click', function () { current = 0; show('quiz'); renderStep(); });
    backBtn.addEventListener('click', function () { if (current > 0) { current--; renderStep(); } });
    root.querySelector('[data-finder-restart]').addEventListener('click', function () { answers = {}; current = 0; show('start'); });
  }

  function boot() { document.querySelectorAll('[data-fb-finder]').forEach(init); }
  if (document.readyState !== 'loading') boot(); else document.addEventListener('DOMContentLoaded', boot);
  document.addEventListener('shopify:section:load', boot);
})();
