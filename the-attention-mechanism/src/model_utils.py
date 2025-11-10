"""
Model utilities for the attention mechanism learning module.

This module provides helper functions for tokenization, embedding creation,
and other model-related utilities needed for the attention mechanism tutorial.

The utilities are designed to be educational and provide clear examples
of how text is processed in transformer models.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from typing import List, Dict, Tuple, Optional, Union, Any
import re
import json
import os
import warnings
from pathlib import Path

# Import display utilities for cross-platform symbol support
try:
    from .display_utils import symbols, format_message
except ImportError:
    from src.display_utils import symbols, format_message


def tokenize_text(text: str, method: str = 'simple') -> List[str]:
    """
    Tokenize input text into a list of tokens.
    
    This function provides a simple tokenization approach for educational purposes.
    In production, you would use more sophisticated tokenizers like BPE or SentencePiece.
    
    Args:
        text: Input text to tokenize
        method: Tokenization method ('simple', 'word', 'char')
    
    Returns:
        List of tokens
    """
    # TODO: Epic 2 will implement more sophisticated tokenization
    # For now, provide basic word-level tokenization
    
    if method == 'simple':
        # Simple whitespace and punctuation tokenization
        # Add special tokens for better educational value
        tokens = ['<BOS>']  # Beginning of sequence
        
        # Split on whitespace and punctuation
        words = re.findall(r'\w+|[^\w\s]', text.lower())
        tokens.extend(words)
        
        tokens.append('<EOS>')  # End of sequence
        
    elif method == 'word':
        # Word-level tokenization
        tokens = text.lower().split()
        
    elif method == 'char':
        # Character-level tokenization
        tokens = list(text.lower())
        
    else:
        raise ValueError(f"Unknown tokenization method: {method}")
    
    return tokens


def create_embeddings(tokens: List[str], embedding_dim: int = 512, 
                     vocab_size: int = 10000) -> torch.Tensor:
    """
    Create embeddings for the given tokens.
    
    This function creates random embeddings for educational purposes.
    In production, you would use pre-trained embeddings or learn them during training.
    
    Args:
        tokens: List of tokens to embed
        embedding_dim: Dimension of the embedding vectors
        vocab_size: Size of the vocabulary
    
    Returns:
        Embedding tensor (1, seq_len, embedding_dim)
    """
    # TODO: Epic 2 will implement proper embedding lookup
    # For now, create random embeddings for demonstration
    
    # Create a simple vocabulary mapping
    vocab = create_vocabulary(tokens, vocab_size)
    
    # Convert tokens to indices
    token_indices = [vocab.get(token, vocab.get('<UNK>', 0)) for token in tokens]
    
    # Create embedding layer
    embedding_layer = nn.Embedding(vocab_size, embedding_dim)
    
    # Get embeddings
    token_tensor = torch.tensor(token_indices).unsqueeze(0)  # Add batch dimension
    embeddings = embedding_layer(token_tensor)
    
    return embeddings


def create_vocabulary(tokens: List[str], vocab_size: int = 10000) -> Dict[str, int]:
    """
    Create a vocabulary mapping from tokens to indices.
    
    Args:
        tokens: List of all tokens to include in vocabulary
        vocab_size: Maximum vocabulary size
    
    Returns:
        Dictionary mapping tokens to indices
    """
    # TODO: Epic 2 will implement proper vocabulary building
    # For now, create a simple mapping
    
    # Special tokens
    special_tokens = ['<PAD>', '<UNK>', '<BOS>', '<EOS>']
    vocab = {token: idx for idx, token in enumerate(special_tokens)}
    
    # Add unique tokens from input
    unique_tokens = list(set(tokens))
    for token in unique_tokens:
        if token not in vocab and len(vocab) < vocab_size:
            vocab[token] = len(vocab)
    
    return vocab


def positional_encoding(seq_len: int, d_model: int, max_len: int = 10000) -> torch.Tensor:
    """
    Create positional encodings for the transformer architecture.
    
    Positional encodings help the model understand the order of tokens
    since attention is permutation-invariant.
    
    Args:
        seq_len: Length of the sequence
        d_model: Model dimension (should match embedding dimension)
        max_len: Maximum sequence length for pre-computation
    
    Returns:
        Positional encoding tensor (seq_len, d_model)
    """
    # TODO: Epic 2 will implement full positional encoding
    # For now, create a simple sinusoidal encoding
    
    pos_encoding = torch.zeros(max_len, d_model)
    position = torch.arange(0, max_len).unsqueeze(1).float()
    
    # Create the div_term for sinusoidal encoding
    div_term = torch.exp(torch.arange(0, d_model, 2).float() * 
                        -(np.log(10000.0) / d_model))
    
    # Apply sine to even positions
    pos_encoding[:, 0::2] = torch.sin(position * div_term)
    
    # Apply cosine to odd positions
    if d_model % 2 == 1:
        pos_encoding[:, 1::2] = torch.cos(position * div_term[:-1])
    else:
        pos_encoding[:, 1::2] = torch.cos(position * div_term)
    
    return pos_encoding[:seq_len]


def create_attention_mask(seq_len: int, mask_type: str = 'causal') -> torch.Tensor:
    """
    Create attention masks for different types of attention patterns.
    
    Args:
        seq_len: Sequence length
        mask_type: Type of mask ('causal', 'padding', 'full')
    
    Returns:
        Attention mask tensor
    """
    # TODO: Epic 2 will implement various mask types
    # For now, provide basic implementations
    
    if mask_type == 'causal':
        # Lower triangular mask for causal attention
        mask = torch.tril(torch.ones(seq_len, seq_len))
        
    elif mask_type == 'padding':
        # Full attention (no masking) - padding masks would be sequence-specific
        mask = torch.ones(seq_len, seq_len)
        
    elif mask_type == 'full':
        # Full attention (no masking)
        mask = torch.ones(seq_len, seq_len)
        
    else:
        raise ValueError(f"Unknown mask type: {mask_type}")
    
    # Convert to boolean mask (True = attend, False = mask)
    return mask.bool()


def apply_attention_mask(attention_scores: torch.Tensor, mask: torch.Tensor) -> torch.Tensor:
    """
    Apply attention mask to attention scores.
    
    Args:
        attention_scores: Attention scores before masking
        mask: Boolean mask (True = attend, False = mask)
    
    Returns:
        Masked attention scores
    """
    # TODO: Epic 2 will implement proper masking
    # For now, provide basic masking
    
    # Apply mask by setting masked positions to large negative value
    masked_scores = attention_scores.clone()
    masked_scores.masked_fill_(~mask, float('-inf'))
    
    return masked_scores


def load_pretrained_embeddings(embedding_path: str, vocab: Dict[str, int]) -> torch.Tensor:
    """
    Load pre-trained embeddings from file.
    
    Args:
        embedding_path: Path to embedding file
        vocab: Vocabulary mapping
    
    Returns:
        Pre-trained embedding matrix
    """
    # TODO: Epic 2 will implement embedding loading
    # For now, return random embeddings
    
    vocab_size = len(vocab)
    embedding_dim = 512  # Default dimension
    
    print(format_message(f"Loading embeddings from {embedding_path} (placeholder)", 'info'))
    print(f"Vocabulary size: {vocab_size}")
    
    # Create random embeddings as placeholder
    embeddings = torch.randn(vocab_size, embedding_dim)
    
    return embeddings


def save_model_checkpoint(model: nn.Module, optimizer, epoch: int, loss: float, 
                         filepath: str) -> None:
    """
    Save model checkpoint for training resumption.
    
    Args:
        model: PyTorch model
        optimizer: Optimizer state
        epoch: Current epoch
        loss: Current loss
        filepath: Path to save checkpoint
    """
    # TODO: Epic 5 will implement proper checkpointing
    # For now, provide basic saving
    
    checkpoint = {
        'epoch': epoch,
        'model_state_dict': model.state_dict(),
        'optimizer_state_dict': optimizer.state_dict(),
        'loss': loss,
        'timestamp': torch.tensor(0)  # Placeholder
    }
    
    torch.save(checkpoint, filepath)
    print(format_message(f"Model checkpoint saved to: {filepath}", 'folder'))


def load_model_checkpoint(filepath: str, model: nn.Module, optimizer=None) -> Dict:
    """
    Load model checkpoint for training resumption.
    
    Args:
        filepath: Path to checkpoint file
        model: PyTorch model to load weights into
        optimizer: Optimizer to load state into (optional)
    
    Returns:
        Checkpoint information
    """
    # TODO: Epic 5 will implement proper checkpoint loading
    # For now, provide basic loading
    
    try:
        checkpoint = torch.load(filepath)
        model.load_state_dict(checkpoint['model_state_dict'])
        
        if optimizer and 'optimizer_state_dict' in checkpoint:
            optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
        
        print(format_message(f"Model checkpoint loaded from: {filepath}", 'folder'))
        print(f"Epoch: {checkpoint.get('epoch', 'unknown')}")
        print(f"Loss: {checkpoint.get('loss', 'unknown')}")
        
        return checkpoint
        
    except FileNotFoundError:
        print(format_message(f"Checkpoint file not found: {filepath}", 'failure'))
        return {}


def count_parameters(model: nn.Module) -> Dict[str, int]:
    """
    Count the number of parameters in a model.
    
    Args:
        model: PyTorch model
    
    Returns:
        Parameter count information
    """
    total_params = sum(p.numel() for p in model.parameters())
    trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    
    return {
        'total_parameters': total_params,
        'trainable_parameters': trainable_params,
        'non_trainable_parameters': total_params - trainable_params
    }


def get_model_size(model: nn.Module) -> Dict[str, Union[int, float]]:
    """
    Calculate the size of a model in memory.
    
    Args:
        model: PyTorch model
    
    Returns:
        Model size information
    """
    param_size = 0
    buffer_size = 0
    
    for param in model.parameters():
        param_size += param.nelement() * param.element_size()
    
    for buffer in model.buffers():
        buffer_size += buffer.nelement() * buffer.element_size()
    
    total_size = param_size + buffer_size
    
    return {
        'parameter_size_bytes': param_size,
        'buffer_size_bytes': buffer_size,
        'total_size_bytes': total_size,
        'total_size_mb': total_size / (1024 ** 2),
        'total_size_gb': total_size / (1024 ** 3)
    }


def validate_tensor_shapes(tensors: Dict[str, torch.Tensor], 
                          expected_shapes: Dict[str, Tuple]) -> Dict[str, bool]:
    """
    Validate that tensors have expected shapes.
    
    Args:
        tensors: Dictionary of tensors to validate
        expected_shapes: Dictionary of expected shapes
    
    Returns:
        Validation results
    """
    results = {}
    
    for name, tensor in tensors.items():
        if name in expected_shapes:
            expected = expected_shapes[name]
            actual = tensor.shape
            
            # Allow flexible batch size (-1 in expected shape)
            if len(expected) == len(actual):
                shape_match = all(
                    e == a or e == -1 
                    for e, a in zip(expected, actual)
                )
                results[name] = shape_match
            else:
                results[name] = False
        else:
            results[name] = True  # No expectation, assume valid
    
    return results


# Configuration utilities
def load_model_config(config_path: str) -> Dict:
    """Load model configuration from JSON file."""
    try:
        with open(config_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(format_message(f"Config file not found: {config_path}", 'failure'))
        return {}


def save_model_config(config: Dict, config_path: str) -> None:
    """Save model configuration to JSON file."""
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)
    print(format_message(f"Model config saved to: {config_path}", 'folder'))


# ================================================================================
# EPIC 5: TRANSFORMER INTEGRATION FUNCTIONS
# ================================================================================

def load_mini_transformer(model_name: str = "distilgpt2", cache_dir: Optional[str] = None) -> Tuple[Any, Any]:
    """
    Load and cache a small transformer model for educational comparison.
    
    This function loads a pre-trained transformer model and its tokenizer,
    caching them locally for offline use. The model is used to demonstrate
    how our reference attention implementation relates to production transformers.
    
    Args:
        model_name: Name of the HuggingFace model to load (default: "distilgpt2")
        cache_dir: Directory to cache the model (default: "./cache/models/")
    
    Returns:
        Tuple of (model, tokenizer) objects
    
    Example:
        >>> model, tokenizer = load_mini_transformer()
        >>> print(f"Model loaded: {model.config.model_type}")
        >>> print(f"Vocab size: {tokenizer.vocab_size}")
    """
    try:
        from transformers import AutoModel, AutoTokenizer
    except ImportError:
        raise ImportError(
            "transformers library not found. Please install with: pip install transformers"
        )
    
    # Set up cache directory
    if cache_dir is None:
        cache_dir = "./cache/models/"
    
    # Create cache directory if it doesn't exist
    os.makedirs(cache_dir, exist_ok=True)
    
    print(f"Loading mini-transformer: {model_name}")
    print(f"Cache directory: {os.path.abspath(cache_dir)}")
    
    try:
        # Load tokenizer and model with caching
        tokenizer = AutoTokenizer.from_pretrained(
            model_name,
            cache_dir=cache_dir,
            local_files_only=False  # Allow downloading if not cached
        )
        
        model = AutoModel.from_pretrained(
            model_name,
            cache_dir=cache_dir,
            local_files_only=False,  # Allow downloading if not cached
            output_attentions=True,  # Enable attention output for comparison
            output_hidden_states=True
        )
        
        # Set to evaluation mode
        model.eval()
        
        # Add padding token if not present
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
        
        print(f"Model loaded successfully!")
        print(f"   Model type: {model.config.model_type}")
        print(f"   Vocab size: {tokenizer.vocab_size}")
        print(f"   Hidden size: {model.config.hidden_size}")
        print(f"   Number of attention heads: {model.config.num_attention_heads}")
        print(f"   Number of layers: {model.config.num_hidden_layers}")
        
        return model, tokenizer
        
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Note: This requires internet connection for first-time download")
        raise


def compare_attention_implementations(text: str = "The cat sat on the mat",
                                    model_name: str = "distilgpt2") -> Dict[str, Any]:
    """
    Compare reference attention implementation with production transformer.
    
    This is the main comparison function that demonstrates how our educational
    reference implementation relates to production transformer models. It shows
    both the similarities and differences in approach.
    
    Args:
        text: Input text to analyze (default: "The cat sat on the mat")
        model_name: HuggingFace model to compare against (default: "distilgpt2")
    
    Returns:
        Dictionary containing:
        - 'reference_results': Results from our reference implementation
        - 'transformer_results': Results from production transformer
        - 'comparison': Side-by-side analysis
        - 'educational_insights': Key learning points
    
    Example:
        >>> results = compare_attention_implementations()
        >>> print(f"Reference embedding dim: {results['reference_results']['embedding_dim']}")
        >>> print(f"Transformer embedding dim: {results['transformer_results']['embedding_dim']}")
    """
    print(f"Comparing attention implementations")
    print(f"Input text: '{text}'")
    print("=" * 60)
    
    # 1. Get results from our reference implementation
    print("\n1. Running reference implementation...")
    try:
        # Try absolute import first
        try:
            from src.reference_attention import demo_attention, attention_mechanism
        except ImportError:
            # Fall back to relative import
            from .reference_attention import demo_attention, attention_mechanism
        
        reference_results = demo_attention()
        
        print(f"   Reference implementation complete")
        print(f"   Embedding dimension: {reference_results['embeddings'].shape[-1]}")
        print(f"   Attention weights shape: {reference_results['attention_weights'].shape}")
        
    except ImportError as e:
        print(f"   Could not import reference implementation: {e}")
        reference_results = None
    
    # 2. Get results from production transformer
    print("\n2. Running production transformer...")
    try:
        model, tokenizer = load_mini_transformer(model_name)
        
        # Tokenize input
        inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
        
        # Run through model
        with torch.no_grad():
            outputs = model(**inputs, output_attentions=True, output_hidden_states=True)
        
        # Extract key information
        transformer_results = {
            'input_ids': inputs['input_ids'],
            'tokens': tokenizer.convert_ids_to_tokens(inputs['input_ids'][0]),
            'embeddings': outputs.hidden_states[0],  # First layer embeddings
            'hidden_states': outputs.hidden_states,
            'attentions': outputs.attentions,
            'embedding_dim': outputs.hidden_states[0].shape[-1],
            'sequence_length': outputs.hidden_states[0].shape[1],
            'num_heads': model.config.num_attention_heads,
            'num_layers': len(outputs.attentions)
        }
        
        print(f"   Transformer processing complete")
        print(f"   Embedding dimension: {transformer_results['embedding_dim']}")
        print(f"   Number of tokens: {transformer_results['sequence_length']}")
        print(f"   Number of attention heads: {transformer_results['num_heads']}")
        print(f"   Number of layers: {transformer_results['num_layers']}")
        
    except Exception as e:
        print(f"   Transformer processing failed: {e}")
        transformer_results = None
    
    # 3. Perform comparison analysis
    print("\n3. Analyzing differences...")
    comparison = {}
    educational_insights = []
    
    if reference_results and transformer_results:
        # Dimension comparison
        ref_dim = reference_results['embeddings'].shape[-1]
        trans_dim = transformer_results['embedding_dim']
        
        comparison['embedding_dimensions'] = {
            'reference': ref_dim,
            'transformer': trans_dim,
            'ratio': trans_dim / ref_dim if ref_dim > 0 else float('inf')
        }
        
        # Sequence length comparison
        ref_seq_len = reference_results['embeddings'].shape[1]
        trans_seq_len = transformer_results['sequence_length']
        
        comparison['sequence_lengths'] = {
            'reference': ref_seq_len,
            'transformer': trans_seq_len,
            'match': ref_seq_len == trans_seq_len
        }
        
        # Attention pattern comparison (first head of first layer)
        if transformer_results['attentions']:
            trans_attention_first_head = transformer_results['attentions'][0][0, 0]  # [layer 0, batch 0, head 0]
            ref_attention = reference_results['attention_weights'][0]  # [batch 0]
            
            comparison['attention_patterns'] = {
                'reference_shape': ref_attention.shape,
                'transformer_first_head_shape': trans_attention_first_head.shape,
                'both_sum_to_one': {
                    'reference': torch.allclose(ref_attention.sum(dim=-1), torch.ones(ref_attention.shape[0])),
                    'transformer': torch.allclose(trans_attention_first_head.sum(dim=-1), torch.ones(trans_attention_first_head.shape[0]))
                }
            }
        
        # Educational insights
        educational_insights = [
            f"Our reference uses {ref_dim}D embeddings for educational clarity",
            f"Production transformer uses {trans_dim}D embeddings for expressiveness",
            f"Both implementations use softmax normalization (attention weights sum to 1)",
            f"Production model has {transformer_results['num_heads']} attention heads vs our single head",
            f"Production model has {transformer_results['num_layers']} layers vs our single attention computation",
            "Our reference shows the core mechanism, production models add complexity for performance"
        ]
        
        print(f"   Dimension ratio (production/reference): {comparison['embedding_dimensions']['ratio']:.1f}x")
        print(f"   Sequence length match: {comparison['sequence_lengths']['match']}")
        print(f"   Both use proper attention normalization")
    
    else:
        educational_insights = [
            "Could not complete full comparison due to missing components",
            "Reference implementation demonstrates core attention mechanics",
            "Production transformers add multi-head attention, multiple layers, and larger dimensions"
        ]
    
    # 4. Compile results
    results = {
        'input_text': text,
        'reference_results': reference_results,
        'transformer_results': transformer_results,
        'comparison': comparison,
        'educational_insights': educational_insights,
        'success': reference_results is not None and transformer_results is not None
    }
    
    print("\n4. Comparison complete!")
    print(f"   Success: {results['success']}")
    
    return results


def visualize_model_comparison(comparison_results: Dict[str, Any]) -> None:
    """
    Create visualizations showing differences between implementations.
    
    This function creates educational visualizations that help students understand
    how the reference implementation relates to production transformers.
    
    Args:
        comparison_results: Results from compare_attention_implementations()
    """
    print("Creating model comparison visualizations...")
    
    if not comparison_results['success']:
        print("Cannot create visualizations - comparison incomplete")
        return
    
    try:
        import matplotlib.pyplot as plt
        import seaborn as sns
        
        # Create figure with subplots
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        fig.suptitle('Reference vs Production Transformer Comparison', fontsize=16, fontweight='bold')
        
        ref_results = comparison_results['reference_results']
        trans_results = comparison_results['transformer_results']
        
        # 1. Attention weight heatmaps
        ax1 = axes[0, 0]
        ref_weights = ref_results['attention_weights'][0].detach().numpy()
        sns.heatmap(ref_weights, annot=True, fmt='.2f', cmap='Blues', ax=ax1)
        ax1.set_title('Reference Attention Weights')
        ax1.set_xlabel('Key Positions')
        ax1.set_ylabel('Query Positions')
        
        # 2. Production transformer attention (first head, first layer)
        ax2 = axes[0, 1]
        if trans_results['attentions']:
            trans_weights = trans_results['attentions'][0][0, 0].detach().numpy()
            # Crop to match reference if needed
            min_size = min(ref_weights.shape[0], trans_weights.shape[0])
            trans_weights_cropped = trans_weights[:min_size, :min_size]
            
            sns.heatmap(trans_weights_cropped, annot=True, fmt='.2f', cmap='Reds', ax=ax2)
            ax2.set_title('Transformer Attention (Head 0, Layer 0)')
            ax2.set_xlabel('Key Positions')
            ax2.set_ylabel('Query Positions')
        else:
            ax2.text(0.5, 0.5, 'No attention data available', ha='center', va='center')
            ax2.set_title('Transformer Attention - Unavailable')
        
        # 3. Embedding dimension comparison
        ax3 = axes[1, 0]
        dimensions = [
            ref_results['embeddings'].shape[-1],
            trans_results['embedding_dim']
        ]
        labels = ['Reference\n(Educational)', 'Transformer\n(Production)']
        colors = ['lightblue', 'lightcoral']
        
        bars = ax3.bar(labels, dimensions, color=colors)
        ax3.set_title('Embedding Dimensions')
        ax3.set_ylabel('Dimension Size')
        
        # Add value labels on bars
        for bar, dim in zip(bars, dimensions):
            height = bar.get_height()
            ax3.text(bar.get_x() + bar.get_width()/2., height + height*0.01,
                    f'{dim}D', ha='center', va='bottom', fontweight='bold')
        
        # 4. Architecture complexity comparison
        ax4 = axes[1, 1]
        ref_complexity = {
            'Attention Heads': 1,
            'Layers': 1,
            'Parameters (approx)': 'Few thousand'
        }
        
        trans_complexity = {
            'Attention Heads': trans_results['num_heads'],
            'Layers': trans_results['num_layers'],
            'Parameters (approx)': 'Millions'
        }
        
        # Create text comparison
        ax4.text(0.1, 0.8, 'Reference Implementation:', fontsize=12, fontweight='bold', color='blue')
        ax4.text(0.1, 0.7, f"• {ref_complexity['Attention Heads']} attention head", fontsize=10)
        ax4.text(0.1, 0.6, f"• {ref_complexity['Layers']} layer", fontsize=10)
        ax4.text(0.1, 0.5, f"• {ref_complexity['Parameters (approx)']} parameters", fontsize=10)
        
        ax4.text(0.1, 0.3, 'Production Transformer:', fontsize=12, fontweight='bold', color='red')
        ax4.text(0.1, 0.2, f"• {trans_complexity['Attention Heads']} attention heads", fontsize=10)
        ax4.text(0.1, 0.1, f"• {trans_complexity['Layers']} layers", fontsize=10)
        ax4.text(0.1, 0.0, f"• {trans_complexity['Parameters (approx)']} parameters", fontsize=10)
        
        ax4.set_xlim(0, 1)
        ax4.set_ylim(0, 1)
        ax4.set_title('Architecture Complexity')
        ax4.axis('off')
        
        plt.tight_layout()
        plt.show()
        
        print("Visualizations created successfully!")
        
    except ImportError:
        print("Matplotlib not available for visualization")
    except Exception as e:
        print(f"Error creating visualizations: {e}")


def adapt_dimensions(tensor: torch.Tensor, target_dim: int, method: str = "project") -> torch.Tensor:
    """
    Adapt tensor dimensions for compatibility between reference (64D) and production (768D) models.
    
    This utility function handles the dimension mismatch between our educational
    reference implementation (64 dimensions) and production transformers (typically 768+ dimensions).
    
    Args:
        tensor: Input tensor to adapt [batch_size, seq_len, input_dim]
        target_dim: Target dimension size
        method: Adaptation method ("project", "pad", "truncate")
    
    Returns:
        Adapted tensor with shape [batch_size, seq_len, target_dim]
    
    Example:
        >>> ref_embeddings = torch.randn(1, 6, 64)  # Reference dimension
        >>> adapted = adapt_dimensions(ref_embeddings, 768, method="project")
        >>> print(adapted.shape)  # torch.Size([1, 6, 768])
    """
    input_dim = tensor.shape[-1]
    
    if input_dim == target_dim:
        return tensor  # No adaptation needed
    
    print(f"Adapting dimensions: {input_dim}D -> {target_dim}D (method: {method})")
    
    if method == "project":
        # Use linear projection to change dimensions
        projection_layer = nn.Linear(input_dim, target_dim, bias=False)
        with torch.no_grad():
            # Initialize with Xavier uniform for stable outputs
            nn.init.xavier_uniform_(projection_layer.weight)
        adapted = projection_layer(tensor)
        
    elif method == "pad":
        # Pad with zeros to reach target dimension
        if target_dim > input_dim:
            padding_size = target_dim - input_dim
            padding = torch.zeros(*tensor.shape[:-1], padding_size)
            adapted = torch.cat([tensor, padding], dim=-1)
        else:
            # If target is smaller, truncate
            adapted = tensor[..., :target_dim]
            
    elif method == "truncate":
        # Simply truncate or repeat to match target dimension
        if target_dim < input_dim:
            adapted = tensor[..., :target_dim]
        else:
            # Repeat the tensor to fill target dimension
            repeat_factor = target_dim // input_dim
            remainder = target_dim % input_dim
            
            repeated = tensor.repeat(1, 1, repeat_factor)
            if remainder > 0:
                partial = tensor[..., :remainder]
                adapted = torch.cat([repeated, partial], dim=-1)
            else:
                adapted = repeated
    
    else:
        raise ValueError(f"Unknown adaptation method: {method}")
    
    print(f"   Adaptation complete: {tensor.shape} -> {adapted.shape}")
    return adapted


# ================================================================================

# Module initialization and example usage
def demonstrate_utilities():
    """Demonstrate the utility functions with examples."""
    print("Model Utilities Demonstration")
    print("=" * 50)
    
    # Example text
    example_text = "The cat sat on the mat"
    print(f"Example text: '{example_text}'")
    
    # Tokenization
    tokens = tokenize_text(example_text)
    print(f"Tokens: {tokens}")
    
    # Embeddings
    embeddings = create_embeddings(tokens)
    print(f"Embeddings shape: {embeddings.shape}")
    
    # Positional encoding
    pos_enc = positional_encoding(len(tokens), embeddings.shape[-1])
    print(f"Positional encoding shape: {pos_enc.shape}")
    
    # Attention mask
    mask = create_attention_mask(len(tokens), 'causal')
    print(f"Causal mask shape: {mask.shape}")
    
    print("=" * 50)


# Initialize module - suppress output unless in debug mode
import os
if __name__ == "__main__" or os.environ.get('MODEL_UTILS_DEBUG', '').lower() == 'true':
    print("Model utilities module loaded successfully!")
    print("Available functions:")
    print("- tokenize_text()")
    print("- create_embeddings()")
    print("- positional_encoding()")
    print("- create_attention_mask()")
    print("- apply_attention_mask()")
    print("- load_pretrained_embeddings()")
    print("- save_model_checkpoint() / load_model_checkpoint()")
    print("- count_parameters() / get_model_size()")
    print("- validate_tensor_shapes()")
    print("\nEpic 5 - Transformer Integration Functions:")
    print("- load_mini_transformer() - Load and cache small transformer models")
    print("- compare_attention_implementations() - Compare reference vs production")
    print("- visualize_model_comparison() - Create educational visualizations")
    print("- adapt_dimensions() - Handle dimension mismatches (64D <-> 768D)")
    print("\nNote: Epic 5 functions require 'transformers' library for full functionality.")