# Fabius Balance — Shopify Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produktionsreifer, DSGVO-konformer deutscher Shopify-Shop für Fabius Balance auf einem Custom-Theme (Online Store 2.0, Skeleton-Basis), markengetreu nach Markenhandbuch V1.0.

**Architecture:** Skeleton-Theme via Shopify CLI scaffolden → Brand-Layer (Design-Tokens als CSS-Variablen, selbst-gehostete Schriften, Logos) → eigene Sections (alle im Customizer pflegbar) → Startseite, Über uns, 3 Produkt-Templates, Blog/Kontakt/FAQ, Rechtsseiten + DSGVO-Consent. Bewegter Hero-Loop + Lifestyle-Motive via Higgsfield. Live-Anlage der 3 Produkte über Admin/CLI.

**Tech Stack:** Shopify CLI 4.1, Online Store 2.0 (Skeleton-Theme, Liquid + theme blocks), selbst-gehostete Fonts (Julius Sans One, Lato), SVG für Aha-Section, Higgsfield-MCP (Video/Bild), Node v24 / npm 11.

**Verifikation statt Unit-Tests:** Jeder Task wird per `shopify theme check` (kein Error) und `shopify theme dev`-Preview (visuell + AA-Kontrast + mobil) geprüft. Commit nach jedem grünen Task.

**Spec:** `docs/superpowers/specs/2026-06-05-fabius-balance-shopify-design.md`

---

## Dateistruktur (theme/)

```
theme/
  layout/theme.liquid                 # Basis-Layout, Font-Preload, Consent, Skip-Link
  templates/
    index.json                        # Startseite (Section-Reihenfolge)
    page.ueber-uns.json               # Über uns (rich-story)
    product.atem.json / .darm.json / .metabol.json
    product.json                      # Default-Produkt
    blog.json / article.json          # Wissen
    page.kontakt.json / page.faq.json
    page.json                         # Default (Rechtsseiten)
    cart.json / 404.json
  sections/
    header.liquid  footer.liquid
    hero.liquid  aha-balance.liquid  product-trio.liquid
    story-teaser.liquid  trust.liquid  newsletter.liquid
    rich-story.liquid  faq-accordion.liquid  quote-band.liquid
    main-product.liquid  main-page.liquid  main-blog.liquid  main-article.liquid
  snippets/
    logo.liquid  product-card.liquid  button.liquid
    responsive-image.liquid  icon.liquid
  assets/
    base.css  fonts.css  brand-tokens.css
    reveal.js  aha.js  hero-video.js
    fonts/* (woff2)  logos/*  generated/*
  config/settings_schema.json  config/settings_data.json
  locales/de.default.json  locales/de.default.schema.json
```

Vorhandene Quell-Assets (`Brand/`, `assets/`, `images/`) bleiben unverändert; Build kopiert Bewährtes nach `theme/assets/`.

---

## Phase 0 — Scaffold & Store-Verbindung

### Task 0.1: Skeleton-Theme scaffolden

**Files:** Create: `theme/` (gesamtes Skeleton-Theme)

- [ ] **Step 1:** Theme initialisieren (Skeleton-Variante wählen)

Run: `shopify theme init theme --clone-url https://github.com/Shopify/skeleton-theme`
Falls interaktiv: Theme-Name „theme", Clone-Quelle Skeleton.

- [ ] **Step 2:** Store verbinden / Login prüfen

Run: `shopify theme list --path theme`
Expected: Login-Flow im Browser; danach Liste der Store-Themes ohne Fehler.

- [ ] **Step 3:** Theme-Check Baseline

Run: `shopify theme check theme`
Expected: läuft durch (Offenses des Stock-Skeletons notieren, keine harten Errors einführen).

- [ ] **Step 4:** Preview starten (bleibt offen für Folge-Tasks)

Run: `shopify theme dev --path theme`
Expected: lokale Preview-URL erreichbar, Stock-Skeleton rendert.

