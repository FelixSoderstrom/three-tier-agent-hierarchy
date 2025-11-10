"""
Visualization utilities for the attention mechanism learning module.

This module provides visualization functions for different components of the attention mechanism:
- Q, K, V projections
- Attention scores
- Attention weights
- Attended values

Each function is designed to create educational visualizations that help students
understand how the attention mechanism works at each step.
"""

import matplotlib.pyplot as plt
import numpy as np
import torch
import seaborn as sns
from typing import List, Optional


def visualize_qkv_projections(embeddings: torch.Tensor, query: torch.Tensor, key: torch.Tensor, 
                             value: torch.Tensor, tokens: List[str]) -> None:
    """
    Visualize the Query, Key, and Value projections as heatmaps.
    
    This function creates a visualization showing how the input embeddings are
    projected into different spaces for query, key, and value computations.
    
    Args:
        embeddings: Original input embeddings tensor (batch_size, seq_len, d_model)
        query: Query tensor (batch_size, seq_len, d_k)
        key: Key tensor (batch_size, seq_len, d_k)
        value: Value tensor (batch_size, seq_len, d_k)
        tokens: List of token strings for labeling
    
    Returns:
        None (displays matplotlib figure)
    """
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    fig.suptitle('Q, K, V Projections and Original Embeddings', fontsize=16)
    
    # Handle batch dimension - squeeze if needed
    if embeddings.dim() == 3 and embeddings.size(0) == 1:
        embeddings = embeddings.squeeze(0)
    if query.dim() == 3 and query.size(0) == 1:
        query = query.squeeze(0)
    if key.dim() == 3 and key.size(0) == 1:
        key = key.squeeze(0)
    if value.dim() == 3 and value.size(0) == 1:
        value = value.squeeze(0)
    
    # Convert to numpy
    embed_data = embeddings.detach().numpy()[:len(tokens), :10]  # Show first 10 dimensions
    q_data = query.detach().numpy()[:len(tokens), :10]
    k_data = key.detach().numpy()[:len(tokens), :10]
    v_data = value.detach().numpy()[:len(tokens), :10]
    
    # Plot original embeddings
    sns.heatmap(embed_data, ax=axes[0, 0], cmap='coolwarm', 
                xticklabels=[f'd{i}' for i in range(10)],
                yticklabels=tokens[:len(embed_data)])
    axes[0, 0].set_title('Original Input Embeddings')
    axes[0, 0].set_xlabel('Embedding Dimensions')
    axes[0, 0].set_ylabel('Tokens')
    
    # Plot Q matrix
    sns.heatmap(q_data, ax=axes[0, 1], cmap='viridis', 
                xticklabels=[f'd{i}' for i in range(10)],
                yticklabels=tokens[:len(q_data)])
    axes[0, 1].set_title('Query (Q) Projections')
    axes[0, 1].set_xlabel('Query Dimensions')
    axes[0, 1].set_ylabel('Tokens')
    
    # Plot K matrix
    sns.heatmap(k_data, ax=axes[1, 0], cmap='plasma',
                xticklabels=[f'd{i}' for i in range(10)],
                yticklabels=tokens[:len(k_data)])
    axes[1, 0].set_title('Key (K) Projections')
    axes[1, 0].set_xlabel('Key Dimensions')
    axes[1, 0].set_ylabel('Tokens')
    
    # Plot V matrix
    sns.heatmap(v_data, ax=axes[1, 1], cmap='inferno',
                xticklabels=[f'd{i}' for i in range(10)],
                yticklabels=tokens[:len(v_data)])
    axes[1, 1].set_title('Value (V) Projections')
    axes[1, 1].set_xlabel('Value Dimensions')
    axes[1, 1].set_ylabel('Tokens')
    
    plt.tight_layout()
    plt.show()
    
    print("Q, K, V Projections Visualization")
    print("This shows how input embeddings are transformed into different spaces:")
    print("- Original embeddings: Raw input representations")
    print("- Query (Q): What information each token is looking for")
    print("- Key (K): What information each token provides for matching")
    print("- Value (V): What information each token will contribute to the output")


