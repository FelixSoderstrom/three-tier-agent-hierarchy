"""
Reference implementation of the attention mechanism for Epic 5 evaluation.

This module provides a complete, standalone implementation of the attention mechanism
that can be imported directly without parsing notebooks. All functions use PyTorch
tensors and follow the exact API specifications required by Epic 5.

Example Usage:
    from src.reference_attention import attention_mechanism, demo_attention
    
    # Run complete attention mechanism
    embeddings = torch.randn(1, 6, 64)  # Example input
    output, weights = attention_mechanism(embeddings)
    
    # Run demonstration with "The cat sat on the mat"
    results = demo_attention()
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from typing import Tuple, Dict, Any


def create_qkv_projections(embeddings: torch.Tensor, d_model: int = 64) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
    """
    Create Query, Key, and Value projections from input embeddings.
    
    This function takes input embeddings and creates three different "views" of the data:
    - Query (Q): "What information am I looking for?"
    - Key (K): "What information can I provide?"
    - Value (V): "What is the actual information content?"
    
    Args:
        embeddings: Input embeddings tensor with shape [batch_size, seq_len, d_model] or [seq_len, d_model]
        d_model: Dimension of the model (both input and output projections)
    
    Returns:
        Tuple of (Q, K, V) tensors, each with shape [batch_size, seq_len, d_model] or [seq_len, d_model]
    
    Example:
        >>> embeddings = torch.randn(1, 6, 64)  # "The cat sat on the mat"
        >>> Q, K, V = create_qkv_projections(embeddings, d_model=64)
        >>> print(Q.shape, K.shape, V.shape)  # torch.Size([1, 6, 64]) x3
    """
    # Handle both batched and unbatched inputs
    if embeddings.dim() == 2:
        # Add batch dimension: [seq_len, d_model] -> [1, seq_len, d_model]
        embeddings = embeddings.unsqueeze(0)
        unbatched = True
    else:
        unbatched = False
    
    batch_size, seq_len, embedding_dim = embeddings.shape
    
    # Create linear projection layers (without bias for simplicity)
    W_q = nn.Linear(embedding_dim, d_model, bias=False)
    W_k = nn.Linear(embedding_dim, d_model, bias=False)
    W_v = nn.Linear(embedding_dim, d_model, bias=False)
    
    # Apply projections to create Q, K, V matrices
    Q = W_q(embeddings)  # [batch_size, seq_len, d_model]
    K = W_k(embeddings)  # [batch_size, seq_len, d_model]
    V = W_v(embeddings)  # [batch_size, seq_len, d_model]
    
    # Remove batch dimension if input was unbatched
    if unbatched:
        Q = Q.squeeze(0)  # [seq_len, d_model]
        K = K.squeeze(0)  # [seq_len, d_model]
        V = V.squeeze(0)  # [seq_len, d_model]
    
    return Q, K, V


def compute_attention_scores(Q: torch.Tensor, K: torch.Tensor) -> torch.Tensor:
    """
    Compute scaled dot-product attention scores.
    
    This function measures the compatibility between queries and keys using dot products,
    then scales by √d_k to prevent extremely large values that would cause vanishing gradients.
    
    The mathematical operation is: scores = (Q @ K^T) / √d_k
    
    Args:
        Q: Query tensor with shape [batch_size, seq_len, d_k] or [seq_len, d_k]
        K: Key tensor with shape [batch_size, seq_len, d_k] or [seq_len, d_k]
    
    Returns:
        attention_scores: Tensor with shape [batch_size, seq_len, seq_len] or [seq_len, seq_len]
                         Each element [i,j] represents compatibility between query i and key j
    
    Example:
        >>> Q = torch.randn(1, 6, 64)
        >>> K = torch.randn(1, 6, 64)
        >>> scores = compute_attention_scores(Q, K)
        >>> print(scores.shape)  # torch.Size([1, 6, 6])
    """
    # Handle both batched and unbatched inputs
    if Q.dim() == 2:
        # Add batch dimension
        Q = Q.unsqueeze(0)
        K = K.unsqueeze(0)
        unbatched = True
    else:
        unbatched = False
    
    # Get the dimension of keys for scaling
    d_k = K.shape[-1]
    
    # Compute dot product between Q and K^T
    # Q: [batch_size, seq_len, d_k]
    # K.transpose(-2, -1): [batch_size, d_k, seq_len]
    # Result: [batch_size, seq_len, seq_len]
    attention_scores = torch.matmul(Q, K.transpose(-2, -1))
    
    # Scale by √d_k to prevent extremely large values in softmax
    # This maintains stable gradients during training
    attention_scores = attention_scores / torch.sqrt(torch.tensor(d_k, dtype=torch.float32))
    
    # Remove batch dimension if input was unbatched
    if unbatched:
        attention_scores = attention_scores.squeeze(0)
    
    return attention_scores


def compute_attention_weights(attention_scores: torch.Tensor) -> torch.Tensor:
    """
    Apply softmax to get normalized attention weights.
    
    This function converts raw attention scores into a probability distribution using softmax.
    Each row will sum to 1.0, representing how each query position distributes its attention
    across all key positions.
    
    Args:
        attention_scores: Attention scores with shape [batch_size, seq_len, seq_len] or [seq_len, seq_len]
    
    Returns:
        attention_weights: Normalized weights with shape [batch_size, seq_len, seq_len] or [seq_len, seq_len]
                          Each row sums to 1.0, values are between 0 and 1
    
    Example:
        >>> scores = torch.randn(1, 6, 6)
        >>> weights = compute_attention_weights(scores)
        >>> print(weights[0, 0, :].sum())  # tensor(1.0000)
    """
    # Apply softmax along the last dimension (over key positions)
    # This ensures that for each query position, the weights sum to 1
    attention_weights = F.softmax(attention_scores, dim=-1)
    
    return attention_weights


def aggregate_values(attention_weights: torch.Tensor, V: torch.Tensor) -> torch.Tensor:
    """
    Weighted sum of values using attention weights.
    
    This is where the actual information gathering happens. For each query position,
    we take a weighted combination of all value vectors, where the weights are
    determined by the attention mechanism.
    
    Args:
        attention_weights: Attention weights with shape [batch_size, seq_len, seq_len] or [seq_len, seq_len]
        V: Value tensor with shape [batch_size, seq_len, d_v] or [seq_len, d_v]
    
    Returns:
        attended_values: Weighted combination with shape [batch_size, seq_len, d_v] or [seq_len, d_v]
                        Each position now contains contextualized information
    
    Example:
        >>> weights = torch.softmax(torch.randn(1, 6, 6), dim=-1)
        >>> V = torch.randn(1, 6, 64)
        >>> output = aggregate_values(weights, V)
        >>> print(output.shape)  # torch.Size([1, 6, 64])
    """
    # Handle both batched and unbatched inputs
    if attention_weights.dim() == 2:
        # Add batch dimension
        attention_weights = attention_weights.unsqueeze(0)
        V = V.unsqueeze(0)
        unbatched = True
    else:
        unbatched = False
    
    # Multiply attention weights with value vectors
    # attention_weights: [batch_size, seq_len, seq_len]
    # V: [batch_size, seq_len, d_v]
    # Result: [batch_size, seq_len, d_v]
    attended_values = torch.matmul(attention_weights, V)
    
    # Remove batch dimension if input was unbatched
    if unbatched:
        attended_values = attended_values.squeeze(0)
    
    return attended_values


def attention_mechanism(embeddings: torch.Tensor, d_model: int = 64) -> Tuple[torch.Tensor, torch.Tensor]:
    """
    Complete single-head attention pipeline.
    
    This function combines all four steps of the attention mechanism:
    1. Create Q, K, V projections
    2. Compute attention scores (scaled dot-product)
    3. Apply softmax to get attention weights
    4. Aggregate values using attention weights
    
    Args:
        embeddings: Input embeddings with shape [batch_size, seq_len, d_model] or [seq_len, d_model]
        d_model: Dimension of the model (input and output)
    
    Returns:
        Tuple of:
        - attended_values: Final attended output with same shape as input
        - attention_weights: Attention weights for visualization [batch_size, seq_len, seq_len] or [seq_len, seq_len]
    
    Example:
        >>> embeddings = torch.randn(1, 6, 64)  # "The cat sat on the mat"
        >>> output, weights = attention_mechanism(embeddings, d_model=64)
        >>> print(output.shape, weights.shape)  # torch.Size([1, 6, 64]) torch.Size([1, 6, 6])
    """
    # Step 1: Create Q, K, V projections
    Q, K, V = create_qkv_projections(embeddings, d_model=d_model)
    
    # Step 2: Compute attention scores
    attention_scores = compute_attention_scores(Q, K)
    
    # Step 3: Apply softmax to get attention weights
    attention_weights = compute_attention_weights(attention_scores)
    
    # Step 4: Aggregate values using attention weights
    attended_values = aggregate_values(attention_weights, V)
    
    return attended_values, attention_weights


def demo_attention() -> Dict[str, Any]:
    """
    Demonstration function using 'The cat sat on the mat' example.
    
    This function creates example embeddings for the sentence "The cat sat on the mat"
    and runs the complete attention mechanism, returning all intermediate results
    for inspection and educational purposes.
    
    Returns:
        Dictionary containing:
        - 'tokens': List of tokens from the example sentence
        - 'embeddings': Input embeddings [1, 6, 64]
        - 'Q', 'K', 'V': Query, Key, Value projections [1, 6, 64] each
        - 'attention_scores': Raw attention scores [1, 6, 6]
        - 'attention_weights': Normalized attention weights [1, 6, 6]
        - 'attended_values': Final attended output [1, 6, 64]
        - 'validation': Dictionary with validation checks
    
    Example:
        >>> results = demo_attention()
        >>> print(f"Tokens: {results['tokens']}")
        >>> print(f"Attention weights shape: {results['attention_weights'].shape}")
        >>> print(f"Weights sum correctly: {results['validation']['weights_sum_to_one']}")
    """
    # Example sentence: "The cat sat on the mat"
    example_text = "The cat sat on the mat"
    tokens = example_text.lower().split()
    
    # Create example embeddings for 6 tokens with dimension 64
    # Using fixed seed for reproducible results
    torch.manual_seed(42)
    embeddings = torch.randn(1, 6, 64)  # [batch_size=1, seq_len=6, d_model=64]
    
    # Step 1: Create Q, K, V projections
    Q, K, V = create_qkv_projections(embeddings, d_model=64)
    
    # Step 2: Compute attention scores
    attention_scores = compute_attention_scores(Q, K)
    
    # Step 3: Compute attention weights
    attention_weights = compute_attention_weights(attention_scores)
    
    # Step 4: Aggregate values
    attended_values = aggregate_values(attention_weights, V)
    
    # Validation checks
    validation = {
        'weights_sum_to_one': torch.allclose(attention_weights.sum(dim=-1), torch.ones_like(attention_weights.sum(dim=-1))),
        'output_shape_correct': attended_values.shape == embeddings.shape,
        'weights_shape_correct': attention_weights.shape == (1, 6, 6),
        'all_weights_positive': (attention_weights >= 0).all().item(),
        'attention_is_symmetric_keys': Q.shape == K.shape == V.shape
    }
    
    return {
        'tokens': tokens,
        'embeddings': embeddings,
        'Q': Q,
        'K': K, 
        'V': V,
        'attention_scores': attention_scores,
        'attention_weights': attention_weights,
        'attended_values': attended_values,
        'validation': validation
    }


# Example usage and testing
if __name__ == "__main__":
    print("Reference Attention Mechanism Implementation")
    print("=" * 50)
    
    # Run demonstration
    print("\n1. Running demo with 'The cat sat on the mat'...")
    results = demo_attention()
    
    print(f"   Tokens: {results['tokens']}")
    print(f"   Input shape: {results['embeddings'].shape}")
    print(f"   Output shape: {results['attended_values'].shape}")
    print(f"   Attention weights shape: {results['attention_weights'].shape}")
    
    # Validation results
    print("\n2. Validation Results:")
    for check, passed in results['validation'].items():
        status = "PASS" if passed else "FAIL"
        print(f"   {check}: {status}")
    
    # Show attention pattern
    print("\n3. Sample Attention Weights (first 3x3):")
    weights_sample = results['attention_weights'][0, :3, :3].detach().numpy()
    print(f"   {weights_sample}")
    
    # Test individual functions
    print("\n4. Testing individual functions...")
    
    # Test with different input shapes
    test_embeddings_batched = torch.randn(2, 4, 32)  # [batch=2, seq=4, dim=32]
    test_embeddings_unbatched = torch.randn(4, 32)   # [seq=4, dim=32]
    
    # Test batched input
    output_batched, weights_batched = attention_mechanism(test_embeddings_batched, d_model=32)
    print(f"   Batched input {test_embeddings_batched.shape} -> output {output_batched.shape}, weights {weights_batched.shape}")
    
    # Test unbatched input
    output_unbatched, weights_unbatched = attention_mechanism(test_embeddings_unbatched, d_model=32)
    print(f"   Unbatched input {test_embeddings_unbatched.shape} -> output {output_unbatched.shape}, weights {weights_unbatched.shape}")
    
    # Verify attention weights sum to 1
    weights_sum_batched = weights_batched.sum(dim=-1)
    weights_sum_unbatched = weights_unbatched.sum(dim=-1)
    
    print(f"   Batched weights sum check: {torch.allclose(weights_sum_batched, torch.ones_like(weights_sum_batched))}")
    print(f"   Unbatched weights sum check: {torch.allclose(weights_sum_unbatched, torch.ones_like(weights_sum_unbatched))}")
    
    print("\nReference implementation ready for Epic 5 evaluation!")