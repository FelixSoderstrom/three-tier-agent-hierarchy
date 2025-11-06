/**
 * Gallery JavaScript
 * Attention Mechanism Educational Project
 *
 * Handles workflow gallery filtering, search, and card rendering.
 */

// State management
const state = {
  examples: [],
  filteredExamples: [],
  filters: {
    domain: 'all',
    complexity: 'all',
    search: ''
  }
};

// DOM elements
const elements = {
  galleryGrid: null,
  loadingState: null,
  errorState: null,
  emptyState: null,
  resultsCount: null,
  searchInput: null,
  domainFilter: null,
  complexityFilter: null,
  clearFiltersBtn: null
};

/**
 * Initialize the gallery page
 */
async function init() {
  // Cache DOM elements
  cacheElements();

  // Set up event listeners
  setupEventListeners();

  // Load examples from JSON
  await loadExamples();

  // Initial render
  updateGrid();
}

/**
 * Cache DOM element references
 */
function cacheElements() {
  elements.galleryGrid = document.getElementById('gallery-grid');
  elements.loadingState = document.getElementById('loading-state');
  elements.errorState = document.getElementById('error-state');
  elements.emptyState = document.getElementById('empty-state');
  elements.resultsCount = document.getElementById('results-count');
  elements.searchInput = document.getElementById('search-input');
  elements.domainFilter = document.getElementById('domain-filter');
  elements.complexityFilter = document.getElementById('complexity-filter');
  elements.clearFiltersBtn = document.getElementById('clear-filters');
}

/**
 * Set up event listeners for filters
 */
function setupEventListeners() {
  // Search input with debounce
  let searchTimeout;
  elements.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.filters.search = e.target.value.toLowerCase().trim();
      updateGrid();
    }, 300);
  });

  // Domain filter
  elements.domainFilter.addEventListener('change', (e) => {
    state.filters.domain = e.target.value;
    updateGrid();
  });

  // Complexity filter
  elements.complexityFilter.addEventListener('change', (e) => {
    state.filters.complexity = e.target.value;
    updateGrid();
  });

  // Clear filters button
  elements.clearFiltersBtn.addEventListener('click', clearFilters);

  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
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
    state.filteredExamples = [...state.examples];

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
  elements.resultsCount.textContent = 'Error loading examples';
}

/**
 * Filter examples based on current filter state
 */
