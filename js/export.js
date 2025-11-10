/**
 * Export System for Agentic Workflow Configuration
 * Generates downloadable ZIP files with .claude directory structure
 * and user-configured workflows
 */

/**
 * Main export function that generates and downloads the ZIP file
 * @returns {Promise<void>}
 */
async function generateZipExport() {
  try {
    // Update UI to show loading state
    updateExportButtonState('loading');

    // Step 1: Load state from stateManager
    const state = stateManager.getState();
    console.log('Loaded state:', state);

    // Step 2: Validate configuration
    const validation = validateConfiguration(state);
    if (!validation.isValid) {
      console.error('Validation failed:', validation.errors);
      displayValidationErrors(validation.errors);
      updateExportButtonState('error');
      return;
    }

    console.log('Validation passed');

    // Step 3: Create ZIP instance
    const zip = new JSZip();

    // Step 4: Create .claude directory structure
    const claudeFolder = zip.folder('.claude');
    const commandsFolder = claudeFolder.folder('commands');
    const epicsFolder = commandsFolder.folder('epics');

    // Step 5: Generate and add Product Manager configuration
    updateProgressMessage('Generating Product Manager configuration...');
    const productManagerContent = await generateProductManagerConfig(state);
    commandsFolder.file('product-manager.md', productManagerContent);

    // Step 6: Generate and add Meta-Agent configuration (if enabled)
    if (state.config.coreComponents.metaAgent) {
      updateProgressMessage('Generating Meta-Agent configuration...');
      const metaAgentContent = await generateMetaAgentConfig(state);
      commandsFolder.file('meta-agent.md', metaAgentContent);
    }

    // Step 7: Generate and add Epic definitions
    updateProgressMessage('Generating epic definitions...');
    const epicCount = state.config.epicCount;
    for (let i = 1; i <= epicCount; i++) {
      const epicData = state.epics[i];
      if (epicData) {
        const epicContent = await generateEpicDefinition(epicData, i, state);
        epicsFolder.file(`epic-${i}.md`, epicContent);
      }
    }

    // Step 8: Generate and add Specialized Agent configurations (if enabled)
    if (state.config.optionalFeatures.specializedAgents && state.agents) {
      updateProgressMessage('Generating specialized agent configurations...');
      const agentsFolder = claudeFolder.folder('agents');

      const agentIds = Object.keys(state.agents);
      agentIds.forEach((agentId, index) => {
        const agentData = state.agents[agentId];
        const agentContent = generateAgentConfig(agentData, state);
        agentsFolder.file(`agent-${index + 1}.md`, agentContent);
      });
    }

    // Step 9: Generate and add README
    updateProgressMessage('Generating README...');
    const readmeContent = await generateReadme(state);
    claudeFolder.file('README.md', readmeContent);

    // Step 10: Generate ZIP blob
    updateProgressMessage('Creating ZIP file...');
    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    // Step 11: Trigger download
    const filename = generateFilename();
    downloadZip(blob, filename);

    // Step 12: Update UI to show success
    updateExportButtonState('success');
    updateProgressMessage(`Successfully exported as ${filename}`);

    console.log('Export completed successfully');

  } catch (error) {
    console.error('Export failed:', error);
    updateExportButtonState('error');
    updateProgressMessage(`Export failed: ${error.message}`);
  }
}

/**
 * Load a template file from the templates directory
 * @param {string} filename - Template filename
 * @returns {Promise<string>} Template content
 */
async function loadTemplate(filename) {
  try {
    const response = await fetch(`../templates/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load template: ${filename}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error loading template ${filename}:`, error);
    throw error;
  }
}

/**
 * Replace template variables with actual data
 * @param {string} template - Template content with {{VARIABLE}} placeholders
 * @param {Object} data - Data object with variable values
 * @returns {string} Content with variables replaced
 */
function replaceVariables(template, data) {
  let content = template;

  // Replace each variable in the data object
  Object.keys(data).forEach(key => {
    const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    const value = data[key] !== undefined && data[key] !== null ? data[key] : '';
    content = content.replace(placeholder, value);
  });

  return content;
}

/**
 * Validate the entire configuration before export
 * @param {Object} state - Application state
 * @returns {Object} Validation result with isValid boolean and errors array
 */
