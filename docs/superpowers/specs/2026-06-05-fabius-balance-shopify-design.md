# Fabius Balance — Custom Shopify Theme (Online Store 2.0)
**Design-Spezifikation · Stand 2026-06-05 · v1.0**

Verbindliche Quelle: `Brand/Fabius_Balance_Markenhandbuch_V1_0.pdf` (V1.0, Juni 2026).
Diese Spec setzt das Handbuch für den Web-Shop um. Bei Konflikt gilt das Markenhandbuch.

---

## 1. Ziel & Rahmen

Produktionsreifer, DSGVO-konformer deutscher Shopify-Shop für **Fabius Balance** —
ganzheitliche Premium-Ergänzung für Pferde. Custom-Theme auf **Online Store 2.0**,
gescaffoldet aus dem **Skeleton-Theme** der Shopify CLI, stark an die Marke angepasst.
Vorschau über `shopify theme dev`. Sprache: Deutsch, „Du"-Ansprache.

**Markenkern (Handbuch §01):** Immunsystem, Atemwege, Stoffwechsel und Darm hängen
untrennbar zusammen. Entstanden aus echter Not um das chronisch kranke Pferd *Fabius*.
Kein Marketing-Vehikel — die Geschichte ist der Ursprung.

**Zielgefühl:** Erleichterung und Geborgenheit — „hier versteht jemand mein Pferd wirklich."

**Markenpersönlichkeit:** ruhig & warm, vertrauenswürdig & ehrlich, naturverbunden &
fachlich fundiert, premium aber nahbar.

---

## 2. Entscheidungen (vom Auftraggeber bestätigt)

| Thema | Entscheidung |
|---|---|
| Theme-Basis | **Skeleton** (Shopify CLI), maximale Flexibilität |
| Schriften | **Selbst-gehostet** (DSGVO + Performance), nicht Google-CDN |
| Produktpreis | **59,99 € pro Flasche** (alle drei) |
| Bilder | Echte Fabius-Fotos jetzt **+ Higgsfield-Generierung** für Hero/Lifestyle |
| Shopify-Zugang | Store + CLI-Login vorhanden → Live-Anlage von Theme & Produkten |
| Umgebung | Node v24.15, npm 11.12, Shopify CLI 4.1.0 (verifiziert) |
| Git | github.com/LuminaIntelligence/Fabius-Balance |

---

## 3. Design-System (CSS-Variablen / Skeleton settings)

### 3.1 Farben (Handbuch §03 — exakt vier Töne, KEINE weiteren Akzentfarben)

| Token | Hex | RGB | Rolle |
|---|---|---|---|
| `--fb-beige` | `#f5f0e6` | 245·240·230 | Hintergrund / Canvas |
| `--fb-sage-dark` | `#85998e` | 133·153·142 | Primär / Marke (Buttons, Footer, Akzente) |
| `--fb-sage-light` | `#bfc1b6` | 191·193·182 | Sekundär / UI (Flächen, Trennlinien) |
| `--fb-anthracite` | `#282b2c` | 40·43·44 | Text (Fließtext & Überschriften) |

- Hauptkombination: **Anthrazit-Text auf Beige**.
- Salbei dunkel trägt die Marke (helle Schrift darauf).
- Salbei hell strukturiert Flächen/Abschnitte.
- **Produktunterscheidung (ATEM/DARM/METABOL) erfolgt über Salbei-Abstufungen,
  Typografie und Bildmotive — NICHT über zusätzliche Farben.** (Korrektur ggü.
  erstem Entwurf: kein Terrakotta/Blaugrau im Web-Akzentsystem. Die realen
  Flaschen-Fotos zeigen ihre Label-Bänder weiterhin, aber Theme-Akzente bleiben
  strikt in der 4-Farb-Palette.)
- AA-Kontrast: Anthrazit auf Beige ✓; Weiß auf Salbei-dunkel/Anthrazit ✓.
  Salbei-hell wird nie als Textfarbe auf Beige verwendet (zu geringer Kontrast).

### 3.2 Typografie (Handbuch §04 — selbst-gehostet)

- **Julius Sans One** — nur große Überschriften / Versalien, weite Laufweite
  (`letter-spacing` ~0.08–0.18em). Nie Fließtext, nie Kleinstgrößen.
- **Lato** (Light/Regular/Bold/Black) — sämtlicher Fließtext + alle Bedienelemente.
- **Navigation & Labels:** Lato in Versalien, weit gesperrt — NICHT Julius Sans One klein.
- Wortmarken-Schrift bleibt dem Logo vorbehalten (nicht als UI-Schrift).
- `font-display: swap`; Schriftdateien in `theme/assets/`, geladen via `@font-face`.

### 3.3 Form, Raum, Motion (Handbuch §05)

- **Weich statt scharf:** großzügiger Weißraum, ruhige Rhythmen, sanfte Kontraste,
  leicht abgerundete Ecken (~6–12px).
- **Keine Verläufe, keine harten Schatten, kein Glanz.** Flach + weich.
  Karten mit viel Innenabstand; klare Trennlinien statt schwerer Boxen.
