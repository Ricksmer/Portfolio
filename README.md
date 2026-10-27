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

---

## 🔒 Password-Protected Edit Mode & Admin Layer

The portfolio includes an administrative **Edit Mode** that allows instant editing of all site content while strictly preserving the public site's aesthetics, performance, and animations for normal visitors.

### 1. Dual-View Architecture
The editor provides a persistent minimalist top bar with a view toggle:
- **View 1: Static B&W Edit View (Default)**:
  - Designed for high-density, lag-free editing.
  - The heavy WebGL 3D scene and smooth scrolling are completely unmounted and stopped so zero GPU/CPU cycles run in the background.
  - Clean black & white design with 1px borders, left outline tree panel showing all 7 sections, and modular card stacks for every item.
  - Inline editing, duplicate, delete with undo, hide/show, keyboard reordering, "+ Add Item" with type selection modal, and "+ Add Section".
- **View 2: Live Render View**:
  - Displays the live site with full liquid chrome, glass, 3D star, and animations driven by the same reactive store.
  - Click any element to select it: high-layer outline appears with a floating mini-toolbar (`Edit ✎`, `Copy ⎘`, `Hide 👁`, `Delete ✕`).
  - Slide-out right Inspector Drawer with live form inputs syncing to the DOM in real time.
  - "Pause 3D" toggle for comfortable editing on lower-spec hardware.

### 2. Single Source of Truth & Component Registry
- Master normalized JSON schema: [`js/data/content.json`](file:///c:/Users/RICKSMER%20CABATINGAN/OneDrive/Documents/GitHub/MyProfile/Portfolio/js/data/content.json).
- Universal Component Registry: [`js/modules/registry/componentRegistry.js`](file:///c:/Users/RICKSMER%20CABATINGAN/OneDrive/Documents/GitHub/MyProfile/Portfolio/js/modules/registry/componentRegistry.js) mapping all 13 content types (`header`, `text_block`, `project_card`, `record_card`, `experience_entry`, `credential_list`, `focus_chip_group`, `contact_cluster`, `stack_category`, `creative_showcase`, `link_button`, `editorial_stamp`, `profile_meta`) to both public/render-view HTML and edit-view form schemas.
- Dev-time parity test suite: Run `node tests/parity-check.js` to verify 100% parity across all sections and items.

### 3. Serverless Security & Storage (`/api`)
- Protected serverless endpoints compare against a salted SHA-256 hash and issue signed `httpOnly`, `Secure`, `SameSite=Strict` cookies with 4-hour expiration.
- Brute-force protection: 5 failed attempts locks out the client IP for 15 minutes.
- Draft vs. Published persistence:
  - Draft autosaves locally and server-side to `/api/content/draft`.
  - "PUBLISH LIVE" promotes draft to live CDN baseline and stores rolling snapshots for rollback.
  - "Export JSON" and "Import" allow full disaster-recovery backups.

---

## ⚙️ Required Vercel Environment Variables

When deploying to [Vercel](https://vercel.com), configure the following environment variables under **Project Settings → Environment Variables**:

| Variable Name | Required | Default / Example Value | Description |
| :--- | :---: | :--- | :--- |
| `ADMIN_PASSCODE_HASH` | **Yes** | `24efb5cf3758522bd85f5567d4e4ae604a55043a6cd68b821859428995cd5edf` | SHA-256 hash of your admin passcode (default test passcode is `123456777`). Generate a new hash using `echo -n "YourSecretPassword" \| sha256sum` or via the top bar Passcode tool. |
| `SESSION_SIGNING_SECRET` | **Yes** | `cabatingan-portfolio-v4-super-secret-hmac-key-2026` | High-entropy random string (min 32 characters) used to cryptographically sign session cookies with HMAC-SHA256. |
| `STORAGE_PROVIDER` | Optional | `local` (or `vercel-blob`, `upstash-redis`) | Storage persistence engine. Default fallback stores draft/published states in memory and local storage. |

---

## 🚀 How to Run Locally

Because the project uses native ES Modules, browsers require it to be served via HTTP:

```powershell
# Open terminal in project directory:
cd "c:\Users\RICKSMER CABATINGAN\OneDrive\Documents\GitHub\MyProfile\Portfolio"

# Start local server:
python -m http.server 8000
```
Then visit **[http://localhost:8000](http://localhost:8000)** in your browser.

To enter Edit Mode:
1. Click the subtle trigger in the footer or bottom navigation (`#admin-auth-trigger`).
2. Enter the default administration passcode: `123456777`.
3. The editor lazy-loads on demand and opens in **View 1: Static B&W Edit View**.
4. Use the top bar to switch to **View 2: Live Render View**, undo/redo changes, export/import JSON, or click **PUBLISH LIVE**.

