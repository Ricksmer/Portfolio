# Build Prompt — Ricksmer Cabatingan Portfolio Website

Build a single-page personal portfolio website as one self-contained `index.html` file (inline CSS + JS, no build step). The aesthetic is **"Acid Graphic / Neo-Brutalist Glassmorphism"** — a chrome, high-contrast, premium-minimalist style. Follow every spec below precisely; do not substitute a generic SaaS/card-kit layout.

---

## 1. Aesthetic direction

**Name of style:** Acid Graphic / Neo-Brutalist Glassmorphism ("chrome aesthetic")

**Core visual language:**
- Chromatic dispersion & refraction — light splitting into rainbow spectral highlights through glass/crystal forms
- High-contrast monochromatic base: stark black and near-white, so iridescent accents stand out without competing colors
- Typographic brutalism: heavy Swiss grotesque sans-serif for display type, paired with small monospace/technical micro-typography for labels and metadata
- Tactile materials: glass panels, frosted/blurred surfaces, thin iridescent-gradient borders
- Subtle film grain / noise over the whole page to avoid a flat, "too-digital" look

**Reference mood:** think posters titled "CHROME", "MY PORTFOLIO 2024", "ABSTRACT — SHAPING THIS YEAR'S TREND", "ELEMENTZ — REFRACTIONS" — bold type overlaid on glass/prism renders on black or white grid backgrounds.

**Design tokens:**
```
--bg:          #07070a   (near-black base)
--bg-alt:      #0d0d10
--fg:          #f2f2ef   (near-white text)
--fg-dim:      #8b8b92   (secondary text)
--fg-faint:    #4d4d54   (tertiary/meta text)
--line:        rgba(242,242,239,0.14)   (hairline dividers, no drop shadows)
--glass:       rgba(255,255,255,0.035)  (glass panel fill)
--glass-border:rgba(255,255,255,0.16)
--iris-a:      #a6f3ff
--iris-b:      #c9b6ff
--iris-c:      #ffd9a6
--iris-d:      #ff9ecb
(iridescent accent gradient — use ONLY for hover borders, the hero chrome-text sheen,
and small accent details. Never as large flat color fields.)
--radius:      3px   (sharp, not rounded — this is brutalist, not soft SaaS)
--font-display: 'Space Grotesk', sans-serif   (weight 600–700, tight letter-spacing)
--font-mono:    'JetBrains Mono', monospace   (labels, metadata, timeline index)
```

**Rules:**
- No drop shadows, no soft SaaS card style, no uniform rounded corners.
- Glass panels: `background: var(--glass); border: 1px solid var(--glass-border); backdrop-filter: blur(14px);` with a thin gradient border that appears/intensifies on hover using the iridescent palette.
- A fixed, very low-opacity SVG film-grain overlay (`feTurbulence`) across the whole viewport.
- A faint background grid (thin hairlines, ~64px cells) behind the hero, fading out toward the page edges.
- Do not add a light mode — this is a deliberately single dark theme.

---

## 2. Structure & section order

1. **Hero** — name, tagline, WebGL glass/chrome centerpiece (see §5)
2. **About** — expanded personal + academic bio
3. **Contact** — email, phone, GitHub
4. **Focus Areas** — 3 tags
5. **Projects** — placeholder project grid
6. **Achievements** — competitions/certifications, pinned horizontal-scroll timeline
7. **Experience** — work/org roles, vertical stacked list
8. **Tech Stack** — grouped icon carousels, at the very bottom, above the footer

**Left-side timeline spine:** a fixed vertical nav running the full height of the left edge of the viewport, present on every section. It shows a thin vertical line with a dot per section and a small mono-font text label (e.g. `01 — INTRO`, `02 — ABOUT` … `08 — STACK`). The dot/label for whichever section is currently in view is highlighted (scaled up, filled, glowing) while others stay dim. Clicking a dot smooth-scrolls to that section. On narrow/mobile viewports (<900px), collapse to dots only (hide text labels) and shrink the reserved width.

---

## 3. Content (use verbatim — do not invent facts beyond what's marked "placeholder")

