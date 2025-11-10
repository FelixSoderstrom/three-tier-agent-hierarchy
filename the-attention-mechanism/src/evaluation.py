"""
Evaluation utilities for the attention mechanism learning module.

This module provides functions to evaluate student implementations of the attention mechanism,
including correctness checks, performance metrics, and educational feedback.

The evaluation framework is designed to:
1. Validate implementation correctness
2. Provide educational feedback
3. Track learning progress
4. Generate performance reports
"""

import torch
import numpy as np
from typing import Dict, List, Tuple, Any, Optional
import json
import time
from pathlib import Path
import logging
import os
from datetime import datetime

# Import display utilities for cross-platform symbol support
try:
    from .display_utils import symbols, format_message
except ImportError:
    from src.display_utils import symbols, format_message

# Import LLM integration and reference implementation
try:
    from .llm_integration import LLMEvaluator
except ImportError:
    from src.llm_integration import LLMEvaluator

# Import notebook executor for context-aware evaluation
try:
    from .notebook_executor import NotebookExecutor
except ImportError:
    from src.notebook_executor import NotebookExecutor

try:
    from .reference_attention import (
        create_qkv_projections as ref_create_qkv_projections,
        compute_attention_scores as ref_compute_attention_scores,
        compute_attention_weights as ref_compute_attention_weights,
        aggregate_values as ref_aggregate_values
    )
except ImportError:
    from src.reference_attention import (
        create_qkv_projections as ref_create_qkv_projections,
        compute_attention_scores as ref_compute_attention_scores,
        compute_attention_weights as ref_compute_attention_weights,
        aggregate_values as ref_aggregate_values
    )


def evaluate_attention_output(output: torch.Tensor, attention_weights: torch.Tensor, 
                            input_embeddings: torch.Tensor) -> Dict[str, Any]:
    """
    Evaluate the correctness and quality of attention mechanism output.
    
    This function performs comprehensive evaluation of a student's attention
    implementation, checking mathematical correctness, output properties,
    and providing educational feedback.
    
    Args:
        output: Attention output tensor (batch_size, seq_len, d_v)
        attention_weights: Attention weights (batch_size, seq_len, seq_len)
        input_embeddings: Original input embeddings (batch_size, seq_len, d_model)
    
    Returns:
        Dict containing evaluation results and feedback
    """
    # TODO: Epic 3 will implement comprehensive evaluation
    # For now, provide basic validation
    
    results = {
        'timestamp': time.time(),
        'status': 'placeholder_evaluation',
        'overall_score': 0.0,
        'checks': {},
        'feedback': [],
        'metrics': {}
    }
    
    try:
        # Basic shape validation
        batch_size, seq_len, d_model = input_embeddings.shape
        output_batch, output_seq, output_dim = output.shape
        weights_batch, weights_query, weights_key = attention_weights.shape
        
        # Check output shapes
        shape_correct = (
            output_batch == batch_size and 
            output_seq == seq_len and
            weights_batch == batch_size and
            weights_query == seq_len and
            weights_key == seq_len
        )
        
        results['checks']['shape_validation'] = {
            'passed': shape_correct,
            'expected_output_shape': (batch_size, seq_len, 'd_v'),
            'actual_output_shape': output.shape,
            'expected_weights_shape': (batch_size, seq_len, seq_len),
            'actual_weights_shape': attention_weights.shape
        }
        
        # Check attention weights sum to 1
        weights_sum = torch.sum(attention_weights, dim=-1)
        weights_sum_correct = torch.allclose(weights_sum, torch.ones_like(weights_sum), atol=1e-6)
        
        results['checks']['attention_weights_normalization'] = {
            'passed': weights_sum_correct,
            'description': 'Attention weights should sum to 1 for each query',
            'sample_sums': weights_sum[0, :3].tolist() if weights_sum.numel() > 0 else []
        }
        
        # Check for NaN or infinite values
        output_finite = torch.isfinite(output).all()
        weights_finite = torch.isfinite(attention_weights).all()
        
        results['checks']['finite_values'] = {
            'passed': output_finite and weights_finite,
            'output_finite': output_finite.item(),
            'weights_finite': weights_finite.item()
        }
        
        # Basic metrics
        results['metrics'] = {
            'output_mean': float(torch.mean(output).detach()),
            'output_std': float(torch.std(output).detach()),
            'weights_entropy': float(calculate_attention_entropy(attention_weights).detach()),
            'max_attention_weight': float(torch.max(attention_weights).detach()),
            'min_attention_weight': float(torch.min(attention_weights).detach())
        }
        
        # Generate feedback with appropriate symbols
        feedback = []
        if shape_correct:
            feedback.append(format_message("Output shapes are correct", 'success'))
        else:
            feedback.append(format_message("Output shapes are incorrect", 'failure'))
            
        if weights_sum_correct:
            feedback.append(format_message("Attention weights properly normalized", 'success'))
        else:
            feedback.append(format_message("Attention weights do not sum to 1", 'failure'))
            
        if output_finite and weights_finite:
            feedback.append(format_message("No NaN or infinite values detected", 'success'))
        else:
            feedback.append(format_message("NaN or infinite values detected", 'failure'))
            
        results['feedback'] = feedback
        
        # Calculate overall score (placeholder)
        passed_checks = sum(1 for check in results['checks'].values() if check['passed'])
        total_checks = len(results['checks'])
        results['overall_score'] = (passed_checks / total_checks) * 100 if total_checks > 0 else 0
        
        results['status'] = 'completed'
        
    except Exception as e:
        results['status'] = 'error'
        results['error'] = str(e)
        results['feedback'] = [format_message(f"Evaluation failed: {str(e)}", 'failure')]
    
    return results


def calculate_attention_entropy(attention_weights: torch.Tensor) -> torch.Tensor:
    """
    Calculate the entropy of attention weights to measure attention dispersion.
    
    Higher entropy indicates more distributed attention, lower entropy indicates
    more focused attention.
    
    Args:
        attention_weights: Attention weights (batch_size, seq_len, seq_len)
    
    Returns:
        Mean entropy across all positions
    """
    # TODO: Epic 3 will implement full entropy calculation
    # For now, provide a basic implementation
    
    # Add small epsilon to avoid log(0)
    epsilon = 1e-8
    weights_safe = attention_weights + epsilon
    
    # Calculate entropy: -sum(p * log(p))
    entropy = -torch.sum(weights_safe * torch.log(weights_safe), dim=-1)
    
    return torch.mean(entropy)


