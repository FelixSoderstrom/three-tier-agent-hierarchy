# Building with Agentic Workflows - Vision Document

**Project Type**: Interactive Web-Based Educational Platform
**Target Audience**: AI/ML Students
**Learning Objective**: Teach students to build reusable multi-agent workflow systems
**Deliverable**: Custom `.claude/` directory template generator

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Origin Story](#origin-story)
3. [Educational Philosophy](#educational-philosophy)
4. [User Journey](#user-journey)
5. [Component Specifications](#component-specifications)
6. [Technical Architecture](#technical-architecture)
7. [Content Structure](#content-structure)
8. [Export System](#export-system)
9. [Builder Wizard](#builder-wizard)
10. [Design System](#design-system)
11. [Felix's Original Workflow](#felixs-original-workflow)
12. [Development Guidelines](#development-guidelines)

---

## Project Overview

### What This Is

An interactive web application that teaches AI/ML students how to build complex projects using hands-free agentic workflows. Students learn by:

1. **[Optional]** Experiencing Felix's story of building an attention mechanism lesson through automated agents
2. **[Required]** Exploring a gallery of 2-epic workflow examples for inspiration
3. **[Required]** Using an interactive builder wizard to create their own workflow templates
4. **[Required]** Exporting a ready-to-use `.claude/` directory they can deploy immediately

### What This Is NOT

- Not a graded assignment with validation
- Not a notebook-based tutorial
- Not focused on the attention mechanism (that was the original project)
- Not requiring Claude Code knowledge upfront

### Core Innovation

The lesson is told **from the agents' perspective**, narrating Felix's journey building the attention mechanism project. This meta-narrative reinforces the core concept: Felix didn't build it himself—the agents did.

Example narrative voice:
> "Felix decided to implement a six-epic structure. Here's what he told us: 'If it's one-shottable, it's definitely too easy.' So we got to work..."

---

## Origin Story

Felix created an interactive lesson teaching transformer attention mechanisms for an AI/ML engineering course. The challenge: make it "not one-shottable."

Felix responded by building the **entire project using agentic workflows**:
- Product-Manager (Opus) orchestrating Team-Leads (Sonnet)
- Team-Leads delegating to specialized subagents
- 6 sequential epics with automated handoffs
- Hooks for logging and security
- Post-development validation via simulated student agents

The result: A meta-lesson emerged. The real learning wasn't the attention mechanism—it was **how to build complex projects using AI agents**.

This refactored lesson teaches **that workflow**, making it accessible to students who want to leverage agentic development in their own projects.

---

## Educational Philosophy

### Core Principles

1. **Learn by Creating, Not Consuming**
   - Students don't just read about workflows—they design their own
   - Hands-on template generation, not passive learning

2. **Inspiration Over Prescription**
   - Gallery shows possibilities without implementations
   - Students adapt patterns to their needs

3. **No Validation Required**
   - No grading, no evaluation, no "correct answers"
   - Pure creative tool for workflow design

4. **Optional Depth**
   - Story is optional (students can skip to builder)
   - Advanced features available but not required
   - Beginners can start with 2 epics, expand later

5. **Agent-Centric Narrative**
   - Story told from PM, Team-Lead, and Specialist perspectives
   - Reinforces the meta-concept: agents built this

### Learning Outcomes

By completing this lesson, students will:

1. **Understand** the three-tier agent hierarchy (PM → Team-Lead → Specialist)
2. **Design** epic-based project decomposition strategies
3. **Create** custom agent definitions using meta-agent patterns
4. **Export** a working `.claude/` directory for their own projects
5. **Apply** agentic workflows to future development work

---

## User Journey

### Primary Flow

```
┌─────────────┐
│   Landing   │ ← Entry point with navigation options
└──────┬──────┘
       │
       ├──→ [OPTIONAL] ┌──────────────┐
       │               │ Story Timeline│ ← Felix's journey via agent perspectives
       │               └──────┬───────┘
       │                      │
       ├──────────────────────┘
       │
       ├──→ [REQUIRED] ┌─────────────┐
       │               │   Gallery   │ ← 10-15 example 2-epic workflows
       │               └──────┬──────┘
       │                      │
       ├──────────────────────┘
       │
       ├──→ [REQUIRED] ┌──────────────┐
       │               │ Theory/Learn │ ← Agentic workflow principles
       │               └──────┬───────┘
       │                      │
       ├──────────────────────┘
       │
       └──→ [REQUIRED] ┌─────────────────┐
                       │ Builder Wizard  │ ← Create custom workflow
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Export .claude/ │ ← Download ZIP
                       └─────────────────┘
```

### User Types

**Type 1: The Explorer**
- Reads Felix's story in detail
- Explores all gallery examples
- Takes time with theory
- Builds comprehensive workflow

**Type 2: The Pragmatist**
- Skips story entirely
- Glances at gallery for ideas
- Jumps straight to builder
- Creates minimal viable workflow

**Type 3: The Inspired Creator**
- Reads story for inspiration
- Deep-dives gallery
- Experiments with advanced features
- Builds ambitious multi-agent system

All three paths are valid. The interface must support all three seamlessly.

---

## Component Specifications

### 1. Landing Page

**Purpose**: Welcome users and provide clear navigation

**Required Elements**:
- Project title: "Building with Agentic Workflows"
- Tagline: "Learn to build complex projects using AI agent orchestration"
- Origin story summary (2-3 sentences)
- Navigation options:
  - ✨ "Experience Felix's Story" (optional)
  - 🎨 "Explore Workflow Gallery" (inspirational)
  - 📚 "Learn the Principles" (theory)
  - 🛠️ "Build Your Workflow" (primary CTA)
- Quick stats: "From 6 epics → 2,442 log lines → One completed project"

**Design Notes**:
- Dark theme (#1a1a1a background)
- Orange highlights (#ff6b35) for CTAs
- White text (#ffffff)
- Minimal, professional aesthetic
- Single-page scroll OR section-based navigation

### 2. Story Timeline (Optional)

**Purpose**: Narrate Felix's journey from agents' perspectives

**Structure**:
```
Timeline: [Epic 0] → [Epic 1] → [Epic 2] → [Epic 3] → [Epic 4] → [Epic 5] → [Epic 6] → [Validation]

Each node:
├── Epic Overview
├── Agent Perspectives Tabs:
│   ├── Product-Manager
│   ├── Team-Lead
│   ├── Specialized Agents
│   └── Lessons Learned
├── Completion Data (from .epicN_complete.json)
├── Log Excerpts
└── Key Decisions
```

**Interaction Model**:
- Click epic node to open details
- Tabs for different agent perspectives
- Quote boxes for Felix's instructions
- Code snippets from completion files
- Visual timeline progress bar

**Agent Narrative Examples**:

**Product-Manager Perspective (Epic 0)**:
> "Felix initiated me with a bold instruction: orchestrate the development of an attention mechanism lesson using only automated agents. He specified six epics and emphasized: 'If it's one-shottable, it's too easy.'
>
> My first action: modify `.claude/current_epic.txt` to '0_start', then spawn a Team-Lead via headless Claude Code session..."

**Team-Lead Perspective (Epic 1)**:
> "Product-Manager delegated Epic 1 to me: create the notebook infrastructure. I analyzed the requirements and realized I needed specialists. My first action: invoke meta-agent to create an Environment Setup Specialist and a Notebook Architect..."

**Specialist Perspective (Epic 3)**:
> "I am the Epic3-Visualization-Specialist. Team-Lead tasked me with implementing four visualization functions. I read `.epic1_complete.json` and `.epic2_complete.json` to understand cell positions and tensor shapes. Then I got to work..."

**Content Sources**:
- `.claude/development-process/asessments/attempt-*.md`
- `.claude/logs/*.log` (excerpts only)
- `.claude/development-process/hand-offs/.epicN_complete.json`
- Felix's README.md sections

### 3. Gallery Showcase

**Purpose**: Inspire students with 2-epic workflow possibilities

**Format**: Card-based grid layout

**Each Card Contains**:
- Workflow name
- Brief description (1-2 sentences)
- Epic breakdown:
  - Epic 1: [Name + purpose]
  - Epic 2: [Name + purpose]
- Potential subagents (3-4 examples)
- Use case scenarios
- Complexity indicator (Beginner/Intermediate/Advanced)

**Example Gallery Items**:

1. **API Documentation Generator**
   - Epic 1: Codebase Analysis (analyze API structure, extract endpoints)
   - Epic 2: Documentation Creation (generate Markdown docs, create examples)
   - Agents: Code Scanner, Endpoint Analyzer, Markdown Writer, Example Generator
   - Use case: Auto-generate API docs from codebase
   - Complexity: Beginner

2. **Testing Suite Builder**
   - Epic 1: Test Infrastructure (setup testing framework, create base configs)
   - Epic 2: Test Implementation (generate unit tests, integration tests)
   - Agents: Framework Specialist, Test Generator, Assertion Builder, Mock Creator
   - Use case: Build comprehensive test coverage automatically
   - Complexity: Intermediate

3. **Configuration Migration Tool**
   - Epic 1: Config Analysis (parse existing configs, identify patterns)
   - Epic 2: Config Transformation (convert to new format, validate)
   - Agents: Parser Specialist, Schema Analyzer, Transformer, Validator
   - Use case: Migrate configuration files between formats
   - Complexity: Intermediate

4. **Database Schema Designer**
   - Epic 1: Requirements Analysis (analyze data models, define relationships)
   - Epic 2: Schema Generation (create SQL/ORM schemas, migration scripts)
   - Agents: Model Analyzer, Relationship Mapper, SQL Generator, Migration Writer
   - Use case: Design database schemas from requirements
   - Complexity: Advanced

5. **CLI Tool Generator**
   - Epic 1: Command Structure (design CLI interface, parse args)
   - Epic 2: Implementation (generate command handlers, add help docs)
   - Agents: Interface Designer, Parser Builder, Handler Generator, Doc Writer
   - Use case: Build production CLI tools
   - Complexity: Beginner

**Gallery Requirement**: 10-15 total examples spanning different domains (DevOps, Testing, Documentation, Data, Web, etc.)

**Important**: Gallery provides **inspiration only**, not implementations. Students see what's possible, then create their own variation.

### 4. Theory/Learn Page

**Purpose**: Teach agentic workflow principles

**Content Sections**:

**Section 1: The Three-Tier Hierarchy**
```
Product-Manager (Opus)
    ↓ delegates epics
Team-Lead (Sonnet, headless)
    ↓ delegates tasks
Specialized Subagents
    ↓ implement features
```

Explain:
- Why three tiers? (separation of concerns)
- When to use each tier
- Communication patterns

**Section 2: Epic-Based Development**
- What is an epic?
- How to decompose projects into epics
- Dependency management between epics
- Completion files for handoffs

**Section 3: Meta-Agent Pattern**
- Purpose: create agents on-demand
- Standard format: Purpose → Instructions → Response
- Why standardization matters
- Example agent definition

**Section 4: Custom Commands**
- What are Claude Code custom commands?
- How they enable epic execution
- Relationship to `.claude/commands/*.md`

**Section 5: Agent Delegation**
- Team-leads never write code
- Prompting specialists effectively
- Balance: indicative vs. prescriptive
- Example: good vs. bad delegation

**Section 6: Workflow Best Practices**
- Start simple (2 epics for beginners)
- Epic handoff patterns
- Logging for debugging
- Validation strategies

### 5. Builder Wizard

**Purpose**: Interactive tool to create custom workflow templates

**Step 1: Configuration Selection**

Form with checkboxes:
```
Select Components to Create:

Number of Epics: [ 2 ] (recommended) | [ 3 ] | [ 4 ] | [ custom ]

Core Components:
☑ Product-Manager Start Command (recommended)
☑ Meta-Agent Definition (recommended)
☐ Custom Specialized Agents (optional)

Epics:
☑ Epic 1 Definition
☑ Epic 2 Definition
☐ Epic 3 Definition (if selected)

Advanced Features:
☐ Logging System
☐ Security Hooks (excluded for simplicity)
☐ Validation Agents

[ Continue to Builder → ]
```

**Step 2-N: Dynamic Editors**

For each selected component, provide an editor:

**Example: Epic 1 Editor**
```
┌─────────────────────────────────────────────┐
│ Epic 1 Definition                           │
├─────────────────────────────────────────────┤
│                                             │
│ Epic Name: ________________________         │
│                                             │
│ Epic Definition:                            │
│ ┌─────────────────────────────────────────┐│
│ │ # You are a team-lead!                  ││
│ │                                         ││
│ │ Team-leads primary focus is to complete││
│ │ epics of the project.                   ││
│ │ You are currently working on epic:      ││
│ │ EPIC_NAME                               ││
│ │                                         ││
│ │ [Editable markdown text area...]        ││
│ └─────────────────────────────────────────┘│
│                                             │
│ Suggested Subagents:                        │
│ ┌─────────────────────────────────────────┐│
│ │ - Subagent 1: ____________              ││
│ │ - Subagent 2: ____________              ││
│ │ + Add more                              ││
│ └─────────────────────────────────────────┘│
│                                             │
│ [← Back]  [Preview]  [Continue →]          │
└─────────────────────────────────────────────┘
```

**Templates Available**:
- Product-Manager command (from `.claude/commands/start.md`)
- Epic definition template (from `.claude/commands/*_*.md`)
- Meta-agent definition (from `.claude/agents/meta-agent.md`)
- Specialized agent template (generic structure)

**Editor Features**:
- Syntax highlighting for markdown
- Template variables (EPIC_NAME, PROJECT_PATH, etc.)
- Preview pane showing rendered output
- Validation warnings (missing required sections)
- Help tooltips explaining each section

**Preview System**:
- Live preview of generated markdown files
- Directory structure visualization
- File size estimates
- Syntax checking

### 6. Export System

**Purpose**: Generate downloadable `.claude/` directory ZIP file

**Generated Structure**:
```
.claude/
├── commands/
│   ├── start.md              (Product-Manager)
│   ├── 1_epic-name.md        (Epic 1 definition)
│   ├── 2_epic-name.md        (Epic 2 definition)
│   └── [3_epic-name.md]      (if selected)
├── agents/
│   ├── meta-agent.md         (always included)
│   └── [custom-agent.md]     (if created)
├── logs/                     (empty, for future use)
├── scripts/                  (if logging selected)
│   └── log_agent_activity.sh
└── README.md                 (usage instructions)
```

**Export README Template**:
```markdown
# Your Custom Agentic Workflow

Generated by: Building with Agentic Workflows

## Getting Started

1. Copy this `.claude/` directory to your project root
2. Ensure Claude Code is installed
3. Start the workflow: `/start`

## Your Epics

- Epic 1: [Name] - [Description]
- Epic 2: [Name] - [Description]

## Running Epics

Product-Manager will orchestrate epic execution:
```bash
cd /path/to/project
echo "/1_epic-name" | claude --model sonnet --output-format json
```

## Customization

- Edit epic definitions in `.claude/commands/`
- Create new agents using meta-agent
- Modify to fit your project needs

## Learn More

Visit: [link to meta-lesson]
```

**Export Functionality**:
- Client-side ZIP generation (using JSZip or similar)
- Filename: `claude-workflow-[timestamp].zip`
- Include usage instructions
- Validate all files before export

---

## Technical Architecture

### Frontend Stack

**No Framework Required** - Use vanilla JavaScript for:
- Simplicity (no build process)
- Portability (runs anywhere)
- Educational transparency (students can read the code)

**Core Technologies**:
- HTML5 (semantic markup)
- CSS3 (custom properties for theming)
- JavaScript ES6+ (modules, async/await)
- Optional: JSZip for ZIP generation
- Optional: Marked.js for markdown preview

**File Structure**:
```
meta-lesson/
├── index.html              (Landing page)
├── story.html              (Felix's journey timeline)
├── gallery.html            (Workflow examples)
├── learn.html              (Theory/principles)
├── builder.html            (Wizard interface)
├── css/
│   ├── main.css            (Global styles)
│   ├── timeline.css        (Story component)
│   ├── gallery.css         (Card layout)
│   └── builder.css         (Wizard styles)
├── js/
│   ├── navigation.js       (Router/nav)
│   ├── timeline.js         (Story interactions)
│   ├── gallery.js          (Gallery loading)
│   ├── builder.js          (Wizard logic)
│   └── export.js           (ZIP generation)
├── templates/
│   ├── product-manager.md
│   ├── epic-definition.md
│   ├── meta-agent.md
│   └── specialized-agent.md
├── content/
│   ├── story/
│   │   ├── epic0.json
│   │   ├── epic1.json
│   │   └── ...
│   ├── gallery/
│   │   └── examples.json
│   └── theory/
│       └── principles.md
└── README.md               (This file)
```

### Data Format

**Story Content** (JSON):
```json
{
  "epic": "1_notebook-infrastructure",
  "title": "Epic 1: Notebook Infrastructure",
  "summary": "Creating the foundational structure...",
  "perspectives": {
    "product_manager": {
      "narrative": "I initiated Epic 1 by...",
      "actions": ["Changed current_epic.txt", "Spawned team-lead"],
      "quotes": ["Felix told me: '...'"]
    },
    "team_lead": {
      "narrative": "Product-Manager delegated...",
      "decisions": ["Created Environment Setup Specialist"],
      "challenges": ["Setup script security restrictions"]
    },
    "specialists": [
      {
        "name": "environment-setup-specialist",
        "tasks": ["Cross-platform setup script", "Dependency pinning"],
        "outcome": "Success with security workaround"
      }
    ]
  },
  "completion_data": { /* from .epicN_complete.json */ },
  "lessons": ["Importance of testing", "Security hooks matter"]
}
```

**Gallery Examples** (JSON):
```json
{
  "examples": [
    {
      "id": "api-doc-generator",
      "name": "API Documentation Generator",
      "description": "Auto-generate comprehensive API documentation",
      "complexity": "beginner",
      "domain": "documentation",
      "epics": [
        {
          "name": "Codebase Analysis",
          "purpose": "Analyze API structure and extract endpoints"
        },
        {
          "name": "Documentation Creation",
          "purpose": "Generate Markdown docs with examples"
        }
      ],
      "suggested_agents": [
        "Code Scanner",
        "Endpoint Analyzer",
        "Markdown Writer",
        "Example Generator"
      ],
      "use_cases": [
        "REST API documentation",
        "GraphQL schema docs",
        "SDK reference generation"
      ]
    }
  ]
}
```

### State Management

**Simple State Object**:
```javascript
const wizardState = {
  config: {
    numEpics: 2,
    includeMetaAgent: true,
    includeCustomAgents: false,
    includeLogging: false
  },
  epics: [
    { name: '', definition: '' },
    { name: '', definition: '' }
  ],
  agents: [],
  currentStep: 1
};
```

**Persistence**: LocalStorage for draft saving

---

## Content Structure

### Story Content Requirements

Extract from Felix's workflow:

**Epic 0: Initialization**
- PM receives start command
- Analyzes CLAUDE.md requirements
- Plans 6-epic structure
- Prepares to spawn first team-lead

**Epic 1: Notebook Infrastructure**
- Team-lead creates Environment Setup + Notebook Architect specialists
- Challenges: Setup script security, Python version detection
- Outcome: Complete notebook structure, module stubs
- Handoff: `.epic1_complete.json` with cell mapping

**Epic 2: Attention Implementation**
- PyTorch Attention Specialist + Educational Content Writer
- Implements 4 core sections
- Creates reference module
- Handoff: Working implementations, consistent tensor shapes

**Epic 3: Visualization**
- Visualization Specialist + Notebook Integration Specialist
- Creates 4 visualization functions
- Handles batch dimensions correctly
- Handoff: Working visualizations in notebooks

**Epic 4: Evaluation & Grading**
- LLM Integration Specialist + Evaluation Specialist
- Implements Ollama/OpenAI evaluation
- Challenges: Context isolation bug
- Handoff: Working evaluation system

**Epic 5: Mini-Transformer Integration**
- Transformer Integration Specialist
- Compares reference to DistilGPT-2
- Demonstrates production scaling
- Handoff: Model comparison functions

**Epic 6: Web Interface & Documentation**
- Web Interface Specialist + Documentation Writer
- Creates all documentation (held back until final epic)
- Professional web interface
- Handoff: Complete user-facing experience

**Post-Development Validation**
- Epic validation agents verify implementations
- Student simulator finds critical bugs
- PM fixes issues directly
- Re-run simulation confirms success

### Gallery Content Requirements

Create **15 diverse examples** covering:

**Domain Distribution**:
- Documentation (3 examples)
- Testing (2 examples)
- DevOps/Infrastructure (2 examples)
- Data Processing (2 examples)
- Web Development (2 examples)
- Code Quality (2 examples)
- Miscellaneous (2 examples)

**Complexity Distribution**:
- Beginner: 6 examples
- Intermediate: 6 examples
- Advanced: 3 examples

Each example needs:
- Name
- Description
- Epic breakdown
- 3-5 suggested agents
- Use case scenarios
- Complexity indicator

### Theory Content Requirements

Write clear, concise explanations for:

1. **Agent Hierarchy** (300-400 words)
   - Three tiers explained
   - Why this structure?
   - Communication patterns
   - Examples from Felix's workflow

2. **Epic-Based Development** (400-500 words)
   - Definition of epic
   - Project decomposition strategies
   - Dependency management
   - Handoff patterns
   - Examples: 2-epic vs 6-epic projects

3. **Meta-Agent Pattern** (300-400 words)
   - Purpose and benefits
   - Standard format
   - When to use
   - Example agent definition
   - Customization options

4. **Delegation Best Practices** (400-500 words)
   - Effective prompting
   - Good vs bad examples
   - Balancing guidance vs freedom
   - Error handling
   - Iteration strategies

5. **Getting Started** (200-300 words)
   - First 2-epic project ideas
   - Common pitfalls
   - Debugging approaches
   - Resources

Total: ~2000 words of theory content

---

## Export System

### File Generation

**Product-Manager Command** (start.md):
```markdown
---
name: product-manager
description: An agent orchestrating team-leads to complete epics
PROJECT_PATH: "${PROJECT_PATH}"
---

# Purpose

You are the product-manager tasked with orchestrating epic development.

# Your Epics

${EPIC_LIST}

# Workflow

[Template from original start.md with customizations]
```

**Epic Definition Template**:
```markdown
---
EPIC_NAME: ${EPIC_NAME}
---

# You are a team-lead!

Team-leads primary focus is to complete epics of the project.
You are currently working on epic: EPIC_NAME

## Delegating work

You are a team-lead and should **NEVER** write code.
You are tasked **entirely** with delegating work to subagents.

## meta-agent

[Standard meta-agent instructions]

## Designing prompts for your subagents

[Best practices from original epics]

# ${EPIC_TITLE}

## Epic Definition

${EPIC_DEFINITION}

## Suggested Subagents

${SUGGESTED_AGENTS}

## Core Requirements

${REQUIREMENTS}

## Success Criteria

${SUCCESS_CRITERIA}
```

**Meta-Agent** (always included, unchanged from original)

**Custom Agent Template**:
```markdown
---
name: ${AGENT_NAME}
description: ${AGENT_DESCRIPTION}
tools: ${AGENT_TOOLS}
color: ${AGENT_COLOR}
---

# Purpose

${PURPOSE}

# Instructions

${INSTRUCTIONS}

# Report / Response

${RESPONSE_FORMAT}
```

### Validation Rules

Before export, validate:
- [ ] All epic names are unique
- [ ] At least 2 epics defined
- [ ] Product-Manager command references all epics
- [ ] Meta-agent is included
- [ ] No empty required fields
- [ ] Valid markdown syntax
- [ ] No template variables left unreplaced

### Usage Instructions

Generated README includes:
1. Installation prerequisites (Claude Code)
2. Directory placement instructions
3. How to run product-manager
4. How to execute epics
5. Customization guide
6. Troubleshooting tips
7. Link back to meta-lesson

---

## Builder Wizard

### Step Flow

```
Step 1: Configuration
    ↓
Step 2: Product-Manager Setup
    ↓
Step 3: Epic 1 Definition
    ↓
Step 4: Epic 2 Definition
    ↓
[Step 5: Epic 3 Definition] (if selected)
    ↓
[Step N: Custom Agents] (if selected)
    ↓
Step Final: Preview & Export
```

### Configuration Step (Detailed)

**Section 1: Basic Setup**
```html
<div class="config-section">
  <h3>Basic Configuration</h3>

  <label>Number of Epics</label>
  <div class="radio-group">
    <input type="radio" name="numEpics" value="2" checked>
    <label>2 Epics (Recommended for beginners)</label>

    <input type="radio" name="numEpics" value="3">
    <label>3 Epics (Intermediate)</label>

    <input type="radio" name="numEpics" value="custom">
    <label>Custom (Advanced)</label>
  </div>

  <label>Project Name (optional)</label>
  <input type="text" placeholder="my-awesome-project">
</div>
```

**Section 2: Core Components**
```html
<div class="config-section">
  <h3>Core Components</h3>

  <label>
    <input type="checkbox" name="includeProductManager" checked disabled>
    Product-Manager Start Command (Required)
  </label>

  <label>
    <input type="checkbox" name="includeMetaAgent" checked>
    Meta-Agent Definition (Highly Recommended)
    <span class="hint">Allows creating agents on-demand</span>
  </label>
</div>
```

**Section 3: Optional Features**
```html
<div class="config-section">
  <h3>Optional Features</h3>

  <label>
    <input type="checkbox" name="includeCustomAgents">
    Define Custom Specialized Agents
    <span class="hint">Pre-create agents for your epics</span>
  </label>

  <label>
    <input type="checkbox" name="includeLogging">
    Basic Logging System
    <span class="hint">Track agent activity (requires bash script)</span>
  </label>
</div>
```

### Epic Editor (Detailed)

**Template Helpers**:
- Pre-filled sections based on selected features
- Example text showing proper format
- Inline documentation
- Variable replacement hints

**Example Pre-filled Epic**:
```markdown
---
EPIC_NAME: ${EPIC_NAME}
---

# You are a team-lead!

[Standard team-lead instructions...]

# Epic [N]: [Your Epic Title Here]

## Epic Definition

[Describe what this epic should accomplish. Be specific about the deliverables.]

Example:
"Implement the data processing pipeline that reads CSV files, validates
entries, and generates summary statistics."

## Suggested Subagents

This epic will likely require 2-3 specialized agents:
- **[Agent Name]**: [Brief description of role]
- **[Agent Name]**: [Brief description of role]

Think about what expertise is needed. Examples:
- File Processing Specialist
- Data Validation Expert
- Statistics Calculator

## Core Requirements

### 1. [Requirement Name]

[Detailed description of what needs to be built]

### 2. [Another Requirement]

[Description...]

## Success Criteria

- [ ] [Specific measurable outcome]
- [ ] [Another outcome]
- [ ] Completion marker `.epic${N}_complete.json` created

[Template continues...]
```

**Editor Features**:
1. **Syntax Highlighting**: Markdown formatting
2. **Auto-save**: Persists to localStorage every 30s
3. **Character Count**: Shows progress
4. **Validation Warnings**: Missing required sections
5. **Preview Toggle**: Side-by-side or fullscreen
6. **Template Variables**: Highlighted and explained

### Preview & Export Step

**Preview Panel**:
```
┌─────────────────────────────────────────────┐
│ Your Workflow Preview                       │
├─────────────────────────────────────────────┤
│                                             │
│ 📂 .claude/                                 │
│   ├── 📂 commands/                          │
│   │   ├── 📄 start.md                (2.1KB)│
│   │   ├── 📄 1_epic-name.md          (3.4KB)│
│   │   └── 📄 2_epic-name.md          (3.2KB)│
│   ├── 📂 agents/                            │
│   │   └── 📄 meta-agent.md           (1.8KB)│
│   ├── 📂 logs/                              │
│   └── 📄 README.md                   (1.2KB)│
│                                             │
│ Total Size: ~11.7KB                         │
│ Files: 5                                    │
│                                             │
│ ✅ All validations passed                   │
│                                             │
│ [← Edit]  [Download ZIP]  [Copy to Clipboard]│
└─────────────────────────────────────────────┘
```

**Validation Checklist**:
- ✅ Product-Manager references all epics
- ✅ All epic names are unique
- ✅ Meta-agent included
- ✅ No empty required fields
- ✅ Valid markdown syntax
- ⚠️ Consider adding custom agents (optional)

**Export Options**:
1. **Download ZIP**: Standard workflow
2. **Copy Files**: Show individual file contents for copy-paste
3. **Save Draft**: Save to localStorage for later
4. **Share Link**: Generate shareable URL (future feature)

---

## Design System

### Color Palette

**Primary Colors**:
- Background: `#1a1a1a` (Dark charcoal)
- Primary Accent: `#ff6b35` (Orange)
- Text: `#ffffff` (White)
- Secondary Text: `#b3b3b3` (Light gray)

**Semantic Colors**:
- Success: `#4caf50` (Green)
- Warning: `#ffc107` (Amber)
- Error: `#f44336` (Red)
- Info: `#2196f3` (Blue)

**Gradients**:
- Header: `linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)`
- Cards: `linear-gradient(145deg, #222222 0%, #1a1a1a 100%)`
- Buttons: `linear-gradient(90deg, #ff6b35 0%, #ff8c5a 100%)`

### Typography

**Font Stack**:
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'Fira Code', 'Courier New', monospace;
```

**Type Scale**:
- H1: `2.5rem` (40px) - Page titles
- H2: `2rem` (32px) - Section headers
- H3: `1.5rem` (24px) - Subsections
- H4: `1.25rem` (20px) - Card titles
- Body: `1rem` (16px) - Regular text
- Small: `0.875rem` (14px) - Labels, hints

**Weights**:
- Regular: 400
- Medium: 500
- Bold: 700

### Spacing System

**Base Unit**: 8px

```css
--space-xs: 0.5rem;  /* 8px */
--space-sm: 1rem;    /* 16px */
--space-md: 1.5rem;  /* 24px */
--space-lg: 2rem;    /* 32px */
--space-xl: 3rem;    /* 48px */
--space-2xl: 4rem;   /* 64px */
```

### Components

**Button Styles**:
```css
.btn-primary {
  background: var(--color-orange);
  color: white;
  padding: var(--space-sm) var(--space-lg);
  border-radius: 8px;
  border: none;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #ff8c5a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}
```

**Card Styles**:
```css
.card {
  background: var(--gradient-card);
  border: 1px solid #333;
  border-radius: 12px;
  padding: var(--space-lg);
  transition: all 0.3s;
}

.card:hover {
  border-color: var(--color-orange);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}
```

**Timeline Styles**:
```css
.timeline-node {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--color-dark);
  border: 3px solid var(--color-orange);
  transition: all 0.3s;
}

.timeline-node.completed {
  background: var(--color-orange);
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
}
```

### Animations

**Subtle, Professional**:
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}
```

### Responsive Breakpoints

```css
--breakpoint-mobile: 640px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
--breakpoint-wide: 1280px;
```

**Mobile-First Approach**:
- Base styles for mobile
- Progressive enhancement for larger screens
- Touch-friendly targets (min 44x44px)

---

## Felix's Original Workflow

### Complete Architecture

**Agent Hierarchy**:
```
Product-Manager (Opus)
    |
    +-- Team-Lead 1: Epic 1 (Sonnet, headless)
    |       |
    |       +-- Environment Setup Specialist
    |       +-- Notebook Architect
    |
    +-- Team-Lead 2: Epic 2 (Sonnet, headless)
    |       |
    |       +-- PyTorch Attention Specialist
    |       +-- Educational Content Writer
    |
    +-- Team-Lead 3: Epic 3 (Sonnet, headless)
    |       |
    |       +-- Epic3-Visualization-Specialist
    |       +-- Notebook Integration Specialist
    |
    +-- Team-Lead 4: Epic 4 (Sonnet, headless)
    |       |
    |       +-- Epic4-LLM-Integration-Specialist
    |       +-- Epic4-Evaluation-Specialist
    |
    +-- Team-Lead 5: Epic 5 (Sonnet, headless)
    |       |
    |       +-- Transformer Integration Specialist
    |
    +-- Team-Lead 6: Epic 6 (Sonnet, headless)
    |       |
    |       +-- Web-Interface-Specialist
    |       +-- Documentation-Writer-Specialist
    |       +-- Integration-Tester-Specialist
    |
    +-- Validation Phase
            |
            +-- Epic-Validation-Specialist (x6)
            +-- Student-Simulator
```

### Epic Breakdown

**Epic 0: Start** (Product-Manager initialization)
- Read project requirements
- Plan 6-epic structure
- Initialize tracking system

**Epic 1: Notebook Infrastructure** (2,442 log lines total)
- Created virtual environment setup script
- Generated student + reference notebooks
- Created module stubs (visualizations.py, evaluation.py, model_utils.py)
- Initialized progress tracking
- Handoff: Cell mapping, function signatures

**Epic 2: Attention Implementation**
- Implemented 4 core functions in both notebooks
- Created reference_attention.py module
- Ensured consistent tensor shapes
- Handoff: Working implementations, variable names

**Epic 3: Visualization**
- Implemented 4 visualization functions
- Handled batch dimensions correctly
- Integrated with notebooks
- Handoff: Working visualizations

**Epic 4: Evaluation & Grading**
- Built LLM integration (Ollama + OpenAI)
- Created evaluation system
- Generated educational feedback
- Handoff: Working grading system
- Bug: Context isolation issue (fixed post-development)

**Epic 5: Mini-Transformer Integration**
- Loaded DistilGPT-2 model
- Compared reference to production
- Demonstrated scaling differences
- Handoff: Model comparison functions

**Epic 6: Web Interface & Documentation**
- Created index.html and learn.html
- Wrote 6 documentation files
- Designed professional interface
- Handoff: Complete user experience

**Validation Phase**:
- Epic validation: 100% implementation confirmed
- Student simulation: Found 2 critical bugs
- PM fixed: Evaluation context, setup script
- Re-validation: Success

### Completion Files

Each epic creates `.epicN_complete.json` with:
- Deliverables (file paths, descriptions)
- Function signatures
- Tensor shape specifications
- Configuration details
- Validation results
- Next epic requirements
- Notes and lessons learned

Example from Epic 1:
```json
{
  "epic": "1_notebook-infrastructure",
  "status": "completed",
  "deliverables": {
    "notebook_structure": {
      "student_notebook": "./lesson.ipynb",
      "cell_structure": {
        "section_1": {
          "title": "Linear Projections (Q, K, V)",
          "cells": ["cell-4", "cell-5", "cell-6", "cell-7"],
          "todo_function": "create_qkv_projections"
        }
      }
    }
  }
}
```

### Hooks System (Excluded from Student Version)

**PreToolUse Hooks**:
- Read/Write/Edit/Task → `log_agent_activity.sh`
- Bash → `security_hook.sh`

**Logging Output**:
```
Epic:      1_notebook-infrastructure
Time:      2025-09-19 08:58:43
Tool used: Edit
File:      src/visualizations.py
----------------------------------------
```

**Security Blocking**:
- Dangerous rm commands
- Download-and-execute patterns
- System modification attempts

### Iterations

**Attempt 1**: 90% success
- Issues: Missing visualization cells, setup script broken, evaluation false positives
- Improvements: Clearer epic definitions, cell separation, strict output format

**Attempt 2**: Failed (connectivity)
- Anthropic API overload
- Resumed but suspicious behavior
- Reset agents, moved team-lead instructions

**Attempt 3**: SUCCESS
- Refined prompts from Attempt 1 learnings
- Added validation step
- Student simulation caught critical bugs
- PM fixed directly
- Re-validation passed

### Key Learnings

1. **Team-leads must never write code** - Delegation discipline critical
2. **Epic handoffs need structure** - Completion files essential
3. **Headless debugging is hard** - Extensive logging crucial
4. **Validation after development** - Separate validation agents needed
5. **Student simulation finds real bugs** - Better than manual testing
6. **Consistent examples matter** - "The cat sat on the mat" throughout
7. **Meta-agent standardization** - Ensures consistent agent quality

---

## Development Guidelines

### For Subagents Working on Issues

**Before Starting**:
1. Read this entire vision document
2. Understand the user journey
3. Review relevant technical specifications
4. Check dependencies on other issues

**During Development**:
1. Follow design system exactly
2. Use semantic HTML
3. Write clean, commented JavaScript
4. Test on multiple screen sizes
5. Validate accessibility

**Before Completion**:
1. Test all interactive elements
2. Verify responsive behavior
3. Check against acceptance criteria
4. Document any deviations from plan
5. Update relevant documentation

### Code Quality Standards

**HTML**:
- Semantic elements (`<article>`, `<section>`, `<nav>`)
- Proper heading hierarchy
- ARIA labels where needed
- Valid HTML5

**CSS**:
- Use CSS custom properties
- Mobile-first approach
- Consistent spacing (8px grid)
- Smooth transitions (0.2-0.3s)
- No magic numbers

**JavaScript**:
- ES6+ features
- Clear function names
- Comments for complex logic
- Error handling
- No global pollution

### Accessibility Requirements

**WCAG 2.1 AA Compliance**:
- Minimum contrast ratio: 4.5:1 for text
- Keyboard navigation for all interactive elements
- Focus indicators visible
- ARIA labels for icons
- Alt text for images
- Skip navigation links

**Testing Checklist**:
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast passes
- [ ] Focus visible at all times
- [ ] Forms properly labeled
- [ ] Error messages clear

### Performance Guidelines

**Targets**:
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Page size < 500KB (excluding external libs)

**Optimization**:
- Lazy load images
- Minify CSS/JS in production
- Use system fonts where possible
- Compress assets
- Cache static resources

### Testing Requirements

**Browser Support**:
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

**Device Testing**:
- Desktop (1920x1080, 1366x768)
- Tablet (768x1024)
- Mobile (375x667, 414x896)

**Functionality Testing**:
- All navigation links work
- Forms validate correctly
- Export generates valid ZIP
- Preview renders accurately
- LocalStorage persists data

---

## Future Enhancements (Out of Scope)

Ideas for later versions:

1. **Workflow Templates Library**
   - Community-submitted workflows
   - Rating system
   - Search and filter

2. **Collaboration Features**
   - Share workflow links
   - Fork and remix templates
   - Version history

3. **Advanced Features**
   - Hooks configuration UI
   - Real-time validation
   - Claude Code integration (test workflow directly)

4. **Analytics**
   - Track popular epic types
   - Understand user patterns
   - Improve templates

5. **Video Tutorials**
   - Walkthrough of Felix's workflow
   - Building your first 2-epic system
   - Advanced techniques

---

## Questions for Clarification

If you encounter ambiguity while implementing:

1. **Content**: Refer to Felix's original files (`.claude/` directory)
2. **Design**: Follow design system strictly
3. **Behavior**: Prioritize user experience and simplicity
4. **Technical**: Choose vanilla JS for transparency

When in doubt, ask for clarification via GitHub issue comments.

---

## Glossary

**Epic**: A distinct phase of project development with specific deliverables

**Product-Manager (PM)**: Top-level agent orchestrating the entire workflow (Opus model)

**Team-Lead**: Mid-level agent managing a single epic (Sonnet model, runs headless)

**Specialist/Subagent**: Bottom-level agent implementing specific features

**Meta-Agent**: Special agent that creates new agents on-demand

**Custom Command**: Markdown file in `.claude/commands/` that defines epic instructions

**Completion File**: JSON file (`.epicN_complete.json`) containing epic handoff data

**Headless**: Running without human interaction (background process)

**Handoff**: Transfer of context and deliverables between epics

---

## Revision History

**v1.0** - Initial vision document
- Complete specification for meta-lesson
- All component details defined
- Ready for GitHub issue creation

---

## Contact & Support

For questions about this vision document:
- GitHub Issues: Tag with `question` label
- Reference specific sections by heading link

---

**End of Vision Document**

This document is the single source of truth for the "Building with Agentic Workflows" project. All implementation work must align with the specifications, principles, and guidelines defined herein.
