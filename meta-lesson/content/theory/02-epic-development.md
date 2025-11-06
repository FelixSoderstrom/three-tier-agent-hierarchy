# Epic Development: Breaking Projects into Manageable Chunks

## What Are Epics in Agentic Workflows?

In traditional Agile development, an "epic" is a large body of work that can be broken into smaller stories. Agentic workflows borrow this concept but adapt it for AI agent execution. An epic in this context is a complete, self-contained feature or component that one Team Lead agent can own from start to finish.

For example, in a machine learning lesson project, you might have epics like:
- Epic 1: Set up the Jupyter notebook structure
- Epic 2: Implement core attention mechanism functions
- Epic 3: Create visualization components
- Epic 4: Build evaluation and testing framework
- Epic 5: Develop interactive student exercises
- Epic 6: Generate comprehensive documentation

Each epic represents days or hours of development work, contains multiple related tasks, and produces tangible deliverables.

## Breaking Projects into Manageable Chunks

The art of defining good epics is crucial to workflow success. Epic boundaries should align with natural project divisions. Think about:

**Functional Cohesion**: Group tasks that work toward the same functional goal. Don't mix frontend UI with backend API implementation in the same epic.

**Reasonable Scope**: An epic should be completable in one focused session. Too small, and you waste overhead on coordination. Too large, and agents get lost in complexity.

**Clear Deliverables**: Each epic should produce verifiable outputs - code files, documentation, test results. Vague goals like "improve the codebase" make terrible epics.

**Minimal Cross-Dependencies**: While some dependencies are unavoidable, minimize them. The more epics can run independently, the more parallelization you can achieve.

## Epic Dependencies and Handoffs

Not all epics are independent. Epic 3 might depend on functions created in Epic 2. Managing these dependencies is critical.

**Dependency Declaration**: Each epic definition explicitly states prerequisites. Before starting, the Team Lead checks for required completion files. If dependencies are missing, the agent stops immediately and reports the issue.

**Completion Files**: When an epic finishes, the Team Lead creates a completion file (`.epic2_complete.json`, for example). This JSON file acts as a contract, documenting what was built, where files are located, what function signatures were created, and any configuration details the next epic needs.

**Sequential vs Parallel Execution**: Independent epics can run in parallel - multiple Team Lead sessions executing simultaneously. Dependent epics must run sequentially, with each one reading completion files from its prerequisites before starting work.

## State Management

State management prevents agents from "forgetting" what was done previously. Completion files serve as persistent memory across sessions. Each file typically contains:

```json
{
  "epic_number": 2,
  "status": "complete",
  "timestamp": "2025-11-06T10:30:00Z",
  "deliverables": {
    "notebook_cells": ["0", "1", "2", "3"],
    "functions_created": ["scaled_dot_product_attention", "softmax"],
    "output_files": ["outputs/attention_weights.png"]
  },
  "handoff_notes": "Attention function expects (batch, seq_len, d_model) tensors"
}
```

When Epic 3 starts, its Team Lead reads `.epic2_complete.json` to understand what functions exist, what their signatures are, and how to use them. This explicit state transfer prevents duplicate work and integration failures.

The completion file approach also enables **recovery**. If a Team Lead session crashes mid-epic, you can resume or restart without losing context about completed epics. The state is durable and explicit, not hidden in conversation history.

Good epic development transforms an overwhelming project into a series of achievable milestones, each building on the last with clear handoffs and verifiable progress.
