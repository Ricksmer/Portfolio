# Ricksmer Cabatingan — Personal Portfolio Website (V4 Modular)

A high-performance personal portfolio built in the **Acid Graphic / Neo-Brutalist Glassmorphism ("Chrome Aesthetic")** style.

Designed and engineered with a modern, scalable, and completely modular architecture using native Web Standards (Zero-build ES Modules + CSS Components).

---

## 📁 Architecture & File Structure

```text
portfolio/
├── index.html                  # Semantic, accessible HTML5 entrypoint
├── README.md                   # Complete documentation and setup guide
│
├── css/
│   ├── main.css                # Aggregator importing all CSS modules
│   ├── variables.css           # Design tokens, color palette, iridescent gradients, fonts
│   ├── base.css                # Resets, SVG noise overlay, typography, utilities
│   ├── layout.css              # Main sections layout, grid positioning, hero typography
│   └── components/
│       ├── sweep.css           # Full-coverage glitch-free chromatic blur sweep
│       ├── spine.css           # Fixed left timeline vertical spine navigation (7 sections)
│       ├── orb.css             # Liquid chrome "Say Hi" button with upper-left floating contact arc
│       ├── cursor.css          # Clean, non-clashing minimalist precision cursor
│       ├── cards.css           # Project cards, full-width edge-faded achievements carousel
│       ├── marquee.css         # Seamless infinite tech stack marquee
│       ├── carousel.css        # 3D Arc / Coverflow curved carousel for creative teaser
│       └── modal.css           # Dedicated full-screen detail page view (replaces side panel)
│
└── js/
    ├── main.js                 # Application bootstrap & lifecycle orchestrator
    ├── data/
    │   ├── projects.js         # Decoupled project content (SariSmart, etc.)
    │   ├── achievements.js     # Hackathons, game dev challenges, certifications
    │   ├── experience.js       # GDGoC Chief Creatives Officer, CMAP, DOST roles
    │   ├── techStack.js        # Categorized skills (Languages, Frameworks & Cloud, Tools)
    │   └── creative.js         # Creative portfolio teaser showcase data
    └── modules/
        ├── webgl-torus.js      # Three.js 3D optical glass donut (scroll-linked) & liquid chrome core
        ├── cursor.js           # Precision ring & dot cursor controller
        ├── spine.js            # Left timeline spine scroll observer & smooth navigation
        ├── arc-carousel.js     # 3D Arc / Coverflow carousel controller with swipe & drag
        ├── marquee.js          # Infinite tech stack builder with chip-only hover isolation
        ├── detail-modal.js     # Dedicated full-screen page viewer with history sync
        └── animations.js       # GSAP & ScrollTrigger reveal orchestrations with fallbacks
```

---

## ✨ Features & V4 Enhancements

1. **Section Structure**:
   - `01 — INTRO`
   - `02 — ABOUT`
   - `03 — PROJECTS`
   - `04 — ACHIEVEMENTS`
   - `05 — EXPERIENCE`
   - `06 — STACK`
   - `07 — MORE` (Curated creative portfolio teaser)

2. **Dedicated Full-Screen Detail Pages (`css/components/modal.css`)**:
   - Replaces the side drawer with a complete full-screen view (100vw × 100vh).
   - Features a sticky top navigation bar with `"← BACK TO PORTFOLIO"`, item breadcrumbs, high-resolution media specimen frames, architectural notes, and direct repository links.

3. **Liquid Chrome "Say Hi" Button & Floating Contact Arc (`css/components/orb.css`)**:
   - Positioned in the bottom-right corner of the About section.
   - High-contrast, clean, punchy typography on polished molten chrome.
   - Contact buttons (Email, GitHub, Phone) are hidden by default and pop out into an upper-left fanning arc on hover/focus using spring physics.

4. **Clean, Non-Clashing Precision Cursor (`css/components/cursor.css`)**:
   - Removed intrusive difference disks and text labels that obscured typography.
   - Minimalist 5px glowing dot with an expanding outer hairline ring (glows with an iridescent aura on interactive hover).

5. **Achievements Carousel with Edge Fades (`css/components/cards.css`)**:
   - Full-width container fit with left and right gradient fade masks (`mask-image: linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)`).

6. **Scroll-Linked Optical Glass Donut & Interactive Chrome Centerpiece (`js/modules/webgl-torus.js`)**:
   - **Glass Donut (Reference 1)**: Optical transmission, internal refraction rings, and chromatic dispersion. Strictly scroll-aligned: rotates forward on scroll down and reverses on scroll up.
   - **Liquid Chrome Core (Reference 2)**: Molten chrome finish with procedural studio reflection, pointer avoidance, and dynamic click evasion.

---

## 🚀 How to Run Locally

Because the project uses native ES Modules, browsers require it to be served via HTTP:

```powershell
# Open terminal in project directory:
cd "C:\Users\RICKSMER CABATINGAN\.gemini\antigravity\scratch\portfolio"

# Start local server:
python -m http.server 8000
```
Then visit **[http://localhost:8000](http://localhost:8000)** in your browser.
