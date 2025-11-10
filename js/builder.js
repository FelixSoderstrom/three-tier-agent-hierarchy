/**
 * Builder Wizard Logic - Step 1
 * Handles user interactions, form validation, and state updates
 */

// Wait for DOM and state manager to be ready
document.addEventListener('DOMContentLoaded', () => {
  initializeBuilder();
});

/**
 * Initialize the builder interface
 */
function initializeBuilder() {
  // Load saved state and populate form
  loadSavedState();

  // Setup event listeners
  setupEpicSelectionListeners();
  setupProjectNameListener();
  setupCoreComponentListeners();
  setupOptionalFeatureListeners();
  setupNavigationListeners();

  // Initial validation
  validateForm();

  // Update progress indicator
  updateProgressIndicator();

  console.log('Builder initialized successfully');
}

/**
 * Load saved state and populate form fields
 */
function loadSavedState() {
  const state = stateManager.getState();

  // Load epic count selection
  const epicCount = state.config.epicCount;
  if ([2, 3, 4].includes(epicCount)) {
    selectRadioOption(`epic-${epicCount}`);
  } else {
    selectRadioOption('epic-custom');
    document.getElementById('custom-epic-count').value = epicCount;
    document.getElementById('custom-epic-input').classList.add('visible');
  }

  // Load project name
  document.getElementById('project-name').value = state.config.projectName || '';

  // Load core components
  document.getElementById('core-meta-agent').checked = state.config.coreComponents.metaAgent;
  updateCheckboxUI('core-meta-agent');

  // Load optional features
  document.getElementById('opt-specialized-agents').checked = state.config.optionalFeatures.specializedAgents;
  document.getElementById('opt-logging').checked = state.config.optionalFeatures.logging;
  document.getElementById('opt-custom-tools').checked = state.config.optionalFeatures.customTools;

  updateCheckboxUI('opt-specialized-agents');
  updateCheckboxUI('opt-logging');
  updateCheckboxUI('opt-custom-tools');

  console.log('State loaded:', state);
}

/**
 * Setup event listeners for epic selection
 */
function setupEpicSelectionListeners() {
  const radioOptions = document.querySelectorAll('.radio-option');

  radioOptions.forEach(option => {
    option.addEventListener('click', () => {
      const radioInput = option.querySelector('input[type="radio"]');
      const value = radioInput.value;

      // Update UI
      document.querySelectorAll('.radio-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      option.classList.add('selected');
      radioInput.checked = true;

      // Handle custom input visibility
      const customInput = document.getElementById('custom-epic-input');
      if (value === 'custom') {
        customInput.classList.add('visible');
        document.getElementById('custom-epic-count').focus();
      } else {
        customInput.classList.remove('visible');
        // Update state with preset value
        stateManager.setEpicCount(parseInt(value, 10));
        validateForm();
      }
    });

    // Keyboard accessibility
    option.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        option.click();
      }
    });
  });

  // Custom epic count input
  const customInput = document.getElementById('custom-epic-count');
  customInput.addEventListener('input', (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      stateManager.setEpicCount(value);
      validateForm();
    }
  });
}

/**
 * Setup event listener for project name input
 */
function setupProjectNameListener() {
  const projectNameInput = document.getElementById('project-name');

  // Debounce the input to avoid excessive state updates
  let timeout;
  projectNameInput.addEventListener('input', (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      stateManager.setProjectName(e.target.value);
    }, 500);
  });
}

/**
 * Setup event listeners for core component checkboxes
 */
function setupCoreComponentListeners() {
  // Product Manager is always disabled (required)
  const productManagerCheckbox = document.getElementById('core-product-manager');
  productManagerCheckbox.disabled = true;
  productManagerCheckbox.checked = true;

  // Meta Agent checkbox
  const metaAgentOption = document.querySelector('[data-checkbox="core-meta-agent"]');
  const metaAgentCheckbox = document.getElementById('core-meta-agent');

  metaAgentOption.addEventListener('click', () => {
    metaAgentCheckbox.checked = !metaAgentCheckbox.checked;
    stateManager.setCoreComponent('metaAgent', metaAgentCheckbox.checked);
    updateCheckboxUI('core-meta-agent');
  });

  // Keyboard accessibility
  metaAgentOption.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      metaAgentOption.click();
    }
  });
}

/**
 * Setup event listeners for optional feature checkboxes
 */
function setupOptionalFeatureListeners() {
  const features = [
    { id: 'opt-specialized-agents', key: 'specializedAgents' },
    { id: 'opt-logging', key: 'logging' },
    { id: 'opt-custom-tools', key: 'customTools' }
  ];

  features.forEach(feature => {
    const option = document.querySelector(`[data-checkbox="${feature.id}"]`);
    const checkbox = document.getElementById(feature.id);

    option.addEventListener('click', () => {
      checkbox.checked = !checkbox.checked;
      stateManager.setOptionalFeature(feature.key, checkbox.checked);
      updateCheckboxUI(feature.id);
    });

    // Keyboard accessibility
    option.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        option.click();
      }
    });
  });
}