### Hero
- Kicker: `SOFTWARE ENGINEERING STUDENT — CEBU CITY, PH`
- Name (large display type): **Ricksmer Cabatingan**
- Subline: "BS Information Technology, 3rd Year at Cebu Institute of Technology – University. National DOST Scholar building software and leading creative direction."
- Meta line: Role — Chief Creatives Officer, GDGoC CIT-U · Based — Cebu City, Philippines

### About
Lead line: "A National DOST Scholar studying Information Technology, working at the intersection of software engineering and creative direction."

Body: "Third-year BS Information Technology student at Cebu Institute of Technology – University and a National DOST Scholar, with a strong foundation in software development and creative production. Outside the classroom, that same instinct carries into how he leads: as Chief Creatives Officer for GDGoC CIT-U, he treats a layout or a publication with the same care as a piece of code — deliberate, consistent, and built to be understood at a glance. He's most engaged where logic meets aesthetics — building a working feature one day, refining a visual system the next — and that range shows up across hackathons, game jams, and campus developer communities he's contributed to."

Stat list (side column):
- National DOST Scholar — Batch 2024 Merit Passer
- Top 1, BSIT Freshman Batch — 2024
- Presidential Scholar — 2nd Year, 2nd Sem
- College Scholar Award — ×2 (1st & 2nd Year)
- Chief Creatives Officer — GDGoC CIT-U

### Contact
- Lead: "Open to internships, collaborations, and hackathon teams — reach out through any of these."
- Email: ricksmer.cabatingan@cit.edu
- Phone: +63 942 956 0278
- GitHub: github.com/Ricksmer

### Focus Areas
UI/UX Design · Frontend Development · Game Development

### Projects (all PLACEHOLDER copy except SariSmart, which is real — swap the rest in later)
1. **SariSmart** — "Offline-first Android inventory management app for sari-sari stores, built with an MVP architecture — covers authentication, dashboard, and product tracking." Tags: Kotlin, Android, MVP
2. **Online Marketplace** — placeholder, tag: Web, TBD
3. **Silentium** — placeholder, tag: TBD
4. **Color Sequence Game** — placeholder, tags: JavaScript, Game Logic
5. **Hamsteremoji** — placeholder, tag: TBD
6. **React Component & Props** — placeholder, tags: React, JavaScript
7. **ExpressJS** — placeholder, tags: Node.js, Express

### Achievements (competitions & certifications)
1. **1st Naga City Mayoral Hackathon** (2026) — Semifinalist, Hospital/Health Track, Team Techalang (5-member team) — built a prototype addressing gaps in hospital/health service delivery, under an initiative launched by Mayor Leni Robredo.
2. **NEXT LEVEL: Esports Game Dev Challenge** (2026) — Top 6–10 Regional Finalist, Team Clutch Five, hosted by DOST Region VII — designed and built a game prototype meeting the challenge's requirements.
3. **DOST Game Dev Challenge at ICon — Pinoy Party** (2026) — Exhibitor & Finalist, Team Clutch Five — co-developed a 4-player multiplayer digital board game inspired by traditional Laro ng Lahi games; programmed core mechanics, quiz systems, and multiplayer mini-games.
4. **CodeChum C Programming Certification** (2024) — Top 1.
5. **CodeChum Java Programming Certification** — Certified.

### Experience (org roles)
1. **Chief Creatives Officer**, Google Developer Groups on Campus (GDGoC) – CIT-U (2026–Present) — Leads the Creatives Department as a core officer, managing task assignments, deliverables, and deadlines. Produces layout designs, captions, and video edits.
2. **Creatives Officer**, Committee on Media and Publications (CMAP) (2025–Present) — Designs official publication materials (pubmats) for organizational/institutional releases.
3. **Creatives Officer**, DOST SA SIETE — Scholars' Association Region VII (2024) — Created graphics and visual materials for the association's communications and campaign engagement.

### Tech Stack (grouped into 3 categories, icon chips, tool name appears on hover)
- **Languages:** Java, JavaScript, TypeScript, Python, PHP, Kotlin, C, HTML5, CSS3
- **Web & Cloud:** React, Next.js, Node.js, Express, PostgreSQL, AWS, Google Cloud, Vercel
- **Creative & Dev Tools:** Figma, Canva, Ibis Paint, Photoshop, After Effects, CapCut, DaVinci Resolve, Blender, GitHub, VS Code, Notion

