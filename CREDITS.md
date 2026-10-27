# Credits & Asset Licenses

This document acknowledges all third-party libraries, fonts, and assets utilized in the **Ricksmer Cabatingan — Personal Portfolio Website**.

---

## 1. Libraries & Frameworks

| Library | Version | Distribution | License | Description / Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Three.js** | `0.160.0` | CDN (jsDelivr) | MIT License | 3D WebGL runtime, MeshPhysicalMaterial rendering, perspective camera, scene lighting |
| **GSAP** | `3.12.5` | CDN (jsDelivr) | Standard GreenSock License | High-performance timeline orchestrations, staggered reveals, text shimmer |
| **ScrollTrigger** | `3.12.5` | CDN (jsDelivr) | Standard GreenSock License | Scroll-driven timeline scrubbing, parallax triggers, and section synchronization |
| **Lenis** | `1.1.13` | CDN (jsDelivr) | MIT License | Inertia smooth scrolling with wheel and trackpad normalization |

---

## 2. Typography

| Font Family | Designer / Foundry | Source | License | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Unbounded** | NaN, Vyacheslav Kirilenko, Eugene Tantsurin | Google Fonts | SIL Open Font License, 1.1 | Bold futuristic display headlines & chrome titles |
| **Space Grotesk** | Florian Karsten | Google Fonts | SIL Open Font License, 1.1 | Primary grotesque sans-serif body typography |
| **JetBrains Mono** | JetBrains | Google Fonts | Apache License, 2.0 | Technical cyber-HUD labels, coordinate timestamps, and metadata |

---

## 3. Shaders, Environments & Graphics

- **Procedural Studio Reflection Map:** Generated dynamically in-memory via HTML5 2D Canvas context (`js/modules/webgl-torus.js`) — zero external image asset dependencies or network overhead.
- **Film Grain Filter:** Native procedural SVG `feTurbulence` filter element with fractal noise matrix.
- **Cyber-HUD Icons & Badges:** Custom inline vector SVGs (4-point sparkle stars, crosshair glyphs, technical barcodes, corner brackets).