- [ ] **Step 5: Commit**

```bash
git add theme .gitignore
git commit -m "chore: Skeleton-Theme scaffolden + Store verbinden"
```

---

## Phase 1 — Design-Fundament

### Task 1.1: Selbst-gehostete Schriften beschaffen

**Files:** Create: `theme/assets/fonts/*.woff2`, `theme/assets/fonts.css`

- [ ] **Step 1:** Fonts als woff2 ablegen — Julius Sans One (Regular) + Lato (Light 300, Regular 400, Bold 700, Black 900), latin + latin-ext Subsets. Quelle: offizielle Google-Fonts-Dateien (SIL OFL), lokal gehostet → kein CDN-Abruf.

- [ ] **Step 2:** `fonts.css` mit `@font-face` (alle Schnitte, `font-display: swap`, `unicode-range` latin/latin-ext).

```css
@font-face{font-family:"Julius Sans One";font-style:normal;font-weight:400;
  font-display:swap;src:url("juliussansone-regular.woff2") format("woff2");}
@font-face{font-family:"Lato";font-weight:300;font-display:swap;
  src:url("lato-light.woff2") format("woff2");}
/* ...400, 700, 900 analog... */
```

- [ ] **Step 3:** Verifikation — `shopify theme check theme` ohne neue Errors; in Preview Netzwerk-Tab: keine Requests an fonts.googleapis.com / fonts.gstatic.com.

- [ ] **Step 4: Commit** `git commit -m "feat: selbst-gehostete Schriften (Julius Sans One, Lato)"`

### Task 1.2: Design-Tokens als CSS-Variablen

**Files:** Create: `theme/assets/brand-tokens.css`

- [ ] **Step 1:** Tokens definieren (Farben, Typo-Skala, Radius, Spacing, Motion).

```css
:root{
  --fb-beige:#f5f0e6; --fb-sage-dark:#85998e; --fb-sage-light:#bfc1b6; --fb-anthracite:#282b2c;
  --fb-font-display:"Julius Sans One",serif; --fb-font-body:"Lato",system-ui,sans-serif;
  --fb-radius:10px; --fb-maxw:68ch;
  --fb-space-section:clamp(3.5rem,8vw,7rem);
  --fb-ease:cubic-bezier(.22,.61,.36,1); --fb-dur:420ms;
  --fb-track-display:.12em; --fb-track-label:.18em;
}
@media (prefers-reduced-motion: reduce){ :root{ --fb-dur:0ms; } }
```

- [ ] **Step 2:** Verifikation — Tokens in Preview via DevTools sichtbar; AA-Kontraste prüfen (Anthrazit/Beige, Weiß/Salbei-dunkel).

- [ ] **Step 3: Commit** `git commit -m "feat: Marken-Design-Tokens (4-Farb-Palette, Typo, Motion)"`

### Task 1.3: Basis-Styles + globale Customizer-Settings

**Files:** Create: `theme/assets/base.css`; Modify: `theme/config/settings_schema.json`, `theme/layout/theme.liquid`

- [ ] **Step 1:** `base.css` — Reset/Grundtypografie: Body = Lato/Anthrazit auf Beige; Headings = Julius Sans One, Versalien (`text-transform:uppercase`, `letter-spacing:var(--fb-track-display)`); Lesebreite `--fb-maxw`; Links/Fokus-Stile (sichtbarer Fokusring, AA); `.fb-label`=Lato Versalien gesperrt (Nav/Labels).

- [ ] **Step 2:** `theme.liquid` `<head>`: Preconnect entfällt (kein CDN); `{{ 'fonts.css' | asset_url | stylesheet_tag }}`, dann brand-tokens.css, base.css. Preload der zwei wichtigsten woff2 (Julius Sans One + Lato Regular). Skip-Link, `lang="de"`, Favicon (Bildmarke).