/**
 * Setup event listeners for navigation buttons
 */
function setupNavigationListeners() {
  // Continue button
  document.getElementById('btn-continue').addEventListener('click', () => {
    if (validateForm()) {
      handleContinue();
    }
  });

  // Save draft button
  document.getElementById('btn-save').addEventListener('click', () => {
    handleSaveDraft();
  });

  // Reset button
  document.getElementById('btn-reset').addEventListener('click', () => {
    handleReset();
  });
}

/**
 * Select a radio option programmatically
 * @param {string} value - The value of the radio option to select
 */
function selectRadioOption(value) {
  const radioOption = document.querySelector(`input[value="${value}"]`)?.closest('.radio-option');
  if (radioOption) {
    radioOption.classList.add('selected');
    const input = radioOption.querySelector('input[type="radio"]');
    if (input) {
      input.checked = true;
    }
  }
}

/**
 * Update checkbox UI based on checked state
 * @param {string} checkboxId - The ID of the checkbox
 */
function updateCheckboxUI(checkboxId) {
  const checkbox = document.getElementById(checkboxId);
  const option = document.querySelector(`[data-checkbox="${checkboxId}"]`);

  if (checkbox && option) {
    if (checkbox.checked) {
      option.classList.add('checked');
    } else {
      option.classList.remove('checked');
    }
  }
}

/**
 * Validate the form and display errors
 * @returns {boolean} True if form is valid
 */
function validateForm() {
  const validation = stateManager.validateConfig();
  const errorContainer = document.getElementById('error-message');
  const errorList = document.getElementById('error-list');
  const continueButton = document.getElementById('btn-continue');

  if (!validation.isValid) {
    // Show errors
    errorList.innerHTML = validation.errors
      .map(error => `<li>${error}</li>`)
      .join('');
    errorContainer.classList.add('visible');
    continueButton.disabled = true;
    return false;
  } else {
    // Hide errors
    errorContainer.classList.remove('visible');
    continueButton.disabled = false;
    return true;
  }
}

/**
 * Update progress indicator
 */
function updateProgressIndicator() {
  const state = stateManager.getState();
  const currentStep = state.step;
  const totalSteps = 3; // Assuming 3 steps total (can be made dynamic)

  const progressBar = document.querySelector('.progress-bar');
  const progressText = document.querySelector('.progress-text');
  const currentStepSpan = progressText?.querySelector('.current-step');

  const percentage = (currentStep / totalSteps) * 100;

  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }

  if (currentStepSpan) {
    currentStepSpan.textContent = `Step ${currentStep}`;
  }
}

/**
 * Handle continue button click
 */
function handleContinue() {
  // Show success message temporarily
  const successMessage = document.getElementById('success-message');
  const successText = successMessage.querySelector('.success-message-text');
  successText.textContent = 'Continuing to next step...';
  successMessage.classList.add('visible');

  // Save current state before navigation
  stateManager.saveState();
  console.log('Continuing to next step...');
  console.log('Current configuration:', stateManager.getState().config);

  // Navigate to step 2 after a brief delay to show the message
  setTimeout(() => {
    // Update step number and navigate
    stateManager.setStep(2);
    window.location.href = 'builder-step2.html';
  }, 500);
}

/**
 * Handle save draft button click
 */
function handleSaveDraft() {
  // State is already being saved automatically, but we'll trigger it explicitly
  stateManager.saveState();

  // Show success message
  const successMessage = document.getElementById('success-message');
  const successText = successMessage.querySelector('.success-message-text');
  successText.textContent = 'Draft saved successfully!';
  successMessage.classList.add('visible');

  setTimeout(() => {
    successMessage.classList.remove('visible');
  }, 3000);

  console.log('Draft saved:', stateManager.getState());
}

/**
 * Handle reset button click
 */
function handleReset() {
  if (confirm('Are you sure you want to reset the form? All unsaved changes will be lost.')) {
    // Reset state
    stateManager.resetState();

    // Reload the page to reset UI
    window.location.reload();
  }
}

/**
 * Export configuration (for debugging/testing)
 */
function exportConfiguration() {
  const config = stateManager.exportConfig();
  console.log('Configuration Export:', config);

  // Create download link
  const blob = new Blob([config], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'workflow-config.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Make export function available globally for debugging
window.exportConfiguration = exportConfiguration;

/**
 * Listen for state changes and update UI accordingly
 */
stateManager.addListener((state) => {
  console.log('State updated:', state);
  updateProgressIndicator();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + S to save draft
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    handleSaveDraft();
  }

  // Ctrl/Cmd + Enter to continue
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    if (validateForm()) {
      handleContinue();
    }
  }
});

console.log('Builder.js loaded successfully');
