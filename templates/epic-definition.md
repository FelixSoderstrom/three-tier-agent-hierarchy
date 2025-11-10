# Epic {{EPIC_NUMBER}}: {{EPIC_NAME}}

## Epic Purpose

{{EPIC_PURPOSE}}

This epic is part of the **{{PROJECT_NAME}}** agentic workflow system, designed to accomplish specific objectives while coordinating with other epics in the sequence.

## Epic Metadata

- **Epic Number**: {{EPIC_NUMBER}}
- **Epic Name**: {{EPIC_NAME}}
- **Estimated Complexity**: [Low / Medium / High]
- **Prerequisites**: [List of required previous epics, if any]
- **Suggested Team Size**: [Number of agents needed]

## Objectives

### Primary Objectives
1. [Primary objective 1]
2. [Primary objective 2]
3. [Primary objective 3]

### Secondary Objectives
1. [Secondary objective 1]
2. [Secondary objective 2]

## Context from Previous Epics

### Epic {{PREV_EPIC_NUMBER}} Handoff
**Read from**: `.epic{{PREV_EPIC_NUMBER}}_complete.json`

**Required Information**:
- [Specific data needed from previous epic]
- [File paths or configurations]
- [Function names or interfaces]

**Integration Points**:
- [How this epic builds on previous work]
- [What needs to remain compatible]

### Key Constraints
- [Constraints from previous epics]
- [Standards that must be maintained]
- [Compatibility requirements]

## Deliverables

### Required Deliverables

#### 1. [Deliverable Name]
- **Type**: [File type, e.g., Python script, Jupyter notebook, configuration file]
- **Location**: `[file path]`
- **Description**: [What this deliverable contains]
- **Success Criteria**:
  - [ ] [Criterion 1]
  - [ ] [Criterion 2]
  - [ ] [Criterion 3]

#### 2. [Deliverable Name]
- **Type**: [File type]
- **Location**: `[file path]`
- **Description**: [What this deliverable contains]
- **Success Criteria**:
  - [ ] [Criterion 1]
  - [ ] [Criterion 2]

#### 3. Epic Completion File
- **Type**: JSON
- **Location**: `.epic{{EPIC_NUMBER}}_complete.json`
- **Description**: Structured completion data for handoff to next epic
- **Required Fields**:
  ```json
  {
    "epicNumber": {{EPIC_NUMBER}},
    "epicName": "{{EPIC_NAME}}",
    "completedAt": "[ISO 8601 timestamp]",
    "status": "complete",
    "deliverables": [
      {
        "name": "[deliverable name]",
        "path": "[file path]",
        "type": "[file type]",
        "description": "[brief description]"
      }
    ],
    "handoffData": {
      // Epic-specific data for next epic
    },
    "metadata": {
      "executionTime": "[duration]",
      "agentsUsed": ["[agent names]"],
      "issuesEncountered": ["[any issues]"]
    }
  }
  ```

### Optional Deliverables
- [Optional deliverable 1]
- [Optional deliverable 2]

## Acceptance Criteria

### Functional Requirements
- [ ] All required deliverables created and validated
- [ ] Code executes without errors
- [ ] Integration tests pass (if applicable)
- [ ] Documentation is complete and accurate
- [ ] File structure follows project conventions

### Quality Requirements
- [ ] Code follows style guidelines
- [ ] Functions are properly documented
- [ ] Error handling is implemented
- [ ] Edge cases are handled
- [ ] Performance is acceptable

### Integration Requirements
- [ ] Compatible with deliverables from previous epics
- [ ] Provides necessary handoff data for next epic
- [ ] Maintains consistency with project architecture
- [ ] Configuration settings are preserved
- [ ] File paths are absolute and correct

### Completion Requirements
- [ ] `.epic{{EPIC_NUMBER}}_complete.json` file created
- [ ] Completion file contains all required fields
- [ ] All deliverable paths in completion file are valid
- [ ] Handoff data is complete and structured
- [ ] Epic completion is logged properly

## Suggested Subagents

This epic may benefit from the following specialized agents:

### 1. {{SUBAGENT_1_NAME}}
- **Role**: [What this agent specializes in]
- **Responsibilities**:
  - [Responsibility 1]
  - [Responsibility 2]
- **Tools Needed**: [Read, Write, Edit, Bash, etc.]
- **Deliverables**: [What this agent produces]

### 2. {{SUBAGENT_2_NAME}}
- **Role**: [What this agent specializes in]
- **Responsibilities**:
  - [Responsibility 1]
  - [Responsibility 2]
- **Tools Needed**: [Read, Write, Edit, Bash, etc.]
- **Deliverables**: [What this agent produces]

### 3. {{SUBAGENT_3_NAME}}
- **Role**: [What this agent specializes in]
- **Responsibilities**:
  - [Responsibility 1]
  - [Responsibility 2]
- **Tools Needed**: [Read, Write, Edit, Bash, etc.]
- **Deliverables**: [What this agent produces]

## Technical Specifications

### Technology Stack
- **Primary Language**: [e.g., Python, JavaScript]
- **Frameworks**: [e.g., Jupyter, React]
- **Libraries**: [e.g., NumPy, TensorFlow]
- **Tools**: [e.g., Git, npm]

### File Structure
```
{{PROJECT_NAME}}/
├── .epic{{EPIC_NUMBER}}_complete.json
├── [deliverable directories]
│   ├── [files created by this epic]
│   └── [subdirectories]
└── [other project files]
```

### Coding Standards
- Use absolute file paths (not relative)
- Follow naming conventions: [specify conventions]
- Include docstrings for all functions
- Add type hints where applicable
- Write clear, descriptive comments

