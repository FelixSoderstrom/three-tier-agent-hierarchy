/**
 * Timeline Interactive Component
 * Handles epic data loading, timeline rendering, and modal interactions
 */

// ============================================
// STATE MANAGEMENT
// ============================================

let epicsData = [];
let currentEpicIndex = null;
let currentTabIndex = 0;
let allTabs = [];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initializeTimeline();
});

async function initializeTimeline() {
  try {
    // Load all epic data
    await loadAllEpicData();

    // Hide loading state
    hideLoadingState();

    // Render timeline
    renderTimeline();

    // Initialize modal event listeners
    initializeModalListeners();

    // Initialize keyboard navigation
    initializeKeyboardNavigation();

  } catch (error) {
    console.error('Error initializing timeline:', error);
    showErrorState(error.message);
  }
}

// ============================================
// DATA LOADING
// ============================================

async function loadAllEpicData() {
  const epicPromises = [];

  // Load epics 0-7
  for (let i = 0; i < 8; i++) {
    epicPromises.push(fetchEpicData(i));
  }

  epicsData = await Promise.all(epicPromises);

  // Validate data
  if (epicsData.length !== 8) {
    throw new Error('Failed to load all epic data');
  }
}

async function fetchEpicData(epicNumber) {
  try {
    const response = await fetch(`../content/story/epic${epicNumber}.json`);

    if (!response.ok) {
      throw new Error(`Failed to fetch epic${epicNumber}.json: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error(`Error loading epic ${epicNumber}:`, error);
    throw error;
  }
}

// ============================================
// TIMELINE RENDERING
// ============================================

function renderTimeline() {
  const timelineContainer = document.getElementById('timelineNodes');

  if (!timelineContainer) {
    console.error('Timeline container not found');
    return;
  }

  timelineContainer.innerHTML = '';

  epicsData.forEach((epic, index) => {
    const node = createTimelineNode(epic, index);
    timelineContainer.appendChild(node);
  });
}

function createTimelineNode(epic, index) {
  const node = document.createElement('div');
  node.className = 'timeline-node completed';
  node.setAttribute('role', 'listitem');
  node.setAttribute('tabindex', '0');
  node.setAttribute('aria-label', `Epic ${epic.epicNumber}: ${epic.title}`);
  node.dataset.epicIndex = index;

  // Create circle
  const circle = document.createElement('div');
  circle.className = 'node-circle';
  circle.setAttribute('aria-hidden', 'true');
  circle.textContent = epic.epicNumber;

  // Create label
  const label = document.createElement('div');
  label.className = 'node-label';
  label.textContent = `Epic ${epic.epicNumber}`;

  // Add click handler
  node.addEventListener('click', () => openModal(index));

  // Add keyboard handler
  node.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(index);
    }
  });

  node.appendChild(circle);
  node.appendChild(label);

  return node;
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function openModal(epicIndex) {
  currentEpicIndex = epicIndex;
  const epic = epicsData[epicIndex];

  if (!epic) {
    console.error('Epic data not found for index:', epicIndex);
    return;
  }

  // Update modal content
  populateModalContent(epic);

  // Show modal
  const modal = document.getElementById('epicModal');
  modal.classList.remove('d-none');
  modal.setAttribute('aria-hidden', 'false');

  // Set focus to modal
  const closeButton = document.getElementById('closeModalBtn');
  if (closeButton) {
    closeButton.focus();
  }

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Update timeline node states
  updateTimelineNodeStates(epicIndex);

  // Announce to screen readers
  announceModalOpen(epic);
}

function closeModal() {
  const modal = document.getElementById('epicModal');
  modal.classList.add('d-none');
  modal.setAttribute('aria-hidden', 'true');

  // Restore body scroll
  document.body.style.overflow = '';

  // Return focus to timeline node
  if (currentEpicIndex !== null) {
    const node = document.querySelector(`[data-epic-index="${currentEpicIndex}"]`);
    if (node) {
      node.focus();
    }
  }

  // Reset active states
  updateTimelineNodeStates(null);

  currentEpicIndex = null;
}

function populateModalContent(epic) {
  // Update header
  document.getElementById('modalTitle').textContent = epic.title;
  document.getElementById('modalTagline').textContent = epic.tagline;

  // Populate Product Manager perspective
  const pmNarrative = epic.perspectives.productManager.narrative;
  const pmQuotes = epic.perspectives.productManager.felixQuotes || [];

  document.getElementById('pmNarrative').textContent = pmNarrative;

  const pmQuotesContainer = document.getElementById('pmQuotes');
  const pmQuotesSection = document.getElementById('pmQuotesSection');

  if (pmQuotes.length > 0) {
    pmQuotesSection.style.display = 'block';
    pmQuotesContainer.innerHTML = pmQuotes.map(quote =>
      `<blockquote class="quote-item">${quote}</blockquote>`
    ).join('');
  } else {
    pmQuotesSection.style.display = 'none';
  }

  // Populate Team Lead perspective
  const tlNarrative = epic.perspectives.teamLead.narrative;
  const tlDecisions = epic.perspectives.teamLead.decisions || [];

  document.getElementById('tlNarrative').textContent = tlNarrative;

  const tlDecisionsContainer = document.getElementById('tlDecisions');
  const tlDecisionsSection = document.getElementById('tlDecisionsSection');

  if (tlDecisions.length > 0) {
    tlDecisionsSection.style.display = 'block';
    tlDecisionsContainer.innerHTML = tlDecisions.map(decision =>
      `<li class="decision-item">${decision}</li>`
    ).join('');
  } else {
    tlDecisionsSection.style.display = 'none';
  }

  // Populate Specialist perspectives
  const specialists = epic.perspectives.specialists || [];
  populateSpecialistTabs(specialists);

  // Populate metrics
  populateMetrics(epic.completionMetrics);

  // Populate timeline sidebar
  populateTimelineSidebar(currentEpicIndex);

  // Populate todo list
  populateTodoList(epic);

  // Reset to first tab
  switchTab(0);
}

function populateSpecialistTabs(specialists) {
  const specialistTabsContainer = document.getElementById('specialistTabs');
  const specialistPanelsContainer = document.getElementById('specialistPanels');

  // Clear existing specialist tabs and panels
  specialistTabsContainer.innerHTML = '';
  specialistPanelsContainer.innerHTML = '';

  specialists.forEach((specialist, index) => {
    // Create tab button
    const tabButton = document.createElement('button');
    tabButton.className = 'tab-button';
    tabButton.id = `tabSpecialist${index}`;
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-selected', 'false');
    tabButton.setAttribute('aria-controls', `panelSpecialist${index}`);
    tabButton.setAttribute('tabindex', '-1');
    tabButton.textContent = specialist.role;

    tabButton.addEventListener('click', () => {
      const tabIndex = 2 + index; // PM=0, TL=1, Specialists start at 2
      switchTab(tabIndex);
    });

    specialistTabsContainer.appendChild(tabButton);

    // Create panel
    const panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.id = `panelSpecialist${index}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tabSpecialist${index}`);
    panel.setAttribute('tabindex', '0');

    let panelHTML = `
      <div class="perspective-content">
        <div class="narrative-section">
          <h3 class="section-title">Narrative</h3>
          <p class="narrative-text">${specialist.narrative}</p>
        </div>
    `;

    // Add challenges if present
    if (specialist.challenges && specialist.challenges.length > 0) {
      panelHTML += `
        <div class="challenges-section">
          <h3 class="section-title">Challenges</h3>
          <ul class="challenges-list">
            ${specialist.challenges.map(challenge =>
              `<li class="challenge-item">${challenge}</li>`
            ).join('')}
          </ul>
        </div>
      `;
    }

    // Add solutions if present
    if (specialist.solutions && specialist.solutions.length > 0) {
      panelHTML += `
        <div class="solutions-section">
          <h3 class="section-title">Solutions</h3>
          <ul class="solutions-list">
            ${specialist.solutions.map(solution =>
              `<li class="solution-item">${solution}</li>`
            ).join('')}
          </ul>
        </div>
      `;
    }

    panelHTML += '</div>';
    panel.innerHTML = panelHTML;

    specialistPanelsContainer.appendChild(panel);
  });
}

function populateMetrics(metrics) {
  if (!metrics) return;

  const filesCreated = metrics.filesCreated || 0;
  const linesOfCode = metrics.linesOfCode || 0;

  // Update header stats (always visible)
  document.getElementById('metricFilesHeader').textContent = filesCreated;
  document.getElementById('metricLinesHeader').textContent = linesOfCode;
}

function populateTimelineSidebar(currentEpicIndex) {
  const timelineContainer = document.getElementById('epicTimelineList');

  if (!timelineContainer) {
    console.error('Timeline sidebar container not found');
    return;
  }

  timelineContainer.innerHTML = '';

  epicsData.forEach((epic, index) => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'epic-timeline-item';

    if (index === currentEpicIndex) {
      timelineItem.classList.add('current');
    }

    timelineItem.setAttribute('role', 'button');
    timelineItem.setAttribute('tabindex', '0');
    timelineItem.setAttribute('aria-label', `Navigate to ${epic.title}`);

    const number = document.createElement('div');
    number.className = 'epic-timeline-number';
    number.textContent = epic.epicNumber;

    const text = document.createElement('div');
    text.className = 'epic-timeline-text';
    text.textContent = `Epic ${epic.epicNumber}`;

    timelineItem.appendChild(number);
    timelineItem.appendChild(text);

    // Click handler for navigation
    timelineItem.addEventListener('click', () => {
      if (index !== currentEpicIndex) {
        openModal(index);
      }
    });

    // Keyboard navigation
    timelineItem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (index !== currentEpicIndex) {
          openModal(index);
        }
      }
    });

    timelineContainer.appendChild(timelineItem);
  });
}

function populateTodoList(epic) {
  const todoContainer = document.getElementById('epicTodoList');

  if (!todoContainer) {
    console.error('Todo list container not found');
    return;
  }

  todoContainer.innerHTML = '';

  // Get deliverables from handoffInfo
  const deliverables = epic.handoffInfo?.keyDeliverables || [];

  if (deliverables.length === 0) {
    todoContainer.innerHTML = '<li class="epic-todo-item">No deliverables documented</li>';
    return;
  }

  deliverables.forEach(deliverable => {
    const todoItem = document.createElement('li');
    todoItem.className = 'epic-todo-item';
    todoItem.textContent = deliverable;
    todoContainer.appendChild(todoItem);
  });
}

// ============================================
// TAB SWITCHING
// ============================================

function switchTab(tabIndex) {
  // Get all tab buttons
  const pmTab = document.getElementById('tabProductManager');
  const tlTab = document.getElementById('tabTeamLead');
  const specialistTabsContainer = document.getElementById('specialistTabs');
  const specialistTabs = specialistTabsContainer.querySelectorAll('.tab-button');

  allTabs = [pmTab, tlTab, ...specialistTabs];

  // Get all panels
  const pmPanel = document.getElementById('panelProductManager');
  const tlPanel = document.getElementById('panelTeamLead');
  const specialistPanelsContainer = document.getElementById('specialistPanels');
  const specialistPanels = specialistPanelsContainer.querySelectorAll('.tab-panel');

  const allPanels = [pmPanel, tlPanel, ...specialistPanels];

  // Deactivate all tabs and panels
  allTabs.forEach(tab => {
    if (tab) {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
    }
  });

  allPanels.forEach(panel => {
    if (panel) {
      panel.classList.remove('active');
    }
  });

  // Activate selected tab and panel
  if (allTabs[tabIndex]) {
    allTabs[tabIndex].classList.add('active');
    allTabs[tabIndex].setAttribute('aria-selected', 'true');
    allTabs[tabIndex].setAttribute('tabindex', '0');
  }

  if (allPanels[tabIndex]) {
    allPanels[tabIndex].classList.add('active');
  }

  currentTabIndex = tabIndex;
}

// ============================================
// EVENT LISTENERS
// ============================================

function initializeModalListeners() {
  // Close button
  const closeBtn = document.getElementById('closeModalBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Click outside modal
  const modalOverlay = document.getElementById('epicModal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Product Manager tab
  const pmTab = document.getElementById('tabProductManager');
  if (pmTab) {
    pmTab.addEventListener('click', () => switchTab(0));
  }

  // Team Lead tab
  const tlTab = document.getElementById('tabTeamLead');
  if (tlTab) {
    tlTab.addEventListener('click', () => switchTab(1));
  }
}

function initializeKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('epicModal');
    const isModalOpen = !modal.classList.contains('d-none');

    if (!isModalOpen) return;

    // ESC key - close modal
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }

    // Arrow keys - navigate tabs
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const focusedElement = document.activeElement;
      const isTabFocused = focusedElement.getAttribute('role') === 'tab';

      if (isTabFocused) {
        e.preventDefault();

        if (e.key === 'ArrowLeft') {
          const prevIndex = currentTabIndex > 0 ? currentTabIndex - 1 : allTabs.length - 1;
          switchTab(prevIndex);
          allTabs[prevIndex].focus();
        } else {
          const nextIndex = currentTabIndex < allTabs.length - 1 ? currentTabIndex + 1 : 0;
          switchTab(nextIndex);
          allTabs[nextIndex].focus();
        }
      }
    }

    // Tab key - trap focus within modal
    if (e.key === 'Tab') {
      trapFocusInModal(e);
    }
  });
}

function trapFocusInModal(e) {
  const modal = document.getElementById('epicModal');
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  if (e.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    }
  } else {
    // Tab
    if (document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }
}

// ============================================
// TIMELINE NODE STATES
// ============================================

function updateTimelineNodeStates(activeIndex) {
  const nodes = document.querySelectorAll('.timeline-node');

  nodes.forEach((node, index) => {
    if (index === activeIndex) {
      node.classList.add('active');
    } else {
      node.classList.remove('active');
    }
  });
}

// ============================================
// UI STATE HELPERS
// ============================================

function hideLoadingState() {
  const loadingState = document.getElementById('loadingState');
  if (loadingState) {
    loadingState.style.display = 'none';
  }
}

function showErrorState(message) {
  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const errorMessage = document.getElementById('errorMessage');

  if (loadingState) {
    loadingState.style.display = 'none';
  }

  if (errorState) {
    errorState.classList.remove('d-none');
  }

  if (errorMessage && message) {
    errorMessage.textContent = message;
  }
}

// ============================================
// ACCESSIBILITY ANNOUNCEMENTS
// ============================================

function announceModalOpen(epic) {
  // Create or update live region for screen reader announcements
  let liveRegion = document.getElementById('ariaLiveRegion');

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'ariaLiveRegion';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }

  liveRegion.textContent = `Epic ${epic.epicNumber}: ${epic.title} modal opened. Use arrow keys to navigate between perspectives, Escape to close.`;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle window resize for responsive behavior
let resizeTimer;
window.addEventListener('resize', debounce(() => {
  // Re-render timeline on significant resize
  const currentWidth = window.innerWidth;

  if ((currentWidth <= 640 && !document.body.classList.contains('mobile')) ||
      (currentWidth > 640 && document.body.classList.contains('mobile'))) {
    document.body.classList.toggle('mobile');
  }
}, 250));

// ============================================
// DEVELOPER TOOLS (for debugging)
// ============================================

// Expose functions for debugging in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.timelineDebug = {
    epicsData,
    currentEpicIndex,
    openModal,
    closeModal,
    switchTab
  };
}