- [ ] **Step 3:** `settings_schema.json` — Theme-Settings-Gruppe „Marke": Logo-Bilder (Wort-Bildmarke hell/dunkel, Bildmarke), Favicon, Social-Sharing-Bild. (Farben/Schriften sind fix per Token — bewusst nicht frei wählbar, um Markenkonformität zu sichern.)

- [ ] **Step 4:** Verifikation — Preview zeigt Beige-Canvas, Lato-Fließtext, Versal-Headings; `theme check` grün.

- [ ] **Step 5: Commit** `git commit -m "feat: Basis-Styles, Head-Setup, Marken-Settings"`

### Task 1.4: Logos & Favicon einbinden

**Files:** Create: `theme/assets/logos/*` (aus `Brand/Logos/`), `theme/snippets/logo.liquid`, `theme/snippets/icon.liquid`

- [ ] **Step 1:** Logos nach `theme/assets/logos/` kopieren (alle 6 Varianten). Favicon aus Bildmarke (PNG/SVG).

- [ ] **Step 2:** `logo.liquid` — Param `variant` (wort-bildmarke|bildmarke|wortmarke) + `tone` (auto|light|dark); rendert korrektes Asset mit `alt="Fabius Balance"`, Mindesthöhe respektiert (≥120px Wort-Bildmarke / ≥64px Bildmarke), `loading` passend.

- [ ] **Step 3:** Verifikation — Snippet testweise in `theme.liquid` rendern, Preview prüfen (schwarz auf hell korrekt).

- [ ] **Step 4: Commit** `git commit -m "feat: Logo-Snippet (3 Varianten, hell/dunkel) + Favicon"`

---

## Phase 2 — Header, Footer, Navigation

### Task 2.1: Header-Section

**Files:** Create: `theme/sections/header.liquid`, `theme/snippets/button.liquid`; Modify: `theme/layout/theme.liquid`

- [ ] **Step 1:** `button.liquid` — Param `label, href, style(primary|ghost)`; Primary = Salbei-dunkel, gesperrte Versalien (Lato), Radius, flach (keine Schatten/Verläufe).

- [ ] **Step 2:** `header.liquid` — Logo (Wort-Bildmarke) links, Versal-Navigation (Lato gesperrt) aus Shopify-`linklists`, Warenkorb-Icon. Mobile: ruhiges Off-Canvas-Menü (sanfter Fade/Slide, reduced-motion-fest). Settings: Menü-Auswahl, transparenter-über-Hero-Toggle, Sticky-Toggle. `{% schema %}` mit `presets`.

- [ ] **Step 3:** In `theme.liquid` `{% sections 'header-group' %}` bzw. Section einbinden.

- [ ] **Step 4:** Verifikation — `theme check` grün; Preview Desktop + Mobil (375px): Nav lesbar, AA-Kontrast, Tastatur-Fokus sichtbar.

- [ ] **Step 5: Commit** `git commit -m "feat: Header mit Versal-Nav + Button-Snippet"`

### Task 2.2: Footer-Section

**Files:** Create: `theme/sections/footer.liquid`

- [ ] **Step 1:** Footer auf Salbei-dunkel/Anthrazit, weißes Logo (Wort-Bildmarke white), Footer-Menü (Impressum/Datenschutz/AGB/Versand & Zahlung), kurze Markenzeile, Zahlungs-Icons (Shopify-`payment_type_img_url`), Copyright. Settings: Menüauswahl, Claim-Text.

- [ ] **Step 2:** Verifikation — Preview: weißes Logo auf dunkel mit klarem Kontrast (Handbuch-Regel), Links AA, mobil gestapelt.

- [ ] **Step 3: Commit** `git commit -m "feat: Footer (dunkel, weißes Logo, Rechts-Menü, Zahlarten)"`

---

## Phase 3 — Produkte & Metafelder (live)

### Task 3.1: Metafeld-Definitionen anlegen

**Files:** (Admin/CLI, kein Theme-Code)

