/**
 * Universal Component Registry
 * Maps each Content Type to:
 * 1. renderPublic: HTML generator for Public Site & Render View (Chrome, Glass, 3D, HUD)
 * 2. renderEditor: Clean, high-density B&W form row generator for Edit View
 * 3. defaultFields: Factory for adding new items
 */

export const COMPONENT_REGISTRY = {
  // 1. Headers (Section Eyebrows, Titles, Decos, Kickers)
  header: {
    name: 'Header & Eyebrow',
    category: 'Typography',
    renderPublic: (item) => {
      const f = item.fields || {};
      let html = '';
      if (f.eyebrow) {
        html += `<div class="eyebrow reveal" data-content-id="${item.id}" data-field="eyebrow">${f.eyebrow}</div>`;
      }
      if (f.decoText) {
        html += `<div class="deco-text" data-content-id="${item.id}" data-field="decoText" style="top: -20px; right: 0;">${f.decoText}</div>`;
      }
      if (f.titleFirst && f.titleLast) {
        html += `
          <div class="hero-kicker" data-content-id="${item.id}" data-field="kicker">${f.kicker || ''}</div>
          <h1 class="hero-name chrome-display-title" data-content-id="${item.id}">
            <span class="chrome-line"><span class="chrome-liquid-text" data-field="titleFirst">${f.titleFirst}</span></span>
            <span class="chrome-line"><span class="chrome-liquid-text" data-field="titleLast">${f.titleLast}</span></span>
            ${f.sparkles ? `
              <svg class="hud-sparkle" style="top: -12px; right: 24%;" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z"/>
              </svg>
              <svg class="hud-sparkle delay-2" style="bottom: 14px; left: 42%;" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0L14 9L23 12L14 15L12 24L10 9Z"/>
              </svg>
            ` : ''}
          </h1>
        `;
      } else if (f.title) {
        html += `
          <h2 class="reveal" data-content-id="${item.id}" style="font-size: clamp(34px, 4.5vw, 60px); margin-bottom: 12px;">
            <span data-field="title">${f.title}</span>
            ${f.teaserTag ? `<span class="mono-tag" style="vertical-align: middle;">${f.teaserTag}</span>` : ''}
          </h2>
        `;
      }
      if (f.lead) {
        html += `<p class="reveal" data-content-id="${item.id}" data-field="lead" style="max-width: 680px; margin-bottom: 24px;">${f.lead}</p>`;
      }
      return html;
    },
    renderEditor: (item, actions) => {
      return renderGenericEditorRow({
        item,
        title: item.fields.title || item.fields.eyebrow || 'Section Header',
        typeLabel: 'HEADER',
        fields: [
          { key: 'eyebrow', label: 'Eyebrow Text', type: 'text' },
          { key: 'title', label: 'Headline Title', type: 'text' },
          { key: 'decoText', label: 'Deco / Index Text', type: 'text' },
          { key: 'kicker', label: 'Kicker Text', type: 'text' },
          { key: 'lead', label: 'Lead Paragraph', type: 'textarea' }
        ],
        actions
      });
    },
    defaultFields: () => ({
      eyebrow: 'NEW SECTION',
      decoText: '00//',
      lead: 'Short introductory description for this section.'
    })
  },

  // 2. Text Blocks (Ghost Typography, Marginalia, Bio Paragraphs)
  text_block: {
    name: 'Text Block',
    category: 'Typography',
    renderPublic: (item) => {
      const f = item.fields || {};
      const v = f.variant;
      if (v === 'ghost-outline') {
        return `<div class="ghost-outline-type" aria-hidden="true" data-content-id="${item.id}">${(f.text || '').replace(/\n/g, '<br />')}</div>`;
      }
      if (v === 'marginalia') {
        return `<div class="vertical-marginalia" aria-hidden="true" data-content-id="${item.id}">${f.text || ''}</div>`;
      }
      if (v === 'hero-subline') {
        return `<p class="hero-subline" data-content-id="${item.id}" data-field="text">${f.text || ''}</p>`;
      }
      if (v === 'about-lead') {
        return `
          ${f.badge ? `<div class="hud-serial-badge" style="margin-bottom: 20px;"><span>${f.badge}</span></div>` : ''}
          <p class="about-lead" data-content-id="${item.id}" data-field="text">${f.text || ''}</p>
        `;
      }
      if (v === 'about-body') {
        return `<p class="about-body" data-content-id="${item.id}" data-field="text">${f.text || ''}</p>`;
      }
      return `<p class="reveal" data-content-id="${item.id}" data-field="text">${f.text || ''}</p>`;
    },
    renderEditor: (item, actions) => {
      return renderGenericEditorRow({
        item,
        title: (item.fields.text || 'Text Block').slice(0, 40) + '...',
        typeLabel: `TEXT [${item.fields.variant || 'standard'}]`,
        fields: [
          { key: 'text', label: 'Content Text', type: 'textarea', required: true },
          { key: 'badge', label: 'Serial Badge (Optional)', type: 'text' }
        ],
        actions
      });
    },
    defaultFields: () => ({
      variant: 'paragraph',
      text: 'Content description paragraph.'
    })
  },

  // 3. Project Cards (Work Matrix)
  project_card: {
    name: 'Project Card',
    category: 'Work',
    renderPublic: (item) => {
      const f = item.fields || {};
      const tags = f.tags || [];
      return `
        <article class="project-card hud-frame" data-content-id="${item.id}" data-detail-type="projects" data-detail-id="${item.id}" data-cursor="view" data-tilt>
          <div class="hud-bracket hud-bracket-tl" aria-hidden="true"></div>
          <div class="hud-bracket hud-bracket-tr" aria-hidden="true"></div>
          <div class="hud-bracket hud-bracket-bl" aria-hidden="true"></div>
          <div class="hud-bracket hud-bracket-br" aria-hidden="true"></div>
          <div class="project-card-header">
            <div class="project-card-kicker" data-field="kicker">${f.kicker || ''}</div>
            <h3 class="project-card-title" data-field="name">${f.name || ''}</h3>
          </div>
          <p class="project-card-lead" data-field="lead">${f.lead || ''}</p>
          <div class="project-card-footer">
            <div class="project-tags">
              ${tags.map(t => `<span class="p-tag">${t}</span>`).join('')}
            </div>
            <button class="project-arrow-btn" type="button" aria-label="View specifications for ${f.name || ''}">
              <span>SPECS</span> <span class="arrow-glyph">→</span>
            </button>
          </div>
        </article>
      `;
    },
    renderEditor: (item, actions) => {
      return renderGenericEditorRow({
        item,
        title: item.fields.name || 'Untitled Project',
        typeLabel: 'PROJECT CARD',
        fields: [
          { key: 'name', label: 'Project Name', type: 'text', required: true },
          { key: 'kicker', label: 'Architecture Kicker', type: 'text', required: true },
          { key: 'lead', label: 'Short Lead Description', type: 'textarea', required: true },
          { key: 'tags', label: 'Tech Tags (comma-separated)', type: 'tags' },
          { key: 'repoUrl', label: 'Repository URL', type: 'url' },
          { key: 'liveUrl', label: 'Live Application URL', type: 'url' },
          { key: 'takeaway.title', label: 'Architecture Takeaway Title', type: 'text' },
          { key: 'takeaway.body', label: 'Architecture Takeaway Summary', type: 'textarea' }
        ],
        actions
      });
    },
    defaultFields: () => ({
      name: 'New Project',
      kicker: 'MODULAR ARCHITECTURE',
      lead: 'Short overview of application architecture, offline caching, and responsive interfaces.',
      tags: ['TypeScript', 'Architecture', 'Web'],
      repoUrl: 'https://github.com/Ricksmer',
      liveUrl: '',
      images: 2,
      body: ['Comprehensive breakdown of engineering architecture and design decisions.'],
      takeaway: {
        title: '// KEY TAKEAWAY & ARCHITECTURE',
        body: 'Strict state decoupling, defensive runtime validation, and responsive micro-interactions.'
      }
    })
  },

  // 4. Record / Achievement Cards (Trophy Chronicle)
  record_card: {
    name: 'Achievement Card',
    category: 'Awards',
    renderPublic: (item) => {
      const f = item.fields || {};
      return `
        <div class="achievement-card hud-frame" data-content-id="${item.id}" data-detail-type="achievements" data-detail-id="${item.id}" data-cursor="view" data-tilt>
          <div class="hud-bracket hud-bracket-tl" aria-hidden="true"></div>
          <div class="hud-bracket hud-bracket-tr" aria-hidden="true"></div>
          <div class="hud-bracket hud-bracket-bl" aria-hidden="true"></div>
          <div class="hud-bracket hud-bracket-br" aria-hidden="true"></div>
          <div class="ach-card-top">
            <div class="ach-serial-row">
              <span class="ach-year" data-field="year">${f.year || ''}</span>
              <span class="ach-index-tag">[${f.honorIndex || 'HONOR'}]</span>
            </div>
            <div class="ach-tag" data-field="tag">${f.tag || ''}</div>
            <h4 class="ach-title" data-field="title">${f.title || ''}</h4>
          </div>
          <div class="ach-card-bottom">
            <div class="ach-meta" data-field="meta">${f.meta || ''}</div>
            <div class="ach-footer-row">
              <span class="project-arrow-btn">
                <span>SPECS</span> <span class="arrow-glyph">→</span>
              </span>
            </div>
          </div>
        </div>
      `;
    },
    renderEditor: (item, actions) => {
      return renderGenericEditorRow({
        item,
        title: `${item.fields.year || ''} — ${item.fields.title || 'Untitled Achievement'}`,
        typeLabel: 'ACHIEVEMENT CARD',
        fields: [
          { key: 'year', label: 'Year / Period', type: 'text', required: true },
          { key: 'honorIndex', label: 'Index Badge (e.g. HONOR // 01)', type: 'text' },
          { key: 'tag', label: 'Category / Standing Tag', type: 'text', required: true },
          { key: 'title', label: 'Challenge / Award Title', type: 'text', required: true },
          { key: 'meta', label: 'Team / Institution Details', type: 'text' }
        ],
        actions
      });
    },
    defaultFields: () => ({
      year: '2026',
      honorIndex: 'HONOR // 00',
      tag: 'AWARD — FINALIST',
      title: 'Technical Competition',
      meta: 'Team · Institution · Challenge Track',
      images: 1,
      body: ['Description of challenge milestones and engineering benchmarks.']
    })
  },

  // 5. Experience Entry (Command Log)
  experience_entry: {
    name: 'Experience Entry',
    category: 'Experience',
    renderPublic: (item) => {
      const f = item.fields || {};
      return `
        <div class="experience-item hud-frame" data-content-id="${item.id}" data-detail-type="experience" data-detail-id="${item.id}" data-cursor="view" data-tilt>
          <div class="hud-bracket hud-bracket-tl" aria-hidden="true"></div>
          <div class="hud-bracket hud-bracket-tr" aria-hidden="true"></div>
          <div class="hud-bracket hud-bracket-bl" aria-hidden="true"></div>
          <div class="hud-bracket hud-bracket-br" aria-hidden="true"></div>
          <div class="exp-role-block">
            <div class="exp-badge">${f.badge || '// LOG // LEADERSHIP'}</div>
            <h4 class="exp-role" data-field="role">${f.role || ''}</h4>
            <div class="exp-org" data-field="org">${f.org || ''}</div>
          </div>
          <div class="exp-side-actions">
            <div class="exp-period" data-field="period">${f.period || ''}</div>
            <button class="project-arrow-btn" type="button" aria-label="View record for ${f.role || ''}">
              <span>DOSSIER</span> <span class="arrow-glyph">→</span>
            </button>
          </div>
        </div>
      `;
    },
    renderEditor: (item, actions) => {
      return renderGenericEditorRow({
        item,
        title: `${item.fields.role || 'Role'} @ ${item.fields.org || 'Organization'}`,
        typeLabel: 'EXPERIENCE ENTRY',
        fields: [
          { key: 'role', label: 'Executive Role / Position', type: 'text', required: true },
          { key: 'org', label: 'Organization / Company', type: 'text', required: true },
          { key: 'period', label: 'Active Period (e.g. 2026 – Present)', type: 'text', required: true },
          { key: 'badge', label: 'Serial Log Badge', type: 'text' }
        ],
        actions
      });
    },
    defaultFields: () => ({
      role: 'Lead Developer & Designer',
      org: 'Engineering Organization',
      period: '2026 – Present',
      badge: 'LOG // 00 — LEADERSHIP',
      images: 2,
      body: ['Executive leadership overview and deliverables.']
    })
  },

  // 6. Credential List (Honors & Leadership Roles Cards)
  credential_list: {
    name: 'Credential List',
    category: 'About',
    renderPublic: (item) => {
      const f = item.fields || {};
      const items = f.items || [];
      return `
        <div class="credential-card hud-frame" data-content-id="${item.id}" data-tilt>
          <div class="hud-bracket hud-bracket-tl" aria-hidden="true"></div>
          <div class="hud-bracket hud-bracket-tr" aria-hidden="true"></div>
          <div class="hud-bracket hud-bracket-bl" aria-hidden="true"></div>
          <div class="hud-bracket hud-bracket-br" aria-hidden="true"></div>
          <div class="cred-title">${f.categoryTitle || '// CREDENTIALS'}</div>
          <ul class="cred-sentence-list">
            ${items.map(it => `<li class="cred-sentence-item" data-item-id="${it.id}">${it.text}</li>`).join('')}
          </ul>
        </div>
      `;
    },
    renderEditor: (item, actions) => {
      return renderGenericEditorRow({
        item,
        title: item.fields.categoryTitle || 'Credential List',
        typeLabel: 'CREDENTIAL LIST',
        fields: [
          { key: 'categoryTitle', label: 'List Title', type: 'text', required: true },
          { key: 'itemsList', label: 'Items (One per line)', type: 'textarea' }
        ],
        beforeSave: (formData) => {
          if (formData.itemsList) {
            formData.items = formData.itemsList.split('\n').filter(Boolean).map((line, idx) => ({
              id: `item-${idx + 1}`,
              text: line.trim()
            }));
            delete formData.itemsList;
          }
        },
        afterLoad: (fields) => {
          return {
            ...fields,
            itemsList: (fields.items || []).map(i => i.text).join('\n')
          };
        },
        actions
      });
    },
    defaultFields: () => ({
      categoryTitle: '// CREDENTIALS',
      items: [
        { id: 'c-1', text: 'Recognized achievement credential.' }
      ]
    })
  },

  // 7. Focus Chip Group (Currently Exploring)
  focus_chip_group: {
    name: 'Focus Chip Group',
    category: 'About',
    renderPublic: (item) => {
      const f = item.fields || {};
      const chips = f.chips || [];
      return `
        <div class="explore-section" data-content-id="${item.id}">
          <div class="explore-label">${f.label || '// CURRENTLY EXPLORING'}</div>
          <div class="explore-chips">
            ${chips.map(c => `
              <div class="explore-chip" tabindex="0" data-tilt>
                <b>${c.title}</b>
                <small>${c.desc}</small>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },
    renderEditor: (item, actions) => {
      return renderGenericEditorRow({
        item,
        title: item.fields.label || 'Focus Areas',
        typeLabel: 'FOCUS GROUP',
        fields: [
          { key: 'label', label: 'Section Label', type: 'text', required: true },
          { key: 'chipsText', label: 'Chips (Format: Title | Description)', type: 'textarea' }
        ],
        beforeSave: (formData) => {
          if (formData.chipsText) {
            formData.chips = formData.chipsText.split('\n').filter(Boolean).map((line, idx) => {
              const [title, desc] = line.split('|');
              return {
                id: `chip-${idx + 1}`,
                title: (title || '').trim(),
                desc: (desc || '').trim(),
                tag: `SPEC-0${idx + 1}`
              };
            });
            delete formData.chipsText;
          }
        },
        afterLoad: (fields) => {
          return {
            ...fields,
            chipsText: (fields.chips || []).map(c => `${c.title} | ${c.desc}`).join('\n')
          };
        },
        actions
      });
    },
    defaultFields: () => ({
      label: '// CURRENTLY EXPLORING',
      chips: [
        { id: 'chip-1', title: 'Architecture', desc: 'Design systems and clean code', tag: 'SPEC-01' }
      ]
    })
  },

  // 8. Contact Cluster (Liquid Chrome Orb & Popout Arc)
  contact_cluster: {
    name: 'Contact Cluster & Orb',
    category: 'Contact',
    renderPublic: (item) => {
      const f = item.fields || {};
      return `
        <div class="sayhi-wrapper" data-content-id="${item.id}">
          <div class="sayhi-container" id="sayhi-container" tabindex="0">
            <div class="sayhi-hitbox-bridge"></div>
            <div class="chrome-orb" id="sayhi-orb" data-cursor="hello">
              <span class="orb-label">${(f.orbLabel || 'SAY HI').replace(' ', '<br />')}</span>
            </div>
            <div class="arc-contacts" aria-label="Contact Links">
              <a class="contact-pill pill-email" href="${f.email || 'mailto:ricksmer.cabatingan@cit.edu'}">
                <span class="pill-icon">✉</span> Email
              </a>
              <a class="contact-pill pill-github" href="${f.github || 'https://github.com/Ricksmer'}" target="_blank" rel="noopener">
                <span class="pill-icon">⟡</span> GitHub
              </a>
              <a class="contact-pill pill-call" href="${f.phone || 'tel:+639429560278'}">
                <span class="pill-icon">☎</span> Call
              </a>
            </div>
          </div>
        </div>
      `;
    },
    renderEditor: (item, actions) => {
      return renderGenericEditorRow({
        item,
        title: 'Say Hi Orb & Contacts',
        typeLabel: 'CONTACT CLUSTER',
        fields: [
          { key: 'orbLabel', label: 'Orb Inscription', type: 'text', required: true },
          { key: 'email', label: 'Email Destination (mailto:...)', type: 'text', required: true },
          { key: 'github', label: 'GitHub URL', type: 'url', required: true },
          { key: 'phone', label: 'Phone Destination (tel:...)', type: 'text', required: true },
          { key: 'creativePortfolio', label: 'Creative Portfolio URL', type: 'url' }
        ],
        actions
      });
    },
    defaultFields: () => ({
      orbLabel: 'SAY HI',
      email: 'mailto:ricksmer.cabatingan@cit.edu',
      github: 'https://github.com/Ricksmer',
      phone: 'tel:+639429560278'
    })
  },

  // 9. Stack Category (Infinite Marquee Tracks)
  stack_category: {
    name: 'Stack Category',
    category: 'Stack',
    renderPublic: (item) => {
      const f = item.fields || {};
      const items = f.items || [];
      const quadList = [...items, ...items, ...items, ...items];
      return `
        <div class="stack-group" data-content-id="${item.id}">
          <div class="stack-group-label">// ${f.label || ''} [${f.code || ''}]</div>
          <div class="marquee-container">
            <div class="marquee-track ${f.reverse ? 'reverse' : ''}">
              ${quadList.map(skill => `
                <div class="tech-chip" tabindex="0" data-cursor="SKILL">
                  <span class="chip-symbol">⟡</span>
                  <span class="chip-name">${skill}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    },
    renderEditor: (item, actions) => {
      return renderGenericEditorRow({
        item,
        title: item.fields.label || 'Stack Category',
        typeLabel: 'STACK TRACK',
        fields: [
          { key: 'label', label: 'Category Label', type: 'text', required: true },
          { key: 'code', label: 'Sub-Category Tag (e.g. LANG // 01)', type: 'text' },
          { key: 'itemsCsv', label: 'Items (Comma separated)', type: 'textarea' },
          { key: 'reverse', label: 'Reverse Direction', type: 'checkbox' }
        ],
        beforeSave: (formData) => {
          if (formData.itemsCsv) {
            formData.items = formData.itemsCsv.split(',').map(s => s.trim()).filter(Boolean);
            delete formData.itemsCsv;
          }
        },
        afterLoad: (fields) => {
          return {
            ...fields,
            itemsCsv: (fields.items || []).join(', ')
          };
        },
        actions
      });
    },
    defaultFields: () => ({
      label: 'PROGRAMMING & TOOLS',
      code: 'TECH // 00',
      reverse: false,
      items: ['JavaScript', 'TypeScript', 'Node.js']
    })
  },

  // 10. Creative Showcase (3D Coverflow Arc)
  creative_showcase: {
    name: 'Creative Showcase Arc',
    category: 'More',
    renderPublic: (item) => {
      return `
        <div class="arc-stage" tabindex="0" data-content-id="${item.id}">
          <div class="arc-track" id="arc-carousel-track"></div>
        </div>
        <div class="arc-controls reveal">
          <button class="arc-nav-btn" id="arc-prev-btn" aria-label="Previous Project">←</button>
          <span class="arc-counter" id="arc-counter">01 / 06</span>
          <button class="arc-nav-btn" id="arc-next-btn" aria-label="Next Project">→</button>
        </div>
      `;
    },
    renderEditor: (item, actions) => {
      const items = item.fields.items || [];
      return renderGenericEditorRow({
        item,
        title: `Creative Arc (${items.length} cards)`,
        typeLabel: 'CREATIVE ARC',
        fields: [
          { key: 'itemsJson', label: 'Cards (JSON Array)', type: 'textarea' }
        ],
        beforeSave: (formData) => {
          try {
            if (formData.itemsJson) {
              formData.items = JSON.parse(formData.itemsJson);
              delete formData.itemsJson;
            }
          } catch (e) {
            alert('Invalid JSON in cards list');
          }
        },
        afterLoad: (fields) => {
          return {
            ...fields,
            itemsJson: JSON.stringify(fields.items || [], null, 2)
          };
        },
        actions
      });
    },
    defaultFields: () => ({
      items: [
        {
          id: 'item-1',
          title: 'Brand System',
          category: 'BRAND IDENTITY',
          aspect: 'SYSTEM',
          archiveIndex: 'ARCHIVE // 01',
          previewText: 'Keynote and brand architecture system.'
        }
      ]
    })
  },

  // 11. Link Button
  link_button: {
    name: 'Action Link Button',
    category: 'Navigation',
    renderPublic: (item) => {
      const f = item.fields || {};
      return `
        <div class="reveal" style="margin-bottom: 28px;" data-content-id="${item.id}">
          <a class="pill" id="creative-portfolio-external-link" href="${f.url || '#'}" target="${f.target || '_self'}" rel="noopener">
            ${f.kicker ? `<span class="k">${f.kicker}</span>` : ''}${f.label || 'LINK →'}
          </a>
        </div>
      `;
    },
    renderEditor: (item, actions) => {
      return renderGenericEditorRow({
        item,
        title: item.fields.label || 'Button',
        typeLabel: 'LINK BUTTON',
        fields: [
          { key: 'label', label: 'Button Label', type: 'text', required: true },
          { key: 'kicker', label: 'Button Kicker Tag', type: 'text' },
          { key: 'url', label: 'Destination Address', type: 'url', required: true },
          { key: 'target', label: 'Target (_blank / _self)', type: 'text' }
        ],
        actions
      });
    },
    defaultFields: () => ({
      label: 'ACTION BUTTON →',
      kicker: 'NAV',
      url: 'https://github.com/Ricksmer',
      target: '_blank'
    })
  },

  // 12. Editorial Stamp
  editorial_stamp: {
    name: 'Technical Barcode Stamp',
    category: 'Decorative',
    renderPublic: (item) => {
      const f = item.fields || {};
      return `
        <div class="editorial-stamp" style="margin-bottom: 16px;" data-content-id="${item.id}">
          <div class="hud-serial-badge">
            <div class="hud-barcode" aria-hidden="true">
              <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <span>${f.serial || 'SN: RC-052-2026'}</span>
          </div>
          <span class="stamp-meta">${f.meta || '01/7 // REFRACTIONS &! PRISM'}</span>
          <span class="stamp-pill">${f.pill || 'CRYSTAL CLEAR'}</span>
        </div>
      `;
    },
    renderEditor: (item, actions) => {
      return renderGenericEditorRow({
        item,
        title: item.fields.serial || 'Barcode Stamp',
        typeLabel: 'EDITORIAL STAMP',
        fields: [
          { key: 'serial', label: 'Serial Number', type: 'text', required: true },
          { key: 'meta', label: 'Meta Tag', type: 'text' },
          { key: 'pill', label: 'Pill Label', type: 'text' }
        ],
        actions
      });
    },
    defaultFields: () => ({
      serial: 'SN: RC-052-2026',
      meta: '01/7 // REFRACTIONS &! PRISM',
      pill: 'CRYSTAL CLEAR'
    })
  },

  // 13. Profile Meta
  profile_meta: {
    name: 'Profile Metadata',
    category: 'Identity',
    renderPublic: (item) => {
      const f = item.fields || {};
      return `
        <div class="hero-meta" data-content-id="${item.id}">
          ${f.role ? `<div>ROLE: <span>${f.role}</span></div>` : ''}
          ${f.based ? `<div>BASED: <span>${f.based}</span></div>` : ''}
          ${f.coordinates ? `<div class="hud-crosshair">${f.coordinates}</div>` : ''}
        </div>
      `;
    },
    renderEditor: (item, actions) => {
      return renderGenericEditorRow({
        item,
        title: 'Hero Metadata & Coordinates',
        typeLabel: 'PROFILE META',
        fields: [
          { key: 'role', label: 'Current Role', type: 'text' },
          { key: 'based', label: 'Location Base', type: 'text' },
          { key: 'coordinates', label: 'Geo Coordinates', type: 'text' }
        ],
        actions
      });
    },
    defaultFields: () => ({
      role: 'Software Engineer',
      based: 'Cebu City, Philippines',
      coordinates: "10°18'N 123°53'E"
    })
  }
};