def visualize_attention_scores(attention_scores: torch.Tensor, tokens: List[str]) -> None:
    """
    Visualize the raw attention scores as a heatmap.
    
    This shows the raw compatibility scores between queries and keys
    before softmax normalization.
    
    Args:
        attention_scores: Attention scores tensor (batch_size, seq_len, seq_len)
        tokens: List of token strings for labeling
    
    Returns:
        None (displays matplotlib figure)
    """
    # Handle batch dimension - squeeze if needed
    if attention_scores.dim() == 3 and attention_scores.size(0) == 1:
        scores_data = attention_scores.squeeze(0).detach().numpy()
    else:
        scores_data = attention_scores.detach().numpy()
    
    seq_len = min(len(tokens), scores_data.shape[0])
    scores_data = scores_data[:seq_len, :seq_len]
    
    plt.figure(figsize=(10, 8))
    sns.heatmap(scores_data, 
                xticklabels=tokens[:seq_len],
                yticklabels=tokens[:seq_len],
                cmap='RdBu_r', center=0, annot=True, fmt='.2f',
                cbar_kws={'label': 'Attention Score'})
    
    plt.title('Attention Scores (Before Softmax)\nRaw Query-Key Compatibility')
    plt.xlabel('Key Tokens (what we might attend to)')
    plt.ylabel('Query Tokens (what is querying)')
    plt.xticks(rotation=45)
    plt.yticks(rotation=0)
    plt.tight_layout()
    plt.show()
    
    print("Attention Scores Visualization")
    print("This shows raw compatibility scores between queries and keys:")
    print("- Higher values (red): Strong compatibility between query and key")
    print("- Lower values (blue): Weak compatibility")
    print("- Values are scaled by 1/sqrt(d_k) for numerical stability")
    print("- These will be normalized with softmax to create attention weights")


def visualize_attention_weights(attention_weights: torch.Tensor, tokens: List[str]) -> None:
    """
    Visualize the attention weights as a heatmap.
    
    This shows the normalized attention weights that sum to 1 for each query,
    representing how much each query attends to each key.
    
    Args:
        attention_weights: Attention weights tensor (batch_size, seq_len, seq_len)
        tokens: List of token strings for labeling
    
    Returns:
        None (displays matplotlib figure)
    """
    # Handle batch dimension - squeeze if needed
    if attention_weights.dim() == 3 and attention_weights.size(0) == 1:
        weights_data = attention_weights.squeeze(0).detach().numpy()
    else:
        weights_data = attention_weights.detach().numpy()
    
    seq_len = min(len(tokens), weights_data.shape[0])
    weights_data = weights_data[:seq_len, :seq_len]
    
    # Create the main visualization
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))
    
    # Main heatmap
    sns.heatmap(weights_data, 
                xticklabels=tokens[:seq_len],
                yticklabels=tokens[:seq_len],
                cmap='Blues', annot=True, fmt='.3f',
                cbar_kws={'label': 'Attention Weight'},
                ax=ax1)
    
    ax1.set_title('Attention Weights (After Softmax)\nProbability Distribution')
    ax1.set_xlabel('Key Tokens (what we attend to)')
    ax1.set_ylabel('Query Tokens (what is attending)')
    ax1.tick_params(axis='x', rotation=45)
    ax1.tick_params(axis='y', rotation=0)
    
    # Row sums verification (should all be 1.0)
    row_sums = weights_data.sum(axis=1)
    ax2.bar(range(len(row_sums)), row_sums, alpha=0.7, color='skyblue')
    ax2.axhline(y=1.0, color='red', linestyle='--', alpha=0.8, label='Expected sum = 1.0')
    ax2.set_title('Row Sums Verification\n(Each should equal 1.0)')
    ax2.set_xlabel('Query Token Position')
    ax2.set_ylabel('Sum of Attention Weights')
    ax2.set_xticks(range(len(tokens[:seq_len])))
    ax2.set_xticklabels(tokens[:seq_len], rotation=45)
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.show()
    
    print("Attention Weights Visualization")
    print("This shows normalized attention weights (probabilities):")
    print("- Each row sums to 1.0 (verified in right plot)")
    print("- Darker blue = higher attention weight")
    print("- Shows which tokens each query position attends to most")
    print("- These weights will be used to aggregate value vectors")