- **Motion:** nur dezente Fade/Reveal-Übergänge (IntersectionObserver, kurze Dauer
  ~300–500ms, kleine Translate-Distanz). Keine Parallax-/Dauerbewegung.
  `prefers-reduced-motion: reduce` → alle Übergänge aus.
- **Buttons:** Salbei dunkel, gesperrte Versal-Beschriftung (Lato), abgerundet, flach.
- **Mobile-first**, hohe Performance, sauberes/semantisches Markup, AA-Kontraste.

---

## 4. Marken-Assets

### 4.1 Logos (Handbuch §02 — drei verbindliche Varianten)

Quelle: `Brand/Logos/` (300ppi PNG, je black + white).

| Variante | Datei (black/white) | Einsatz |
|---|---|---|
| Wort-Bildmarke (Haupt) | `fb-logo-wort-bildmarke-*` | Header (Desktop), Titel, Verpackung |
| Bildmarke (Icon) | `fb-logo-bildmarke-*` | Favicon, Social-Avatar, Wasserzeichen, Aha-Grafik |
| Wortmarke | `fb-logo-wortmarke-*` | schmale Kontexte, wenn Symbol schon präsent |

**Regeln:** schwarz auf hell, weiß auf dunkel/Salbei. Schutzraum = Höhe „F".
Mindestgröße Wort-Bildmarke 120px, Bildmarke 64px. **Nie** umfärben, verzerren,
drehen, mit Verläufen/Schatten/Effekten versehen, oder auf unruhigem Foto ohne
Abdunklung platzieren. Wortmarken-Schrift nie ersetzen.

### 4.2 Fotografie (Handbuch §05)

- **Echte Fotos** (`images/`): Fabius (Fuchsstute) + Reiterin, ruhige Natur, gedeckte
  Grüns → Hero, Über-uns, Vertrauen. Quelle der Wahrheit für die Bildsprache.
- **Produktbilder** (`assets/`): `Flaschen.png` (Trio), `Atemwege.jpg`,
  `Verdauung.jpg`, `Stoffwechsel.jpg` → Produktseiten/Grid.
- **Higgsfield-Generierung** → `assets/generated/`: zusätzliche Hero-/Lifestyle-Motive.
  Vorgabe: natürliches Licht, gedeckte Erdtöne, echte Nähe Mensch–Pferd, würdevolle
  ruhige Pferde, viel Bildraum + sanfte Unschärfe. **Keine** grellen Farben,
  Stockklischees, klinische Bildsprache. Wo sinnvoll echte Fabius-Fotos als
  Bildreferenz nutzen, damit Motive anschließen.
- KI-Motive in klar markierte Customizer-Slots (Bild-Settings) → Tausch ohne Code.

---

## 5. Shopify-Setup (live über CLI / Admin)

### 5.1 Produkte (3, je 59,99 €)

| Handle | Titel | Fokus | Bild |
|---|---|---|---|
| `atem` | ATEM | Atemwege | `assets/Atemwege.jpg` |
| `darm` | DARM | Verdauung | `assets/Verdauung.jpg` |
| `metabol` | METABOL | Stoffwechsel | `assets/Stoffwechsel.jpg` |

- Vendor „Fabius Balance", Produkttyp „Ergänzungsfutter", Status Entwurf→aktiv.
- Preis 59,99 € (EUR). Eine Variante (Standardflasche).
- On-Brand-Beschreibung, „Du"-Ansprache, **keine Heilversprechen**.

### 5.2 Metafelder (befüllbare Platzhalter — futtermittelrechtlich)

