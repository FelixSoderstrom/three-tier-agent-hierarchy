# Quick Start: Using the Dynamic Markdown Editor System

## Overview

This guide helps you quickly integrate the epic and agent editors into your workflow builder.

## Step 1: Include Required Files

Add these files to your HTML page:

```html
<!-- CSS -->
<link rel="stylesheet" href="css/builder.css">
<link rel="stylesheet" href="css/editor.css">

<!-- JavaScript -->
<script src="js/state.js"></script>
<script src="js/epic-editor.js"></script>
<script src="js/agent-editor.js"></script>  <!-- Only if using specialized agents -->
```

## Step 2: Create Epic Editors

```javascript
// Load state from Step 1
const state = stateManager.getState();
const epicCount = state.config.epicCount;

// Create container
const container = document.getElementById('epic-editors-container');

// Create editors
const epicEditors = [];
for (let i = 1; i <= epicCount; i++) {
  const epicContainer = document.createElement('div');
  epicContainer.id = `epic-${i}-container`;
  container.appendChild(epicContainer);

  const editor = new EpicEditor(i, epicContainer, stateManager);
  editor.render();
  epicEditors.push(editor);
}
```

## Step 3: Create Agent Editors (Conditional)

```javascript
// Check if specialized agents are enabled
if (state.config.optionalFeatures.specializedAgents) {
  const container = document.getElementById('agent-editors-container');
  
  const agentEditors = [];
  let agentId = 1;
  
  // Create first agent editor
  const agentContainer = document.createElement('div');
  agentContainer.id = `agent-${agentId}-container`;
  container.appendChild(agentContainer);
  
  const editor = new AgentEditor(agentId, agentContainer, stateManager);
  editor.render();
  agentEditors.push(editor);
}
```

## Step 4: Validate Before Proceeding

```javascript
function validateAllEpics() {
  let allValid = true;
  epicEditors.forEach(editor => {
    if (!editor.validate()) {
      allValid = false;
    }
  });
  return allValid;
}

// On continue button click
if (validateAllEpics()) {
  // Save and proceed
  epicEditors.forEach(editor => editor.save());
  window.location.href = 'next-step.html';
} else {
  alert('Please fix validation errors');
}
```

## Step 5: Cleanup on Navigation

```javascript
window.addEventListener('beforeunload', () => {
  epicEditors.forEach(editor => editor.destroy());
  agentEditors.forEach(editor => editor.destroy());
});
```

## Features Available

### Epic Editor Features
- Markdown editing with preview
- Auto-save every 30 seconds
- Subagent chips (add/remove)
- Template loading
- Character/word counting
- Validation (name, purpose, definition, subagents)

### Agent Editor Features  
- Agent metadata fields
- Tool permission selection
- Markdown instructions
- Template loading
- Auto-save
- Validation (name, domain, description, purpose, tools)

## Keyboard Shortcuts

- `Ctrl+S` / `Cmd+S`: Save current editor
- `Ctrl+P` / `Cmd+P`: Toggle preview pane

## Templates Available

Located in `/meta-lesson/templates/`:
1. `product-manager.md` - Product-Manager agent configuration
2. `epic-definition.md` - Epic definition template
3. `meta-agent.md` - Meta-Agent configuration
4. `specialized-agent.md` - Specialized agent template
5. `README-template.md` - Project README template

## Example Implementation

See complete examples in:
- `builder-step2-example.html` - Epic definition step
- `builder-step3-example.html` - Agent configuration step

## State Structure

```javascript
{
  step: 2,
  config: { /* from Step 1 */ },
  epics: {
    1: {
      name: "Epic Name",
      purpose: "Epic purpose",
      definition: "# Markdown content...",
      subagents: ["Agent 1", "Agent 2"]
    }
  },
  agents: {
    1: {
      name: "Agent Name",
      domain: "Domain",
      description: "Description",
      purpose: "Purpose",
      tools: ["read", "write", "bash"],
      instructions: "# Markdown instructions...",
      responseFormat: "JSON format..."
    }
  }
}
```

## Next Steps

For complete implementation details, see:
- `ISSUE_9_IMPLEMENTATION.md` - Full implementation documentation
- Integration with Issue #10 for Review & Export functionality
