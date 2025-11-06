/**
 * Epic Editor Component
 * Provides markdown editing interface for epic definitions
 * with real-time preview, auto-save, and validation
 */

class EpicEditor {
  constructor(epicNumber, container, stateManager) {
    this.epicNumber = epicNumber;
    this.container = container;
    this.stateManager = stateManager;
    this.autoSaveInterval = null;
    this.previewUpdateTimeout = null;
    this.lastSaved = null;
    this.isDirty = false;

    // Load template
    this.loadTemplate();
  }

  /**
   * Load the epic definition template
   */
  async loadTemplate() {
    try {
      const response = await fetch('/meta-lesson/templates/epic-definition.md');
      this.template = await response.text();
    } catch (error) {
      console.error('Error loading epic template:', error);
      this.template = this.getDefaultTemplate();
    }
  }

  /**
   * Get default template if loading fails
   */
  getDefaultTemplate() {
    return `# Epic {{EPIC_NUMBER}}: {{EPIC_NAME}}

## Epic Purpose

{{EPIC_PURPOSE}}

## Objectives

### Primary Objectives
1. [Primary objective 1]
2. [Primary objective 2]

## Deliverables

### Required Deliverables

#### 1. [Deliverable Name]
- **Type**: [File type]
- **Location**: \`[file path]\`
- **Description**: [What this deliverable contains]

## Acceptance Criteria

- [ ] All required deliverables created and validated
- [ ] Code executes without errors
- [ ] Documentation is complete and accurate

## Suggested Subagents

### 1. {{SUBAGENT_1_NAME}}
- **Role**: [What this agent specializes in]
- **Responsibilities**: [List responsibilities]
`;
  }