def validate_qkv_projections(Q: torch.Tensor, K: torch.Tensor, V: torch.Tensor,
                           input_embeddings: torch.Tensor) -> Dict[str, Any]:
    """
    Validate the Q, K, V projection matrices.
    
    Args:
        Q, K, V: Projection tensors
        input_embeddings: Original input embeddings
    
    Returns:
        Validation results
    """
    # TODO: Epic 3 will implement comprehensive Q,K,V validation
    
    results = {
        'shapes_match': Q.shape == K.shape == V.shape,
        'sequence_length_preserved': Q.shape[1] == input_embeddings.shape[1],
        'batch_size_preserved': Q.shape[0] == input_embeddings.shape[0],
        'projection_dimension': Q.shape[-1],
        'recommendations': []
    }
    
    if not results['shapes_match']:
        results['recommendations'].append("Q, K, V should have the same shape")
    
    if not results['sequence_length_preserved']:
        results['recommendations'].append("Sequence length should be preserved in projections")
    
    return results


def evaluate_attention_scores(attention_scores: torch.Tensor, Q: torch.Tensor, 
                            K: torch.Tensor) -> Dict[str, Any]:
    """
    Evaluate the attention scores computation.
    
    Args:
        attention_scores: Computed attention scores
        Q, K: Query and Key tensors
    
    Returns:
        Evaluation results
    """
    # TODO: Epic 3 will implement comprehensive score evaluation
    
    results = {
        'shape_correct': attention_scores.shape == (Q.shape[0], Q.shape[1], K.shape[1]),
        'scale_check': 'placeholder',  # Will check if properly scaled by sqrt(d_k)
        'symmetry_analysis': 'placeholder',  # Analyze attention patterns
        'score_range': {
            'min': float(torch.min(attention_scores)),
            'max': float(torch.max(attention_scores)),
            'mean': float(torch.mean(attention_scores))
        }
    }
    
    return results