function filterExamples() {
  state.filteredExamples = state.examples.filter(example => {
    // Domain filter
    if (state.filters.domain !== 'all' && example.domain !== state.filters.domain) {
      return false;
    }

    // Complexity filter
    if (state.filters.complexity !== 'all' && example.complexity !== state.filters.complexity) {
      return false;
    }

    // Search filter (name and description)
    if (state.filters.search) {
      const searchLower = state.filters.search;
      const nameMatch = example.name.toLowerCase().includes(searchLower);
      const descMatch = example.description.toLowerCase().includes(searchLower);
      const domainMatch = example.domain.toLowerCase().includes(searchLower);

      if (!nameMatch && !descMatch && !domainMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Update the gallery grid display
 */
function updateGrid() {
  // Filter examples
  filterExamples();

  // Update results count
  updateResultsCount();

  // Check for empty results
  if (state.filteredExamples.length === 0) {
    showEmptyState();
    return;
  }

  // Hide empty state
  elements.emptyState.classList.add('d-none');
  elements.galleryGrid.classList.remove('d-none');

  // Render cards
  displayCards(state.filteredExamples);

  // Announce to screen readers
  announceResults();
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
  card.setAttribute('aria-label', `${example.name} - ${example.complexity} level, ${example.domain} domain`);

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

  // Description
  const description = document.createElement('p');
  description.className = 'card-description';
  description.textContent = example.description;

  // Epic flow
  const epicFlow = createEpicFlow(example);

  // Agents section
  const agentsSection = createAgentsSection(example);

  // Use cases section
  const useCasesSection = createUseCasesSection(example);

  // Assemble card
  card.appendChild(header);
  card.appendChild(description);
  card.appendChild(epicFlow);
  card.appendChild(agentsSection);
  card.appendChild(useCasesSection);

  // Add click handler for potential future expansion
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
 * Create epic flow section
 */
function createEpicFlow(example) {
  const epicFlow = document.createElement('div');
  epicFlow.className = 'epic-flow';

  // Epic 1
  const epic1 = document.createElement('div');
  epic1.className = 'epic-item';
  epic1.innerHTML = `
    <div class="epic-title">
      <span class="epic-number">1</span>
      ${example.epic1.name}
    </div>
    <div class="epic-purpose">${example.epic1.purpose}</div>
  `;

  // Arrow
  const arrow = document.createElement('div');
  arrow.className = 'epic-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↓';

  // Epic 2
  const epic2 = document.createElement('div');
  epic2.className = 'epic-item';
  epic2.innerHTML = `
    <div class="epic-title">
      <span class="epic-number">2</span>
      ${example.epic2.name}
    </div>
    <div class="epic-purpose">${example.epic2.purpose}</div>
  `;

  epicFlow.appendChild(epic1);
  epicFlow.appendChild(arrow);
  epicFlow.appendChild(epic2);

  return epicFlow;
}

/**
 * Create agents section
 */
function createAgentsSection(example) {
  const section = document.createElement('div');
  section.className = 'agents-section';

  const title = document.createElement('h4');
  title.className = 'agents-title';
  title.textContent = 'Suggested Agents:';

  const list = document.createElement('ul');
  list.className = 'agents-list';

  // Limit to first 3-4 agents as specified
  const agentsToShow = example.suggestedAgents.slice(0, 4);

  agentsToShow.forEach(agent => {
    const item = document.createElement('li');
    item.className = 'agent-item';
    item.innerHTML = `
      <span class="agent-role">${agent.role}</span> - ${agent.responsibility}
    `;
    list.appendChild(item);
  });

  section.appendChild(title);
  section.appendChild(list);

  return section;
}

/**
 * Create use cases section
 */
function createUseCasesSection(example) {
  const section = document.createElement('div');
  section.className = 'use-cases-section';

  const title = document.createElement('h4');
  title.className = 'use-cases-title';
  title.textContent = 'Use Cases:';

  const list = document.createElement('ul');
  list.className = 'use-cases-list';

  example.useCases.forEach(useCase => {
    const item = document.createElement('li');
    item.className = 'use-case-item';
    item.textContent = useCase;
    list.appendChild(item);
  });

  section.appendChild(title);
  section.appendChild(list);

  return section;
}

/**
 * Handle card click (for potential future expansion)
 */
function handleCardClick(example) {
  // Future: Could open a modal with more details
  console.log('Card clicked:', example.name);
}

/**
 * Update results count display
 */
function updateResultsCount() {
  const total = state.examples.length;
  const showing = state.filteredExamples.length;

  if (showing === total) {
    elements.resultsCount.textContent = `Showing all ${total} examples`;
  } else {
    elements.resultsCount.textContent = `Showing ${showing} of ${total} examples`;
  }
}

/**
 * Show empty state
 */
function showEmptyState() {
  elements.galleryGrid.classList.add('d-none');
  elements.emptyState.classList.remove('d-none');
}

/**
 * Clear all filters
 */
function clearFilters() {
  // Reset filter state
  state.filters.domain = 'all';
  state.filters.complexity = 'all';
  state.filters.search = '';

  // Reset UI
  elements.searchInput.value = '';
  elements.domainFilter.value = 'all';
  elements.complexityFilter.value = 'all';

  // Update grid
  updateGrid();

  // Focus search input
  elements.searchInput.focus();

  // Announce to screen readers
  announceFiltersClear();
}

/**
 * Handle keyboard navigation
 */
function handleKeyboardNavigation(e) {
  // Escape key clears search if focused
  if (e.key === 'Escape' && document.activeElement === elements.searchInput) {
    if (elements.searchInput.value) {
      elements.searchInput.value = '';
      state.filters.search = '';
      updateGrid();
    }
  }
}

/**
 * Announce results to screen readers
 */
function announceResults() {
  const announcement = `${state.filteredExamples.length} workflow examples displayed`;
  announceToScreenReader(announcement);
}

/**
 * Announce filter clear to screen readers
 */
function announceFiltersClear() {
  announceToScreenReader('All filters cleared');
}

/**
 * Announce message to screen readers
 */
function announceToScreenReader(message) {
  // Use the results count element which has aria-live="polite"
  const currentText = elements.resultsCount.textContent;
  elements.resultsCount.textContent = message;

  // Restore original text after announcement
  setTimeout(() => {
    updateResultsCount();
  }, 1000);
}

/**
 * Utility: Check if any filters are active
 */
function hasActiveFilters() {
  return state.filters.domain !== 'all' ||
         state.filters.complexity !== 'all' ||
         state.filters.search !== '';
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', init);

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    init,
    filterExamples,
    displayCards,
    clearFilters
  };
}
