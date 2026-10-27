/**
 * Infinite Tech Stack Marquee Module
 * Renders categorized skill chips and manages infinite looping tracks
 */
import { TECH_STACK } from '../data/portfolioData.js';

export function initTechMarquee() {
  const container = document.getElementById('tech-stack-container');
  if (!container) return;

  container.innerHTML = '';

  TECH_STACK.forEach((group, index) => {
    const groupEl = document.createElement('div');
    groupEl.className = 'stack-group';

    const labelEl = document.createElement('div');
    labelEl.className = 'stack-group-label';
    labelEl.textContent = `// ${group.label}`;
    groupEl.appendChild(labelEl);

    const marqueeWrapper = document.createElement('div');
    marqueeWrapper.className = 'marquee-container';

    const track = document.createElement('div');
    track.className = `marquee-track ${index % 2 === 1 ? 'reverse' : ''}`;

    // Duplicate list 4 times to ensure infinite smooth seamless looping across all viewport widths with -50% translateX
    const fullList = [...group.items, ...group.items, ...group.items, ...group.items];

    fullList.forEach((skill) => {
      const chip = document.createElement('div');
      chip.className = 'tech-chip';
      chip.setAttribute('tabindex', '0');
      chip.setAttribute('data-cursor', 'SKILL');
      chip.innerHTML = `
        <span class="chip-symbol">⟡</span>
        <span class="chip-name">${skill}</span>
      `;
      track.appendChild(chip);
    });

    marqueeWrapper.appendChild(track);
    groupEl.appendChild(marqueeWrapper);
    container.appendChild(groupEl);
  });
}
