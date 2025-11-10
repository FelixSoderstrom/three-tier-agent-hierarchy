/**
 * Gallery JavaScript
 * Attention Mechanism Educational Project
 *
 * Handles workflow gallery filtering, search, and card rendering.
 */

// State management
const state = {
  examples: []
};

// DOM elements
const elements = {
  galleryGrid: null,
  loadingState: null,
  errorState: null
};

/**
 * Initialize the gallery page
 */
async function init() {
  // Cache DOM elements
  cacheElements();

  // Load examples from JSON
  await loadExamples();

  // Initial render
  displayCards(state.examples);
}

/**
 * Cache DOM element references
 */
function cacheElements() {
  elements.galleryGrid = document.getElementById('gallery-grid');
  elements.loadingState = document.getElementById('loading-state');
  elements.errorState = document.getElementById('error-state');
}

/**
 * Load examples from JSON file
 */
async function loadExamples() {
  try {
    const response = await fetch('content/gallery/examples.json');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    state.examples = data.examples || [];

    // Hide loading, show content
    elements.loadingState.classList.add('d-none');
    elements.galleryGrid.classList.remove('d-none');

  } catch (error) {
    console.error('Error loading examples:', error);
    showError();
  }
}

/**
 * Show error state
 */
function showError() {
  elements.loadingState.classList.add('d-none');
  elements.galleryGrid.classList.add('d-none');
  elements.errorState.classList.remove('d-none');
}

/**
 * Display workflow cards in the grid
 */
function displayCards(examples) {
  // Clear existing cards
  elements.galleryGrid.innerHTML = '';

  // Create and append cards
  examples.forEach((example, index) => {
    const card = createWorkflowCard(example, index);
    elements.galleryGrid.appendChild(card);
  });
}

/**
 * Create a workflow card element
 */
function createWorkflowCard(example, index) {
  const card = document.createElement('article');
  card.className = 'workflow-card';
  card.setAttribute('role', 'listitem');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `${example.name} - ${example.complexity} level, ${example.domain} domain. Click for details.`);

  // Card header
  const header = document.createElement('div');
  header.className = 'card-header-section';

  const cardTop = document.createElement('div');
  cardTop.className = 'card-top';

  const title = document.createElement('h3');
  title.className = 'card-title-text';
  title.textContent = example.name;

  const complexityBadge = document.createElement('span');
  complexityBadge.className = `complexity-badge ${example.complexity.toLowerCase()}`;
  complexityBadge.textContent = example.complexity;
  complexityBadge.setAttribute('aria-label', `Complexity: ${example.complexity}`);

  cardTop.appendChild(title);
  cardTop.appendChild(complexityBadge);

  const domainTag = document.createElement('div');
  domainTag.className = 'domain-tag';
  domainTag.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
    <span>${example.domain}</span>
  `;
  domainTag.setAttribute('aria-label', `Domain: ${example.domain}`);

  header.appendChild(cardTop);
  header.appendChild(domainTag);

  // Assemble card
  card.appendChild(header);

  // Add click handler to open modal
  card.addEventListener('click', () => handleCardClick(example));
  card.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(example);
    }
  });

  return card;
}

/**
 * Handle card click - Open workflow detail modal
 */
function handleCardClick(example) {
  openWorkflowModal(example);
}

/**
 * Open workflow detail modal
 */
function openWorkflowModal(example) {
  // Get modal elements
  const modal = document.getElementById('workflowModal');
  const title = document.getElementById('workflowModalTitle');
  const subtitle = document.getElementById('workflowModalSubtitle');
  const description = document.getElementById('workflowDescription');
  const epicFlow = document.getElementById('workflowEpicFlow');
  const agents = document.getElementById('workflowAgents');
  const useCases = document.getElementById('workflowUseCases');
  const closeBtn = document.getElementById('closeWorkflowModalBtn');

  // Populate modal content
  title.textContent = example.name;
  subtitle.textContent = `${example.domain} - ${example.complexity} Level`;
  description.textContent = example.description;

  // Build epic flow
  epicFlow.innerHTML = `
    <div class="modal-epic-flow">
      <div class="modal-epic-item">
        <div class="modal-epic-header">
          <span class="modal-epic-number">1</span>
          <strong>${example.epic1.name}</strong>
        </div>
        <p class="modal-epic-purpose">${example.epic1.purpose}</p>
      </div>
      <div class="modal-epic-arrow" aria-hidden="true">↓</div>
      <div class="modal-epic-item">
        <div class="modal-epic-header">
          <span class="modal-epic-number">2</span>
          <strong>${example.epic2.name}</strong>
        </div>
        <p class="modal-epic-purpose">${example.epic2.purpose}</p>
      </div>
    </div>
  `;

  // Build agents list
  agents.innerHTML = `
    <ul class="modal-list">
      ${example.suggestedAgents.map(agent => `
        <li class="modal-list-item">
          <strong>${agent.role}:</strong> ${agent.responsibility}
        </li>
      `).join('')}
    </ul>
  `;

  // Build use cases list
  useCases.innerHTML = `
    <ul class="modal-list">
      ${example.useCases.map(useCase => `
        <li class="modal-list-item">${useCase}</li>
      `).join('')}
    </ul>
  `;

  // Show modal
  modal.classList.remove('d-none');
  modal.setAttribute('aria-hidden', 'false');

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Set up event listeners
  closeBtn.addEventListener('click', closeWorkflowModal);
  modal.addEventListener('click', handleModalOverlayClick);
  document.addEventListener('keydown', handleModalKeydown);

  // Focus close button
  closeBtn.focus();

  // Announce to screen readers
  announceModalOpen(example.name);
}

/**
 * Close workflow detail modal
 */
function closeWorkflowModal() {
  const modal = document.getElementById('workflowModal');
  const closeBtn = document.getElementById('closeWorkflowModalBtn');

  // Hide modal
  modal.classList.add('d-none');
  modal.setAttribute('aria-hidden', 'true');

  // Restore body scroll
  document.body.style.overflow = '';

  // Remove event listeners
  closeBtn.removeEventListener('click', closeWorkflowModal);
  modal.removeEventListener('click', handleModalOverlayClick);
  document.removeEventListener('keydown', handleModalKeydown);
}

/**
 * Handle modal overlay click
 */
function handleModalOverlayClick(e) {
  const modal = document.getElementById('workflowModal');
  if (e.target === modal) {
    closeWorkflowModal();
  }
}

/**
 * Handle modal keyboard events
 */
function handleModalKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault();
    closeWorkflowModal();
  }
}

/**
 * Announce modal open to screen readers
 */
function announceModalOpen(workflowName) {
  let liveRegion = document.getElementById('modal-live-region');

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'modal-live-region';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }

  liveRegion.textContent = `${workflowName} workflow details opened. Press Escape to close.`;
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', init);
