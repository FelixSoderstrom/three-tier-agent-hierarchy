"""
Notebook Executor Module
Provides cumulative context execution for Jupyter notebooks to properly evaluate
student implementations with their required dependencies.
"""

import json
import sys
import io
import re
import traceback
from typing import Dict, Any, Tuple, Optional, List
from contextlib import redirect_stdout, redirect_stderr
import copy


class NotebookExecutor:
    """Execute notebook cells with cumulative context management."""

    def __init__(self, notebook_path: str):
        """
        Initialize with notebook path and create isolated namespace.

        Args:
            notebook_path: Path to the Jupyter notebook file
        """
        self.notebook_path = notebook_path
        self.notebook_data = self._load_notebook()
        self.cells = self._extract_code_cells()
        self.execution_cache = {}  # Cache execution results by cell index

    def _load_notebook(self) -> Dict:
        """Load notebook JSON data."""
        try:
            with open(self.notebook_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            raise ValueError(f"Failed to load notebook: {e}")

    def _extract_code_cells(self) -> List[Dict]:
        """Extract all code cells from notebook."""
        cells = []
        for idx, cell in enumerate(self.notebook_data.get('cells', [])):
            if cell.get('cell_type') == 'code':
                # Join source lines if it's a list
                source = cell.get('source', '')
                if isinstance(source, list):
                    source = ''.join(source)
                cells.append({
                    'index': idx,
                    'source': source,
                    'original_index': len(cells)  # Track position among code cells only
                })
        return cells

    def execute_cells_until(self, target_cell_index: int) -> Dict[str, Any]:
        """
        Execute all cells from 0 to target_cell_index sequentially.
        Returns the accumulated namespace at that point.

        Args:
            target_cell_index: Index of the last cell to execute (inclusive)

        Returns:
            Dict containing the accumulated namespace
        """
        # Check cache first
        if target_cell_index in self.execution_cache:
            return copy.deepcopy(self.execution_cache[target_cell_index])

        # Initialize context with common imports
        context = self._initialize_context()

        # Execute cells sequentially
        for i, cell in enumerate(self.cells):
            if cell['original_index'] > target_cell_index:
                break

            cell_source = cell['source'].strip()
            if not cell_source:
                continue

            # Skip IPython magic commands and special imports
            if cell_source.startswith('!') or cell_source.startswith('%'):
                continue

            # Handle import statements for evaluation module
            if 'from src.evaluation import' in cell_source:
                # Skip evaluation imports during context building
                continue

            # Execute cell with accumulated context
            context, error = self._safe_cell_execution(cell_source, context, i)

            if error:
                print(f"Warning: Cell {i} execution failed: {error}")
                # Continue with partial context

        # Cache the result (excluding module objects that can't be pickled)
        cacheable_context = {}
        for key, value in context.items():
            # Skip modules and other non-pickleable types
            if not (hasattr(value, '__module__') and
                   (value.__class__.__name__ == 'module' or
                    key in ['__builtins__', 'torch', 'nn', 'F', 'np', 'math'])):
                try:
                    # Try to deepcopy; if it fails, store reference
                    cacheable_context[key] = copy.deepcopy(value)
                except:
                    cacheable_context[key] = value
            else:
                # Store reference to module objects
                cacheable_context[key] = value

        self.execution_cache[target_cell_index] = cacheable_context
        return context

    def find_function_cell(self, function_name: str) -> int:
        """
        Locate which cell contains a function definition.
        Returns cell index or -1 if not found.

        Args:
            function_name: Name of the function to find

        Returns:
            Cell index (among code cells) or -1 if not found
        """
        pattern = rf'^\s*def\s+{re.escape(function_name)}\s*\('

        for cell in self.cells:
            if re.search(pattern, cell['source'], re.MULTILINE):
                return cell['original_index']

        return -1

    def get_context_for_function(self, function_name: str) -> Dict[str, Any]:
        """
        Execute all cells up to and including the function definition.
        Returns complete context needed to test the function.

        Args:
            function_name: Name of the function to get context for

        Returns:
            Dict containing the complete context for the function
        """
        cell_index = self.find_function_cell(function_name)

        if cell_index == -1:
            raise ValueError(f"Function '{function_name}' not found in notebook")

        # Execute all cells up to and including the function definition
        return self.execute_cells_until(cell_index)

    def _initialize_context(self) -> Dict[str, Any]:
        """
        Initialize the execution context with standard imports and setup.

        Returns:
            Dict with initial context
        """
        # Import modules directly
        import torch
        import torch.nn as nn
        import torch.nn.functional as F
        import numpy as np
        import math

        context = {
            '__builtins__': __builtins__,
            '__name__': '__main__',
            'torch': torch,
            'nn': nn,
            'F': F,
            'np': np,
            'math': math
        }

        # Try to import helper functions
        try:
            from .model_utils import tokenize_text, create_embeddings
            from .visualizations import (
                visualize_qkv_projections,
                visualize_attention_scores,
                visualize_attention_weights,
                visualize_attended_values
            )
            context['tokenize_text'] = tokenize_text
            context['create_embeddings'] = create_embeddings
            context['visualize_qkv_projections'] = visualize_qkv_projections
            context['visualize_attention_scores'] = visualize_attention_scores
            context['visualize_attention_weights'] = visualize_attention_weights
            context['visualize_attended_output'] = visualize_attended_values
        except ImportError:
            try:
                # Fallback to absolute imports
                from src.model_utils import tokenize_text, create_embeddings
                from src.visualizations import (
                    visualize_qkv_projections,
                    visualize_attention_scores,
                    visualize_attention_weights,
                    visualize_attended_values
                )
                context['tokenize_text'] = tokenize_text
                context['create_embeddings'] = create_embeddings
                context['visualize_qkv_projections'] = visualize_qkv_projections
                context['visualize_attention_scores'] = visualize_attention_scores
                context['visualize_attention_weights'] = visualize_attention_weights
                context['visualize_attended_output'] = visualize_attended_values
            except ImportError as e:
                print(f"Warning: Failed to import helper functions: {e}")
                # Define placeholder functions if imports fail
                def tokenize_text(text):
                    return text.split()

                def create_embeddings(tokens):
                    return torch.randn(1, len(tokens), 512)

                def visualize_qkv_projections(*args, **kwargs):
                    pass  # Silently skip visualization

                def visualize_attention_scores(*args, **kwargs):
                    pass  # Silently skip visualization

                def visualize_attention_weights(*args, **kwargs):
                    pass  # Silently skip visualization

                def visualize_attended_output(*args, **kwargs):
                    pass  # Silently skip visualization

                context['tokenize_text'] = tokenize_text
                context['create_embeddings'] = create_embeddings
                context['visualize_qkv_projections'] = visualize_qkv_projections
                context['visualize_attention_scores'] = visualize_attention_scores
                context['visualize_attention_weights'] = visualize_attention_weights
                context['visualize_attended_output'] = visualize_attended_output

        return context

    def _safe_cell_execution(self, cell_code: str, context: Dict,
                           cell_index: int) -> Tuple[Dict, Optional[str]]:
        """
        Safely execute a cell with error handling.

        Args:
            cell_code: Code to execute
            context: Current execution context
            cell_index: Index of the cell being executed

        Returns:
            Tuple of (updated_context, error_message)
        """
        # Create a copy to avoid mutation on error
        local_context = context.copy()

        # Capture output
        stdout_capture = io.StringIO()
        stderr_capture = io.StringIO()

        try:
            with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
                exec(cell_code, local_context)

            # Success - return updated context
            return local_context, None

        except Exception as e:
            error_msg = f"Cell {cell_index} execution failed: {str(e)}\n"
            error_msg += f"Traceback: {traceback.format_exc()}"
            return context, error_msg

    def validate_context_for_function(self, function_name: str,
                                     context: Dict) -> Tuple[bool, List[str]]:
        """
        Validate that context has all required variables for a function.

        Args:
            function_name: Name of the function to validate context for
            context: The execution context to validate

        Returns:
            Tuple of (is_valid, missing_variables)
        """
        requirements = {
            'create_qkv_projections': ['embeddings', 'torch', 'nn'],
            'compute_attention_scores': ['Q', 'K', 'torch', 'math'],
            'compute_attention_weights': ['attention_scores', 'F'],
            'aggregate_values': ['attention_weights', 'V', 'torch']
        }

        required = requirements.get(function_name, [])
        missing = [var for var in required if var not in context]

        return len(missing) == 0, missing

    def validate_tensor_shapes(self, context: Dict, stage: str) -> Dict[str, Any]:
        """
        Validate that tensors have expected shapes at each stage.

        Args:
            context: The execution context to validate
            stage: The stage of execution (e.g., 'after_embeddings')

        Returns:
            Dict with validation results
        """
        expected_shapes = {
            'after_embeddings': {'embeddings': (1, 6, 512)},
            'after_qkv': {
                'Q': (1, 6, 64),
                'K': (1, 6, 64),
                'V': (1, 6, 64)
            },
            'after_scores': {'attention_scores': (1, 6, 6)},
            'after_weights': {'attention_weights': (1, 6, 6)},
            'after_aggregation': {'attended_output': (1, 6, 64)}
        }

        validation_results = {
            'stage': stage,
            'valid': True,
            'errors': []
        }

        if stage not in expected_shapes:
            validation_results['errors'].append(f"Unknown stage: {stage}")
            validation_results['valid'] = False
            return validation_results

        for var_name, expected_shape in expected_shapes[stage].items():
            if var_name not in context:
                validation_results['errors'].append(
                    f"Missing variable: {var_name}"
                )
                validation_results['valid'] = False
                continue

            var = context[var_name]
            if hasattr(var, 'shape'):
                actual_shape = tuple(var.shape)
                if actual_shape != expected_shape:
                    validation_results['errors'].append(
                        f"{var_name} shape mismatch: expected {expected_shape}, "
                        f"got {actual_shape}"
                    )
                    validation_results['valid'] = False
            else:
                validation_results['errors'].append(
                    f"{var_name} is not a tensor"
                )
                validation_results['valid'] = False

        return validation_results

    def get_function_with_context(self, function_name: str) -> Tuple[Optional[callable], Dict[str, Any]]:
        """
        Get a function and its complete execution context.

        Args:
            function_name: Name of the function to retrieve

        Returns:
            Tuple of (function, context) or (None, context) if function not found
        """
        try:
            context = self.get_context_for_function(function_name)
            func = context.get(function_name)
            return func, context
        except ValueError as e:
            print(f"Error getting function context: {e}")
            return None, {}