- [ ] **Step 1:** Produkt-Metafelder (Namespace `fabius`) definieren: `zusammensetzung` (multi-line), `analytische_bestandteile` (multi-line), `fuetterungsempfehlung` (multi-line), `inhalt_ml` (number/text), `kategorie_label` (single-line). Via Admin → Einstellungen → Metafelder oder Admin-API.

- [ ] **Step 2:** Verifikation — Metafelder erscheinen in der Produktmaske.

### Task 3.2: Drei Produkte anlegen (je 59,99 €)

**Files:** (Admin/CLI)

- [ ] **Step 1:** Produkte erstellen — ATEM/`atem`, DARM/`darm`, METABOL/`metabol`; Vendor „Fabius Balance"; Produkttyp „Ergänzungsfutter"; Preis 59,99 € EUR; eine Variante; Produktbild (`Atemwege.jpg`/`Verdauung.jpg`/`Stoffwechsel.jpg`); `kategorie_label` „ATEMWEGE"/„VERDAUUNG"/„STOFFWECHSEL"; On-Brand-Beschreibung (Du-Ansprache, keine Heilversprechen); Metafelder mit klar markierten Platzhaltertexten füllen.

- [ ] **Step 2:** Status zunächst Entwurf; Verfügbarkeit Online-Store.

- [ ] **Step 3:** Verifikation — Produkte im Preview-Store über Handle aufrufbar (`/products/atem`), Preis 59,99 €.

- [ ] **Step 4: Commit** (Doku) `git commit -m "docs: Produkt- & Metafeld-Setup dokumentiert" --allow-empty`

---

## Phase 4 — Higgsfield-Medien

### Task 4.1: Hero-Video-Loop generieren

**Files:** Create: `theme/assets/generated/hero-loop.mp4`, `hero-loop.webm`, `hero-poster.jpg`

- [ ] **Step 1:** Echtes Fabius-Foto als Bild-Referenz hochladen (`media_upload`), Video-Modell wählen (`models_explore action=recommend`, Ziel: ruhiger 8s-Loop, image-to-video).

