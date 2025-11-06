# {{PROJECT_NAME}}

> An automated agentic workflow system for orchestrated AI-driven development

## Overview

**{{PROJECT_NAME}}** is an advanced agentic workflow system that uses multiple coordinated AI agents to accomplish complex tasks through structured epic execution. This project implements a multi-agent architecture where specialized agents work together under the coordination of a Product-Manager agent to deliver comprehensive, high-quality results.

### Key Features

- **Multi-Epic Architecture**: {{EPIC_COUNT}} structured epics for organized development
- **Agent Orchestration**: Coordinated execution through Product-Manager agent
- **Completion Tracking**: JSON-based completion files for inter-epic communication
- **Specialized Agents**: Domain-specific agents for optimized task execution
- **Quality Assurance**: Built-in validation and acceptance criteria
- **Automated Handoffs**: Seamless information transfer between epics

## Project Structure

```
{{PROJECT_NAME}}/
├── .claude/                          # Claude AI configuration directory
│   ├── product-manager.md            # Product-Manager agent configuration
│   ├── meta-agent.md                 # Meta-Agent configuration (if enabled)
│   ├── specialized-agents/           # Specialized agent configurations
│   │   ├── agent-1.md
│   │   ├── agent-2.md
│   │   └── ...
│   └── epics/                        # Epic definitions
│       ├── epic-1.md
│       ├── epic-2.md
│       ├── ...
│       └── epic-{{EPIC_COUNT}}.md
├── .epic1_complete.json              # Epic 1 completion data
├── .epic2_complete.json              # Epic 2 completion data
├── ...                               # Additional epic completion files
├── .epic{{EPIC_COUNT}}_complete.json # Final epic completion data
├── {{CUSTOM_DIRECTORY_STRUCTURE}}    # Project-specific directories
└── README.md                         # This file
```

### Directory Descriptions