Icons must stay monochrome/monoline (white/grey strokes) to match the high-contrast palette — do NOT use colorful brand logos, they clash with the aesthetic. Build simple custom line-icon glyphs, or monogram badges as a fallback, rather than pulling in a colorful icon font.

---

## 4. Scroll animation spec

Use **GSAP + ScrollTrigger** for scroll-tied animation, and **Lenis** for smooth-scroll easing. Load both via pinned-version CDN script tags (jsDelivr npm CDN is reliable: `https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js`, `.../ScrollTrigger.min.js`, and `https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js`). Wrap all usage in feature-detection (`if (window.gsap)`, `if (window.Lenis)`) so the page still works if a CDN fails.

Implement all three of the following, distributed across the page (not all crammed into one section):

1. **Fade/slide-up reveals** — default entrance for section content (About, Contact, Focus Areas, Projects grid, Experience list, Tech Stack groups) as it scrolls into view. Keep this understated (translateY ~30px, opacity 0→1).
2. **Parallax depth** — in the Hero: the text block and the 3D glass centerpiece move at different scroll speeds as the user scrolls past the hero (text moves up faster / fades, the glass shape drifts more slowly), using `scrub: true` ScrollTrigger tweens.
3. **Pinned/transform section** — the **Achievements** section pins in place while its cards scroll horizontally as the user scrolls down (classic pinned horizontal-timeline technique): calculate the track's scrollable width, pin the section for a scroll distance equal to that width, and translateX the card track by `-distance` with `scrub: true`.

Respect `prefers-reduced-motion: reduce`: disable Lenis smooth-scroll, skip the scrub/parallax/pin tweens (or make them instant), and stop any continuous looping animation (marquees, hero rotation).

---

## 5. Hero centerpiece — WebGL glass shader (Three.js)

Build a real 3D glass object (not a CSS approximation) as the hero's visual anchor, positioned beside/behind the name text so page text stays readable.

- Load Three.js **r160** as ES modules via jsDelivr, pinned exact version: `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js` and the `RoomEnvironment` example addon from `https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js` (this generates a procedural reflection environment with no external image assets needed — required since the page can't load external texture files).
- Geometry: `TorusGeometry` (a glass "donut" shape, echoing the reference image) — reasonably high segment count for smooth refraction highlights.
- Material: `MeshPhysicalMaterial` with `transmission: 1`, low `roughness` (~0.04), `thickness` ~2.2, `ior` ~1.4, **`iridescence: 1`** with `iridescenceIOR` ~1.3 and an `iridescenceThicknessRange` (e.g. `[120, 900]`) — this is what produces the rainbow chromatic-dispersion fringes from the reference image without needing a custom shader or post-processing pass. Add `clearcoat: 1`.
- Lighting: 1–2 point lights (a warm/white key light and a cool rim light) plus low ambient, positioned to rake across the glass surface and catch the iridescence.
- Slow continuous auto-rotation on two axes; nudge rotation speed slightly based on scroll position for the parallax effect described in §4.
- Cap `devicePixelRatio` at 2, size the renderer to its container only (not full page) for performance, and add a `resize` handler.
- **Critical: wrap the entire Three.js setup in try/catch.** If WebGL is unavailable or a CDN import fails, fall back to a blurred CSS radial-gradient blob in the same position (soft iridescent glow) so the hero never renders broken/empty.

---

## 6. Technical constraints

- Single self-contained HTML file — all CSS and JS inline except the pinned CDN scripts listed above and Google Fonts (`Space Grotesk`, `JetBrains Mono` from `fonts.googleapis.com`).
- Fully responsive down to mobile (~360px): stack the About grid and Projects grid to one column, collapse the timeline spine to dots-only, keep the hero glass shape from overlapping text at narrow widths.
- Keyboard-focus states must remain visible on interactive elements (spine dots, contact links).
- No `localStorage`/`sessionStorage` — this page needs no persistence.
- Keep JS defensive: feature-detect every external library before using it so one failed CDN doesn't break the whole page.

---

## 7. Deliverable

One `index.html` file implementing all of the above, ready to open directly in a browser or deploy as a static page.