  /**
   * Render the epic editor interface
   */
  render() {
    const state = this.stateManager.getState();
    const epicData = state.epics?.[this.epicNumber] || this.getDefaultEpicData();

    this.container.innerHTML = `
      <div class="epic-editor-container" data-epic="${this.epicNumber}">
        <!-- Header -->
        <div class="epic-editor-header">
          <div class="epic-number-badge">Epic ${this.epicNumber}</div>
          <h2 class="epic-editor-title">Epic Definition</h2>
          <div class="epic-editor-status">
            <span class="auto-save-indicator" id="epic-${this.epicNumber}-save-status">
              <span class="save-icon">💾</span>
              <span class="save-text">Saved</span>
            </span>
            <span class="last-saved-time" id="epic-${this.epicNumber}-last-saved"></span>
          </div>
        </div>

        <!-- Epic Metadata -->
        <div class="epic-metadata-section">
          <div class="form-group">
            <label for="epic-${this.epicNumber}-name" class="form-label required">
              Epic Name
            </label>
            <input
              type="text"
              id="epic-${this.epicNumber}-name"
              class="form-input epic-name-input"
              placeholder="Enter epic name (e.g., Environment Setup)"
              value="${epicData.name || ''}"
              data-epic="${this.epicNumber}"
              required
              minlength="3"
            />
            <span class="form-helper-text">A clear, descriptive name for this epic (minimum 3 characters)</span>
            <span class="error-text" id="epic-${this.epicNumber}-name-error"></span>
          </div>

          <div class="form-group">
            <label for="epic-${this.epicNumber}-purpose" class="form-label required">
              Epic Purpose
            </label>
            <textarea
              id="epic-${this.epicNumber}-purpose"
              class="form-input epic-purpose-input"
              placeholder="Describe the purpose of this epic..."
              rows="3"
              data-epic="${this.epicNumber}"
              required
              minlength="20"
            >${epicData.purpose || ''}</textarea>
            <span class="form-helper-text">Brief description of what this epic accomplishes (minimum 20 characters)</span>
            <span class="error-text" id="epic-${this.epicNumber}-purpose-error"></span>
          </div>
        </div>

        <!-- Suggested Subagents -->
        <div class="subagents-section">
          <label class="form-label required">
            Suggested Subagents
          </label>
          <div class="subagents-chips-container" id="epic-${this.epicNumber}-subagents">
            ${this.renderSubagentsChips(epicData.subagents || [])}
          </div>
          <div class="subagent-input-container">
            <input
              type="text"
              id="epic-${this.epicNumber}-subagent-input"
              class="form-input subagent-input"
              placeholder="Type agent name and press Enter"
              data-epic="${this.epicNumber}"
            />
            <button
              type="button"
              class="btn btn-secondary btn-add-subagent"
              data-epic="${this.epicNumber}"
            >
              Add Agent
            </button>
          </div>
          <span class="form-helper-text">Add at least one suggested subagent for this epic</span>
          <span class="error-text" id="epic-${this.epicNumber}-subagents-error"></span>
        </div>

        <!-- Markdown Editor Section -->
        <div class="markdown-editor-section">
          <div class="editor-toolbar">
            <div class="toolbar-group">
              <button type="button" class="toolbar-btn" data-action="preview" title="Toggle Preview (Ctrl+P)">
                <span class="icon">👁️</span>
                <span class="text">Preview</span>
              </button>
              <button type="button" class="toolbar-btn" data-action="template" title="Load Template">
                <span class="icon">📄</span>
                <span class="text">Use Template</span>
              </button>
              <button type="button" class="toolbar-btn" data-action="variables" title="Show Variables">
                <span class="icon">🔤</span>
                <span class="text">Variables</span>
              </button>
            </div>
            <div class="editor-stats">
              <span class="stat-item">
                <span class="stat-label">Words:</span>
                <span class="stat-value" id="epic-${this.epicNumber}-word-count">0</span>
              </span>
              <span class="stat-item">
                <span class="stat-label">Chars:</span>
                <span class="stat-value" id="epic-${this.epicNumber}-char-count">0</span>
              </span>
            </div>
          </div>

          <div class="editor-container" id="epic-${this.epicNumber}-editor-container">
            <!-- Editor Pane -->
            <div class="editor-pane" id="epic-${this.epicNumber}-editor-pane">
              <textarea
                id="epic-${this.epicNumber}-markdown"
                class="markdown-textarea"
                placeholder="Enter your epic definition in markdown..."
                data-epic="${this.epicNumber}"
              >${epicData.definition || ''}</textarea>
              <div class="syntax-overlay" id="epic-${this.epicNumber}-syntax-overlay"></div>
            </div>

            <!-- Preview Pane -->
            <div class="preview-pane hidden" id="epic-${this.epicNumber}-preview-pane">
              <div class="preview-header">
                <h3>Preview</h3>
                <button type="button" class="btn-close-preview" data-epic="${this.epicNumber}">✕</button>
              </div>
              <div class="preview-content" id="epic-${this.epicNumber}-preview"></div>
            </div>
          </div>
        </div>

        <!-- Validation Messages -->
        <div class="epic-validation-messages" id="epic-${this.epicNumber}-validation"></div>
      </div>
    `;

    this.attachEventListeners();
    this.startAutoSave();
    this.updateStats();
    this.updateLastSavedTime();
  }

  /**
   * Render subagent chips
   */
  renderSubagentsChips(subagents) {
    if (!subagents || subagents.length === 0) {
      return '<div class="subagents-empty">No subagents added yet</div>';
    }

    return subagents.map(agent => `
      <div class="subagent-chip" data-agent="${agent}">
        <span class="chip-text">${agent}</span>
        <button type="button" class="chip-remove" data-agent="${agent}" title="Remove">×</button>
      </div>
    `).join('');
  }

  /**
   * Get default epic data structure
   */
  getDefaultEpicData() {
    return {
      name: '',
      purpose: '',
      definition: '',
      subagents: [],
      requirements: '',
      successCriteria: []
    };
  }