def evaluate_cell_implementation(student_code: str, function_name: str, 
                                context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    LLM-powered code comparison against reference implementation.

    This function uses the LLM integration to compare student code against
    the reference implementation and provide educational feedback.

    Args:
        student_code: Student's implementation code
        function_name: Name of the function being evaluated
        context: Additional context (e.g., test inputs, expected outputs)

    Returns:
        Dictionary containing:
        - comparison_result: overall assessment
        - educational_feedback: detailed educational explanation
        - suggestions: improvement suggestions
        - score: numerical score (0-100)
        - understanding_check: questions to verify understanding
    """
    try:
        # Initialize LLM evaluator
        evaluator = LLMEvaluator()
        
        # Get reference implementation code
        reference_functions = {
            'create_qkv_projections': _get_reference_code('create_qkv_projections'),
            'compute_attention_scores': _get_reference_code('compute_attention_scores'),
            'compute_attention_weights': _get_reference_code('compute_attention_weights'),
            'aggregate_values': _get_reference_code('aggregate_values')
        }
        
        if function_name not in reference_functions:
            return {
                'comparison_result': 'error',
                'educational_feedback': f'Unknown function: {function_name}',
                'suggestions': ['Check function name spelling'],
                'score': 0,
                'understanding_check': [],
                'error': f'Function {function_name} not found in reference implementations'
            }
        
        reference_code = reference_functions[function_name]
        
        # Use LLM to compare implementations
        result = evaluator.compare_code(
            student_code=student_code,
            reference_code=reference_code,
            function_name=function_name,
            context=context
        )
        
        return result
        
    except Exception as e:
        logging.error(f"Error in evaluate_cell_implementation: {e}")
        return {
            'comparison_result': 'error',
            'educational_feedback': f'Evaluation failed: {str(e)}',
            'suggestions': ['Check code syntax and try again'],
            'score': 0,
            'understanding_check': [],
            'error': str(e)
        }


def validate_tensor_output(student_output: torch.Tensor, function_name: str,
                          input_tensors: Dict[str, torch.Tensor]) -> Dict[str, Any]:
    """
    Check tensor shapes and values using Epic 2 specifications.

    This function validates that student implementations produce tensors
    with correct shapes and mathematically valid values.

    Args:
        student_output: Tensor output from student implementation
        function_name: Name of the function that produced the output
        input_tensors: Dictionary of input tensors used for the function

    Returns:
        Dictionary containing validation results
    """
    try:
        # Load Epic 2 specifications
        epic2_specs = _load_epic2_specifications()
        
        if function_name not in epic2_specs.get('core_implementations', {}):
            return {
                'shape_validation': False,
                'value_validation': False,
                'error': f'No specifications found for {function_name}'
            }
        
        spec = epic2_specs['core_implementations'][function_name]
        
        # Validate tensor shapes
        shape_results = _validate_tensor_shapes(student_output, spec, input_tensors)
        
        # Validate tensor values
        value_results = _validate_tensor_values(student_output, function_name, input_tensors)
        
        return {
            'shape_validation': shape_results,
            'value_validation': value_results,
            'overall_valid': shape_results.get('valid', False) and value_results.get('valid', False),
            'function_name': function_name,
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        logging.error(f"Error in validate_tensor_output: {e}")
        return {
            'shape_validation': {'valid': False, 'error': str(e)},
            'value_validation': {'valid': False, 'error': str(e)},
            'overall_valid': False,
            'error': str(e)
        }


def grade_notebook(notebook_path: str, attempt_number: int = 1) -> Dict[str, Any]:
    """
    Main evaluation orchestrator for all 4 attention sections.

    This function coordinates the evaluation of all student implementations
    in the notebook and generates a comprehensive grade report.

    Args:
        notebook_path: Path to the student's notebook
        attempt_number: Attempt number for organizing output

    Returns:
        Comprehensive evaluation results
    """
    try:
        # Create grade directory for this attempt
        grade_dir = _create_grade_directory(attempt_number)

        # Load Epic 1 cell mapping
        cell_mapping = _load_epic1_cell_mapping()

        # Initialize NotebookExecutor for context-aware evaluation
        use_context_aware = True  # Feature flag for new execution model

        # Extract student implementations from notebook
        student_implementations = _extract_student_code(notebook_path, cell_mapping)

        # Evaluate each section
        section_results = {}
        overall_scores = []

        for section_name, implementation_info in student_implementations.items():
            if implementation_info['code']:
                # Evaluate implementation
                eval_result = evaluate_cell_implementation(
                    student_code=implementation_info['code'],
                    function_name=implementation_info['function_name'],
                    context=implementation_info.get('context')
                )

                # Test implementation with appropriate context
                tensor_result = None
                try:
                    if use_context_aware and implementation_info.get('cell_index', -1) != -1:
                        # Use new context-aware testing
                        tensor_result = _test_student_implementation_with_context(
                            notebook_path,
                            implementation_info['function_name'],
                            implementation_info['cell_index']
                        )
                    else:
                        # Fallback to old method if context-aware is disabled or cell not found
                        notebook_context = _extract_notebook_context(notebook_path)
                        tensor_result = _test_student_implementation(
                            implementation_info['code'],
                            implementation_info['function_name'],
                            notebook_context=notebook_context
                        )
                except Exception as e:
                    tensor_result = {'error': str(e), 'valid': False}

                section_results[section_name] = {
                    'llm_evaluation': eval_result,
                    'tensor_validation': tensor_result,
                    'function_name': implementation_info['function_name'],
                    'cell_index': implementation_info.get('cell_index', -1),
                    'cell_range': implementation_info.get('cell_range'),
                    'used_context_aware': use_context_aware and implementation_info.get('cell_index', -1) != -1,
                    'timestamp': datetime.now().isoformat()
                }

                # Collect scores
                if eval_result.get('score') is not None:
                    overall_scores.append(eval_result['score'])
            else:
                section_results[section_name] = {
                    'llm_evaluation': {
                        'comparison_result': 'not_implemented',
                        'score': 0,
                        'educational_feedback': 'Function not implemented'
                    },
                    'tensor_validation': {'valid': False, 'error': 'No implementation'},
                    'function_name': implementation_info['function_name']
                }
                overall_scores.append(0)
        
        # Calculate overall grade
        overall_score = np.mean(overall_scores) if overall_scores else 0
        
        # Generate comprehensive report
        grade_report = {
            'attempt_number': attempt_number,
            'overall_score': overall_score,
            'overall_grade': _score_to_letter_grade(overall_score),
            'section_results': section_results,
            'summary': {
                'sections_evaluated': len(section_results),
                'sections_implemented': sum(1 for r in section_results.values() 
                                          if r['llm_evaluation']['comparison_result'] != 'not_implemented'),
                'average_score': overall_score,
                'timestamp': datetime.now().isoformat()
            },
            'grade_directory': str(grade_dir),
            'notebook_path': notebook_path
        }
        
        # Save results
        results_file = grade_dir / f'grade_report_attempt_{attempt_number}.json'
        with open(results_file, 'w') as f:
            json.dump(grade_report, f, indent=2, default=str)
        
        return grade_report
        
    except Exception as e:
        logging.error(f"Error in grade_notebook: {e}")
        return {
            'error': str(e),
            'attempt_number': attempt_number,
            'overall_score': 0,
            'timestamp': datetime.now().isoformat()
        }


def generate_feedback(evaluation_results: Dict[str, Any]) -> str:
    """
    Create educational feedback from LLM responses.

    This function takes evaluation results and formats them into
    comprehensive educational feedback for students.

    Args:
        evaluation_results: Results from grade_notebook or evaluate_cell_implementation

    Returns:
        Formatted educational feedback string
    """
    try:
        if 'section_results' in evaluation_results:
            # Comprehensive feedback from full notebook evaluation
            return _generate_comprehensive_feedback(evaluation_results)
        else:
            # Single function feedback
            return _generate_single_function_feedback(evaluation_results)
            
    except Exception as e:
        logging.error(f"Error in generate_feedback: {e}")
        return f"Error generating feedback: {str(e)}"


def check_implementation_completeness(notebook_path: str) -> Dict[str, Any]:
    """
    Check if all required functions are implemented in the notebook.
    
    Args:
        notebook_path: Path to the student's notebook
    
    Returns:
        Implementation completeness report
    """
    try:
        # Load Epic 1 cell mapping for structure
        cell_mapping = _load_epic1_cell_mapping()
        
        # Extract student implementations
        student_implementations = _extract_student_code(notebook_path, cell_mapping)
        
        required_functions = [
            'create_qkv_projections',
            'compute_attention_scores',
            'compute_attention_weights',
            'aggregate_values'
        ]
        
        implemented_functions = []
        missing_functions = []
        
        for func_name in required_functions:
            # Find corresponding section
            section_found = False
            for section_name, impl_info in student_implementations.items():
                if impl_info['function_name'] == func_name:
                    if impl_info['code'] and impl_info['code'].strip():
                        implemented_functions.append(func_name)
                    else:
                        missing_functions.append(func_name)
                    section_found = True
                    break
            
            if not section_found:
                missing_functions.append(func_name)
        
        implementation_score = (len(implemented_functions) / len(required_functions)) * 100
        
        results = {
            'notebook_exists': Path(notebook_path).exists(),
            'required_functions': required_functions,
            'implemented_functions': implemented_functions,
            'missing_functions': missing_functions,
            'implementation_score': implementation_score,
            'sections_analyzed': len(student_implementations),
            'recommendations': _generate_implementation_recommendations(missing_functions),
            'timestamp': datetime.now().isoformat()
        }
        
        return results
        
    except Exception as e:
        logging.error(f"Error in check_implementation_completeness: {e}")
        return {
            'notebook_exists': Path(notebook_path).exists() if notebook_path else False,
            'error': str(e),
            'implementation_score': 0.0,
            'recommendations': ['Fix notebook access issues']
        }


def generate_progress_report(student_id: str, evaluation_results: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generate a comprehensive progress report for a student.
    
    Args:
        student_id: Unique identifier for the student
        evaluation_results: List of evaluation results over time
    
    Returns:
        Progress report
    """
    # TODO: Epic 4 will implement comprehensive reporting
    
    if not evaluation_results:
        return {
            'student_id': student_id,
            'total_attempts': 0,
            'progress': 'no_attempts',
            'recommendations': ['Start working on the implementation']
        }
    
    latest_result = evaluation_results[-1]
    
    report = {
        'student_id': student_id,
        'total_attempts': len(evaluation_results),
        'latest_score': latest_result.get('overall_score', 0),
        'progress_trend': 'placeholder',  # Will calculate trend
        'strengths': [],
        'areas_for_improvement': [],
        'next_steps': [],
        'estimated_completion': 'unknown'
    }
    
    # Basic analysis
    if latest_result.get('overall_score', 0) >= 80:
        report['progress'] = 'excellent'
        report['next_steps'] = ['Move to advanced topics', 'Try multi-head attention']
    elif latest_result.get('overall_score', 0) >= 60:
        report['progress'] = 'good'
        report['next_steps'] = ['Review failing test cases', 'Optimize implementation']
    else:
        report['progress'] = 'needs_work'
        report['next_steps'] = ['Review tutorial materials', 'Debug implementation']
    
    return report


def benchmark_implementation(attention_function, input_embeddings: torch.Tensor,
                           num_runs: int = 10) -> Dict[str, Any]:
    """
    Benchmark the performance of an attention implementation.
    
    Args:
        attention_function: The attention function to benchmark
        input_embeddings: Test input embeddings
        num_runs: Number of benchmark runs
    
    Returns:
        Performance metrics
    """
    # TODO: Epic 5 will implement comprehensive benchmarking
    
    times = []
    memory_usage = []
    
    try:
        for _ in range(num_runs):
            start_time = time.time()
            
            # Run the attention function
            output, weights = attention_function(input_embeddings)
            
            end_time = time.time()
            times.append(end_time - start_time)
        
        results = {
            'average_time': np.mean(times),
            'std_time': np.std(times),
            'min_time': np.min(times),
            'max_time': np.max(times),
            'runs_completed': len(times),
            'memory_efficient': True,  # Placeholder
            'recommendations': []
        }
        
        # Performance recommendations
        if results['average_time'] > 1.0:
            results['recommendations'].append("Consider optimizing for speed")
        
        if results['std_time'] > 0.1:
            results['recommendations'].append("Performance is inconsistent")
            
    except Exception as e:
        results = {
            'error': str(e),
            'benchmark_failed': True,
            'recommendations': ['Fix implementation errors before benchmarking']
        }
    
    return results


# Utility functions for evaluation framework
def save_evaluation_results(results: Dict[str, Any], filepath: str) -> None:
    """Save evaluation results to JSON file."""
    with open(filepath, 'w') as f:
        json.dump(results, f, indent=2, default=str)
    print(format_message(f"Evaluation results saved to: {filepath}", 'folder'))


def load_evaluation_history(filepath: str) -> List[Dict[str, Any]]:
    """Load evaluation history from JSON file."""
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []


def export_evaluation_report(results: Dict[str, Any], format: str = 'html') -> str:
    """Export evaluation results to various formats."""
    # TODO: Epic 4 will implement report export
    if format == 'html':
        return generate_html_report(results)
    elif format == 'pdf':
        return generate_pdf_report(results)
    else:
        return json.dumps(results, indent=2)


def generate_html_report(results: Dict[str, Any]) -> str:
    """Generate HTML report of evaluation results."""
    # TODO: Epic 4 will implement HTML report generation
    return f"""
    <html>
    <head><title>Attention Mechanism Evaluation Report</title></head>
    <body>
    <h1>Evaluation Report</h1>
    <p>Overall Score: {results.get('overall_score', 'N/A')}</p>
    <p>Status: {results.get('status', 'Unknown')}</p>
    </body>
    </html>
    """


def generate_pdf_report(results: Dict[str, Any]) -> str:
    """Generate PDF report of evaluation results."""
    # TODO: Epic 4 will implement PDF report generation
    return "PDF generation not yet implemented"


# Helper functions for Epic 4 evaluation system

def _get_reference_code(function_name: str) -> str:
    """Extract reference code for a specific function."""
    try:
        import inspect
        if function_name == 'create_qkv_projections':
            return inspect.getsource(ref_create_qkv_projections)
        elif function_name == 'compute_attention_scores':
            return inspect.getsource(ref_compute_attention_scores)
        elif function_name == 'compute_attention_weights':
            return inspect.getsource(ref_compute_attention_weights)
        elif function_name == 'aggregate_values':
            return inspect.getsource(ref_aggregate_values)
        else:
            return f"# Reference code for {function_name} not found"
    except Exception as e:
        return f"# Error getting reference code: {str(e)}"


def _load_epic2_specifications() -> Dict[str, Any]:
    """Load Epic 2 completion file with tensor specifications."""
    try:
        spec_path = Path('.epic2_complete.json')
        if spec_path.exists():
            with open(spec_path, 'r') as f:
                return json.load(f)
        else:
            # Fallback specifications based on Epic 2 analysis
            return {
                'core_implementations': {
                    'create_qkv_projections': {
                        'input_shape': '[1, 6, 64] or [6, 64]',
                        'output_shapes': {'Q': '[1, 6, 64]', 'K': '[1, 6, 64]', 'V': '[1, 6, 64]'}
                    },
                    'compute_attention_scores': {
                        'input_shapes': {'Q': '[1, 6, 64]', 'K': '[1, 6, 64]'},
                        'output_shape': '[1, 6, 6]',
                        'scaling_factor': 'sqrt(d_k)'
                    },
                    'compute_attention_weights': {
                        'input_shape': '[1, 6, 6]',
                        'output_shape': '[1, 6, 6]',
                        'normalization': 'softmax_applied'
                    },
                    'aggregate_values': {
                        'input_shapes': {'attention_weights': '[1, 6, 6]', 'V': '[1, 6, 64]'},
                        'output_shape': '[1, 6, 64]'
                    }
                }
            }
    except Exception as e:
        logging.error(f"Error loading Epic 2 specifications: {e}")
        return {'core_implementations': {}}


def _load_epic1_cell_mapping() -> Dict[str, Any]:
    """Load Epic 1 completion file with cell mapping information."""
    try:
        epic1_path = Path('.epic1_complete.json')
        if epic1_path.exists():
            with open(epic1_path, 'r') as f:
                epic1_data = json.load(f)
            return epic1_data.get('deliverables', {}).get('notebook_structure', {}).get('student_notebook', {}).get('cell_structure', {})
        else:
            # Fallback cell mapping
            return {
                'section_1': {
                    'title': 'Linear Projections (Q, K, V)',
                    'cells': ['cell-4', 'cell-5', 'cell-6', 'cell-7'],
                    'todo_function': 'create_qkv_projections'
                },
                'section_2': {
                    'title': 'Scaled Dot-Product Attention',
                    'cells': ['cell-8', 'cell-9', 'cell-10'],
                    'todo_function': 'compute_attention_scores'
                },
                'section_3': {
                    'title': 'Softmax & Attention Weights',
                    'cells': ['cell-11', 'cell-12', 'cell-13'],
                    'todo_function': 'compute_attention_weights'
                },
                'section_4': {
                    'title': 'Value Aggregation',
                    'cells': ['cell-14', 'cell-15', 'cell-16'],
                    'todo_function': 'aggregate_values'
                }
            }
    except Exception as e:
        logging.error(f"Error loading Epic 1 cell mapping: {e}")
        return {}


def _create_grade_directory(attempt_number: int) -> Path:
    """Create grade directory structure for evaluation outputs."""
    grade_dir = Path('grade') / f'attempt_{attempt_number}'
    grade_dir.mkdir(parents=True, exist_ok=True)
    return grade_dir


def _extract_student_code(notebook_path: str, cell_mapping: Dict[str, Any]) -> Dict[str, Any]:
    """Extract student implementation code from notebook cells with cell indices."""
    try:
        import nbformat

        if not Path(notebook_path).exists():
            logging.error(f"Notebook not found: {notebook_path}")
            return {}

        # Load notebook
        with open(notebook_path, 'r', encoding='utf-8') as f:
            nb = nbformat.read(f, as_version=4)

        implementations = {}

        # Track code cell indices
        code_cell_index = 0

        for section_name, section_info in cell_mapping.items():
            function_name = section_info.get('todo_function')
            cell_range = section_info.get('cells', [])

            # Extract code from cells and track where function is defined
            code_parts = []
            function_cell_index = -1

            # Reset code cell counter for each search
            current_code_index = 0
            for idx, cell in enumerate(nb.cells):
                if cell.cell_type == 'code':
                    # Look for function definition
                    if function_name and f'def {function_name}' in cell.source:
                        code_parts.append(cell.source)
                        function_cell_index = current_code_index
                    current_code_index += 1

            implementations[section_name] = {
                'function_name': function_name,
                'code': '\n\n'.join(code_parts) if code_parts else '',
                'cell_index': function_cell_index,  # Track which code cell contains the function
                'cell_range': cell_range,
                'title': section_info.get('title', ''),
                'context': {
                    'section_name': section_name,
                    'expected_function': function_name,
                    'cell_index': function_cell_index
                }
            }

        return implementations
        
    except Exception as e:
        logging.error(f"Error extracting student code: {e}")
        # Fallback: return empty implementations with structure
        return {
            'section_1': {'function_name': 'create_qkv_projections', 'code': ''},
            'section_2': {'function_name': 'compute_attention_scores', 'code': ''},
            'section_3': {'function_name': 'compute_attention_weights', 'code': ''},
            'section_4': {'function_name': 'aggregate_values', 'code': ''}
        }


def _validate_tensor_shapes(output: torch.Tensor, spec: Dict[str, Any], inputs: Dict[str, torch.Tensor]) -> Dict[str, Any]:
    """Validate tensor shapes against Epic 2 specifications."""
    try:
        expected_shape_str = spec.get('output_shape', '')
        
        # Parse expected shape from string like '[1, 6, 64]'
        if expected_shape_str.startswith('[') and expected_shape_str.endswith(']'):
            expected_dims = [int(x.strip()) for x in expected_shape_str[1:-1].split(',')]
            
            shape_match = list(output.shape) == expected_dims
            
            return {
                'valid': shape_match,
                'expected_shape': expected_dims,
                'actual_shape': list(output.shape),
                'error': None if shape_match else f"Shape mismatch: expected {expected_dims}, got {list(output.shape)}"
            }
        else:
            return {'valid': False, 'error': f'Cannot parse expected shape: {expected_shape_str}'}
            
    except Exception as e:
        return {'valid': False, 'error': str(e)}


def _build_test_context(notebook_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Build test context with notebook variables and standard imports.
    
    Args:
        notebook_context: Optional dictionary of variables from notebook execution
        
    Returns:
        Complete test context with imports and notebook variables
    """
    # Start with standard imports and utilities
    test_context = {
        'torch': torch,
        'np': np,
        'F': torch.nn.functional,
        'nn': torch.nn
    }
    
    # Add notebook context if available
    if notebook_context:
        # Common notebook variables that student functions might need
        context_vars = [
            'embeddings', 'Q', 'K', 'V', 
            'attention_scores', 'attention_weights',
            'tokens', 'PROMPT_EXAMPLE', 'd_k', 'd_model'
        ]
        
        for var_name in context_vars:
            if var_name in notebook_context:
                test_context[var_name] = notebook_context[var_name]
    
    # Create fallback sample tensors if notebook context is missing
    if 'embeddings' not in test_context:
        test_context['embeddings'] = torch.randn(1, 6, 512)  # Use proper d_model dimension
    
    if 'tokens' not in test_context:
        test_context['tokens'] = ['The', 'cat', 'sat', 'on', 'the', 'mat']
    
    if 'PROMPT_EXAMPLE' not in test_context:
        test_context['PROMPT_EXAMPLE'] = "The cat sat on the mat"
    
    return test_context


def _extract_notebook_context(notebook_path: str) -> Dict[str, Any]:
    """Extract execution context from a notebook file.
    
    Args:
        notebook_path: Path to the notebook file
        
    Returns:
        Dictionary of variables available in the notebook context
    """
    try:
        import nbformat
        import re
        
        if not Path(notebook_path).exists():
            logging.warning(f"Notebook not found: {notebook_path}")
            return {}
        
        # Load notebook without executing (safer approach)
        with open(notebook_path, 'r', encoding='utf-8') as f:
            nb = nbformat.read(f, as_version=4)
        
        # Parse code cells to find variable assignments
        context = {}
        
        # Look for variable assignments using pattern matching
        patterns = {
            'embeddings': r'embeddings\s*=\s*create_embeddings\(',
            'Q': r'Q,?\s*K,?\s*V\s*=\s*create_qkv_projections\(',
            'K': r'Q,?\s*K,?\s*V\s*=\s*create_qkv_projections\(',
            'V': r'Q,?\s*K,?\s*V\s*=\s*create_qkv_projections\(',
            'attention_scores': r'attention_scores\s*=\s*compute_attention_scores\(',
            'attention_weights': r'attention_weights\s*=\s*compute_attention_weights\(',
            'tokens': r'tokens\s*=\s*tokenize_text\(',
            'PROMPT_EXAMPLE': r'PROMPT_EXAMPLE\s*=\s*["\']([^"\']+)["\']'
        }
        
        for cell in nb.cells:
            if cell.cell_type == 'code':
                source = cell.source
                
                # Check for each pattern
                for var_name, pattern in patterns.items():
                    if re.search(pattern, source):
                        # Create appropriate sample tensors based on what we find
                        if var_name == 'embeddings':
                            context[var_name] = torch.randn(1, 6, 512)  # Proper d_model dimension
                        elif var_name in ['Q', 'K', 'V']:
                            context[var_name] = torch.randn(1, 6, 64)
                        elif var_name == 'attention_scores':
                            context[var_name] = torch.randn(1, 6, 6)
                        elif var_name == 'attention_weights':
                            context[var_name] = torch.softmax(torch.randn(1, 6, 6), dim=-1)
                        elif var_name == 'tokens':
                            context[var_name] = ['The', 'cat', 'sat', 'on', 'the', 'mat']
                        elif var_name == 'PROMPT_EXAMPLE':
                            match = re.search(pattern, source)
                            if match:
                                context[var_name] = match.group(1)
                            else:
                                context[var_name] = "The cat sat on the mat"
        
        # Log what we found
        if context:
            logging.info(f"Extracted notebook context variables: {list(context.keys())}")
        else:
            logging.info("No notebook context variables found, using fallback tensors")
                    
        return context
        
    except Exception as e:
        logging.warning(f"Could not extract notebook context: {e}")
        return {}


def _validate_tensor_values(output: torch.Tensor, function_name: str, inputs: Dict[str, torch.Tensor]) -> Dict[str, Any]:
    """Validate tensor values for mathematical correctness."""
    try:
        results = {'valid': True, 'checks': []}
        
        # Common checks for all functions
        if torch.isnan(output).any():
            results['valid'] = False
            results['checks'].append('Contains NaN values')
        
        if torch.isinf(output).any():
            results['valid'] = False
            results['checks'].append('Contains infinite values')
        
        # Function-specific checks
        if function_name == 'compute_attention_weights':
            # Check if weights sum to 1 (with tolerance)
            weights_sum = torch.sum(output, dim=-1)
            if not torch.allclose(weights_sum, torch.ones_like(weights_sum), atol=1e-6):
                results['valid'] = False
                results['checks'].append('Attention weights do not sum to 1')
            
            # Check if all weights are non-negative
            if (output < 0).any():
                results['valid'] = False
                results['checks'].append('Contains negative attention weights')
        
        elif function_name == 'compute_attention_scores':
            # Check if scores are scaled properly (rough heuristic)
            score_range = torch.max(output) - torch.min(output)
            if score_range > 50:  # Rough threshold for unscaled scores
                results['checks'].append('Attention scores may not be properly scaled')
        
        if not results['checks']:
            results['checks'].append('All value checks passed')
        
        return results
        
    except Exception as e:
        return {'valid': False, 'error': str(e)}


def _test_student_implementation(code: str, function_name: str, notebook_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Execute student code and test it with sample inputs.

    Args:
        code: Student's implementation code
        function_name: Name of the function to test
        notebook_context: Optional context variables from notebook execution
    """
    try:
        # Create a test environment with notebook context
        test_globals = _build_test_context(notebook_context)

        # Execute student code in test environment
        exec(code, test_globals)

        # Check if function exists
        if function_name not in test_globals:
            return {'valid': False, 'error': f'Function {function_name} not defined'}

        student_function = test_globals[function_name]

        # Test with sample inputs
        test_results = _run_function_tests(student_function, function_name, test_globals)

        return test_results

    except Exception as e:
        return {'valid': False, 'error': str(e)}


def _test_student_implementation_with_context(notebook_path: str, function_name: str, cell_index: int) -> Dict[str, Any]:
    """Test student function with full notebook context using NotebookExecutor.

    This function executes all cells up to and including the function definition,
    providing the complete cumulative context needed for proper evaluation.

    Args:
        notebook_path: Path to the student's notebook
        function_name: Name of the function to test
        cell_index: Index of the cell containing the function definition

    Returns:
        Test results with context information
    """
    try:
        # Initialize executor
        executor = NotebookExecutor(notebook_path)

        # If cell_index is -1, the function wasn't found
        if cell_index == -1:
            return {
                'valid': False,
                'error': f'Function {function_name} not found in notebook',
                'context_issue': True
            }

        # Get context up to and including function definition
        context = executor.execute_cells_until(cell_index)

        # Validate context has required variables
        is_valid, missing_vars = executor.validate_context_for_function(function_name, context)

        if not is_valid:
            return {
                'valid': False,
                'error': f'Missing required variables for {function_name}: {missing_vars}',
                'context_issue': True,
                'missing_variables': missing_vars
            }

        # Check if function exists in context
        if function_name not in context:
            return {
                'valid': False,
                'error': f'Function {function_name} not found after cell execution',
                'context_issue': True
            }

        # Get the function from the context
        student_function = context[function_name]

        # Run tests with actual notebook context
        test_results = _run_function_tests_with_context(student_function, function_name, context)
        test_results['used_cumulative_context'] = True
        test_results['cell_index'] = cell_index

        return test_results

    except Exception as e:
        logging.error(f"Error testing with context: {e}")
        return {
            'valid': False,
            'error': str(e),
            'context_issue': True
        }


def _run_function_tests_with_context(func, function_name: str, context: Dict[str, Any]) -> Dict[str, Any]:
    """Run specific tests for each function using actual notebook context.

    This version uses the cumulative notebook context, ensuring functions
    have access to all variables defined in previous cells.

    Args:
        func: The student function to test
        function_name: Name of the function being tested
        context: Complete notebook context up to function definition
    """
    try:
        if function_name == 'create_qkv_projections':
            # Use actual embeddings from notebook context
            if 'embeddings' not in context:
                return {'valid': False, 'error': 'embeddings not found in context'}

            embeddings = context['embeddings']
            Q, K, V = func(embeddings)

            return {
                'valid': Q.shape == K.shape == V.shape == torch.Size([1, 6, 64]),
                'output_shapes': {'Q': list(Q.shape), 'K': list(K.shape), 'V': list(V.shape)},
                'test_passed': True,
                'used_notebook_context': True,
                'actual_embeddings_shape': list(embeddings.shape)
            }

        elif function_name == 'compute_attention_scores':
            # Use actual Q, K from notebook context
            if 'Q' not in context or 'K' not in context:
                return {'valid': False, 'error': 'Q or K not found in context'}

            Q = context['Q']
            K = context['K']
            scores = func(Q, K)

            return {
                'valid': scores.shape == torch.Size([1, 6, 6]),
                'output_shape': list(scores.shape),
                'test_passed': True,
                'used_notebook_context': True,
                'input_shapes': {'Q': list(Q.shape), 'K': list(K.shape)}
            }

        elif function_name == 'compute_attention_weights':
            # Use actual attention_scores from notebook context
            if 'attention_scores' not in context:
                return {'valid': False, 'error': 'attention_scores not found in context'}

            scores = context['attention_scores']
            weights = func(scores)

            weights_sum = torch.sum(weights, dim=-1)
            sum_check = torch.allclose(weights_sum, torch.ones_like(weights_sum), atol=1e-6)

            return {
                'valid': weights.shape == torch.Size([1, 6, 6]) and sum_check,
                'output_shape': list(weights.shape),
                'weights_sum_to_one': sum_check,
                'test_passed': True,
                'used_notebook_context': True,
                'input_shape': list(scores.shape)
            }

        elif function_name == 'aggregate_values':
            # Use actual attention_weights and V from notebook context
            if 'attention_weights' not in context:
                return {'valid': False, 'error': 'attention_weights not found in context'}
            if 'V' not in context:
                return {'valid': False, 'error': 'V not found in context'}

            weights = context['attention_weights']
            V = context['V']
            output = func(weights, V)

            return {
                'valid': output.shape == torch.Size([1, 6, 64]),
                'output_shape': list(output.shape),
                'test_passed': True,
                'used_notebook_context': True,
                'input_shapes': {'weights': list(weights.shape), 'V': list(V.shape)}
            }

        else:
            return {'valid': False, 'error': f'Unknown function type: {function_name}'}

    except Exception as e:
        return {'valid': False, 'error': str(e), 'context_issue': True}


def _run_function_tests(func, function_name: str, test_context: Dict[str, Any]) -> Dict[str, Any]:
    """Run specific tests for each function type using proper context.
    
    Args:
        func: The student function to test
        function_name: Name of the function being tested
        test_context: Context variables available during testing
    """
    try:
        if function_name == 'create_qkv_projections':
            # Use notebook embeddings if available, otherwise create test embeddings
            embeddings = test_context.get('embeddings', torch.randn(1, 6, 512))
            Q, K, V = func(embeddings)
            
            return {
                'valid': Q.shape == K.shape == V.shape == torch.Size([1, 6, 64]),
                'output_shapes': {'Q': list(Q.shape), 'K': list(K.shape), 'V': list(V.shape)},
                'test_passed': True,
                'used_notebook_context': 'embeddings' in test_context
            }
            
        elif function_name == 'compute_attention_scores':
            # Use notebook Q, K if available, otherwise create test tensors
            Q = test_context.get('Q', torch.randn(1, 6, 64))
            K = test_context.get('K', torch.randn(1, 6, 64))
            scores = func(Q, K)
            
            return {
                'valid': scores.shape == torch.Size([1, 6, 6]),
                'output_shape': list(scores.shape),
                'test_passed': True,
                'used_notebook_context': 'Q' in test_context and 'K' in test_context
            }
            
        elif function_name == 'compute_attention_weights':
            # Use notebook attention_scores if available, otherwise create test scores
            scores = test_context.get('attention_scores', torch.randn(1, 6, 6))
            weights = func(scores)
            
            weights_sum = torch.sum(weights, dim=-1)
            sum_check = torch.allclose(weights_sum, torch.ones_like(weights_sum), atol=1e-6)
            
            return {
                'valid': weights.shape == torch.Size([1, 6, 6]) and sum_check,
                'output_shape': list(weights.shape),
                'weights_sum_to_one': sum_check,
                'test_passed': True,
                'used_notebook_context': 'attention_scores' in test_context
            }
            
        elif function_name == 'aggregate_values':
            # Use notebook attention_weights and V if available, otherwise create test tensors
            weights = test_context.get('attention_weights', torch.softmax(torch.randn(1, 6, 6), dim=-1))
            V = test_context.get('V', torch.randn(1, 6, 64))
            output = func(weights, V)
            
            return {
                'valid': output.shape == torch.Size([1, 6, 64]),
                'output_shape': list(output.shape),
                'test_passed': True,
                'used_notebook_context': 'attention_weights' in test_context and 'V' in test_context
            }
        
        else:
            return {'valid': False, 'error': f'Unknown function type: {function_name}'}
            
    except Exception as e:
        return {'valid': False, 'error': str(e)}


def _score_to_letter_grade(score: float) -> str:
    """Convert numerical score to letter grade."""
    if score >= 90:
        return 'A'
    elif score >= 80:
        return 'B'
    elif score >= 70:
        return 'C'
    elif score >= 60:
        return 'D'
    else:
        return 'F'


def _generate_comprehensive_feedback(results: Dict[str, Any]) -> str:
    """Generate comprehensive feedback from full notebook evaluation."""
    feedback_parts = []
    
    feedback_parts.append(f"# Attention Mechanism Implementation Evaluation")
    feedback_parts.append(f"Overall Score: {results.get('overall_score', 0):.1f}/100 (Grade: {results.get('overall_grade', 'F')})")
    feedback_parts.append("")
    
    section_results = results.get('section_results', {})
    
    for section_name, section_result in section_results.items():
        feedback_parts.append(f"## {section_name}: {section_result.get('function_name', 'Unknown')}")
        
        llm_eval = section_result.get('llm_evaluation', {})
        feedback_parts.append(f"Score: {llm_eval.get('score', 0)}/100")
        feedback_parts.append(f"Status: {llm_eval.get('comparison_result', 'unknown')}")
        
        if llm_eval.get('educational_feedback'):
            feedback_parts.append("### Educational Feedback:")
            feedback_parts.append(llm_eval['educational_feedback'])
        
        if llm_eval.get('suggestions'):
            feedback_parts.append("### Suggestions for Improvement:")
            for suggestion in llm_eval['suggestions']:
                feedback_parts.append(f"- {suggestion}")
        
        feedback_parts.append("")
    
    return "\n".join(feedback_parts)


def _generate_single_function_feedback(results: Dict[str, Any]) -> str:
    """Generate feedback for a single function evaluation."""
    feedback_parts = []
    
    feedback_parts.append(f"# Function Evaluation Results")
    feedback_parts.append(f"Score: {results.get('score', 0)}/100")
    feedback_parts.append(f"Status: {results.get('comparison_result', 'unknown')}")
    feedback_parts.append("")
    
    if results.get('educational_feedback'):
        feedback_parts.append("## Educational Feedback:")
        feedback_parts.append(results['educational_feedback'])
        feedback_parts.append("")
    
    if results.get('suggestions'):
        feedback_parts.append("## Suggestions for Improvement:")
        for suggestion in results['suggestions']:
            feedback_parts.append(f"- {suggestion}")
        feedback_parts.append("")
    
    if results.get('understanding_check'):
        feedback_parts.append("## Understanding Check Questions:")
        for question in results['understanding_check']:
            feedback_parts.append(f"- {question}")
    
    return "\n".join(feedback_parts)


def _generate_implementation_recommendations(missing_functions: List[str]) -> List[str]:
    """Generate recommendations based on missing functions."""
    recommendations = []
    
    if not missing_functions:
        recommendations.append("All required functions are implemented!")
        recommendations.append("Review implementations for correctness and optimization")
    else:
        recommendations.append(f"Implement missing functions: {', '.join(missing_functions)}")
        
        if 'create_qkv_projections' in missing_functions:
            recommendations.append("Start with Q, K, V projections - they're the foundation of attention")
        
        if 'compute_attention_scores' in missing_functions:
            recommendations.append("Implement attention scores with proper scaling by sqrt(d_k)")
        
        if 'compute_attention_weights' in missing_functions:
            recommendations.append("Apply softmax to convert scores to normalized weights")
        
        if 'aggregate_values' in missing_functions:
            recommendations.append("Complete the attention mechanism with weighted value aggregation")
    
    recommendations.append("Test each function with the provided test cases")
    recommendations.append("Verify tensor shapes match the expected specifications")
    
    return recommendations


def run_notebook_evaluation(notebook_path: str = "lesson.ipynb", clear_cache: bool = False) -> Dict[str, Any]:
    """
    Run comprehensive LLM evaluation with automatic attempt numbering and pretty printing.

    This is the main user-facing function for notebook evaluation. It:
    1. Automatically determines the next attempt number
    2. Runs the full LLM evaluation using grade_notebook()
    3. Pretty prints the results in a user-friendly format
    4. Returns the full evaluation results

    Args:
        notebook_path: Path to the notebook to evaluate (default: lesson.ipynb)
        clear_cache: If True, clear the LLM cache before evaluation (default: False)

    Returns:
        Dictionary containing the full evaluation results
    """
    print("=" * 70)
    print("🎯 RUNNING COMPREHENSIVE LLM EVALUATION")
    print("=" * 70)

    # Clear cache if requested
    if clear_cache:
        cache_dir = Path("progress/.llm_cache")
        if cache_dir.exists():
            import shutil
            print("\n📗 Clearing LLM cache...")
            shutil.rmtree(cache_dir)
            cache_dir.mkdir(parents=True, exist_ok=True)
            print("   ✅ Cache cleared - will make fresh LLM calls")

    # Step 1: Determine the next attempt number
    print("\n1. Checking for existing evaluation attempts...")
    grade_dir = Path("grade")
    grade_dir.mkdir(exist_ok=True)

    # Find all existing attempt directories
    existing_attempts = []
    if grade_dir.exists():
        for item in grade_dir.iterdir():
            if item.is_dir() and item.name.startswith("attempt_"):
                try:
                    attempt_num = int(item.name.split("_")[1])
                    existing_attempts.append(attempt_num)
                except (IndexError, ValueError):
                    continue

    if existing_attempts:
        highest_attempt = max(existing_attempts)
        next_attempt = highest_attempt + 1
        print(f"   Found {len(existing_attempts)} existing attempt(s)")
        print(f"   Highest attempt number: {highest_attempt}")
    else:
        next_attempt = 1
        print("   No existing attempts found")

    print(f"   → Will use attempt number: {next_attempt}")

    # Step 2: Run the LLM evaluation
    print(f"\n2. Running LLM evaluation (attempt #{next_attempt})...")
    print("   This evaluates all 4 functions using Llama 3.1")
    print("   Please wait, this may take 20-40 seconds...")

    import time
    start_time = time.time()

    try:
        # Suppress all unwanted output during evaluation
        import matplotlib
        matplotlib.use('Agg')  # Use non-interactive backend to prevent plots
        import matplotlib.pyplot as plt
        plt.ioff()  # Turn off interactive mode

        # Suppress stdout/stderr during evaluation
        import sys
        import io
        from contextlib import redirect_stdout, redirect_stderr

        # Capture output but don't display it
        captured_output = io.StringIO()
        captured_errors = io.StringIO()

        with redirect_stdout(captured_output), redirect_stderr(captured_errors):
            # Run the actual LLM evaluation (all prints/plots are captured)
            results = grade_notebook(notebook_path, attempt_number=next_attempt)

        elapsed_time = time.time() - start_time
        print(f"   ✅ Evaluation complete in {elapsed_time:.1f} seconds")

        # Step 3: Load and pretty print the results
        report_path = Path(f"grade/attempt_{next_attempt}/grade_report_attempt_{next_attempt}.json")

        if report_path.exists():
            with open(report_path, 'r') as f:
                report = json.load(f)

            print("\n" + "=" * 70)
            print("📊 EVALUATION REPORT")
            print("=" * 70)

            # Overall results
            print(f"\n🎯 OVERALL RESULTS:")
            print(f"   • Overall Score: {report['overall_score']:.1f}/100")
            print(f"   • Letter Grade: {report['overall_grade']}")
            print(f"   • Attempt Number: {report['attempt_number']}")

            # Individual function scores
            print(f"\n📝 INDIVIDUAL FUNCTION SCORES:")
            for section_name, section_result in report['section_results'].items():
                func_name = section_result['function_name']
                llm_eval = section_result['llm_evaluation']
                score = llm_eval.get('score', 0)
                status = llm_eval.get('comparison_result', 'unknown')

                # Emoji based on score
                if score >= 80:
                    emoji = "✅"
                elif score >= 60:
                    emoji = "⚠️"
                else:
                    emoji = "❌"

                print(f"   {emoji} {func_name}: {score}/100 ({status})")

            # Summary statistics
            summary = report.get('summary', {})
            print(f"\n📈 SUMMARY:")
            print(f"   • Sections evaluated: {summary.get('sections_evaluated', 0)}")
            print(f"   • Sections implemented: {summary.get('sections_implemented', 0)}")
            print(f"   • Average score: {summary.get('average_score', 0):.1f}/100")

            # Educational feedback for the lowest scoring function
            print(f"\n💡 EDUCATIONAL FEEDBACK:")
            lowest_score = 100
            lowest_func = None
            for section_name, section_result in report['section_results'].items():
                score = section_result['llm_evaluation'].get('score', 0)
                if score < lowest_score:
                    lowest_score = score
                    lowest_func = section_result

            if lowest_func and lowest_func['llm_evaluation'].get('educational_feedback'):
                print(f"   Feedback for {lowest_func['function_name']} (lowest score: {lowest_score}/100):")
                feedback = lowest_func['llm_evaluation']['educational_feedback']
                # Print first 300 chars of feedback
                if len(feedback) > 300:
                    print(f"   {feedback[:300]}...")
                else:
                    print(f"   {feedback}")

                # Print suggestions if available
                suggestions = lowest_func['llm_evaluation'].get('suggestions', [])
                if suggestions:
                    print(f"\n   Suggestions:")
                    for i, suggestion in enumerate(suggestions[:3], 1):
                        print(f"   {i}. {suggestion}")

            print(f"\n📁 Full report saved to: {report_path}")
            print(f"   View with: cat {report_path} | python -m json.tool")

        else:
            print(f"   ⚠️ Report file not found at {report_path}")
            print(f"   Evaluation may still be processing...")

        print("\n" + "=" * 70)
        print("Evaluation complete! The LLM has assessed your implementation.")
        print("=" * 70)

        # Reset matplotlib to interactive backend for normal notebook use
        try:
            import matplotlib
            import matplotlib.pyplot as plt
            matplotlib.use('module://matplotlib_inline.backend_inline')
            plt.ion()  # Turn interactive mode back on
        except:
            pass  # If inline backend not available, just continue

        return results

    except Exception as e:
        logging.error(f"Evaluation failed in run_notebook_evaluation: {e}")
        print(f"\n❌ Evaluation failed: {e}")
        print("   Check logs directory for detailed error information")
        print("\n" + "=" * 70)
        raise


# Module initialization - only print if running as main or in debug mode
if __name__ == "__main__" or os.environ.get('EVALUATION_DEBUG', '').lower() == 'true':
    print("Epic 4 Evaluation module loaded successfully!")
    print("Available functions:")
    print("- run_notebook_evaluation() - Main user-facing evaluation with pretty output")
    print("- evaluate_cell_implementation() - LLM-powered code comparison")
    print("- validate_tensor_output() - Tensor shape and value validation")
    print("- grade_notebook() - Main evaluation orchestrator")
    print("- generate_feedback() - Educational feedback generation")
    print("- check_implementation_completeness() - Implementation status check")
    print("- evaluate_attention_output() - Legacy evaluation function")
    print("- validate_qkv_projections() - Q, K, V validation")
    print("- evaluate_attention_scores() - Attention scores evaluation")
    print("- generate_progress_report() - Progress tracking")
    print("- benchmark_implementation() - Performance testing")
    print("\nEpic 4: LLM-powered evaluation system ready!")