// /public/js/eqSlide.js

/**
 * eqSlide.js
 * ------------
 * 1. Parses raw JSON from data-raw
 * 2. Renders all lines up-front
 * 3. Listens for `playerTick` to highlight current line
 * 4. Emits `eqLineChange` to update sidebar
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize every EQ slide on the page
  document.querySelectorAll('.slide.eq-slide[data-raw]').forEach(initEqSlide);

  // Listen for the global clock event to highlight lines
  document.addEventListener('playerTick', e => {
    const t = e.detail.currentTime;
    document.querySelectorAll('.slide.eq-slide').forEach(slideEl => {
      highlightEqLine(slideEl, t);
    });
  });
});

function initEqSlide(slideEl) {
  // 1. Parse the JSON payload
  const raw = JSON.parse(slideEl.dataset.raw);

  // 2. Group into steps (main + sidebar)
  const steps = [];
  let current;
  raw.forEach(item => {
    if (item.showAt !== undefined) {
      current = { main: item, sidebar: [] };
      steps.push(current);
    } else if (current) {
      current.sidebar.push(item);
    }
  });

  // Store for tick-time reference
  slideEl._eqSteps = steps;

  // 3. Render all lines (visible by default) and empty sidebar
  slideEl.innerHTML = `
    <div class="eq-lines">
      ${steps.map((step, i) => `
        <div class="eq-line" data-showat="${step.main.showAt}" data-index="${i}">
          <div class="main-content ${step.main.type}">
            ${step.main.content}
          </div>
        </div>
      `).join('')}
    </div>
    <div class="eq-sidebar"></div>
  `;

  // 4. Wire up sidebar updates
  slideEl.addEventListener('eqLineChange', e =>
    updateSidebar(slideEl, e.detail.lineIndex)
  );
}

function highlightEqLine(slideEl, currentTime) {
  const steps = slideEl._eqSteps || [];
  let active = -1;

  // Determine the last step whose showAt ≤ currentTime
  steps.forEach((s, i) => {
    if (currentTime >= s.main.showAt) active = i;
  });

  // Toggle "active" class on each line
  slideEl.querySelectorAll('.eq-line').forEach((lineEl, i) => {
    lineEl.classList.toggle('active', i === active);
  });

  // Fire sidebar update if we have a valid active line
  if (active >= 0) {
    slideEl.dispatchEvent(
      new CustomEvent('eqLineChange', { detail: { lineIndex: active } })
    );
  }
}

function updateSidebar(slideEl, idx) {
  const sidebar = slideEl.querySelector('.eq-sidebar');
  sidebar.innerHTML = '';
  const steps = slideEl._eqSteps || [];
  const step  = steps[idx];
  if (!step) return;

  // Render each sidebar item
  step.sidebar.forEach(item => {
    let el;
    switch (item.type) {
      case 'spHeading':
        el = document.createElement('h3');
        el.textContent = item.content;
        break;
      case 'spText':
        el = document.createElement('p');
        el.textContent = item.content;
        break;
      case 'spMath':
        el = document.createElement('div');
        el.classList.add('spMath');
        el.textContent = item.content;
        break;
      case 'spImage':
        el = document.createElement('div');
        el.classList.add('spImage');
        const img = document.createElement('img');
        img.src = item.content;
        el.appendChild(img);
        break;
      default:
        return;
    }
    sidebar.appendChild(el);
  });
}