  /**
   * Attach event listeners to editor elements
   */
  attachEventListeners() {
    const epicNum = this.epicNumber;

    // Epic name input
    const nameInput = document.getElementById(`epic-${epicNum}-name`);
    nameInput?.addEventListener('input', (e) => {
      this.handleNameChange(e.target.value);
      this.markDirty();
    });

    // Epic purpose textarea
    const purposeInput = document.getElementById(`epic-${epicNum}-purpose`);
    purposeInput?.addEventListener('input', (e) => {
      this.handlePurposeChange(e.target.value);
      this.markDirty();
    });

    // Markdown textarea
    const markdownTextarea = document.getElementById(`epic-${epicNum}-markdown`);
    markdownTextarea?.addEventListener('input', (e) => {
      this.handleMarkdownChange(e.target.value);
      this.updateStats();
      this.debouncedPreviewUpdate();
      this.markDirty();
    });

    // Subagent input
    const subagentInput = document.getElementById(`epic-${epicNum}-subagent-input`);
    subagentInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.addSubagent(e.target.value.trim());
        e.target.value = '';
      }
    });

    // Add subagent button
    const addBtn = document.querySelector(`button.btn-add-subagent[data-epic="${epicNum}"]`);
    addBtn?.addEventListener('click', () => {
      const input = document.getElementById(`epic-${epicNum}-subagent-input`);
      if (input.value.trim()) {
        this.addSubagent(input.value.trim());
        input.value = '';
      }
    });

    // Subagent chip removal (event delegation)
    const chipsContainer = document.getElementById(`epic-${epicNum}-subagents`);
    chipsContainer?.addEventListener('click', (e) => {
      if (e.target.classList.contains('chip-remove')) {
        const agentName = e.target.dataset.agent;
        this.removeSubagent(agentName);
      }
    });

    // Toolbar buttons
    const toolbar = document.querySelector(`#epic-${epicNum}-editor-container .editor-toolbar`);
    toolbar?.addEventListener('click', (e) => {
      const btn = e.target.closest('.toolbar-btn');
      if (btn) {
        const action = btn.dataset.action;
        this.handleToolbarAction(action);
      }
    });

    // Close preview button
    const closePreviewBtn = document.querySelector(`.btn-close-preview[data-epic="${epicNum}"]`);
    closePreviewBtn?.addEventListener('click', () => {
      this.togglePreview();
    });
  }

  /**
   * Handle epic name change
   */
  handleNameChange(name) {
    const state = this.stateManager.getState();
    if (!state.epics) state.epics = {};
    if (!state.epics[this.epicNumber]) state.epics[this.epicNumber] = this.getDefaultEpicData();

    state.epics[this.epicNumber].name = name;
    this.stateManager.state.epics = state.epics;
    this.validate();
  }

  /**
   * Handle epic purpose change
   */
  handlePurposeChange(purpose) {
    const state = this.stateManager.getState();
    if (!state.epics) state.epics = {};
    if (!state.epics[this.epicNumber]) state.epics[this.epicNumber] = this.getDefaultEpicData();

    state.epics[this.epicNumber].purpose = purpose;
    this.stateManager.state.epics = state.epics;
    this.validate();
  }

  /**
   * Handle markdown content change
   */
  handleMarkdownChange(content) {
    const state = this.stateManager.getState();
    if (!state.epics) state.epics = {};
    if (!state.epics[this.epicNumber]) state.epics[this.epicNumber] = this.getDefaultEpicData();

    state.epics[this.epicNumber].definition = content;
    this.stateManager.state.epics = state.epics;
    this.validate();
  }

  /**
   * Add a subagent to the list
   */
  addSubagent(agentName) {
    if (!agentName) return;

    const state = this.stateManager.getState();
    if (!state.epics) state.epics = {};
    if (!state.epics[this.epicNumber]) state.epics[this.epicNumber] = this.getDefaultEpicData();
    if (!state.epics[this.epicNumber].subagents) state.epics[this.epicNumber].subagents = [];

    // Check for duplicates
    if (state.epics[this.epicNumber].subagents.includes(agentName)) {
      this.showError(`epic-${this.epicNumber}-subagents-error`, 'This subagent is already added');
      return;
    }

    state.epics[this.epicNumber].subagents.push(agentName);
    this.stateManager.state.epics = state.epics;

    // Re-render chips
    const chipsContainer = document.getElementById(`epic-${this.epicNumber}-subagents`);
    if (chipsContainer) {
      chipsContainer.innerHTML = this.renderSubagentsChips(state.epics[this.epicNumber].subagents);
    }

    this.markDirty();
    this.validate();
  }

  /**
   * Remove a subagent from the list
   */
  removeSubagent(agentName) {
    const state = this.stateManager.getState();
    if (!state.epics?.[this.epicNumber]?.subagents) return;

    state.epics[this.epicNumber].subagents = state.epics[this.epicNumber].subagents.filter(
      agent => agent !== agentName
    );
    this.stateManager.state.epics = state.epics;

    // Re-render chips
    const chipsContainer = document.getElementById(`epic-${this.epicNumber}-subagents`);
    if (chipsContainer) {
      chipsContainer.innerHTML = this.renderSubagentsChips(state.epics[this.epicNumber].subagents);
    }

    this.markDirty();
    this.validate();
  }

  /**
   * Handle toolbar actions
   */
  handleToolbarAction(action) {
    switch (action) {
      case 'preview':
        this.togglePreview();
        break;
      case 'template':
        this.loadTemplateContent();
        break;
      case 'variables':
        this.showVariablesHelp();
        break;
    }
  }

  /**
   * Toggle markdown preview
   */
  togglePreview() {
    const editorPane = document.getElementById(`epic-${this.epicNumber}-editor-pane`);
    const previewPane = document.getElementById(`epic-${this.epicNumber}-preview-pane`);
    const container = document.getElementById(`epic-${this.epicNumber}-editor-container`);

    if (previewPane.classList.contains('hidden')) {
      // Show preview
      previewPane.classList.remove('hidden');
      container.classList.add('split-view');
      this.updatePreview();
    } else {
      // Hide preview
      previewPane.classList.add('hidden');
      container.classList.remove('split-view');
    }
  }

  /**
   * Load template content into editor
   */
  loadTemplateContent() {
    if (confirm('Load the epic definition template? This will replace current content.')) {
      const state = this.stateManager.getState();
      const projectName = state.config?.projectName || 'My Project';

      let content = this.template || this.getDefaultTemplate();

      // Replace template variables
      content = content
        .replace(/\{\{EPIC_NUMBER\}\}/g, this.epicNumber)
        .replace(/\{\{PROJECT_NAME\}\}/g, projectName);

      const textarea = document.getElementById(`epic-${this.epicNumber}-markdown`);
      if (textarea) {
        textarea.value = content;
        this.handleMarkdownChange(content);
        this.updateStats();
        this.updatePreview();
        this.markDirty();
      }
    }
  }

  /**
   * Show variables help dialog
   */
  showVariablesHelp() {
    const helpText = `
Available Template Variables:

• {{EPIC_NUMBER}} - Current epic number (${this.epicNumber})
• {{EPIC_NAME}} - Epic name from the form
• {{EPIC_PURPOSE}} - Epic purpose from the form
• {{PROJECT_NAME}} - Project name from configuration
• {{PREV_EPIC_NUMBER}} - Previous epic number
• {{SUBAGENT_1_NAME}}, {{SUBAGENT_2_NAME}}, etc. - Subagent names

These variables will be replaced when the configuration is exported.
    `.trim();

    alert(helpText);
  }

  /**
   * Update character and word counts
   */
  updateStats() {
    const textarea = document.getElementById(`epic-${this.epicNumber}-markdown`);
    if (!textarea) return;

    const content = textarea.value;
    const charCount = content.length;
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

    const charCountEl = document.getElementById(`epic-${this.epicNumber}-char-count`);
    const wordCountEl = document.getElementById(`epic-${this.epicNumber}-word-count`);

    if (charCountEl) charCountEl.textContent = charCount;
    if (wordCountEl) wordCountEl.textContent = wordCount;
  }

  /**
   * Debounced preview update
   */
  debouncedPreviewUpdate() {
    clearTimeout(this.previewUpdateTimeout);
    this.previewUpdateTimeout = setTimeout(() => {
      this.updatePreview();
    }, 500);
  }

  /**
   * Update markdown preview
   */
  updatePreview() {
    const textarea = document.getElementById(`epic-${this.epicNumber}-markdown`);
    const previewEl = document.getElementById(`epic-${this.epicNumber}-preview`);

    if (!textarea || !previewEl) return;

    const markdown = textarea.value;
    const html = this.markdownToHtml(markdown);
    previewEl.innerHTML = html;
  }

  /**
   * Convert markdown to HTML (simple implementation)
   * For production, use a library like marked.js or showdown.js
   */
  markdownToHtml(markdown) {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');

    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Checkboxes
    html = html.replace(/- \[ \] (.*)/g, '<input type="checkbox" disabled> $1');
    html = html.replace(/- \[x\] (.*)/gi, '<input type="checkbox" checked disabled> $1');

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    // Highlight template variables
    html = html.replace(/\{\{([A-Z_]+)\}\}/g, '<span class="template-variable">{{$1}}</span>');

    return html;
  }

  /**
   * Validate epic data
   */
  validate() {
    const state = this.stateManager.getState();
    const epicData = state.epics?.[this.epicNumber] || this.getDefaultEpicData();
    const errors = [];

    // Validate name
    if (!epicData.name || epicData.name.trim().length < 3) {
      errors.push({ field: 'name', message: 'Epic name must be at least 3 characters' });
      this.showError(`epic-${this.epicNumber}-name-error`, 'Epic name must be at least 3 characters');
    } else {
      this.clearError(`epic-${this.epicNumber}-name-error`);
    }

    // Check for duplicate names
    if (epicData.name) {
      const duplicateEpic = Object.keys(state.epics || {}).find(num =>
        parseInt(num) !== this.epicNumber &&
        state.epics[num].name === epicData.name
      );
      if (duplicateEpic) {
        errors.push({ field: 'name', message: 'Epic name must be unique' });
        this.showError(`epic-${this.epicNumber}-name-error`, 'This epic name is already used');
      }
    }

    // Validate purpose
    if (!epicData.purpose || epicData.purpose.trim().length < 20) {
      errors.push({ field: 'purpose', message: 'Epic purpose must be at least 20 characters' });
      this.showError(`epic-${this.epicNumber}-purpose-error`, 'Epic purpose must be at least 20 characters');
    } else {
      this.clearError(`epic-${this.epicNumber}-purpose-error`);
    }

    // Validate definition
    if (!epicData.definition || epicData.definition.trim().length < 50) {
      errors.push({ field: 'definition', message: 'Epic definition must be at least 50 characters' });
    }

    // Validate subagents
    if (!epicData.subagents || epicData.subagents.length === 0) {
      errors.push({ field: 'subagents', message: 'At least 1 suggested subagent is required' });
      this.showError(`epic-${this.epicNumber}-subagents-error`, 'Add at least one suggested subagent');
    } else {
      this.clearError(`epic-${this.epicNumber}-subagents-error`);
    }

    // Check for unreplaced template variables in user-entered content
    if (epicData.definition) {
      const unreplacedVars = epicData.definition.match(/\{\{[A-Z_]+\}\}/g);
      if (unreplacedVars && unreplacedVars.length > 0) {
        errors.push({
          field: 'definition',
          message: `Unreplaced template variables: ${unreplacedVars.join(', ')}`
        });
      }
    }

    return errors.length === 0;
  }

  /**
   * Show error message
   */
  showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  /**
   * Clear error message
   */
  clearError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }

  /**
   * Mark editor as dirty (has unsaved changes)
   */
  markDirty() {
    this.isDirty = true;
    const statusEl = document.getElementById(`epic-${this.epicNumber}-save-status`);
    if (statusEl) {
      statusEl.querySelector('.save-text').textContent = 'Unsaved';
      statusEl.classList.add('unsaved');
    }
  }

  /**
   * Mark editor as clean (saved)
   */
  markClean() {
    this.isDirty = false;
    this.lastSaved = new Date();
    const statusEl = document.getElementById(`epic-${this.epicNumber}-save-status`);
    if (statusEl) {
      statusEl.querySelector('.save-text').textContent = 'Saved';
      statusEl.classList.remove('unsaved');
    }
    this.updateLastSavedTime();
  }

  /**
   * Update last saved time display
   */
  updateLastSavedTime() {
    const timeEl = document.getElementById(`epic-${this.epicNumber}-last-saved`);
    if (!timeEl || !this.lastSaved) return;

    const now = new Date();
    const diff = Math.floor((now - this.lastSaved) / 1000); // seconds

    let timeText;
    if (diff < 60) {
      timeText = 'Just now';
    } else if (diff < 3600) {
      const mins = Math.floor(diff / 60);
      timeText = `${mins} minute${mins > 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(diff / 3600);
      timeText = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    timeEl.textContent = timeText;
  }

  /**
   * Start auto-save interval (every 30 seconds)
   */
  startAutoSave() {
    this.autoSaveInterval = setInterval(() => {
      if (this.isDirty) {
        this.save();
      }
      this.updateLastSavedTime();
    }, 30000); // 30 seconds
  }

  /**
   * Stop auto-save interval
   */
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  /**
   * Save epic data to state
   */
  save() {
    this.stateManager.saveState();
    this.markClean();
    console.log(`Epic ${this.epicNumber} saved`);
  }

  /**
   * Destroy the editor and clean up
   */
  destroy() {
    this.stopAutoSave();
    if (this.isDirty) {
      this.save();
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EpicEditor };
}
