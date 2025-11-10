---
EPIC_NAME: 4_evaluation-grading
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

# Epic 4: Evaluation & Grading

## Prerequisites
Read `.epic1_complete.json`, `.epic2_complete.json`, and `.epic3_complete.json` to get progress schema, LLM config, and cell information.

## Epic Definition
Implement automated evaluation system using LLM-based assessment to grade the 4 core attention mechanism implementations from Epic 2.

## Suggested Subagents
This epic will likely require 2-3 specialized agents:
- **LLM Integration Specialist**: Expert in Ollama and OpenAI API integration
- **Evaluation Specialist**: Expert in code evaluation and educational feedback generation

## Natural Delegation Points
- LLM provider setup and API integration → LLM Integration Specialist
- Evaluation logic and feedback generation → Evaluation Specialist
- Progress tracking updates → Either agent

## Core Requirements

### 1. LLM-Based Evaluation
Implement evaluation using:
- **Primary**: Ollama (local) for code comparison
- **Fallback**: OpenAI API if Ollama unavailable
- Use LLM to compare student code against reference implementation
- NO rule-based evaluation (LLM comparison only)

### 2. Evaluate 4 Implementation Sections
Grade these sections from the notebooks:
1. Linear Projections (Q, K, V)
2. Scaled Dot-Product Attention
3. Softmax & Attention Weights
4. Value Aggregation

### 3. Evaluation Criteria
For each section check:
- Output tensor shapes match expected
- Attention weights sum to 1.0 (where applicable)
- Implementation follows attention mechanism patterns
- Code quality and understanding

### 4. Unified Output Format
Create single evaluation output format:
- Score per section
- Overall grade
- Educational feedback
- Suggestions for improvement
Store in `grade/attempt_X/` directory

### 5. Complete evaluation.py
Implement core functions:
- `evaluate_cell_implementation()` - Compare against reference
- `validate_tensor_output()` - Check shapes and values
- `grade_notebook()` - Main evaluation entry point
- `generate_feedback()` - Create human-readable feedback

### 6. Update Progress Tracking
Update `progress/lesson_progress.json` with evaluation results using Epic 1's schema.

## Scope
Focus on LLM-based code comparison. Empty implementations score 0, complete implementations score based on correctness.

## Handoff Requirements
Provide to subsequent epics:
- Working evaluation system
- Grading results in standardized format
- Updated progress tracking

## Success Criteria
- LLM evaluation working (Ollama or OpenAI)
- All 4 sections evaluated correctly
- Feedback generated and stored
- Progress tracking updated
- Completion marker `.epic4_complete.json` created

## Important Notes
- LLM evaluation is required - no rule-based fallback
- Use simple cell identification (avoid complex mapping)
- Focus on educational feedback quality