### Error Handling
- Implement try-catch blocks for critical operations
- Provide informative error messages
- Log errors appropriately
- Fail gracefully with cleanup

## Dependencies

### External Dependencies
- **Libraries**: [List required libraries with versions]
- **Tools**: [List required tools]
- **Environment**: [Environment requirements, e.g., Python 3.8+]

### Internal Dependencies
- **Previous Epics**: Epic {{PREV_EPIC_NUMBER}} must be complete
- **Completion Files**: Must read `.epic{{PREV_EPIC_NUMBER}}_complete.json`
- **Existing Files**: [List files from previous epics this epic uses]

### Validation Steps
Before starting this epic, verify:
```bash
# Check previous epic completion
[ -f .epic{{PREV_EPIC_NUMBER}}_complete.json ] || echo "ERROR: Epic {{PREV_EPIC_NUMBER}} incomplete"

# Validate JSON structure
cat .epic{{PREV_EPIC_NUMBER}}_complete.json | jq empty

# Check required files exist
[ -f [required file path] ] || echo "ERROR: Required file missing"
```

## Execution Instructions

### Pre-Execution Checklist
- [ ] Previous epic(s) completed successfully
- [ ] All prerequisite completion files exist and are valid
- [ ] Required dependencies are available
- [ ] Working directory is correct
- [ ] Tool permissions are configured

### Execution Steps

#### Step 1: Environment Assessment
1. Read all previous epic completion files
2. Validate prerequisite deliverables exist
3. Identify integration points
4. Set up working directory

#### Step 2: Implementation
1. Create required deliverables
2. Implement functionality according to specifications
3. Test each component as it's created
4. Integrate with previous epic deliverables

#### Step 3: Validation
1. Run all tests
2. Verify acceptance criteria
3. Check integration points
4. Validate file paths and structure

#### Step 4: Completion
1. Create `.epic{{EPIC_NUMBER}}_complete.json` file
2. Populate with all required fields
3. Include handoff data for next epic
4. Generate completion report

### Post-Execution Checklist
- [ ] All deliverables created
- [ ] All acceptance criteria met
- [ ] Completion file created and valid
- [ ] No errors in logs
- [ ] Ready for next epic

## Risk Assessment

### Potential Risks

#### Risk 1: [Risk Name]
- **Likelihood**: [Low / Medium / High]
- **Impact**: [Low / Medium / High]
- **Mitigation**: [How to prevent or handle]

#### Risk 2: [Risk Name]
- **Likelihood**: [Low / Medium / High]
- **Impact**: [Low / Medium / High]
- **Mitigation**: [How to prevent or handle]

### Contingency Plans

#### If deliverable creation fails:
1. Review error logs
2. Check dependencies
3. Verify file paths
4. Retry with corrections

#### If integration fails:
1. Re-read previous completion files
2. Verify handoff data structure
3. Check compatibility with previous epics
4. Coordinate with Product-Manager for guidance

## Testing Requirements

### Unit Tests
- [ ] Test individual functions
- [ ] Verify input validation
- [ ] Check error handling
- [ ] Validate edge cases

### Integration Tests
- [ ] Test interaction with previous epic deliverables
- [ ] Verify data flow between components
- [ ] Check file I/O operations
- [ ] Validate configuration loading

### Acceptance Tests
- [ ] All acceptance criteria pass
- [ ] Deliverables meet specifications
- [ ] Completion file is valid
- [ ] No regressions introduced

## Documentation Requirements

### Code Documentation
- Docstrings for all functions and classes
- Inline comments for complex logic
- Type hints where applicable
- Usage examples

### User Documentation
- README or guide for this epic's deliverables
- Configuration instructions
- Troubleshooting tips
- Example usage

### Handoff Documentation
- What next epic needs to know
- How to use this epic's deliverables
- Important considerations
- Known limitations

## Template Variables

The following variables will be replaced with actual values:

- **{{EPIC_NUMBER}}**: The number of this epic (e.g., 1, 2, 3)
- **{{EPIC_NAME}}**: The name of this epic
- **{{EPIC_PURPOSE}}**: The purpose/goal of this epic
- **{{PROJECT_NAME}}**: The name of the overall project
- **{{PREV_EPIC_NUMBER}}**: The previous epic number ({{EPIC_NUMBER}} - 1)
- **{{SUBAGENT_X_NAME}}**: Names of suggested specialized agents

## Success Metrics

This epic is considered successful when:

- ✓ All required deliverables are created and validated
- ✓ All acceptance criteria checkboxes are checked
- ✓ `.epic{{EPIC_NUMBER}}_complete.json` exists and is valid
- ✓ Integration with previous epics is confirmed
- ✓ All tests pass
- ✓ Documentation is complete
- ✓ Handoff data for next epic is ready
- ✓ No blocking errors remain

## Notes and Considerations

### Important Notes
- Always use absolute file paths, never relative paths
- Validate all inputs from previous epics
- Handle errors gracefully with informative messages
- Test thoroughly before marking complete

### Coordination Requirements
- Communicate clearly with Product-Manager agent
- Provide status updates during execution
- Report any blockers immediately
- Request clarification if epic definition is unclear

### Best Practices
- Read previous completion files first
- Validate each deliverable as it's created
- Test integration points early
- Document assumptions and decisions
- Create completion file only when everything is verified

---

**Epic Owner**: Team-Lead Agent assigned by Product-Manager
**Review Authority**: Product-Manager Agent
**Next Epic**: Epic {{NEXT_EPIC_NUMBER}} (if applicable)