def visualize_attended_values(attended_values: torch.Tensor, attention_weights: torch.Tensor, 
                             tokens: List[str]) -> None:
    """
    Visualize the final attended output values and how they were computed.
    
    This shows the weighted combination of value vectors that produces
    the final attention output.
    
    Args:
        attended_values: Final attention output from aggregate_values (batch_size, seq_len, d_v)
        attention_weights: Attention weights used for aggregation (batch_size, seq_len, seq_len)
        tokens: List of token strings for labeling
    
    Returns:
        None (displays matplotlib figure)
    """
    # Handle batch dimension - squeeze if needed
    if attended_values.dim() == 3 and attended_values.size(0) == 1:
        output_data = attended_values.squeeze(0).detach().numpy()
    else:
        output_data = attended_values.detach().numpy()
    
    if attention_weights.dim() == 3 and attention_weights.size(0) == 1:
        weights_data = attention_weights.squeeze(0).detach().numpy()
    else:
        weights_data = attention_weights.detach().numpy()
    
    seq_len = min(len(tokens), output_data.shape[0])
    dim_show = min(12, output_data.shape[1])  # Show first 12 dimensions
    
    fig, axes = plt.subplots(2, 2, figsize=(16, 10))
    fig.suptitle('Attended Values: Weighted Aggregation Results', fontsize=16)
    
    # Plot attended output (main result)
    sns.heatmap(output_data[:seq_len, :dim_show], ax=axes[0, 0], cmap='plasma',
                xticklabels=[f'd{i}' for i in range(dim_show)],
                yticklabels=tokens[:seq_len],
                cbar_kws={'label': 'Output Value'})
    axes[0, 0].set_title('Attended Values Output\n(Weighted Sum of Value Vectors)')
    axes[0, 0].set_xlabel('Output Dimensions')
    axes[0, 0].set_ylabel('Tokens')
    
    # Plot attention weights used for aggregation
    sns.heatmap(weights_data[:seq_len, :seq_len], ax=axes[0, 1], cmap='Blues',
                xticklabels=tokens[:seq_len],
                yticklabels=tokens[:seq_len],
                annot=True, fmt='.2f',
                cbar_kws={'label': 'Attention Weight'})
    axes[0, 1].set_title('Attention Weights\n(Used for Aggregation)')
    axes[0, 1].set_xlabel('Key Tokens')
    axes[0, 1].set_ylabel('Query Tokens')
    axes[0, 1].tick_params(axis='x', rotation=45)
    
    # Plot attention pattern summary - who gets attended to most
    avg_attention_received = weights_data[:seq_len, :seq_len].mean(axis=0)
    bars1 = axes[1, 0].bar(range(len(avg_attention_received)), avg_attention_received, 
                          alpha=0.7, color='lightblue')
    axes[1, 0].set_title('Average Attention Received\n(Which tokens are attended to most)')
    axes[1, 0].set_xlabel('Token Position')
    axes[1, 0].set_ylabel('Average Attention Weight')
    axes[1, 0].set_xticks(range(len(tokens[:seq_len])))
    axes[1, 0].set_xticklabels(tokens[:seq_len], rotation=45)
    axes[1, 0].grid(True, alpha=0.3)
    
    # Highlight max attention received
    max_idx = np.argmax(avg_attention_received)
    bars1[max_idx].set_color('red')
    bars1[max_idx].set_alpha(0.8)
    
    # Plot attention pattern summary - who attends most
    avg_attention_given = weights_data[:seq_len, :seq_len].mean(axis=1)
    bars2 = axes[1, 1].bar(range(len(avg_attention_given)), avg_attention_given, 
                          alpha=0.7, color='lightgreen')
    axes[1, 1].set_title('Average Attention Given\n(Which tokens attend most to others)')
    axes[1, 1].set_xlabel('Token Position')
    axes[1, 1].set_ylabel('Average Attention Weight')
    axes[1, 1].set_xticks(range(len(tokens[:seq_len])))
    axes[1, 1].set_xticklabels(tokens[:seq_len], rotation=45)
    axes[1, 1].grid(True, alpha=0.3)
    
    # Highlight max attention given
    max_idx = np.argmax(avg_attention_given)
    bars2[max_idx].set_color('red')
    bars2[max_idx].set_alpha(0.8)
    
    plt.tight_layout()
    plt.show()
    
    print("Attended Values Visualization")
    print("This shows the final step of attention - value aggregation:")
    print("- Top left: Final attended output (weighted combination of value vectors)")
    print("- Top right: Attention weights used for the weighted sum")
    print("- Bottom left: Which tokens receive most attention (red = highest)")
    print("- Bottom right: Which tokens give most attention (red = highest)")
    print("\nThe attended values are computed as: output[i] = sum_j(attention_weights[i,j] * V[j])")


