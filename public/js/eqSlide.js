
// /public/js/eqSlide.js

// Initialize all EQ slides once the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.eq-slide[data-raw]').forEach(initEqSlide);
  });
  
  /**
   * Turns a flat list of lines and sidebar items into grouped steps,
   * renders left-hand lines and sets up sidebar updates.
   */
  function initEqSlide(slideEl) {
    // parse the raw flat data
    const raw = JSON.parse(slideEl.dataset.raw);
  
    // group into steps: each new item with showAt begins a step
    const steps = [];
    let currentStep = null;
  
    raw.forEach(item => {
      if (item.showAt !== undefined) {
        currentStep = { main: item, sidebar: [] };
        steps.push(currentStep);
      } else if (currentStep) {
        currentStep.sidebar.push(item);
      }
    });
  
    // render main lines
    const linesContainer = slideEl.querySelector('.eq-lines');
    linesContainer.innerHTML = '';
    steps.forEach((step, idx) => {
      const lineDiv = document.createElement('div');
      lineDiv.classList.add('eq-line');
      lineDiv.dataset.index = idx;
      lineDiv.dataset.showat = step.main.showAt;
      lineDiv.dataset.spitems = JSON.stringify(step.sidebar);
      lineDiv.innerHTML = `<pre class="eq-content">${step.main.content}</pre>`;
      linesContainer.appendChild(lineDiv);
    });
  
    // render initial sidebar
    updateSidebar(slideEl, 0);
  
    // listen for a custom event to swap sidebar content
    slideEl.addEventListener('eqLineChange', e => {
      updateSidebar(slideEl, e.detail.lineIndex);
    });
  }
  
  /**
   * Clears and renders sidebar items for the given slide and line index.
   */
  function updateSidebar(slideEl, lineIndex) {
    const sidebar = slideEl.querySelector('.eq-sidebar');
    sidebar.innerHTML = '';
  
    const lines = slideEl.querySelectorAll('.eq-line');
    const lineEl = lines[lineIndex];
    if (!lineEl) return;
  
    const spItems = JSON.parse(lineEl.dataset.spitems || '[]');
    spItems.forEach(item => {
      let el;
      switch(item.type) {
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
  