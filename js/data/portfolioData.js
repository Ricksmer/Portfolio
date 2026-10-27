/**
 * Portfolio Unified Master Data File
 * 
 * THE GOLDEN RULE:
 * Locked data: All text content, projects, achievements, experience, honors, stack, links, contact details, and dates.
 * Placeholders are explicitly marked for user customization.
 */

export const PORTFOLIO_DATA = {
  profile: {
    name: 'Ricksmer Cabatingan',
    firstName: 'Ricksmer',
    lastName: 'Cabatingan',
    monogram: 'RC',
    gradYear: "'26",
    kicker: '// SOFTWARE ENGINEERING STUDENT — CEBU CITY, PH',
    subline: 'BS Information Technology, 3rd Year at Cebu Institute of Technology – University. National DOST Scholar building software and leading creative direction.',
    role: 'Chief Creatives Officer, GDGoC CIT-U',
    based: 'Cebu City, Philippines',
    institution: 'Cebu Institute of Technology – University',
    program: 'BS Information Technology, 3rd Year',
    scholarship: 'National DOST Scholar',
    status: 'OPEN FOR INTERNSHIPS & COLLABORATIONS',
    serialNumber: 'SN: RC-052-2026',
    systemTag: 'REFRACTIONS &! PRISM // SYSTEM 01'
  },

  contact: {
    // Verified primary targets — editable via CMS overlay or in this file
    email: 'mailto:ricksmer.cabatingan@cit.edu',
    emailDisplay: 'ricksmer.cabatingan@cit.edu',
    phone: 'tel:+639429560278',
    phoneDisplay: '+63 942 956 0278',
    github: 'https://github.com/Ricksmer',
    // PLACEHOLDER: Update with your dedicated creative portfolio link (e.g., Behance, ReadCV, or custom domain)
    creativePortfolio: 'https://github.com/Ricksmer',
    location: 'Cebu City, Philippines',
    timezone: 'Asia/Manila',
    timezoneDisplay: 'PHT (UTC+8)'
  },

  about: {
    lead: 'Driven by obsessive craft and creative curiosity — engineering software that feels as deliberate, fluid, and refined to touch as it is structurally sound.',
    body: "Third-year BS Information Technology student at Cebu Institute of Technology – University and a National DOST Scholar, with a strong foundation in software development and creative production. Outside the classroom, that same instinct carries into how he leads: as Chief Creatives Officer for GDGoC CIT-U, he treats a layout or a publication with the same care as a piece of code — deliberate, consistent, and built to be understood at a glance. He's most engaged where logic meets aesthetics — building a working feature one day, refining a visual system the next — and that range shows up across hackathons, game jams, and campus developer communities he's contributed to.",
    
    academicHonors: [
      { id: 'honor-1', text: 'Awarded as a National DOST Scholar under the Batch 2024 Merit Scholarship program.' },
      { id: 'honor-2', text: 'Recognized as Top 1 of the BSIT Freshman Batch for the academic year 2024.' },
      { id: 'honor-3', text: 'Conferred as Presidential Scholar during the 2nd Year, 2nd Semester.' },
      { id: 'honor-4', text: 'Honored with the College Scholar Award across two consecutive academic years.' }
    ],

    leadershipRoles: [
      { id: 'lead-1', text: 'Leads visual branding, motion campaigns, and creative deliverables as Chief Creatives Officer for GDGoC CIT-U.' },
      { id: 'lead-2', text: 'Directs official institutional publication designs and media releases as Creatives Officer for CMAP.' },
      { id: 'lead-3', text: 'Created regional visual communications and branding collateral for DOST SA SIETE.' }
    ],

    focusAreas: [
      {
        id: 'ui-ux',
        title: 'UI/UX Design',
        desc: 'Design systems, typography, interaction',
        tag: 'SPEC-01'
      },
      {
        id: 'frontend',
        title: 'Frontend Development',
        desc: 'Motion graphics, WebGL, responsive frameworks',
        tag: 'SPEC-02'
      },
      {
        id: 'gamedev',
        title: 'Game Development',
        desc: 'Mechanics, physics tuning, rapid prototyping',
        tag: 'SPEC-03'
      }
    ]
  },

  projects: [
    {
      id: 'sarismart',
      name: 'SariSmart',
      kicker: 'OFFLINE-FIRST MOBILE SYSTEM',
      lead: 'Offline-first Android inventory management app for sari-sari stores, built with an MVP architecture.',
      tags: ['Kotlin', 'Android', 'MVP Architecture'],
      images: 3,
      placeholder: false,
      repoUrl: 'https://github.com/Ricksmer/SariSmart',
      liveUrl: null,
      body: [
        'An offline-first Android inventory management application designed specifically for neighborhood sari-sari micro-retail stores. Built using Kotlin with clean Model-View-Presenter (MVP) architecture.',
        'Features full offline synchronization, secure local SQLite persistence, real-time inventory level tracking, stock alerting, daily sales analytics, and transaction recording without requiring an active internet connection.'
      ],
      takeaway: {
        title: '// KEY TAKEAWAY & ARCHITECTURE',
        body: 'Strict offline-first persistence with defensive SQLite caching, decoupled MVP contracts, and asynchronous background sync guaranteeing zero data loss during connectivity drops.'
      }
    },
    {
      id: 'marketplace',
      name: 'Online Marketplace',
      kicker: 'FULL-STACK COMMERCE',
      lead: 'Modern commerce prototype with dynamic cataloging, cart state management, and authenticated checkout.',
      tags: ['Web', 'React', 'Node.js'],
      images: 2,
      placeholder: true,
      repoUrl: 'https://github.com/Ricksmer/online-marketplace', // PLACEHOLDER: TBD by user
      liveUrl: null,
      body: [
        'Comprehensive digital marketplace prototype built for seamless item exploration, category filtering, cart management, and order processing.',
        'Focuses on ultra-low latency navigation, responsive layouts across devices, and scalable API integration patterns.'
      ],
      takeaway: {
        title: '// KEY TAKEAWAY & ARCHITECTURE',
        body: 'Optimized client-side state machine for real-time inventory updates and responsive micro-interactions across varied viewport constraints.'
      }
    },
    {
      id: 'silentium',
      name: 'Silentium',
      kicker: 'AUDIO & PRODUCTIVITY',
      lead: 'Minimalist atmospheric soundscapes and distraction-free workspace environment for focused work.',
      tags: ['Web Audio API', 'TypeScript', 'UI/UX'],
      images: 2,
      placeholder: true,
      repoUrl: 'https://github.com/Ricksmer/silentium', // PLACEHOLDER: TBD by user
      liveUrl: null,
      body: [
        'A bespoke ambient focus application delivering generative audio environments with spatial panning and volume balancing.',
        'Explores neo-brutalist UI paradigms with subtle reactive micro-interactions and low cognitive overhead.'
      ],
      takeaway: {
        title: '// KEY TAKEAWAY & ARCHITECTURE',
        body: 'Modular Web Audio synthesizer nodes running off the main thread with spatial stereo separation for natural binaural sound.'
      }
    },
    {
      id: 'color-sequence',
      name: 'Color Sequence Game',
      kicker: 'INTERACTIVE GAME LOGIC',
      lead: 'Pattern memorization and reactive sequencing game exploring timing, score states, and sound cues.',
      tags: ['JavaScript', 'Game Logic', 'Canvas'],
      images: 2,
      placeholder: true,
      repoUrl: 'https://github.com/Ricksmer/color-sequence-game', // PLACEHOLDER: TBD by user
      liveUrl: null,
      body: [
        'High-speed reactive pattern recall game engineered in vanilla JavaScript with procedural audio feedback.',
        'Implemented custom state machines for difficulty ramp-up, input queuing, and local high-score persistence.'
      ],
      takeaway: {
        title: '// KEY TAKEAWAY & ARCHITECTURE',
        body: 'Deterministic state machine with requestAnimationFrame tick timing and strict queue synchronization to prevent input collisions.'
      }
    },
    {
      id: 'hamsteremoji',
      name: 'Hamsteremoji',
      kicker: 'CREATIVE ASSET PLATFORM',
      lead: 'Interactive vector emoji creator and asset generator for digital communities.',
      tags: ['SVG', 'Interaction', 'Canvas'],
      images: 2,
      placeholder: true,
      repoUrl: 'https://github.com/Ricksmer/hamsteremoji', // PLACEHOLDER: TBD by user
      liveUrl: null,
      body: [
        'Custom vector emoji styling engine allowing users to assemble, preview, and export layered vector art assets in real-time.',
        'Demonstrates component-based rendering and instant SVG/PNG rasterization pipelines.'
      ],
      takeaway: {
        title: '// KEY TAKEAWAY & ARCHITECTURE',
        body: 'Layered vector compositing pipeline with high-resolution canvas exporting and SVG node mutation optimization.'
      }
    },
    {
      id: 'react-components',
      name: 'React Component & Props',
      kicker: 'UI COMPONENT ARCHITECTURE',
      lead: 'Modular design system library emphasizing polymorphic components, strict typing, and a11y standards.',
      tags: ['React', 'TypeScript', 'Storybook'],
      images: 2,
      placeholder: true,
      repoUrl: 'https://github.com/Ricksmer/react-component-props', // PLACEHOLDER: TBD by user
      liveUrl: null,
      body: [
        'A clean component architecture showcase implementing compound component patterns, keyboard accessibility, and tokenized design systems.',
        'Provides reusable primitives for high-performance dashboard interfaces.'
      ],
      takeaway: {
        title: '// KEY TAKEAWAY & ARCHITECTURE',
        body: 'Strict polymorphism with generic TypeScript props and full ARIA adherence across complex compound components.'
      }
    },
    {
      id: 'expressjs-api',
      name: 'ExpressJS Backend Suite',
      kicker: 'API ARCHITECTURE',
      lead: 'Robust RESTful microservices engine featuring JWT authorization, rate limiting, and database abstraction.',
      tags: ['Node.js', 'Express', 'PostgreSQL'],
      images: 2,
      placeholder: true,
      repoUrl: 'https://github.com/Ricksmer/expressjs-backend', // PLACEHOLDER: TBD by user
      liveUrl: null,
      body: [
        'Scalable backend boilerplate with layered routing, request sanitization, role-based access control, and transactional DB pooling.',
        'Built with test-driven methodologies and automated endpoint documentation.'
      ],
      takeaway: {
        title: '// KEY TAKEAWAY & ARCHITECTURE',
        body: 'Layered architecture separating controllers, services, and repositories with connection pool reuse and centralized middleware error handling.'
      }
    }
  ],

  achievements: [
    {
      id: 'naga-hackathon',
      year: '2026',
      title: '1st Naga City Mayoral Hackathon',
      tag: 'HACKATHON — SEMIFINALIST',
      meta: 'Hospital/Health Track · Team Techalang · 5-Member Team',
      images: 2,
      body: [
        'Semifinalist in the prestigious Hospital/Health Service Track under a civic innovation initiative launched by Mayor Leni Robredo.',
        'As part of the 5-member Team Techalang, conceptualized and engineered a rapid-response digital prototype addressing critical bottlenecks in urban hospital triage, patient queuing, and medical service dispatch.',
        'Contributed to system design, interface mockups, and client-side application state management within an intensive 48-hour development sprint.'
      ]
    },
    {
      id: 'nextlevel-gamedev',
      year: '2026',
      title: 'NEXT LEVEL: Esports Game Dev Challenge',
      tag: 'GAME DEV — REGIONAL FINALIST',
      meta: 'Top 6–10 Regional Finalist · Team Clutch Five · DOST Region VII',
      images: 2,
      body: [
        'Selected as a Top 6–10 Regional Finalist in the esports game development competition hosted by the Department of Science and Technology (DOST) Region VII.',
        'Collaborated within Team Clutch Five to design and implement a competitive game prototype meeting rigorous technical and performance benchmarks.',
        'Responsible for gameplay physics tuning, player input handling, and responsive audiovisual cues.'
      ]
    },
    {
      id: 'icon-pinoyparty',
      year: '2026',
      title: 'DOST Game Dev Challenge at ICon — Pinoy Party',
      tag: 'EXHIBITOR & FINALIST',
      meta: '4-Player Multiplayer · Team Clutch Five · ICon Convention',
      images: 3,
      body: [
        'Official Exhibitor and Finalist at the DOST ICon Game Development Showcase featuring the flagship title "Pinoy Party".',
        'Co-developed a 4-player couch/online multiplayer digital board game proudly inspired by traditional Filipino folk games (Laro ng Lahi).',
        'Programmed core turn-based board mechanics, dynamic trivia and interactive challenge systems, synchronized minigames, and animated player assets.'
      ]
    },
    {
      id: 'codechum-c',
      year: '2024',
      title: 'CodeChum C Programming Certification',
      tag: 'CERTIFICATION — TOP 1',
      meta: 'National Benchmark Assessment · 2024',
      images: 1,
      body: [
        'Ranked Top 1 overall in the CodeChum C Programming Certification evaluation, demonstrating mastery of low-level memory management, pointers, complex data structures, and algorithmic optimization.'
      ]
    },
    {
      id: 'codechum-java',
      year: '2024',
      title: 'CodeChum Java Programming Certification',
      tag: 'CERTIFICATION — CERTIFIED',
      meta: 'Object-Oriented Programming Assessment',
      images: 1,
      body: [
        'Earned official certification in Java Programming, demonstrating practical command of OOP principles, abstraction, polymorphic interfaces, exceptions, and collection frameworks.'
      ]
    },
    {
      id: 'dost-sei',
      year: '2023 – PRESENT',
      title: 'DOST-SEI Merit Scholarship Award',
      tag: 'NATIONAL SCHOLARSHIP',
      meta: 'Department of Science and Technology · Republic of the Philippines',
      images: 1,
      body: [
        'Conferred the prestigious Department of Science and Technology (DOST) Science Education Institute Merit Scholarship, awarded to students demonstrating superior aptitude in STEM and software disciplines.'
      ]
    }
  ],

  experience: [
    {
      id: 'gdgoc',
      role: 'Chief Creatives Officer',
      org: 'Google Developer Groups on Campus (GDGoC) – CIT-U',
      period: '2026 – Present',
      images: 2,
      body: [
        'Leads the Creatives Department as a core executive officer, overseeing visual identity, promotional campaigns, motion assets, and event documentation for campus developer initiatives.',
        'Manages cross-functional design sprints, delegates deliverables across designers and video editors, and enforces rigorous aesthetic consistency across all technical symposiums, workshops, and hackathons.',
        'Designs high-impact publication materials (pubmats), social teasers, and presentation decks that bridge technical depth with accessible, compelling visual design.'
      ]
    },
    {
      id: 'cmap',
      role: 'Creatives Officer',
      org: 'Committee on Media and Publications (CMAP)',
      period: '2025 – Present',
      images: 2,
      body: [
        'Directs the creation of official publication materials (pubmats), editorial infographics, and visual announcements for institutional university releases.',
        'Collaborates closely with editorial and copy teams to transform policy updates and community milestones into engaging visual communications.'
      ]
    },
    {
      id: 'dostsiete',
      role: 'Creatives Officer',
      org: "DOST SA SIETE – Scholars' Association Region VII",
      period: '2024',
      images: 2,
      body: [
        'Spearheaded graphic design and multimedia production for regional DOST scholars, producing marketing collaterals and social campaign assets that amplified scholar community engagement.',
        'Maintained brand identity standards and supported regional scholarship outreach conferences.'
      ]
    }
  ],

  techStack: [
    {
      id: 'languages',
      label: 'PROGRAMMING & MARKUP LANGUAGES',
      code: 'LANG // 01',
      items: ['Java', 'JavaScript', 'TypeScript', 'Python', 'PHP', 'Kotlin', 'C', 'HTML5', 'CSS3']
    },
    {
      id: 'frameworks-cloud',
      label: 'FRAMEWORKS & CLOUD',
      code: 'INFRA // 02',
      items: ['React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'AWS', 'Google Cloud', 'Vercel']
    },
    {
      id: 'tools',
      label: 'CREATIVE & DEV TOOLS',
      code: 'TOOLS // 03',
      items: ['Figma', 'Canva', 'Ibis Paint', 'Photoshop', 'After Effects', 'CapCut', 'DaVinci Resolve', 'Blender', 'GitHub', 'VS Code', 'Notion']
    }
  ],

  creativeShowcase: [
    {
      id: 'visual-identity',
      title: 'GDGoC Brand System',
      category: 'BRAND IDENTITY & MOTION',
      aspect: 'POSTER / SYSTEM',
      previewText: 'Google Developer Groups on Campus CIT-U visual identity guidelines, keynote presentation slides, and promotional assets.'
    },
    {
      id: 'refraction-posters',
      title: 'Neo-Chrome Poster Series',
      category: 'ACID GRAPHIC / 3D',
      aspect: 'GRAPHIC DESIGN',
      previewText: 'Experimental typography posters exploring chromatic aberration, procedural glass distortions, and high-contrast brutalism.'
    },
    {
      id: 'game-art-pinoy',
      title: 'Pinoy Party Game Assets',
      category: 'GAME ART & UI',
      aspect: 'ILLUSTRATION & 2D',
      previewText: 'Character badges, isometric board tiles, and nostalgic carnival vector illustrations for the 4-player party game.'
    },
    {
      id: 'cmap-editorial',
      title: 'CMAP Editorial Releases',
      category: 'EDITORIAL & PUBMATS',
      aspect: 'LAYOUT DESIGN',
      previewText: 'High-density institutional infographics and official press releases with Swiss typographic rigor.'
    },
    {
      id: 'dost-multimedia',
      title: 'DOST Scholars Campaign',
      category: 'CAMPAIGN / SOCIAL',
      aspect: 'MULTIMEDIA',
      previewText: 'Regional youth leadership collaterals and scholarship spotlight visual stories across Region VII.'
    },
    {
      id: 'ambient-motion',
      title: 'Interactive 3D Shaders',
      category: 'CREATIVE CODE',
      aspect: 'WEBGL / THREE.JS',
      previewText: 'Real-time raymarching experiments, iridescent crystal physics, and generative audio-reactive surfaces.'
    }
  ]
};

// Re-export individually for clean modular backward compatibility
export const {
  profile: PROFILE,
  contact: CONTACT,
  about: ABOUT,
  projects: PROJECTS,
  achievements: ACHIEVEMENTS,
  experience: EXPERIENCE,
  techStack: TECH_STACK,
  creativeShowcase: CREATIVE_ITEMS
} = PORTFOLIO_DATA;

export const CREATIVE_EXTERNAL_URL = PORTFOLIO_DATA.contact.creativePortfolio;