#### `.claude/` - Agent Configuration
Contains all agent configurations and epic definitions that drive the workflow:
- **product-manager.md**: Central orchestrator for all epic execution
- **meta-agent.md**: Advanced agent capable of dynamically creating specialized agents
- **specialized-agents/**: Pre-configured domain-specific agents
- **epics/**: Detailed definitions for each epic in the workflow

#### Epic Completion Files
JSON files created by each epic upon successful completion:
- Contain deliverable information and metadata
- Enable information handoff between sequential epics
- Provide progress tracking and validation data
- Critical for epic dependency management

#### Project Deliverables
{{CUSTOM_DIRECTORY_STRUCTURE}}

## Epic Execution Order

This workflow consists of {{EPIC_COUNT}} epics that must be executed in sequence:

{{EPIC_LIST}}

### Epic Dependencies

```
Epic 1
  ↓ (requires Epic 1 completion)
Epic 2
  ↓ (requires Epic 2 completion)
Epic 3
  ↓ (requires Epic 3 completion)
...
  ↓ (requires Epic N-1 completion)
Epic {{EPIC_COUNT}}
```

## How to Use This Workflow

### Prerequisites

- **Claude AI Access**: Claude Sonnet 4.5 or compatible model recommended
- **Environment**: Bash-compatible terminal (Linux, macOS, WSL)
- **Dependencies**: [Project-specific dependencies listed here]

### Quick Start

1. **Initialize the Workflow**
   ```bash
   # Navigate to project directory
   cd {{PROJECT_NAME}}

   # Verify directory structure
   ls -la .claude/

   # Check for previous completion files (for resumption)
   ls -la .epic*.json 2>/dev/null || echo "Starting fresh"
   ```

2. **Start with Product-Manager Agent**
   ```bash
   # The Product-Manager agent orchestrates everything
   # Provide it with the product-manager.md configuration
   # It will spawn team-lead agents for each epic
   ```

3. **Monitor Progress**
   ```bash
   # Check which epics are complete
   for i in {1..{{EPIC_COUNT}}}; do
     if [ -f ".epic${i}_complete.json" ]; then
       echo "Epic $i: ✓ Complete"
     else
       echo "Epic $i: ○ Pending"
     fi
   done
   ```

4. **Verify Completion**
   ```bash
   # All epics should have completion files
   [ $(ls .epic*.json 2>/dev/null | wc -l) -eq {{EPIC_COUNT}} ] && echo "All epics complete!" || echo "Workflow in progress"
   ```

### Resuming a Workflow

If the workflow is interrupted:

1. **Check Current State**
   ```bash
   # Find the last completed epic
   LAST_EPIC=$(ls .epic*.json 2>/dev/null | tail -1 | grep -oP '\d+')
   echo "Last completed epic: ${LAST_EPIC:-None}"
   ```

2. **Validate Completion Files**
   ```bash
   # Ensure all completion files are valid JSON
   for file in .epic*.json; do
     if jq empty "$file" 2>/dev/null; then
       echo "$file: ✓ Valid"
     else
       echo "$file: ✗ Invalid - may need to redo this epic"
     fi
   done
   ```

3. **Resume from Next Epic**
   - Provide Product-Manager with current state
   - It will read existing completion files
   - Continue from the next incomplete epic

## Agent Roles and Responsibilities

### Product-Manager Agent
**Primary Coordinator** for the entire workflow

**Responsibilities**:
- Orchestrate epic execution in correct order
- Spawn team-lead agents for each epic
- Monitor epic completion through completion files
- Validate deliverables and acceptance criteria
- Manage error handling and recovery
- Generate progress reports

**Key Files**:
- Configuration: `.claude/product-manager.md`
- Monitors: `.epic*_complete.json` files

### Meta-Agent (if enabled)
**Dynamic Agent Creator** for complex, adaptive workflows

**Responsibilities**:
- Analyze complex tasks and decompose them
- Design and spawn custom specialized agents
- Coordinate multi-agent workflows
- Adapt agent configurations based on runtime conditions

**Key Files**:
- Configuration: `.claude/meta-agent.md`

### Specialized Agents (if configured)
**Domain Experts** for specific task types

**Types**:
- Data Science Specialist
- Web Development Specialist
- Documentation Specialist
- Testing Specialist
- [Additional specialized agents as configured]

**Key Files**:
- Configurations: `.claude/specialized-agents/*.md`

## Epic Structure

Each epic follows a consistent structure:

### Epic Definition Components
1. **Epic Purpose**: Clear statement of what the epic accomplishes
2. **Objectives**: Primary and secondary goals
3. **Context from Previous Epics**: Required handoff data
4. **Deliverables**: Specific outputs with success criteria
5. **Acceptance Criteria**: Checklist of requirements
6. **Suggested Subagents**: Recommended specialized agents
7. **Dependencies**: Prerequisites and validation steps

### Epic Completion File Structure
```json
{
  "epicNumber": 1,
  "epicName": "Epic Name",
  "completedAt": "2024-01-15T10:30:00Z",
  "status": "complete",
  "deliverables": [
    {
      "name": "Deliverable Name",
      "path": "/absolute/path/to/file",
      "type": "file type",
      "description": "Brief description"
    }
  ],
  "handoffData": {
    "key": "Information for next epic"
  },
  "metadata": {
    "executionTime": "45 minutes",
    "agentsUsed": ["Team-Lead", "Specialist-1"],
    "issuesEncountered": []
  }
}
```

## Workflow Best Practices

### For Product-Manager Agent

1. **Always Read Previous Completion Files First**
   - Never start an epic without checking prerequisites
   - Validate JSON structure of completion files
   - Extract and provide handoff data to team-leads

2. **Validate Before Proceeding**
   - Check that completion files exist
   - Verify all deliverables are present
   - Ensure acceptance criteria were met

3. **Handle Errors Gracefully**
   - Detect epic failures early
   - Provide clear error messages
   - Offer recovery paths
   - Document issues in completion files

### For Team-Lead Agents

1. **Read Epic Definition Thoroughly**
   - Understand all objectives
   - Review acceptance criteria
   - Note dependencies

2. **Gather Context from Previous Epics**
   - Read relevant completion files
   - Understand integration requirements
   - Identify handoff data

3. **Create Comprehensive Completion Files**
   - Include all deliverables with absolute paths
   - Provide detailed handoff data
   - Document any issues or considerations

### For All Agents

1. **Use Absolute File Paths**
   - Never use relative paths in code or completion files
   - Ensures consistency across environments

2. **Validate Continuously**
   - Test as you build
   - Verify integration points
   - Check against acceptance criteria

3. **Document Decisions**
   - Explain non-obvious choices
   - Note assumptions
   - Provide context for future work

## Troubleshooting

### Common Issues and Solutions

#### Issue: Epic completion file missing
**Symptoms**: Next epic cannot start, missing `.epicN_complete.json`

**Solutions**:
1. Check if epic actually completed successfully
2. Review epic's output for errors
3. Manually create completion file if epic deliverables are valid
4. Re-execute the epic with explicit completion file requirement

**Prevention**:
- Always create completion file as final step
- Validate completion file creation
- Use templates for consistent structure

#### Issue: Epic completion file invalid JSON
**Symptoms**: Cannot parse `.epicN_complete.json`, JSON syntax errors

**Solutions**:
1. Validate JSON structure: `cat .epicN_complete.json | jq empty`
2. Check for missing commas, brackets, or quotes
3. Use a JSON validator to identify specific errors
4. Recreate using valid template

**Prevention**:
- Use JSON validators during creation
- Follow completion file template exactly
- Test JSON parsing before marking epic complete

#### Issue: Dependencies not met
**Symptoms**: Epic fails because required files from previous epic don't exist

**Solutions**:
1. Check previous epic completion file for deliverable paths
2. Verify files exist at specified paths: `ls -la [path]`
3. Re-execute previous epic if deliverables are missing
4. Update paths if files were moved

**Prevention**:
- Always use absolute paths
- Validate deliverable existence before marking epic complete
- Document file locations clearly in completion files

#### Issue: Agent spawn failure
**Symptoms**: Team-lead or specialized agent fails to initialize

**Solutions**:
1. Verify agent configuration file exists
2. Check configuration file syntax
3. Ensure agent has required tool permissions
4. Provide complete context to agent

**Prevention**:
- Validate agent configurations before deploying
- Test agent spawn process
- Provide comprehensive initialization context

#### Issue: Workflow interruption
**Symptoms**: Workflow stops mid-execution

**Solutions**:
1. Identify last completed epic: `ls .epic*.json | tail -1`
2. Validate existing completion files
3. Resume from next epic with Product-Manager
4. Provide current state and existing completion data

**Prevention**:
- Create completion files immediately upon epic success
- Regular progress backups
- Clear resumption procedures

### Debugging Commands

```bash
# Check all completion files
ls -la .epic*.json

# Validate a specific completion file
jq empty .epic1_complete.json

# Pretty-print completion file contents
jq . .epic1_complete.json

# Count completed epics
ls .epic*.json 2>/dev/null | wc -l

# Find missing epics
for i in {1..{{EPIC_COUNT}}}; do
  [ ! -f ".epic${i}_complete.json" ] && echo "Epic $i incomplete"
done

# Check if all deliverables from epic exist
jq -r '.deliverables[].path' .epic1_complete.json | while read path; do
  [ -f "$path" ] && echo "$path: ✓" || echo "$path: ✗ MISSING"
done
```

## Configuration and Customization

### Modifying Epic Definitions

Epic definitions are located in `.claude/epics/`. To modify:

1. **Edit the epic definition file**
   ```bash
   nano .claude/epics/epic-1.md
   ```

2. **Update these sections as needed**:
   - Epic Purpose
   - Objectives
   - Deliverables
   - Acceptance Criteria

3. **Validate changes**:
   - Ensure template variables are preserved
   - Check that dependencies are still accurate
   - Verify acceptance criteria are measurable

### Adding Specialized Agents

To add new specialized agents:

1. **Create agent configuration**
   ```bash
   nano .claude/specialized-agents/new-agent.md
   ```

2. **Use the specialized agent template** (`.claude/specialized-agents/template.md`)

3. **Configure**:
   - Agent name and domain
   - Tool access requirements
   - Detailed instructions
   - Expected deliverables

4. **Reference in epic definitions** where appropriate

### Adjusting Epic Count

If you need to add or remove epics:

1. **Update epic count variable**: {{EPIC_COUNT}}
2. **Add/remove epic definition files** in `.claude/epics/`
3. **Update dependencies** in affected epic definitions
4. **Update this README** with new epic list
5. **Test the complete workflow** to ensure consistency

## Project Variables

This configuration uses the following variables that are replaced during setup:

- **{{PROJECT_NAME}}**: The name of your agentic workflow project
- **{{EPIC_COUNT}}**: Total number of epics in the workflow
- **{{EPIC_LIST}}**: Formatted list of all epics with descriptions
- **{{CUSTOM_INSTRUCTIONS}}**: Project-specific instructions
- **{{CUSTOM_DIRECTORY_STRUCTURE}}**: Project-specific directory layout

## Performance and Optimization

### Execution Time Estimates

| Epic | Estimated Duration | Complexity |
|------|-------------------|------------|
{{EPIC_DURATION_TABLE}}

**Total Estimated Time**: {{TOTAL_DURATION}}

### Optimization Tips

1. **Parallel Execution** (where possible)
   - Some epic sub-tasks can run in parallel
   - Coordinate with Meta-Agent for multi-agent parallelism

2. **Caching and Reuse**
   - Reuse deliverables from previous epics
   - Cache expensive computations
   - Avoid redundant work

3. **Resource Management**
   - Monitor memory and CPU usage
   - Optimize file I/O operations
   - Clean up temporary files

## Quality Assurance

### Validation Checklist

Before considering the workflow complete:

- [ ] All {{EPIC_COUNT}} epic completion files exist
- [ ] All completion files are valid JSON
- [ ] All deliverables listed in completion files exist
- [ ] All epic acceptance criteria are met
- [ ] Integration between epics is validated
- [ ] No critical errors in any epic
- [ ] Final project deliverables are complete
- [ ] Documentation is comprehensive and accurate

### Quality Metrics

Track these metrics throughout execution:

- **Epic Success Rate**: Percentage of epics completed on first attempt
- **Average Execution Time**: Time per epic
- **Error Rate**: Number of errors encountered
- **Deliverable Quality**: Adherence to acceptance criteria
- **Integration Success**: Successful handoffs between epics

## Contributing

{{CUSTOM_INSTRUCTIONS}}

### Making Changes

1. **Test thoroughly** before committing
2. **Update epic definitions** if deliverables change
3. **Maintain completion file structure**
4. **Document all modifications**

### Version Control

- Commit epic completion files for tracking
- Tag major milestones
- Document significant changes in commit messages

## License and Attribution

[Add your license information here]

## Support and Contact

For issues, questions, or contributions:

- **Documentation**: This README and epic definition files
- **Troubleshooting**: See Troubleshooting section above
- **Advanced Help**: Consult Product-Manager agent configuration

## Appendix

### Glossary

- **Epic**: A major unit of work in the workflow, containing multiple deliverables
- **Product-Manager Agent**: Central orchestrator for epic execution
- **Team-Lead Agent**: Agent responsible for executing a specific epic
- **Meta-Agent**: Agent capable of dynamically creating other agents
- **Specialized Agent**: Domain-specific agent for particular task types
- **Completion File**: JSON file containing epic completion data and handoff information
- **Handoff Data**: Information passed from one epic to the next
- **Acceptance Criteria**: Checklist of requirements for epic completion

### References

- [Claude AI Documentation](https://docs.anthropic.com/)
- [Agentic Workflow Patterns](https://www.anthropic.com/)
- [Multi-Agent Systems](https://en.wikipedia.org/wiki/Multi-agent_system)

### Changelog

#### Version 1.0.0 - Initial Release
- {{EPIC_COUNT}} epic workflow
- Product-Manager orchestration
- Completion file system
- {{CUSTOM_CHANGELOG_ENTRIES}}

---

**Project**: {{PROJECT_NAME}}
**Version**: 1.0.0
**Last Updated**: [Auto-generated date]
**Epic Count**: {{EPIC_COUNT}}
**Status**: {{PROJECT_STATUS}}