def visualize_attention_flow(attention_weights: torch.Tensor, tokens: List[str],
                           query_idx: int = 0, top_k: int = 3) -> None:
    """
    Visualize the attention flow for a specific query token.
    
    This creates a focused visualization showing which tokens a specific
    query token attends to most strongly.
    
    Args:
        attention_weights: Attention weights tensor (batch_size, seq_len, seq_len)
        tokens: List of token strings
        query_idx: Index of the query token to analyze
        top_k: Number of top attention targets to highlight
    
    Returns:
        None (displays matplotlib figure)
    """
    # TODO: Epic 2 will implement this visualization
    # For now, create a placeholder
    
    weights = attention_weights[0, query_idx].detach().numpy()
    seq_len = min(len(tokens), len(weights))
    
    plt.figure(figsize=(12, 6))
    bars = plt.bar(range(seq_len), weights[:seq_len])
    
    # Highlight top-k attention targets
    top_indices = np.argsort(weights[:seq_len])[-top_k:]
    for idx in top_indices:
        bars[idx].set_color('red')
        bars[idx].set_alpha(0.8)
    
    plt.title(f'Attention Flow from "{tokens[query_idx]}" (Query Token {query_idx})')
    plt.xlabel('Key Token Position')
    plt.ylabel('Attention Weight')
    plt.xticks(range(seq_len), tokens[:seq_len], rotation=45)
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.show()
    
    print(f"Attention Flow for '{tokens[query_idx]}'")
    print(f"Red bars show the top-{top_k} tokens this query attends to most.")
    
    # Print top attention targets
    top_indices = np.argsort(weights[:seq_len])[-top_k:]
    print(f"\nTop {top_k} attention targets:")
    for i, idx in enumerate(reversed(top_indices)):
        print(f"{i+1}. '{tokens[idx]}': {weights[idx]:.4f}")


# Utility functions for Epic 2 development
def setup_visualization_style() -> None:
    """Set up consistent styling for all visualizations."""
    plt.style.use('default')
    sns.set_palette("husl")
    plt.rcParams['figure.figsize'] = (10, 6)
    plt.rcParams['font.size'] = 12


def save_visualization(fig, filename: str, dpi: int = 300) -> None:
    """Save visualization to file with consistent formatting."""
    fig.savefig(filename, dpi=dpi, bbox_inches='tight', 
                facecolor='white', edgecolor='none')
    print(f"Visualization saved to: {filename}")


# Module initialization
setup_visualization_style()

# Suppress module initialization prints unless in debug mode
import os
if __name__ == "__main__" or os.environ.get('VISUALIZATION_DEBUG', '').lower() == 'true':
    print("Visualization module loaded successfully!")
    print("Available functions:")
    print("- visualize_qkv_projections()")
    print("- visualize_attention_scores()")
    print("- visualize_attention_weights()")
    print("- visualize_attended_values()")
    print("- visualize_attention_flow()")
    print("\nNote: Epic 3 implementations now complete.")