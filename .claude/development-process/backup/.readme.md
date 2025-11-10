# Transformer Attention Mechanism Lesson
## Development Guide

This README serves as the development guide for creating an interactive lesson on transformer attention mechanisms. It's intended for developers and AI coding assistants, not for end-users.

## Project Overview

We're creating a ~30-minute interactive Jupyter notebook lesson that teaches students how transformer attention mechanisms work by implementing and visualizing a single attention head.

### Key Learning Objectives
- Understand and implement scaled dot-product attention
- Build a single attention head with query, key, value projections
- Visualize attention patterns with a consistent example
- Compare performance with a mini-transformer model

## Implementation Approach

### Core Notebook Structure
1. **Introduction & Theory** - Explain attention mechanisms
2. **PROMPT_EXAMPLE Definition** - Consistent example used throughout
3. **Tokenization & Embedding** - Convert text to tokens and embeddings
4. **Linear Projections** - Create Q/K/V projections (student implementation)
5. **Scaled Dot-Product Attention** - Core attention formula (student implementation)
6. **Softmax & Attention Weights** - Convert scores to weights (student implementation)
7. **Value Aggregation** - Combine values based on weights
8. **Full Attention Head** - Connect all components
9. **Mini-Model Demonstration** - Run inference with tiny pre-trained model
10. **Validation & Grading** - Evaluate student implementations

### Visualization Strategy
- Attention heatmaps showing token relationships
- Directed graphs for attention flows
- Step-by-step visualizations of attention calculation

### Evaluation & Grading
- Point system: 1 point per correctly implemented cell
- LLM-based evaluation using a cheat sheet notebook with correct implementations
- Final cell runs evaluation and updates progress JSON
- Tolerance for numerical differences in implementations

## Project Structure

```
/
├── index.html              # A how-to guide for the lesson
├── lesson.ipynb            # Main lesson notebook
├── complete_lesson.ipynb   # Complete notebook with solutions
├── README.md               # Project overview
├── verify.py               # Verification script called from notebook
├── src/                    # Helper code and utilities
│   ├── visualizations.py   # Attention visualization functions
│   ├── evaluation.py       # LLM-based evaluation functions
│   └── model_utils.py      # Mini-transformer utilities
├── progress/
│   └── lesson_progress.json # Updated progress tracking
├── requirements.txt        # Pinned dependencies
└── setup_venv.sh           # Environment setup script
```

## Implementation Notes

### Notebook Implementation
- Each student implementation cell should have clear instructions
- Each implementation cell should be followed by a hint cell (collapsed by default)
- Visualizations should run automatically after each implementation
- Test cases should validate implementation correctness

### LLM-Based Evaluation
- Using Ollama for local LLM inference
- Evaluation compares student implementation against reference
- Considers both functional correctness and code quality
- Tolerant of different but correct approaches

### Mini-Transformer
- Use a tiny pre-trained model (1-5M parameters)
- Allow students to hook their attention implementation into it
- Demonstrate inference with the same PROMPT_EXAMPLE
- Compare student attention patterns with pre-trained model

## Practical Considerations

### Accommodating Requirements
- While we need to satisfy the assignment structure, our focus is a cohesive learning experience
- index.html will be simple but exist as the entry point
- run_lesson.ipynb serves as the main entrypoint
- verify.py will be called from the notebook rather than standalone

### Dependencies
- PyTorch for tensor operations
- Matplotlib/Plotly for visualizations
- Transformers library for mini-model
- Ollama for LLM-based evaluation

### Time Management
- Core implementation tasks should take ~20-25 minutes
- Visualization and explanation ~5-10 minutes
- Aim for minimum friction during the lesson flow

## Development Workflow
1. Create the reference notebook first (with all correct implementations)
2. Develop visualization and evaluation utilities
3. Create the student notebook with blank implementation cells
4. Add hint cells and instructions
5. Implement verification and progress tracking
6. Test end-to-end flow and timing
7. Finalize documentation

## Metrics & Comparisons
Include performance comparisons between:
- Attention with and without scaling factor
- Different attention temperature values
- Single-head vs reference multi-head attention
- Student implementation vs reference implementation

These comparisons demonstrate the impact of implementation choices on attention behavior.