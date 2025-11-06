# Agent Hierarchy: Three Tiers of Intelligence

## Understanding the Organizational Structure

Imagine you're managing a large software project. You wouldn't have every developer working independently without coordination, right? Agentic workflows follow the same principle. They organize AI agents into a three-tier hierarchy that mirrors successful team structures in real-world software development.

## The Three-Tier Structure

**Product Manager (Top Tier)**
The Product Manager sits at the top of the hierarchy. This is your main agent - the one you interact with directly. Its job is strategic: understanding the overall project goals, breaking them into manageable pieces called "epics," and delegating those epics to Team Leads. Think of it as the architect who sees the big picture but doesn't write every line of code.

**Team Lead (Middle Tier)**
Team Leads receive epics from the Product Manager and are responsible for execution. Each Team Lead runs as a separate background session, working independently on their assigned epic. They analyze requirements, plan the work, and delegate specific tasks to Specialized Subagents. Team Leads are tactical coordinators - they understand both high-level goals and implementation details.

**Specialized Subagents (Bottom Tier)**
These are your task-specific workers. Each subagent is created on-demand with expertise tailored to a particular job: writing documentation, creating test files, validating code, or implementing specific features. They execute specific tasks and report results back to their Team Lead. This is where the actual work happens.

## How Agents Communicate

Communication flows primarily downward through delegation and upward through completion reports. The Product Manager delegates epics to Team Leads via custom commands (like `/epic1` or `/epic2`). Team Leads create subagents dynamically, passing detailed instructions through specialized prompts. When work completes, agents create completion files (like `.epic1_complete.json`) that serve as handoff documents, containing critical information for the next epic.

## Benefits of Hierarchical Organization

This structure prevents chaos. Without hierarchy, you'd have dozens of agents working without coordination, duplicating effort or creating conflicts. The hierarchy provides clear responsibility boundaries, enabling parallel execution (multiple Team Leads can work simultaneously), and creates natural checkpoints for validation.

The hierarchy also optimizes costs. You can run your Product Manager with a powerful model (like Claude Opus) for strategic thinking, Team Leads with a mid-tier model (like Claude Sonnet) for tactical work, and Subagents with efficient models for specific tasks. This balances intelligence with efficiency.

Most importantly, hierarchy enables **scalability**. As projects grow, you simply add more Team Leads or Subagents. The structure remains comprehensible and manageable because each tier has a defined role.
