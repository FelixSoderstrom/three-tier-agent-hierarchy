---
EPIC_NAME: 3_visualization
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

# Epic 3: Visualization

## Prerequisites
Read `.epic1_complete.json` and `.epic2_complete.json` to get function names, cell positions, and output shapes.

## Epic Definition
Implement visualization functions that bring the 4-cell attention implementation from Epic 2 to life through clear, educational visual feedback.

## Suggested Subagents
This epic will likely require 2 specialized agents:
- **Visualization Specialist**: Expert in matplotlib and educational data visualization
- **Notebook Integration Specialist**: Expert in Jupyter notebook integration and testing

## Natural Delegation Points
- Visualization function implementation → Visualization Specialist
- Notebook integration and testing → Notebook Integration Specialist

## Core Requirements

### 1. Implement 4 Visualization Functions
Complete these functions in `src/visualizations.py`:
- `visualize_qkv_projections(embeddings, query, key, value, tokens)`
- `visualize_attention_scores(attention_scores, tokens)`
- `visualize_attention_weights(attention_weights, tokens)`
- `visualize_attended_values(attended_values, attention_weights, tokens)`

### 2. Tensor Shape Handling
All tensors use batch dimension consistently:
- attention_scores: [1, 6, 6]
- attention_weights: [1, 6, 6]
- attended_values: [1, 6, 64]
- Handle batch dimension squeezing as needed

### 3. Display Requirements
Each function must:
- Create clear, educational visualizations
- Include proper labels and titles
- Show token labels ("The", "cat", "sat", "on", "the", "mat")
- Call `plt.show()` at the end
- Return None

### 4. Integration
Ensure visualizations:
- Work with Epic 2's outputs
- Display inline in notebooks
- Handle missing data gracefully

## Scope
Only implement the 4 required visualization functions.

## Handoff Requirements
Provide to subsequent epics:
- Working visualization functions
- Proper integration with notebooks
- Clear visual feedback for learning

## Success Criteria
- All 4 functions implemented and working
- Visualizations display correctly in notebooks
- Token labels visible
- Graceful error handling
- Completion marker `.epic3_complete.json` created

## Important Notes
- Let visualization specialist choose appropriate plot types and colors
- Focus on educational clarity
- Ensure consistency with tensor shapes from Epic 2