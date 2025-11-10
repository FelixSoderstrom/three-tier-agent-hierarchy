# Delegation Best Practices: Making Agents Work Together

## Effective Prompting Techniques

Delegation in agentic workflows happens through prompting. The quality of your delegation determines the quality of your results. Poor prompts lead to confused agents, wasted tokens, and incorrect outputs. Great prompts create autonomous, effective agents.

**Be Specific About Expectations**: Vague instructions like "make the code better" doom your agents to failure. Instead: "Refactor the attention function to improve readability by: extracting the softmax calculation into a separate function, adding type hints, and including docstrings with parameter descriptions and example usage."

**Provide Context**: Agents don't automatically know your project's history, conventions, or constraints. Effective delegation includes background: "This project uses PyTorch, follows Google Python style guide, and targets beginners learning about transformers. All code should include educational comments explaining the 'why' behind implementation choices."

**Use Examples**: When possible, show don't just tell. If you want a particular coding style, provide a reference example. If you need documentation in a specific format, share a template. Examples eliminate ambiguity far better than descriptions.

**Specify Output Format**: Be explicit about deliverables. "Create unit tests" is unclear. "Create a pytest file named `test_attention.py` containing at least 5 test functions covering: basic functionality, edge cases, tensor shape validation, gradient flow, and batch processing" is actionable.

## Clear Task Boundaries and Acceptance Criteria

Agents perform best when they understand exactly what they're responsible for and when they're done.

**Define Scope Explicitly**: "Implement the attention mechanism" has unclear boundaries. Does it include visualization? Testing? Multiple attention variants? Instead: "Implement ONLY the scaled dot-product attention function as described in 'Attention Is All You Need' section 3.2.1. Input: Q, K, V matrices. Output: attention output and attention weights. Do NOT implement multi-head attention or positional encoding - those are separate tasks."

**Use Checkboxes for Acceptance Criteria**: Give agents a literal checklist:

```markdown
Task complete when:
- [ ] Function `scaled_dot_product_attention()` created in attention.py
- [ ] Function accepts Q, K, V tensors with shapes (batch, seq_len, d_k)
- [ ] Function returns tuple of (output, attention_weights)
- [ ] Docstring includes mathematical formula and parameter descriptions
- [ ] Example usage included in docstring
- [ ] Function handles mask parameter for padding tokens
```

Agents can verify completion by checking off items. This creates accountability and prevents premature task completion.

**Establish Success Metrics**: How do you know the work is correct? Define verification: "Implementation is successful if it produces the same attention weights as the reference implementation in `test_data/expected_attention_weights.pt` when given `test_data/input_qkv.pt` (tolerance: 1e-6)."

## Error Handling and Recovery

Things go wrong in agentic workflows. Agents misunderstand instructions, code has bugs, dependencies break. Building in error handling is essential.

**Validation Steps**: Instruct agents to validate their work before marking tasks complete. "After implementation, run the function with the example input Q=[[1, 0], [0, 1]], K=V=[[1, 2], [3, 4]] and verify output shapes are correct. Include the output in your completion report."

**Failure Protocols**: Define what agents should do when encountering problems. "If you cannot complete the task due to missing dependencies, create a `.epic_blocked.json` file documenting: the blocking issue, what prerequisites are needed, and your progress so far. Then stop execution."

**Graceful Degradation**: Sometimes partial completion is better than total failure. "Primary goal: implement full attention with masking. Fallback: if masking proves too complex, implement basic attention without masking and document the limitation."

**Logging and Transparency**: Require agents to log their actions. Many workflows use hooks that automatically log tool usage (file reads/writes, bash commands). This creates an audit trail for debugging. When things fail, you can trace exactly what the agent did.

## Agent Coordination Strategies

Multiple agents working simultaneously need coordination to avoid conflicts.

**File Ownership**: Assign clear file ownership. "Epic 2 owns all files in `src/attention/`. Epic 3 owns `src/visualization/`. If Epic 3 needs to modify attention code, it must create an interface request rather than editing directly."

**Lock Files**: For shared resources, use lock files. Before modifying a shared configuration file, an agent creates `.config_lock` to signal "I'm working here." Other agents check for locks before proceeding.

**Merge Strategies**: When agents work on related code, define merge strategies upfront. "Subagent A handles test files. Subagent B handles implementation. Team Lead reviews both and integrates changes after validation."

**Communication Channels**: Agents communicate through structured files, not just code. Create `messages/` directory where agents leave `.json` messages for each other:

```json
{
  "from": "epic3_visualization_agent",
  "to": "epic2_implementation_agent",
  "subject": "API Request",
  "message": "Need attention_head() to return intermediate states for visualization. Can you add return_intermediates=False parameter?"
}
```

This explicit communication prevents assumptions and enables true agent collaboration.

**Conflict Resolution**: Define who has authority when agents disagree. Typically, Team Leads resolve conflicts between their Subagents, and the Product Manager resolves conflicts between Team Leads.

Effective delegation transforms agents from unpredictable tools into reliable team members. The investment in clear instructions, boundaries, and coordination pays massive dividends in workflow reliability and output quality.
