/**
 * Agent Editor Component
 * Provides interface for creating custom specialized agent configurations
 * Only shown if user selected "Specialized Agent Templates" in Step 1
 */

class AgentEditor {
  constructor(agentId, container, stateManager) {
    this.agentId = agentId;
    this.container = container;
    this.stateManager = stateManager;
    this.autoSaveInterval = null;
    this.previewUpdateTimeout = null;
    this.lastSaved = null;
    this.isDirty = false;

    // Available tools for agents
    this.availableTools = [
      { id: 'read', name: 'Read', description: 'Read files from the filesystem' },
      { id: 'write', name: 'Write', description: 'Create new files' },
      { id: 'edit', name: 'Edit', description: 'Modify existing files' },
      { id: 'bash', name: 'Bash', description: 'Execute shell commands' },
      { id: 'grep', name: 'Grep', description: 'Search file contents' },
      { id: 'glob', name: 'Glob', description: 'Find files by pattern' }
    ];

    // Load template
    this.loadTemplate();
  }

  /**
   * Load the specialized agent template
   */
  async loadTemplate() {
    try {
      const response = await fetch('/meta-lesson/templates/specialized-agent.md');
      this.template = await response.text();
    } catch (error) {
      console.error('Error loading agent template:', error);
      this.template = this.getDefaultTemplate();
    }
  }

  /**
   * Get default template if loading fails
   */
  getDefaultTemplate() {
    return `# Specialized Agent Configuration: {{AGENT_NAME}}

## Agent Identity

- **Agent Name**: {{AGENT_NAME}}
- **Domain**: {{DOMAIN}}
- **Specialization**: [Specific area of expertise]
- **Role**: [Primary role in workflow]

## Purpose

This specialized agent is designed to excel in **{{DOMAIN}}** tasks.

## Domain Expertise

### Core Competencies
1. [Competency 1]
2. [Competency 2]
3. [Competency 3]

## Tool Access Requirements

{{TOOLS}}

## Detailed Instructions

[Detailed step-by-step instructions for this agent...]
`;
  }

