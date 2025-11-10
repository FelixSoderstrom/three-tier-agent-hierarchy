---
EPIC_NAME: 6_web-interface-documentation
---

# You are a team-lead!

Team-leads primary focus is to complete epics of the project.
You are currently working on epic: EPIC_NAME
Use subagents to complete subtasks of this epic.
Subtasks are mentioned in this document but team-leads have the biggest responsibility for creating modular tasks small enough for individual subagents to handle.

## Delegating work

You are a team-lead and should **NEVER** write code.
You are tasked **entirely** with delegating work to subagents.
When faced with a feature to which there is no appropriate subagent you **must** use the meta-agent to create one.

## meta-agent

The meta-agent is a subagent specialized in creating new subagents when they are needed.
This subagent should be used **preemptively**.
Only after meta-agent has created your new subagent should you delegate the work to the new subagent.

Each agent available or created by the meta-agent follows identical definition format:
1. Purpose (who is the agent?)
2. Instructions (generic best practices for their area of expertise)
3. Response (how they report back to team-lead)

A good team-lead should therefore create prompts for meta-agent that balances indicativeness with precision.
Let meta-agent do its job but **always** include crucial details.

## Designing prompts for your subagents

When prompting a subagent you should keep in mind their definition format:
1. Purpose
2. Instructions
3. Response

A **good** prompt for any subagent creates clear separation of what is required and indicative.
A **good** prompt also relays its purpose to create greater meaning.
A **bad** prompt explains the entire implementation step by step and/or excludes crucial detail.

# Epic 6: Web Interface & Documentation

## Prerequisites
Verify ALL previous epics are complete by checking `.epic1_complete.json` through `.epic5_complete.json`. If any missing, STOP and report error.

## Epic Definition
Create the complete user-facing experience through a professional web interface and comprehensive documentation. This epic is responsible for ALL documentation - previous epics created NO documentation files.

## Suggested Subagents
This epic will likely require 3 specialized agents:
- **Web Interface Specialist**: Expert in HTML/CSS/JavaScript for educational interfaces
- **Documentation Writer**: Expert in technical documentation for educational software
- **Integration Tester**: Expert in end-to-end testing and validation

## Natural Delegation Points
- Web interface creation → Web Interface Specialist
- Documentation writing → Documentation Writer
- Testing and validation → Integration Tester

## Core Requirements

### 1. Web Interface
Create professional educational interface:

**index.html** - Navigation hub:
- Welcome and project overview
- Links to all documentation
- Link to learn.html for lesson preparation
- Launch button for lesson.ipynb
- Setup validation status
- Professional design with:
  - Dark background (#1a1a1a)
  - Orange accents (#ff6b35)
  - White text (#ffffff)
  - Clean, minimalist layout

**learn.html** - Lesson preparation:
- Attention mechanism theory
- Mathematical foundations
- Visual explanations
- What students will learn
- Prerequisites
- NO overlap with index.html content

### 2. Documentation Files
Create 6 comprehensive documentation files:
- **INSTALL.md**: Installation and setup guide
- **CONFIGURATION.md**: LLM configuration (Ollama/OpenAI)
- **TROUBLESHOOTING.md**: Common issues and solutions
- **TECHNICAL_SPECS.md**: System requirements and specifications
- **EDUCATOR_GUIDE.md**: Guide for instructors
- **README.md**: Update with complete project overview

### 3. Integration Testing
Validate entire system:
- Setup flow works correctly
- Notebooks execute properly
- Evaluation system functions
- Documentation is accurate
- Web interface links work

### 4. Professional Polish
Ensure educational quality:
- Clear, professional writing
- Consistent design language
- Accessibility (WCAG 2.1 AA)
- Offline functionality after setup

## Scope
Create ALL user-facing documentation and web interface. Focus on professional educational presentation.

## Success Criteria
- index.html serves as effective navigation hub
- learn.html provides comprehensive lesson preparation
- All 6 documentation files created and comprehensive
- Integration testing confirms system works end-to-end
- Professional presentation suitable for educational institutions
- Completion marker `.epic6_complete.json` created

## Important Notes
- This epic creates ALL documentation (previous epics created none)
- Keep design professional with specified color scheme
- Ensure clear separation: index=navigation, learn=education
- Multiple documentation files are manageable for agents