Namespace `fabius`: `zusammensetzung`, `analytische_bestandteile`,
`fuetterungsempfehlung`, `inhalt_ml`, `kategorie_label` (z.B. „ATEMWEGE").
Echte Werte trägt Auftraggeberin/Fachexpertin nach.

### 5.3 Navigation, Seiten, Newsletter

- Hauptmenü: Start · Produkte (ATEM/DARM/METABOL) · Über uns · Wissen · Kontakt · FAQ.
- Footer-Menü: Impressum · Datenschutz · AGB · Versand & Zahlung.
- Newsletter: Shopify-Kundenkontakt/Mailingliste (Double-Opt-in-fähig).

---

## 6. Sections (alle im Customizer pflegbar — Settings statt Hardcoding)

| Section | Zweck | Kern-Settings |
|---|---|---|
| `hero` | Startseiten-Einstieg (**bewegt**) | Video-Slot (mp4/webm), Poster-/Fallback-Bild, Überschrift, Subtext, CTA |
| `aha-balance` | Zusammenspiel 4 Bereiche | 4× Titel/Text, Zentralaussage |
| `product-trio` | 3 Produkte | Heading, Produktauswahl, CTA-Label |
| `story-teaser` | Fabius-Anriss (2–3 Sätze) | Text, Link, Bild |
| `trust` | Fachkompetenz/Vertrauen | Punkte/Logos, Zitat |
| `newsletter` | Anmeldung | Heading, Text, Datenschutz-Hinweis |
| `rich-story` | Über-uns-Kapitel | Wiederholbare Block-Kapitel (Bild+Text) |
| `faq-accordion` | FAQ | Wiederholbare Frage/Antwort-Blöcke |
| `quote-band` | Werte/Zitat | Zitat, Quelle |

Alle Sektionen: dezente Reveal-Animation, `prefers-reduced-motion`-fest, AA-Kontrast,
mobile-first, Section-Padding über Settings steuerbar.

---

### 6.1 Hero-Video („Ein ruhiger Atemzug")

Bewegter Hero als **nahtlose ~8-s-Schleife**, markentreu LOW DENSITY (kein
Effekt-Feuerwerk): eine durchgehende Einstellung, junge Frau + Fuchsstute (Fabius)
in weichem Streiflicht, echte Nähe (Hand an Nüstern), nur atmosphärische
Mikro-Bewegung (Mähne/Gras/Atem) + unmerklicher optischer Push-in. Ruhiger Bildraum
links für Headline; untere Hälfte leicht abgedunkelt für Logo/Text-Kontrast.

- Generierung via Higgsfield (Build-Schritt 4), Bild-Referenz = echtes Fabius-Foto
  für Kontinuität. Ablage `assets/generated/` (Video + Poster).
- Einbindung: `autoplay muted loop playsinline` + Poster-Standbild; `mp4`+`webm`.
- **`prefers-reduced-motion: reduce`** sowie langsame Verbindung/Mobil → Video wird
  nicht geladen, statisches Hero-Foto als Fallback. Beides als Customizer-Settings.

## 7. Aha-Section (Herzstück Startseite)

Die **Bildmarke selbst** ist die Metapher: vier Pferdeköpfe/Blätter = Immunsystem ·
Atemwege · Stoffwechsel · Darm, die zur Mitte „Balance" zusammenfließen.

- Reduzierter **SVG-Aufbau**: vier Quadranten, je hover/klick → kurzer Klartext-Satz
  in einfacher Sprache; Zentrum trägt die Aussage „Einzellösungen greifen zu kurz".
- Ruhig, dezent reagierend — **kein** Effekt-Feuerwerk. Touch: Tap blendet Text ein.
- `prefers-reduced-motion`: statische, vollständig sichtbare Variante (alle vier Texte
  ohne Interaktion lesbar). Tastatur-bedienbar, ARIA-Labels.

---

## 8. Seiten / Templates

- **Startseite:** Hero → Aha-Balance → Product-Trio → Story-Teaser → Trust → Newsletter.
- **Über uns** (Herzstück, `rich-story`): Ursprung → Wendepunkt → Not zur Mission →
  Menschen/Fachkompetenz (Platzhalter). Ruhiges „Du"-Storytelling + echte Fotos.
- **3 Produkt-Templates** (ATEM/DARM/METABOL): produktspezifische Salbei-Abstufung +
  Bildmotiv, Metafeld-Anzeige (Zusammensetzung, Dosierung), Cross-Sell zu den anderen.
- **Wissen** (Blog), **Kontakt** (Formular), **FAQ** (`faq-accordion`).
- **Rechtliches als befüllbare Vorlagen:** Impressum, Datenschutz, AGB, Versand & Zahlung.

---

## 9. DSGVO / Compliance

- **Cookie-Consent:** Shopifys nativer Consent-Banner + Customer-Privacy-API
  (produktionskorrekt, kein Hardcoding eigener Tracker).
- **Schriften selbst-gehostet** (kein Google-CDN-Abruf).
- **Sprache/Tonalität:** „Du", nahbar, ehrlich, fachlich, beruhigend.
  **Keine Heilversprechen, keine Angst-Rhetorik** — in allen Default-Texten kodiert.

---

## 10. Build-Reihenfolge (mit Preview-Checkpoints)

1. Theme (Skeleton) scaffolden + Store verbinden + Tokens/Schriften/Logos → **Preview**
2. Header/Footer/Navigation → **Preview**
3. 3 Produkte + Metafelder live anlegen (59,99 €)
4. Higgsfield: **Hero-Video-Loop** + Hero-/Lifestyle-Motive generieren → `assets/generated/`
5. Startseite Section für Section (Hero→Aha→Trio→Story→Trust→Newsletter) → **Preview je Section**
6. Über-uns + 3 Produkt-Templates → **Preview**
7. Blog/Kontakt/FAQ + Rechtsseiten + Cookie-Consent → **Preview**
8. Mobile-/Performance-/AA-Politur → **finale Preview**

---

## 11. Offene Punkte (vom Auftraggeber nachzutragen)

- Reale Werte für Metafelder (Zusammensetzung, analytische Bestandteile, Dosierung).
- Impressum-/Rechtsangaben (Firmierung, Adresse, USt-IdNr., Verantwortliche).
- Namen/Bios der Fachexpertinnen (Über-uns „Menschen dahinter").
- Finale Hero-Headline-Texte (Default-Vorschläge werden geliefert, editierbar).