  /**
   * Render the agent editor interface
   */
  render() {
    const state = this.stateManager.getState();
    const agentData = state.agents?.[this.agentId] || this.getDefaultAgentData();

    this.container.innerHTML = `
      <div class="agent-editor-container" data-agent="${this.agentId}">
        <!-- Header -->
        <div class="agent-editor-header">
          <div class="agent-number-badge">Agent ${this.agentId}</div>
          <h2 class="agent-editor-title">Specialized Agent Configuration</h2>
          <div class="agent-editor-status">
            <span class="auto-save-indicator" id="agent-${this.agentId}-save-status">
              <span class="save-icon">💾</span>
              <span class="save-text">Saved</span>
            </span>
            <span class="last-saved-time" id="agent-${this.agentId}-last-saved"></span>
          </div>
        </div>

        <!-- Agent Metadata -->
        <div class="agent-metadata-section">
          <div class="form-row">
            <div class="form-group">
              <label for="agent-${this.agentId}-name" class="form-label required">
                Agent Name
              </label>
              <input
                type="text"
                id="agent-${this.agentId}-name"
                class="form-input agent-name-input"
                placeholder="e.g., Data Analysis Specialist"
                value="${agentData.name || ''}"
                data-agent="${this.agentId}"
                required
                minlength="3"
              />
              <span class="form-helper-text">A clear, descriptive name (minimum 3 characters)</span>
              <span class="error-text" id="agent-${this.agentId}-name-error"></span>
            </div>

            <div class="form-group">
              <label for="agent-${this.agentId}-domain" class="form-label required">
                Domain
              </label>
              <input
                type="text"
                id="agent-${this.agentId}-domain"
                class="form-input agent-domain-input"
                placeholder="e.g., data-science, web-development"
                value="${agentData.domain || ''}"
                data-agent="${this.agentId}"
                required
                minlength="3"
              />
              <span class="form-helper-text">Primary domain of expertise</span>
              <span class="error-text" id="agent-${this.agentId}-domain-error"></span>
            </div>
          </div>

          <div class="form-group">
            <label for="agent-${this.agentId}-description" class="form-label required">
              Agent Description
            </label>
            <textarea
              id="agent-${this.agentId}-description"
              class="form-input agent-description-input"
              placeholder="Describe what this agent specializes in..."
              rows="3"
              data-agent="${this.agentId}"
              required
              minlength="20"
            >${agentData.description || ''}</textarea>
            <span class="form-helper-text">Brief description of the agent's capabilities (minimum 20 characters)</span>
            <span class="error-text" id="agent-${this.agentId}-description-error"></span>
          </div>

          <div class="form-group">
            <label for="agent-${this.agentId}-purpose" class="form-label required">
              Agent Purpose
            </label>
            <textarea
              id="agent-${this.agentId}-purpose"
              class="form-input agent-purpose-input"
              placeholder="What specific tasks or problems does this agent solve?"
              rows="2"
              data-agent="${this.agentId}"
              required
              minlength="20"
            >${agentData.purpose || ''}</textarea>
            <span class="form-helper-text">Clear statement of what this agent accomplishes</span>
            <span class="error-text" id="agent-${this.agentId}-purpose-error"></span>
          </div>
        </div>

        <!-- Tool Selection -->
        <div class="tools-selection-section">
          <label class="form-label required">
            Tool Access Permissions
          </label>
          <p class="form-helper-text">Select which tools this agent needs to perform its duties</p>

          <div class="tools-grid" id="agent-${this.agentId}-tools">
            ${this.renderToolsGrid(agentData.tools || [])}
          </div>
          <span class="error-text" id="agent-${this.agentId}-tools-error"></span>
        </div>

        <!-- Markdown Editor Section -->
        <div class="markdown-editor-section">
          <label class="form-label required">
            Detailed Instructions (Markdown)
          </label>
          <p class="form-helper-text">Provide comprehensive instructions for this agent in markdown format</p>

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
                <span class="stat-value" id="agent-${this.agentId}-word-count">0</span>
              </span>
              <span class="stat-item">
                <span class="stat-label">Chars:</span>
                <span class="stat-value" id="agent-${this.agentId}-char-count">0</span>
              </span>
            </div>
          </div>

          <div class="editor-container" id="agent-${this.agentId}-editor-container">
            <!-- Editor Pane -->
            <div class="editor-pane" id="agent-${this.agentId}-editor-pane">
              <textarea
                id="agent-${this.agentId}-markdown"
                class="markdown-textarea"
                placeholder="Enter detailed instructions in markdown..."
                data-agent="${this.agentId}"
              >${agentData.instructions || ''}</textarea>
            </div>

            <!-- Preview Pane -->
            <div class="preview-pane hidden" id="agent-${this.agentId}-preview-pane">
              <div class="preview-header">
                <h3>Preview</h3>
                <button type="button" class="btn-close-preview" data-agent="${this.agentId}">✕</button>
              </div>
              <div class="preview-content" id="agent-${this.agentId}-preview"></div>
            </div>
          </div>
        </div>

        <!-- Response Format -->
        <div class="response-format-section">
          <label for="agent-${this.agentId}-response-format" class="form-label">
            Response Format Specification (Optional)
          </label>
          <textarea
            id="agent-${this.agentId}-response-format"
            class="form-input agent-response-format-input"
            placeholder="Specify how this agent should format its responses..."
            rows="4"
            data-agent="${this.agentId}"
          >${agentData.responseFormat || ''}</textarea>
          <span class="form-helper-text">Define the expected output format for this agent (JSON, markdown, etc.)</span>
        </div>

        <!-- Validation Messages -->
        <div class="agent-validation-messages" id="agent-${this.agentId}-validation"></div>
      </div>
    `;

    this.attachEventListeners();
    this.startAutoSave();
    this.updateStats();
    this.updateLastSavedTime();
  }

