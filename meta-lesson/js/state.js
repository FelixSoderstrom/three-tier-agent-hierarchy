/**
 * State Management System for Agentic Workflow Configuration Wizard
 * Handles persistent state storage and retrieval using localStorage
 */

// Define the default workflow state
const DEFAULT_STATE = {
  step: 1,
  config: {
    epicCount: 2,
    projectName: "",
    coreComponents: {
      productManager: true,
      metaAgent: true
    },
    optionalFeatures: {
      specializedAgents: false,
      logging: false,
      customTools: false
    }
  }
};

// Storage key for localStorage
const STORAGE_KEY = 'agentic-workflow-state';

/**
 * State Manager Class
 * Provides methods to manage workflow configuration state
 */
class StateManager {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }

  /**
   * Load state from localStorage or return default state
   * @returns {Object} The current state
   */
  loadState() {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Merge with default state to ensure all properties exist
        return this.mergeWithDefault(parsed);
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  /**
   * Merge saved state with default state to ensure all properties exist
   * @param {Object} savedState - The saved state from localStorage
   * @returns {Object} Merged state
   */
  mergeWithDefault(savedState) {
    return {
      step: savedState.step || DEFAULT_STATE.step,
      config: {
        epicCount: savedState.config?.epicCount || DEFAULT_STATE.config.epicCount,
        projectName: savedState.config?.projectName || DEFAULT_STATE.config.projectName,
        coreComponents: {
          ...DEFAULT_STATE.config.coreComponents,
          ...savedState.config?.coreComponents
        },
        optionalFeatures: {
          ...DEFAULT_STATE.config.optionalFeatures,
          ...savedState.config?.optionalFeatures
        }
      }
    };
  }

  /**
   * Save current state to localStorage
   */
  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      console.log('State saved successfully:', this.state);
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  }

  /**
   * Get the current state
   * @returns {Object} Current state
   */
  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Update the epic count
   * @param {number} count - The new epic count
   */
  setEpicCount(count) {
    this.state.config.epicCount = parseInt(count, 10);
    this.saveState();
    this.notifyListeners();
  }

  /**
   * Update the project name
   * @param {string} name - The new project name
   */
  setProjectName(name) {
    this.state.config.projectName = name;
    this.saveState();
    this.notifyListeners();
  }

  /**
   * Update a core component setting
   * @param {string} component - Component name (productManager, metaAgent)
   * @param {boolean} enabled - Whether the component is enabled
   */
  setCoreComponent(component, enabled) {
    if (this.state.config.coreComponents.hasOwnProperty(component)) {
      this.state.config.coreComponents[component] = enabled;
      this.saveState();
      this.notifyListeners();
    }
  }

  /**
   * Update an optional feature setting
   * @param {string} feature - Feature name
   * @param {boolean} enabled - Whether the feature is enabled
   */
  setOptionalFeature(feature, enabled) {
    if (this.state.config.optionalFeatures.hasOwnProperty(feature)) {
      this.state.config.optionalFeatures[feature] = enabled;
      this.saveState();
      this.notifyListeners();
    }
  }

  /**
   * Update the current step
   * @param {number} step - The new step number
   */
  setStep(step) {
    this.state.step = step;
    this.saveState();
    this.notifyListeners();
  }

  /**
   * Reset state to default values
   */
  resetState() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveState();
    this.notifyListeners();
  }

  /**
   * Clear state from localStorage
   */
  clearStorage() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('State cleared from localStorage');
    } catch (error) {
      console.error('Error clearing state from localStorage:', error);
    }
  }

  /**
   * Validate the current configuration
   * @returns {Object} Validation result with isValid boolean and errors array
   */
  validateConfig() {
    const errors = [];
    const config = this.state.config;

    // Validate epic count (minimum 2)
    if (config.epicCount < 2) {
      errors.push('Epic count must be at least 2');
    }

    // Validate epic count is a number
    if (isNaN(config.epicCount)) {
      errors.push('Epic count must be a valid number');
    }

    // Product Manager is always required (should always be true)
    if (!config.coreComponents.productManager) {
      errors.push('Product Manager agent is required');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Add a state change listener
   * @param {Function} callback - Function to call when state changes
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove a state change listener
   * @param {Function} callback - The callback to remove
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  /**
   * Notify all listeners of state change
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.getState());
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }

  /**
   * Export configuration as JSON
   * @returns {string} JSON string of current configuration
   */
  exportConfig() {
    return JSON.stringify(this.state.config, null, 2);
  }

  /**
   * Import configuration from JSON
   * @param {string} jsonString - JSON string to import
   * @returns {boolean} Success status
   */
  importConfig(jsonString) {
    try {
      const config = JSON.parse(jsonString);
      this.state.config = this.mergeWithDefault({ config }).config;
      this.saveState();
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error importing configuration:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
const stateManager = new StateManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StateManager, stateManager };
}