/**
 * Helper to construct a clean, high-density, strictly black & white modular item row for Edit View
 */
function renderGenericEditorRow({ item, title, typeLabel, fields, beforeSave, afterLoad, actions }) {
  const row = document.createElement('div');
  row.className = `editor-item-card ${item.visible === false ? 'is-hidden' : ''}`;
  row.setAttribute('data-item-id', item.id);
  row.setAttribute('data-item-type', item.type);

  // Initial field data
  let fieldData = JSON.parse(JSON.stringify(item.fields || {}));
  if (afterLoad) fieldData = afterLoad(fieldData);

  row.innerHTML = `
    <div class="editor-item-header">
      <div class="editor-item-left">
        <span class="editor-drag-grip" title="Drag to reorder" aria-label="Reorder handle">⋮⋮</span>
        <span class="editor-type-badge">${typeLabel}</span>
        <span class="editor-item-title">${escapeHtml(title)}</span>
      </div>
      <div class="editor-item-actions">
        <button type="button" class="editor-btn btn-visibility" title="${item.visible === false ? 'Show on public site' : 'Hide from public site'}">
          ${item.visible === false ? 'Hidden' : 'Visible'}
        </button>
        <button type="button" class="editor-btn btn-duplicate" title="Duplicate item">Copy</button>
        <button type="button" class="editor-btn btn-delete" title="Delete item">Delete</button>
        <button type="button" class="editor-btn btn-expand" title="Expand / collapse">Expand</button>
      </div>
    </div>
    <div class="editor-item-body">
      <form class="editor-inline-form">
        <div class="editor-form-grid">
          ${fields.map(f => {
            const val = getNestedValue(fieldData, f.key) || '';
            if (f.type === 'textarea') {
              return `
                <div class="editor-field-group col-span-2">
                  <label class="editor-label">${f.label}${f.required ? ' *' : ''}</label>
                  <textarea class="editor-input editor-textarea" name="${f.key}" ${f.required ? 'required' : ''}>${escapeHtml(val)}</textarea>
                </div>
              `;
            }
            if (f.type === 'checkbox') {
              return `
                <div class="editor-field-group">
                  <label class="editor-label-checkbox">
                    <input type="checkbox" name="${f.key}" ${val ? 'checked' : ''} />
                    <span>${f.label}</span>
                  </label>
                </div>
              `;
            }
            return `
              <div class="editor-field-group">
                <label class="editor-label">${f.label}${f.required ? ' *' : ''}</label>
                <input type="${f.type || 'text'}" class="editor-input" name="${f.key}" value="${escapeHtml(val)}" ${f.required ? 'required' : ''} />
              </div>
            `;
          }).join('')}
        </div>
      </form>
    </div>
  `;

  // Hook form input changes
  const form = row.querySelector('.editor-inline-form');
  const header = row.querySelector('.editor-item-header');
  const body = row.querySelector('.editor-item-body');

  header.addEventListener('click', (e) => {
    if (e.target.closest('.editor-btn, .editor-drag-grip')) return;
    row.classList.toggle('is-expanded');
    const expandBtn = row.querySelector('.btn-expand');
    if (expandBtn) expandBtn.textContent = row.classList.contains('is-expanded') ? 'Collapse' : 'Expand';
  });

  const expandBtn = row.querySelector('.btn-expand');
  expandBtn.addEventListener('click', () => {
    row.classList.toggle('is-expanded');
    expandBtn.textContent = row.classList.contains('is-expanded') ? 'Collapse' : 'Expand';
  });

  // Action listeners
  row.querySelector('.btn-visibility').addEventListener('click', () => {
    if (actions.toggleVisibility) actions.toggleVisibility(item.id);
  });

  row.querySelector('.btn-duplicate').addEventListener('click', () => {
    if (actions.duplicate) actions.duplicate(item.id);
  });

  row.querySelector('.btn-delete').addEventListener('click', () => {
    if (confirm(`Delete "${title}"? This can be undone with Ctrl+Z.`)) {
      if (actions.remove) actions.remove(item.id);
    }
  });

  // Collect form updates on input change with debounce
  let updateTimer = null;
  form.addEventListener('input', () => {
    clearTimeout(updateTimer);
    updateTimer = setTimeout(() => {
      const formData = new FormData(form);
      const newFields = {};
      for (const [key, value] of formData.entries()) {
        setNestedValue(newFields, key, value);
      }
      fields.forEach(f => {
        if (f.type === 'checkbox') {
          const input = form.querySelector(`[name="${f.key}"]`);
          setNestedValue(newFields, f.key, input ? input.checked : false);
        } else if (f.type === 'tags') {
          const input = form.querySelector(`[name="${f.key}"]`);
          if (input) {
            const tags = input.value.split(',').map(t => t.trim()).filter(Boolean);
            setNestedValue(newFields, f.key, tags);
          }
        }
      });
      if (beforeSave) beforeSave(newFields);
      if (actions.updateFields) actions.updateFields(item.id, newFields);
    }, 250);
  });

  return row;
}

function getNestedValue(obj, path) {
  if (!obj) return '';
  const parts = path.split('.');
  let curr = obj;
  for (const p of parts) {
    if (curr === undefined || curr === null) return '';
    curr = curr[p];
  }
  return curr;
}

function setNestedValue(obj, path, value) {
  const parts = path.split('.');
  let curr = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!curr[parts[i]]) curr[parts[i]] = {};
    curr = curr[parts[i]];
  }
  curr[parts[parts.length - 1]] = value;
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str || '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