  /**
   * Render tools selection grid
   */
  renderToolsGrid(selectedTools) {
    return this.availableTools.map(tool => {
      const isSelected = selectedTools.includes(tool.id);
      return `
        <div class="tool-option ${isSelected ? 'selected' : ''}" data-tool="${tool.id}">
          <input
            type="checkbox"
            id="agent-${this.agentId}-tool-${tool.id}"
            value="${tool.id}"
            ${isSelected ? 'checked' : ''}
            data-agent="${this.agentId}"
          />
          <div class="tool-checkbox-visual"></div>
          <div class="tool-info">
            <div class="tool-name">${tool.name}</div>
            <div class="tool-description">${tool.description}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Get default agent data structure
   */
  getDefaultAgentData() {
    return {
      name: '',
      domain: '',
      description: '',
      purpose: '',
      tools: [],
      instructions: '',
      responseFormat: ''
    };
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    const agentId = this.agentId;

    // Agent name input
    const nameInput = document.getElementById(`agent-${agentId}-name`);
    nameInput?.addEventListener('input', (e) => {
      this.handleNameChange(e.target.value);
      this.markDirty();
    });

    // Domain input
    const domainInput = document.getElementById(`agent-${agentId}-domain`);
    domainInput?.addEventListener('input', (e) => {
      this.handleDomainChange(e.target.value);
      this.markDirty();
    });

    // Description textarea
    const descriptionInput = document.getElementById(`agent-${agentId}-description`);
    descriptionInput?.addEventListener('input', (e) => {
      this.handleDescriptionChange(e.target.value);
      this.markDirty();
    });

    // Purpose textarea
    const purposeInput = document.getElementById(`agent-${agentId}-purpose`);
    purposeInput?.addEventListener('input', (e) => {
      this.handlePurposeChange(e.target.value);
      this.markDirty();
    });

    // Response format textarea
    const responseFormatInput = document.getElementById(`agent-${agentId}-response-format`);
    responseFormatInput?.addEventListener('input', (e) => {
      this.handleResponseFormatChange(e.target.value);
      this.markDirty();
    });

    // Tool selection (event delegation)
    const toolsGrid = document.getElementById(`agent-${agentId}-tools`);
    toolsGrid?.addEventListener('click', (e) => {
      const toolOption = e.target.closest('.tool-option');
      if (toolOption) {
        const toolId = toolOption.dataset.tool;
        const checkbox = toolOption.querySelector('input[type="checkbox"]');
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        this.handleToolToggle(toolId, checkbox.checked);
        toolOption.classList.toggle('selected', checkbox.checked);
        this.markDirty();
      }
    });

    // Markdown textarea
    const markdownTextarea = document.getElementById(`agent-${agentId}-markdown`);
    markdownTextarea?.addEventListener('input', (e) => {
      this.handleInstructionsChange(e.target.value);
      this.updateStats();
      this.debouncedPreviewUpdate();
      this.markDirty();
    });

    // Toolbar buttons
    const toolbar = document.querySelector(`#agent-${agentId}-editor-container .editor-toolbar`);
    toolbar?.addEventListener('click', (e) => {
      const btn = e.target.closest('.toolbar-btn');
      if (btn) {
        const action = btn.dataset.action;
        this.handleToolbarAction(action);
      }
    });

    // Close preview button
    const closePreviewBtn = document.querySelector(`.btn-close-preview[data-agent="${agentId}"]`);
    closePreviewBtn?.addEventListener('click', () => {
      this.togglePreview();
    });
  }

  /**
   * Handle agent name change
   */
  handleNameChange(name) {
    const state = this.stateManager.getState();
    if (!state.agents) state.agents = {};
    if (!state.agents[this.agentId]) state.agents[this.agentId] = this.getDefaultAgentData();

    state.agents[this.agentId].name = name;
    this.stateManager.state.agents = state.agents;
    this.validate();
  }

  /**
   * Handle domain change
   */
  handleDomainChange(domain) {
    const state = this.stateManager.getState();
    if (!state.agents) state.agents = {};
    if (!state.agents[this.agentId]) state.agents[this.agentId] = this.getDefaultAgentData();

    state.agents[this.agentId].domain = domain;
    this.stateManager.state.agents = state.agents;
    this.validate();
  }

  /**
   * Handle description change
   */
  handleDescriptionChange(description) {
    const state = this.stateManager.getState();
    if (!state.agents) state.agents = {};
    if (!state.agents[this.agentId]) state.agents[this.agentId] = this.getDefaultAgentData();

    state.agents[this.agentId].description = description;
    this.stateManager.state.agents = state.agents;
    this.validate();
  }

  /**
   * Handle purpose change
   */
  handlePurposeChange(purpose) {
    const state = this.stateManager.getState();
    if (!state.agents) state.agents = {};
    if (!state.agents[this.agentId]) state.agents[this.agentId] = this.getDefaultAgentData();

    state.agents[this.agentId].purpose = purpose;
    this.stateManager.state.agents = state.agents;
    this.validate();
  }

  /**
   * Handle instructions change
   */
  handleInstructionsChange(instructions) {
    const state = this.stateManager.getState();
    if (!state.agents) state.agents = {};
    if (!state.agents[this.agentId]) state.agents[this.agentId] = this.getDefaultAgentData();

    state.agents[this.agentId].instructions = instructions;
    this.stateManager.state.agents = state.agents;
    this.validate();
  }

  /**
   * Handle response format change
   */
  handleResponseFormatChange(format) {
    const state = this.stateManager.getState();
    if (!state.agents) state.agents = {};
    if (!state.agents[this.agentId]) state.agents[this.agentId] = this.getDefaultAgentData();

    state.agents[this.agentId].responseFormat = format;
    this.stateManager.state.agents = state.agents;
  }

  /**
   * Handle tool toggle
   */
  handleToolToggle(toolId, isEnabled) {
    const state = this.stateManager.getState();
    if (!state.agents) state.agents = {};
    if (!state.agents[this.agentId]) state.agents[this.agentId] = this.getDefaultAgentData();
    if (!state.agents[this.agentId].tools) state.agents[this.agentId].tools = [];

    if (isEnabled) {
      if (!state.agents[this.agentId].tools.includes(toolId)) {
        state.agents[this.agentId].tools.push(toolId);
      }
    } else {
      state.agents[this.agentId].tools = state.agents[this.agentId].tools.filter(t => t !== toolId);
    }

    this.stateManager.state.agents = state.agents;
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
    const previewPane = document.getElementById(`agent-${this.agentId}-preview-pane`);
    const container = document.getElementById(`agent-${this.agentId}-editor-container`);

    if (previewPane.classList.contains('hidden')) {
      previewPane.classList.remove('hidden');
      container.classList.add('split-view');
      this.updatePreview();
    } else {
      previewPane.classList.add('hidden');
      container.classList.remove('split-view');
    }
  }

  /**
   * Load template content
   */
  loadTemplateContent() {
    if (confirm('Load the specialized agent template? This will replace current instructions.')) {
      const state = this.stateManager.getState();
      const agentData = state.agents?.[this.agentId] || this.getDefaultAgentData();

      let content = this.template || this.getDefaultTemplate();

      // Replace template variables
      content = content
        .replace(/\{\{AGENT_NAME\}\}/g, agentData.name || '[Agent Name]')
        .replace(/\{\{DOMAIN\}\}/g, agentData.domain || '[Domain]');

      // Replace tools section
      const toolsList = agentData.tools.map(toolId => {
        const tool = this.availableTools.find(t => t.id === toolId);
        return `- **${tool.name}**: ${tool.description}`;
      }).join('\n');
      content = content.replace(/\{\{TOOLS\}\}/g, toolsList || '[No tools selected]');

      const textarea = document.getElementById(`agent-${this.agentId}-markdown`);
      if (textarea) {
        textarea.value = content;
        this.handleInstructionsChange(content);
        this.updateStats();
        this.updatePreview();
        this.markDirty();
      }
    }
  }

  /**
   * Show variables help
   */
  showVariablesHelp() {
    const helpText = `
Available Template Variables:

• {{AGENT_NAME}} - Agent name from the form
• {{DOMAIN}} - Domain from the form
• {{TOOLS}} - List of selected tools
• {{PROJECT_NAME}} - Project name from configuration

These variables will be replaced when the configuration is exported.
    `.trim();

    alert(helpText);
  }

  /**
   * Update stats
   */
  updateStats() {
    const textarea = document.getElementById(`agent-${this.agentId}-markdown`);
    if (!textarea) return;

    const content = textarea.value;
    const charCount = content.length;
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

    const charCountEl = document.getElementById(`agent-${this.agentId}-char-count`);
    const wordCountEl = document.getElementById(`agent-${this.agentId}-word-count`);

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
   * Update preview
   */
  updatePreview() {
    const textarea = document.getElementById(`agent-${this.agentId}-markdown`);
    const previewEl = document.getElementById(`agent-${this.agentId}-preview`);

    if (!textarea || !previewEl) return;

    const markdown = textarea.value;
    const html = this.markdownToHtml(markdown);
    previewEl.innerHTML = html;
  }

  /**
   * Convert markdown to HTML (simple implementation)
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

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    // Highlight template variables
    html = html.replace(/\{\{([A-Z_]+)\}\}/g, '<span class="template-variable">{{$1}}</span>');

    return html;
  }

  /**
   * Validate agent data
   */
  validate() {
    const state = this.stateManager.getState();
    const agentData = state.agents?.[this.agentId] || this.getDefaultAgentData();
    const errors = [];

    // Validate name
    if (!agentData.name || agentData.name.trim().length < 3) {
      errors.push({ field: 'name', message: 'Agent name must be at least 3 characters' });
      this.showError(`agent-${this.agentId}-name-error`, 'Agent name must be at least 3 characters');
    } else {
      this.clearError(`agent-${this.agentId}-name-error`);
    }

    // Check for duplicate names
    if (agentData.name) {
      const duplicateAgent = Object.keys(state.agents || {}).find(id =>
        id !== this.agentId &&
        state.agents[id].name === agentData.name
      );
      if (duplicateAgent) {
        errors.push({ field: 'name', message: 'Agent name must be unique' });
        this.showError(`agent-${this.agentId}-name-error`, 'This agent name is already used');
      }
    }

    // Validate domain
    if (!agentData.domain || agentData.domain.trim().length < 3) {
      errors.push({ field: 'domain', message: 'Domain must be at least 3 characters' });
      this.showError(`agent-${this.agentId}-domain-error`, 'Domain must be at least 3 characters');
    } else {
      this.clearError(`agent-${this.agentId}-domain-error`);
    }

    // Validate description
    if (!agentData.description || agentData.description.trim().length < 20) {
      errors.push({ field: 'description', message: 'Description must be at least 20 characters' });
      this.showError(`agent-${this.agentId}-description-error`, 'Description must be at least 20 characters');
    } else {
      this.clearError(`agent-${this.agentId}-description-error`);
    }

    // Validate purpose
    if (!agentData.purpose || agentData.purpose.trim().length < 20) {
      errors.push({ field: 'purpose', message: 'Purpose must be at least 20 characters' });
      this.showError(`agent-${this.agentId}-purpose-error`, 'Purpose must be at least 20 characters');
    } else {
      this.clearError(`agent-${this.agentId}-purpose-error`);
    }

    // Validate tools
    if (!agentData.tools || agentData.tools.length === 0) {
      errors.push({ field: 'tools', message: 'At least 1 tool must be selected' });
      this.showError(`agent-${this.agentId}-tools-error`, 'Select at least one tool for this agent');
    } else {
      this.clearError(`agent-${this.agentId}-tools-error`);
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
   * Mark as dirty
   */
  markDirty() {
    this.isDirty = true;
    const statusEl = document.getElementById(`agent-${this.agentId}-save-status`);
    if (statusEl) {
      statusEl.querySelector('.save-text').textContent = 'Unsaved';
      statusEl.classList.add('unsaved');
    }
  }

  /**
   * Mark as clean
   */
  markClean() {
    this.isDirty = false;
    this.lastSaved = new Date();
    const statusEl = document.getElementById(`agent-${this.agentId}-save-status`);
    if (statusEl) {
      statusEl.querySelector('.save-text').textContent = 'Saved';
      statusEl.classList.remove('unsaved');
    }
    this.updateLastSavedTime();
  }

  /**
   * Update last saved time
   */
  updateLastSavedTime() {
    const timeEl = document.getElementById(`agent-${this.agentId}-last-saved`);
    if (!timeEl || !this.lastSaved) return;

    const now = new Date();
    const diff = Math.floor((now - this.lastSaved) / 1000);

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
   * Start auto-save
   */
  startAutoSave() {
    this.autoSaveInterval = setInterval(() => {
      if (this.isDirty) {
        this.save();
      }
      this.updateLastSavedTime();
    }, 30000);
  }

  /**
   * Stop auto-save
   */
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  /**
   * Save agent data
   */
  save() {
    this.stateManager.saveState();
    this.markClean();
    console.log(`Agent ${this.agentId} saved`);
  }

  /**
   * Destroy the editor
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
  module.exports = { AgentEditor };
}