- [ ] **Step 2:** `generate_video` mit dem Prompt aus der Spec §6.1 („Ein ruhiger Atemzug", LOW DENSITY, nahtloser Loop, Bildraum links, untere Hälfte abgedunkelt).

- [ ] **Step 3:** Ergebnis prüfen (markentreu? ruhig? loopbar?), ggf. 1–2 Re-Rolls. Poster = erster Frame. Nach `assets/generated/` speichern, mp4+webm.

- [ ] **Step 4:** Verifikation — Datei < ~5 MB (Web-tauglich), 1080p, nahtloser Loop visuell ok.

- [ ] **Step 5: Commit** `git commit -m "feat: Hero-Video-Loop (Higgsfield) + Poster"`

### Task 4.2: Lifestyle-/Sektions-Motive generieren

**Files:** Create: `theme/assets/generated/lifestyle-*.jpg`

- [ ] **Step 1:** 2–3 ruhige Lifestyle-Motive (Über-uns-Kapitel, Trust-Section) generieren — Vorgaben: natürliches Licht, gedeckte Erdtöne, echte Nähe Mensch–Pferd, viel Bildraum, sanfte Unschärfe; keine Klischees.

- [ ] **Step 2:** Verifikation — Motive markenkonform, in Beige-Palette einfügbar.

- [ ] **Step 3: Commit** `git commit -m "feat: Lifestyle-Motive (Higgsfield)"`

---

## Phase 5 — Startseite (Section für Section)

### Task 5.1: Hero-Section (bewegt + Fallback)

**Files:** Create: `theme/sections/hero.liquid`, `theme/assets/hero-video.js`; Modify: `theme/templates/index.json`

- [ ] **Step 1:** `hero.liquid` Markup — `<section>` mit `<video autoplay muted loop playsinline preload="none" poster=poster>` (Quellen webm+mp4) ODER Bild-Fallback; Overlay-Box links: Headline (Julius Sans One Versalien), Subtext (Lato), CTA-Button. Untere Hälfte mit dezentem Dunkel-Verlauf NUR zur Textlesbarkeit (über Bild, nicht als Deko — zulässig, da Kontrast-Hilfe).

- [ ] **Step 2:** Section-Settings (`{% schema %}`): `video` (Asset/URL), `poster_image`, `fallback_image`, `heading` (Default „Ein starkes Immunsystem trägt alles."), `subtext` (Default-Text aus Spec), `cta_label`, `cta_link`, `height` (Auswahl), `overlay_position` (links/rechts). Preset „Hero".

- [ ] **Step 3:** `hero-video.js` — lädt Video nur wenn `!prefers-reduced-motion` und nicht Save-Data/sehr kleiner Viewport; sonst Poster/Fallback-Bild bleibt. Fügt `<source>` dynamisch ein, startet `play()` leise.

- [ ] **Step 4:** `index.json` — Hero als erste Section.

- [ ] **Step 5:** Verifikation — Preview: Video läuft (muted, loop), Headline lesbar/AA; DevTools `prefers-reduced-motion` an → statisches Bild; mobil ok.

- [ ] **Step 6: Commit** `git commit -m "feat: Hero-Section (Video-Loop + Reduced-Motion/Mobil-Fallback)"`

### Task 5.2: Aha-Balance-Section (SVG-Bildmarke)

**Files:** Create: `theme/sections/aha-balance.liquid`, `theme/assets/aha.js`; Modify: `theme/templates/index.json`

- [ ] **Step 1:** SVG der Bildmarke mit vier separat ansprechbaren Quadranten (Immunsystem/Atemwege/Stoffwechsel/Darm) + Zentrum „Balance". Markup mit `role`, `aria-label`, fokussierbaren Quadranten (`<button>`), je ein zugehöriger Klartext.

- [ ] **Step 2:** Settings: Zentralaussage (Default „Einzellösungen greifen zu kurz"), 4× {Titel, Kurztext} als Blöcke; Überschrift/Intro.

- [ ] **Step 3:** `aha.js` — Hover/Klick/Tap blendet zugehörigen Satz weich ein; Tastatur (Tab/Enter); bei `prefers-reduced-motion` alle vier Texte statisch sichtbar.

- [ ] **Step 4:** Verifikation — Preview: dezente Reaktion, kein Effekt-Feuerwerk; reduced-motion zeigt alle Texte; Tastaturbedienung ok; AA.

- [ ] **Step 5: Commit** `git commit -m "feat: Aha-Section (Zusammenspiel 4 Bereiche, SVG-Bildmarke)"`

### Task 5.3: Produkt-Trio-Section

**Files:** Create: `theme/sections/product-trio.liquid`, `theme/snippets/product-card.liquid`; Modify: `theme/templates/index.json`

- [ ] **Step 1:** `product-card.liquid` — weiche Karte, viel Innenabstand, klare Trennlinie statt schwerer Box; Produktbild, Titel (Versal), `kategorie_label`, Preis, Button „Entdecken". Keine Schatten/Verläufe.

- [ ] **Step 2:** `product-trio.liquid` — Heading + 3 Produktauswahl-Blöcke (product picker), responsive 3→1 Spalten; Salbei-Abstufung je Karte (nicht Zusatzfarbe).

- [ ] **Step 3:** Verifikation — Preview: 3 Karten, mobil gestapelt, Preise 59,99 €, AA.

- [ ] **Step 4: Commit** `git commit -m "feat: Produkt-Trio + Produktkarten-Snippet"`

### Task 5.4: Story-Teaser-Section

**Files:** Create: `theme/sections/story-teaser.liquid`; Modify: `theme/templates/index.json`

- [ ] **Step 1:** 2–3-Satz-Anriss zu Fabius (Default-Text, Du-Ansprache, emotional aber nicht kitschig) + Bild (Slot/echtes Foto) + Link „Unsere Geschichte" → `/pages/ueber-uns`. Settings: Heading, Text, Bild, Link-Label/-Ziel.

- [ ] **Step 2:** Verifikation — Preview: ruhiges Bild-Text-Layout, Link funktioniert, mobil ok.

- [ ] **Step 3: Commit** `git commit -m "feat: Story-Teaser (Fabius-Anriss + Link Über uns)"`

### Task 5.5: Trust-Section

**Files:** Create: `theme/sections/trust.liquid`; Modify: `theme/templates/index.json`

- [ ] **Step 1:** Fachkompetenz/Vertrauen: 3–4 Punkte (Icon/Kurztext, z.B. „Aus echter Erfahrung", „Ganzheitlich gedacht", „Premium-Qualität", „Ehrlich, keine Heilversprechen") + optionales Zitat. Wiederholbare Blöcke; dezente Icons (Linienstil). Keine erfundenen Siegel.

- [ ] **Step 2:** Verifikation — Preview: ruhige Anordnung, AA, mobil.

- [ ] **Step 3: Commit** `git commit -m "feat: Trust/Fachkompetenz-Section"`

### Task 5.6: Newsletter-Section

**Files:** Create: `theme/sections/newsletter.liquid`; Modify: `theme/templates/index.json`

- [ ] **Step 1:** Shopify-`{% form 'customer' %}` (Newsletter-Tag), E-Mail-Feld, gesperrter Versal-Button, **Datenschutz-Hinweis + Link** (Double-Opt-in-konform). Settings: Heading, Text, Erfolgsmeldung.

- [ ] **Step 2:** Verifikation — Preview: Absenden zeigt Erfolgsmeldung; Datenschutz-Link vorhanden; AA.

- [ ] **Step 3: Commit** `git commit -m "feat: Newsletter-Section (DSGVO-Hinweis)"`

### Task 5.7: Startseite zusammenstellen + Default-Texte

**Files:** Modify: `theme/templates/index.json`, `theme/locales/de.default.json`

- [ ] **Step 1:** Reihenfolge index.json: Hero → Aha → Produkt-Trio → Story-Teaser → Trust → Newsletter. Default-Texte/Übersetzungen in `de.default.json`.

- [ ] **Step 2:** Verifikation — komplette Startseite Preview Desktop + 375px; alle Sections im Customizer editierbar; `theme check` grün.

- [ ] **Step 3: Commit** `git commit -m "feat: Startseite komplett (Sections + Default-Texte)"`

---

## Phase 6 — Über uns & Produkt-Templates

### Task 6.1: Rich-Story-Section + Über-uns-Seite

**Files:** Create: `theme/sections/rich-story.liquid`; `theme/templates/page.ueber-uns.json`; (Admin: Seite „Über uns", Handle `ueber-uns`)

- [ ] **Step 1:** `rich-story.liquid` — wiederholbare Kapitel-Blöcke (Bild links/rechts alternierend, Überschrift Versal, Fließtext), ruhige Reveal-Animation. Settings je Block: Bild, Überschrift, Text, Bildseite.

- [ ] **Step 2:** Default-Kapitel (Du-Ansprache, Handbuch-Tonalität): (1) Der Ursprung — Fabius, chronisch krank; (2) Der Wendepunkt — starkes Immunsystem, untrennbar mit Atem/Stoffwechsel/Darm; (3) Aus der Not zur Mission; (4) Die Menschen/Fachkompetenz (Platzhalter-Bios). Keine Heilversprechen.

- [ ] **Step 3:** Admin-Seite „Über uns" anlegen, Template `page.ueber-uns`.

- [ ] **Step 4:** Verifikation — Preview `/pages/ueber-uns`: Storytelling lesbar, Bilder wechselseitig, mobil, AA.

- [ ] **Step 5: Commit** `git commit -m "feat: Über-uns (Rich-Story, Fabius-Geschichte)"`

### Task 6.2: Produkt-Template (main-product) + drei Varianten

**Files:** Create: `theme/sections/main-product.liquid`; `theme/templates/product.atem.json`, `product.darm.json`, `product.metabol.json`, `product.json`

- [ ] **Step 1:** `main-product.liquid` — Galerie (Produktbild), Titel (Versal) + `kategorie_label`, Preis, „In den Warenkorb" (Salbei-dunkel), Kurzbeschreibung; Metafeld-Blöcke (Zusammensetzung, analytische Bestandteile, Fütterungsempfehlung, Inhalt) als ruhige Akkordeons/Abschnitte; produktspezifische Salbei-Abstufung über `kategorie_label`/Setting (keine Zusatzfarbe).

- [ ] **Step 2:** Cross-Sell-Block „Das ganze Zusammenspiel" → Links zu den anderen zwei Produkten.

- [ ] **Step 3:** Drei `product.*.json`-Templates mit passenden Section-Settings; Produkte im Admin den Templates zuweisen.

- [ ] **Step 4:** Verifikation — `/products/atem|darm|metabol`: Layout korrekt, Warenkorb funktioniert (Add→Cart), Metafelder/Platzhalter sichtbar, mobil, AA.

- [ ] **Step 5: Commit** `git commit -m "feat: Produkt-Template + ATEM/DARM/METABOL-Varianten"`

---

## Phase 7 — Blog, Kontakt, FAQ, Rechtliches, Consent

### Task 7.1: Wissen (Blog + Artikel)

**Files:** Create: `theme/sections/main-blog.liquid`, `theme/sections/main-article.liquid`, `theme/templates/blog.json`, `theme/templates/article.json`; (Admin: Blog „Wissen", 1 Beispiel-Artikel)

- [ ] **Step 1:** Blog-Liste (Karten, ruhig) + Artikel-Layout (Lesebreite `--fb-maxw`, großzügige Typo). Beispiel-Artikel im Admin (Du-Ansprache, fachlich).

- [ ] **Step 2:** Verifikation — `/blogs/wissen` + Artikel Preview, lesbar, mobil, AA.

- [ ] **Step 3: Commit** `git commit -m "feat: Wissen (Blog + Artikel-Templates)"`

### Task 7.2: Kontakt-Seite

**Files:** Create: `theme/sections/main-page.liquid` (falls nicht vorhanden), `theme/templates/page.kontakt.json`; (Admin: Seite „Kontakt", Handle `kontakt`)

- [ ] **Step 1:** Kontaktformular (`{% form 'contact' %}`: Name, E-Mail, Nachricht), Datenschutz-Hinweis, ruhige Gestaltung, optional Kontaktdaten-Block.

- [ ] **Step 2:** Verifikation — Absenden zeigt Erfolg; Pflichtfelder/Fokus; AA; mobil.

- [ ] **Step 3: Commit** `git commit -m "feat: Kontakt-Seite (Formular + DSGVO-Hinweis)"`

### Task 7.3: FAQ-Akkordeon

**Files:** Create: `theme/sections/faq-accordion.liquid`; `theme/templates/page.faq.json`; (Admin: Seite „FAQ", Handle `faq`)

- [ ] **Step 1:** Akkordeon (`<details>/<summary>`, nativ + barrierearm), wiederholbare Frage/Antwort-Blöcke; Default-FAQs (Fütterung, Lieferzeit, Eignung — ohne Heilversprechen).

- [ ] **Step 2:** Verifikation — Auf-/Zuklappen Tastatur + Maus; reduced-motion; AA; mobil.

- [ ] **Step 3: Commit** `git commit -m "feat: FAQ-Akkordeon"`

### Task 7.4: Rechtsseiten als befüllbare Vorlagen

**Files:** (Admin: Seiten Impressum/Datenschutz/AGB/Versand & Zahlung mit Vorlagentext); ggf. `theme/templates/page.json`

- [ ] **Step 1:** Vier Seiten mit klar markierten Platzhalter-Vorlagen (deutscher Standardaufbau: Impressum n. §5 DDG, Datenschutz n. DSGVO, AGB, Versand & Zahlung). Hinweis an Kundin, juristisch prüfen zu lassen.

- [ ] **Step 2:** Ins Footer-Menü verlinken.

- [ ] **Step 3:** Verifikation — alle vier Seiten erreichbar, lesbar, mobil.

- [ ] **Step 4: Commit** `git commit -m "docs/content: Rechtsseiten-Vorlagen verlinkt"`

### Task 7.5: DSGVO-Cookie-Consent

**Files:** Modify: `theme/layout/theme.liquid` (+ ggf. Settings)

- [ ] **Step 1:** Shopify Customer-Privacy-API / nativen Consent-Banner aktivieren (Admin: Einstellungen → Kundenprivatsphäre → Cookie-Banner, Region EU). Sicherstellen, dass keine eigenen Tracker ohne Einwilligung laden.

- [ ] **Step 2:** Verifikation — Preview/Store: Banner erscheint (EU), Auswahl speicherbar; ohne Zustimmung keine nicht-essentiellen Cookies.

- [ ] **Step 3: Commit** `git commit -m "feat: DSGVO-Cookie-Consent (Customer-Privacy-API)"`

---

## Phase 8 — Politur & Abnahme

### Task 8.1: Mobile-, Performance-, A11y-Politur

**Files:** Modify: betroffene CSS/JS/Sections

- [ ] **Step 1:** Mobil (375/390px) jede Seite durchgehen: Abstände, Schriftgrößen, Tap-Targets ≥44px, kein Overflow.

- [ ] **Step 2:** Performance: Bilder responsiv (`responsive-image.liquid`, `srcset`, `loading=lazy` außer Hero-Poster), Video `preload=none`, CSS/JS schlank; Hero-Poster als LCP optimiert.

- [ ] **Step 3:** A11y: Landmarks, Alt-Texte, Fokusreihenfolge, AA-Kontraste, reduced-motion überall; `theme check` ohne Errors.

- [ ] **Step 4:** Verifikation — Lighthouse/Browse-Check (Performance/Best Practices/SEO/A11y) auf Startseite + Produktseite; Screenshots Desktop+Mobil.

- [ ] **Step 5: Commit** `git commit -m "perf/a11y: Mobile-, Performance-, Barrierefreiheits-Politur"`

### Task 8.2: Finale Abnahme

- [ ] **Step 1:** Vollständiger Klickpfad: Start → Produkt → Warenkorb → Über uns → Blog → Kontakt → FAQ → Rechtsseiten. Customizer: stichprobenartig Texte/Bilder ändern → übernimmt.

- [ ] **Step 2:** `git push origin main`; Zusammenfassung + offene Punkte (Metafeld-Werte, Impressum-Daten, Expertinnen-Bios) an Auftraggeberin.

---

## Self-Review (Spec-Abdeckung)

- §2 Entscheidungen → Phase 0–1 (Skeleton, Fonts, 59,99 €) ✓
- §3 Design-System → Task 1.1–1.3 ✓
- §4 Assets/Logos/Fotografie → Task 1.4, Phase 4 ✓
- §5 Shopify-Setup/Produkte/Metafelder/Nav → Phase 3, Task 2.1/2.2 ✓
- §6 Sections (alle) → Phase 5; Hero-Video §6.1 → Task 4.1/5.1 ✓
- §7 Aha-Section → Task 5.2 ✓
- §8 Seiten/Templates → Phase 5–7 ✓
- §9 DSGVO/Consent/Tonalität → Task 7.5, durchgängige Default-Texte ✓
- §10 Build-Reihenfolge → Phasenfolge ✓
- §11 Offene Punkte → Task 8.2 Übergabe ✓

Keine Platzhalter ohne Inhalt; Namen konsistent (`hero`, `aha-balance`, `product-trio`, `product-card.liquid`, `kategorie_label`, Namespace `fabius`).