function validateConfiguration(state) {
  const errors = [];

  // 1. Epic Validation
  const epicCount = state.config.epicCount;

  // Minimum 2 epics
  if (epicCount < 2) {
    errors.push({
      type: 'config',
      message: 'Minimum 2 epics required',
      field: 'epicCount'
    });
  }

  // Check that we have epic definitions for each epic number
  const epicNumbers = Object.keys(state.epics || {}).map(n => parseInt(n));
  for (let i = 1; i <= epicCount; i++) {
    const epicData = state.epics?.[i];

    if (!epicData) {
      errors.push({
        type: 'epic',
        epicNumber: i,
        message: `Epic ${i} is not defined`,
        field: 'epic'
      });
      continue;
    }

    // Validate epic name (unique and minimum 3 characters)
    if (!epicData.name || epicData.name.trim().length < 3) {
      errors.push({
        type: 'epic',
        epicNumber: i,
        message: `Epic ${i} name must be at least 3 characters`,
        field: 'name'
      });
    }

    // Check for duplicate epic names
    if (epicData.name) {
      const duplicateEpic = Object.keys(state.epics || {}).find(num =>
        parseInt(num) !== i &&
        state.epics[num].name === epicData.name
      );
      if (duplicateEpic) {
        errors.push({
          type: 'epic',
          epicNumber: i,
          message: `Epic ${i} has duplicate name: "${epicData.name}"`,
          field: 'name'
        });
      }
    }

    // Validate epic purpose (minimum 20 characters)
    if (!epicData.purpose || epicData.purpose.trim().length < 20) {
      errors.push({
        type: 'epic',
        epicNumber: i,
        message: `Epic ${i} purpose must be at least 20 characters`,
        field: 'purpose'
      });
    }

    // Validate epic definition (minimum 50 characters)
    if (!epicData.definition || epicData.definition.trim().length < 50) {
      errors.push({
        type: 'epic',
        epicNumber: i,
        message: `Epic ${i} definition must be at least 50 characters`,
        field: 'definition'
      });
    }

    // Validate suggested subagents (at least 1)
    if (!epicData.subagents || epicData.subagents.length === 0) {
      errors.push({
        type: 'epic',
        epicNumber: i,
        message: `Epic ${i} must have at least 1 suggested subagent`,
        field: 'subagents'
      });
    }

    // Check for unreplaced template variables in user content
    if (epicData.definition) {
      const unreplacedVars = epicData.definition.match(/\{\{[A-Z_]+\}\}/g);
      if (unreplacedVars && unreplacedVars.length > 0) {
        errors.push({
          type: 'epic',
          epicNumber: i,
          message: `Epic ${i} has unreplaced template variables: ${unreplacedVars.join(', ')}`,
          field: 'definition'
        });
      }
    }
  }

  // 2. Agent Validation (if specialized agents are enabled)
  if (state.config.optionalFeatures.specializedAgents && state.agents) {
    const agentIds = Object.keys(state.agents);

    agentIds.forEach((agentId) => {
      const agentData = state.agents[agentId];

      // Validate agent name (minimum 3 characters)
      if (!agentData.name || agentData.name.trim().length < 3) {
        errors.push({
          type: 'agent',
          agentId: agentId,
          message: `Agent ${agentId} name must be at least 3 characters`,
          field: 'name'
        });
      }

      // Check for duplicate agent names
      if (agentData.name) {
        const duplicateAgent = agentIds.find(id =>
          id !== agentId &&
          state.agents[id].name === agentData.name
        );
        if (duplicateAgent) {
          errors.push({
            type: 'agent',
            agentId: agentId,
            message: `Agent ${agentId} has duplicate name: "${agentData.name}"`,
            field: 'name'
          });
        }
      }

      // Validate agent description (minimum 20 characters)
      if (!agentData.description || agentData.description.trim().length < 20) {
        errors.push({
          type: 'agent',
          agentId: agentId,
          message: `Agent ${agentId} description must be at least 20 characters`,
          field: 'description'
        });
      }

      // Validate tools (at least 1 selected)
      if (!agentData.tools || agentData.tools.length === 0) {
        errors.push({
          type: 'agent',
          agentId: agentId,
          message: `Agent ${agentId} must have at least 1 tool selected`,
          field: 'tools'
        });
      }
    });
  }

  // 3. Metadata Validation
  if (state.config.projectName && state.config.projectName.trim().length === 0) {
    // If project name is provided, it should not be empty
    errors.push({
      type: 'config',
      message: 'Project name should not be empty if provided',
      field: 'projectName'
    });
  }

  // Epic count should match number of defined epics
  const definedEpicCount = Object.keys(state.epics || {}).length;
  if (definedEpicCount !== epicCount) {
    errors.push({
      type: 'config',
      message: `Epic count mismatch: configured ${epicCount}, defined ${definedEpicCount}`,
      field: 'epicCount'
    });
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Generate Product Manager configuration content
 * @param {Object} state - Application state
 * @returns {Promise<string>} Generated content
 */
async function generateProductManagerConfig(state) {
  const template = await loadTemplate('product-manager.md');

  // Generate epic list
  const epicList = generateEpicList(state);

  const variables = {
    PROJECT_NAME: state.config.projectName || 'Agentic Workflow',
    EPIC_COUNT: state.config.epicCount,
    EPIC_LIST: epicList,
    CUSTOM_INSTRUCTIONS: state.config.customInstructions || ''
  };

  return replaceVariables(template, variables);
}

/**
 * Generate Meta-Agent configuration content
 * @param {Object} state - Application state
 * @returns {Promise<string>} Generated content
 */
async function generateMetaAgentConfig(state) {
  const template = await loadTemplate('meta-agent.md');

  const variables = {
    PROJECT_NAME: state.config.projectName || 'Agentic Workflow',
    EPIC_COUNT: state.config.epicCount
  };

  return replaceVariables(template, variables);
}

/**
 * Generate Epic definition content
 * @param {Object} epicData - Epic data from state
 * @param {number} epicNumber - Epic number
 * @param {Object} state - Application state
 * @returns {Promise<string>} Generated content
 */
async function generateEpicDefinition(epicData, epicNumber, state) {
  const template = await loadTemplate('epic-definition.md');

  // Generate subagents section
  const subagentsSection = generateSubagentsSection(epicData.subagents || []);

  // Calculate previous and next epic numbers
  const prevEpicNumber = epicNumber - 1;
  const nextEpicNumber = epicNumber + 1;

  const variables = {
    EPIC_NUMBER: epicNumber,
    EPIC_NAME: epicData.name || `Epic ${epicNumber}`,
    EPIC_PURPOSE: epicData.purpose || '',
    EPIC_DEFINITION: epicData.definition || '',
    PROJECT_NAME: state.config.projectName || 'Agentic Workflow',
    PREV_EPIC_NUMBER: prevEpicNumber > 0 ? prevEpicNumber : '',
    NEXT_EPIC_NUMBER: nextEpicNumber <= state.config.epicCount ? nextEpicNumber : '',
    SUGGESTED_SUBAGENTS: (epicData.subagents || []).join(', '),
    SUBAGENT_1_NAME: epicData.subagents?.[0] || '[Subagent 1]',
    SUBAGENT_2_NAME: epicData.subagents?.[1] || '[Subagent 2]',
    SUBAGENT_3_NAME: epicData.subagents?.[2] || '[Subagent 3]'
  };

  let content = replaceVariables(template, variables);

  // Also replace the epic definition content if it exists
  // This allows users to have their custom markdown in the epic definition
  if (epicData.definition && epicData.definition.trim().length > 0) {
    // The definition already contains user's markdown, so we keep it as is
    // Template variables in the user's definition were already validated
  }

  return content;
}

/**
 * Generate Specialized Agent configuration content
 * @param {Object} agentData - Agent data from state
 * @param {Object} state - Application state
 * @returns {string} Generated content
 */
function generateAgentConfig(agentData, state) {
  // Since we're loading template async, we'll use a simpler approach for agents
  // or we could make this async too
  let content = `# Specialized Agent Configuration: ${agentData.name}

## Agent Identity

- **Agent Name**: ${agentData.name}
- **Domain**: ${agentData.domain || 'General'}
- **Specialization**: ${agentData.description || 'Specialized agent'}
- **Role**: ${agentData.purpose || 'Supporting role in workflow'}

## Purpose

${agentData.purpose || 'This specialized agent assists with specific tasks in the workflow.'}

## Domain Expertise

${agentData.description || 'Domain-specific expertise and capabilities.'}

## Tool Access Requirements

This agent has access to the following tools:

${generateToolsList(agentData.tools || [])}

## Detailed Instructions

${agentData.instructions || 'No specific instructions provided.'}

## Response Format

${agentData.responseFormat || 'Standard markdown format for responses.'}

---

**Project**: ${state.config.projectName || 'Agentic Workflow'}
**Agent Type**: Specialized Agent
**Configuration Version**: 1.0.0
`;

  return content;
}

/**
 * Generate README content
 * @param {Object} state - Application state
 * @returns {Promise<string>} Generated content
 */
async function generateReadme(state) {
  const template = await loadTemplate('README-template.md');

  // Generate epic list
  const epicList = generateEpicListForReadme(state);

  // Generate agent list (if applicable)
  const agentList = generateAgentList(state);

  // Generate directory structure
  const directoryStructure = generateDirectoryStructure(state);

  const variables = {
    PROJECT_NAME: state.config.projectName || 'Agentic Workflow',
    EPIC_COUNT: state.config.epicCount,
    EPIC_LIST: epicList,
    AGENT_LIST: agentList,
    DIRECTORY_STRUCTURE: directoryStructure,
    CUSTOM_INSTRUCTIONS: state.config.customInstructions || '',
    CUSTOM_DIRECTORY_STRUCTURE: '[Your project files and directories]',
    EPIC_DURATION_TABLE: generateDurationTable(state),
    TOTAL_DURATION: 'Varies by project complexity',
    CUSTOM_CHANGELOG_ENTRIES: '',
    PROJECT_STATUS: 'Ready for execution'
  };

  return replaceVariables(template, variables);
}

/**
 * Generate epic list for product manager
 * @param {Object} state - Application state
 * @returns {string} Formatted epic list
 */
function generateEpicList(state) {
  const epicCount = state.config.epicCount;
  const epics = [];

  for (let i = 1; i <= epicCount; i++) {
    const epicData = state.epics?.[i];
    if (epicData) {
      epics.push(`${i}. **${epicData.name}**: ${epicData.purpose}`);
    } else {
      epics.push(`${i}. Epic ${i} (not yet defined)`);
    }
  }

  return epics.join('\n');
}

/**
 * Generate epic list for README
 * @param {Object} state - Application state
 * @returns {string} Formatted epic list
 */
function generateEpicListForReadme(state) {
  const epicCount = state.config.epicCount;
  const epics = [];

  for (let i = 1; i <= epicCount; i++) {
    const epicData = state.epics?.[i];
    if (epicData) {
      epics.push(`### Epic ${i}: ${epicData.name}\n\n${epicData.purpose}\n\n**Suggested Subagents**: ${(epicData.subagents || []).join(', ')}`);
    } else {
      epics.push(`### Epic ${i}\n\n(Not yet defined)`);
    }
  }

  return epics.join('\n\n');
}

/**
 * Generate agent list for README
 * @param {Object} state - Application state
 * @returns {string} Formatted agent list
 */
function generateAgentList(state) {
  if (!state.config.optionalFeatures.specializedAgents || !state.agents) {
    return 'No specialized agents configured.';
  }

  const agentIds = Object.keys(state.agents);
  if (agentIds.length === 0) {
    return 'No specialized agents configured.';
  }

  const agents = agentIds.map((agentId, index) => {
    const agentData = state.agents[agentId];
    return `### Agent ${index + 1}: ${agentData.name}\n\n- **Domain**: ${agentData.domain}\n- **Description**: ${agentData.description}\n- **Tools**: ${agentData.tools.join(', ')}`;
  });

  return agents.join('\n\n');
}

/**
 * Generate directory structure for README
 * @param {Object} state - Application state
 * @returns {string} Directory structure
 */
function generateDirectoryStructure(state) {
  const hasAgents = state.config.optionalFeatures.specializedAgents &&
                    state.agents &&
                    Object.keys(state.agents).length > 0;

  let structure = `.claude/
├── commands/
│   ├── product-manager.md`;

  if (state.config.coreComponents.metaAgent) {
    structure += `\n│   ├── meta-agent.md`;
  }

  structure += `\n│   └── epics/`;

  for (let i = 1; i <= state.config.epicCount; i++) {
    structure += `\n│       ├── epic-${i}.md`;
  }

  if (hasAgents) {
    const agentCount = Object.keys(state.agents).length;
    structure += `\n├── agents/`;
    for (let i = 1; i <= agentCount; i++) {
      structure += `\n│   ├── agent-${i}.md`;
    }
  }

  structure += `\n└── README.md`;

  return structure;
}

/**
 * Generate subagents section for epic definition
 * @param {Array<string>} subagents - Array of subagent names
 * @returns {string} Formatted subagents section
 */
function generateSubagentsSection(subagents) {
  if (!subagents || subagents.length === 0) {
    return 'No specific subagents suggested.';
  }

  return subagents.map((agent, index) => {
    return `### ${index + 1}. ${agent}\n- **Role**: [Specialized role]\n- **Responsibilities**: [Key responsibilities]`;
  }).join('\n\n');
}

/**
 * Generate tools list for agent configuration
 * @param {Array<string>} tools - Array of tool IDs
 * @returns {string} Formatted tools list
 */
function generateToolsList(tools) {
  if (!tools || tools.length === 0) {
    return 'No tools configured.';
  }

  const toolDescriptions = {
    read: 'Read files from the filesystem',
    write: 'Create new files',
    edit: 'Modify existing files',
    bash: 'Execute shell commands',
    grep: 'Search file contents',
    glob: 'Find files by pattern'
  };

  return tools.map(toolId => {
    const description = toolDescriptions[toolId] || 'Tool access';
    return `- **${toolId.charAt(0).toUpperCase() + toolId.slice(1)}**: ${description}`;
  }).join('\n');
}

/**
 * Generate duration table for README
 * @param {Object} state - Application state
 * @returns {string} Formatted duration table
 */
function generateDurationTable(state) {
  const rows = [];
  for (let i = 1; i <= state.config.epicCount; i++) {
    const epicData = state.epics?.[i];
    const epicName = epicData?.name || `Epic ${i}`;
    rows.push(`| Epic ${i} | TBD | Medium |`);
  }
  return rows.join('\n');
}

/**
 * Generate filename with timestamp
 * @returns {string} Filename for ZIP download
 */
function generateFilename() {
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '-')
    .split('.')[0];

  return `claude-workflow-${timestamp}.zip`;
}

/**
 * Trigger ZIP file download
 * @param {Blob} blob - ZIP blob
 * @param {string} filename - Download filename
 */
function downloadZip(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Update export button state
 * @param {string} state - Button state: 'ready', 'loading', 'success', 'error'
 */
function updateExportButtonState(state) {
  const button = document.getElementById('export-button');
  if (!button) return;

  // Remove all state classes
  button.classList.remove('btn-loading', 'btn-success', 'btn-error');

  switch (state) {
    case 'loading':
      button.disabled = true;
      button.classList.add('btn-loading');
      button.innerHTML = '<span class="spinner"></span> Generating ZIP...';
      break;
    case 'success':
      button.disabled = false;
      button.classList.add('btn-success');
      button.innerHTML = '✓ Download Ready!';
      // Reset after 3 seconds
      setTimeout(() => {
        updateExportButtonState('ready');
      }, 3000);
      break;
    case 'error':
      button.disabled = false;
      button.classList.add('btn-error');
      button.innerHTML = '✗ Export Failed';
      // Reset after 3 seconds
      setTimeout(() => {
        updateExportButtonState('ready');
      }, 3000);
      break;
    case 'ready':
    default:
      button.disabled = false;
      button.innerHTML = 'Export Configuration';
      break;
  }
}

/**
 * Update progress message
 * @param {string} message - Progress message
 */
function updateProgressMessage(message) {
  const progressEl = document.getElementById('export-progress');
  if (progressEl) {
    progressEl.textContent = message;
    progressEl.style.display = 'block';
  }
}

/**
 * Display validation errors in the UI
 * @param {Array} errors - Array of validation error objects
 */
function displayValidationErrors(errors) {
  const container = document.getElementById('validation-errors');
  if (!container) return;

  container.innerHTML = '';
  container.style.display = 'block';

  const header = document.createElement('h3');
  header.textContent = 'Validation Errors';
  header.className = 'validation-errors-header';
  container.appendChild(header);

  const errorList = document.createElement('ul');
  errorList.className = 'validation-errors-list';

  errors.forEach(error => {
    const li = document.createElement('li');
    li.className = 'validation-error-item';

    let errorText = '';
    if (error.type === 'epic') {
      errorText = `Epic ${error.epicNumber}: ${error.message}`;
    } else if (error.type === 'agent') {
      errorText = `Agent ${error.agentId}: ${error.message}`;
    } else {
      errorText = error.message;
    }

    li.textContent = errorText;
    errorList.appendChild(li);
  });

  container.appendChild(errorList);

  // Scroll to errors
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Clear validation errors from UI
 */
function clearValidationErrors() {
  const container = document.getElementById('validation-errors');
  if (container) {
    container.innerHTML = '';
    container.style.display = 'none';
  }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateZipExport,
    loadTemplate,
    replaceVariables,
    validateConfiguration,
    generateProductManagerConfig,
    generateEpicDefinition,
    generateAgentConfig,
    generateReadme
  };
}
