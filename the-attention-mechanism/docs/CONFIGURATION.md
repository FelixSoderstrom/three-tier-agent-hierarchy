# LLM Configuration Guide

## Overview

The Attention Mechanism Educational Project integrates Large Language Models (LLMs) to provide intelligent code evaluation, educational feedback, and interactive explanations. This guide covers setup and configuration of both Ollama (primary, free) and OpenAI (fallback) providers.

## Configuration File Structure

The system uses `.llm_config.json` for all LLM settings:

```json
{
  "llm_providers": {
    "primary": { /* Ollama configuration */ },
    "fallback": { /* OpenAI configuration */ }
  },
  "educational_settings": { /* Learning preferences */ },
  "rate_limiting": { /* Usage controls */ },
  "cache": { /* Response caching */ },
  "prompts": { /* Educational prompts */ }
}
```

## Primary Provider: Ollama Setup

Ollama is the recommended primary provider as it's free and runs locally.

### 1. Install Ollama

**Windows:**
1. Download from [ollama.ai](https://ollama.ai/download/windows)
2. Run the installer
3. Ollama service starts automatically

**macOS:**
```bash
# Using Homebrew
brew install ollama

# Or download from ollama.ai
```

**Linux:**
```bash
# Install script
curl -fsSL https://ollama.ai/install.sh | sh

# Or manual installation
wget https://ollama.ai/download/ollama-linux-amd64
sudo mv ollama-linux-amd64 /usr/local/bin/ollama
sudo chmod +x /usr/local/bin/ollama
```

### 2. Start Ollama Service

**Automatic (Recommended):**
Ollama typically starts as a system service automatically.

**Manual:**
```bash
ollama serve
# Runs on http://localhost:11434
```

### 3. Download Educational Models

The project uses `llama3.1:8b` for educational explanations:

```bash
# Primary educational model
ollama pull llama3.1:8b

# Optional: Code-specific model
ollama pull codellama:7b
```

**Model Requirements:**
- **llama3.1:8b**: ~4.7GB - Primary educational model
- **codellama:7b**: ~3.8GB - Optional code explanation model

### 4. Verify Ollama Installation

Test Ollama is working:
```bash
# Check service
curl http://localhost:11434/api/tags

# Test model
ollama run llama3.1:8b "Explain attention mechanism briefly"
```

### 5. Ollama Configuration in .llm_config.json

```json
{
  "llm_providers": {
    "primary": {
      "provider": "ollama",
      "base_url": "http://localhost:11434",
      "models": {
        "default": "llama3.1:8b",
        "code_explanation": "codellama:7b",
        "educational": "llama3.1:8b"
      },
      "parameters": {
        "temperature": 0.7,
        "max_tokens": 2048,
        "top_p": 0.9,
        "stream": false
      },
      "timeout": 60,
      "retry_attempts": 3
    }
  }
}
```

## Fallback Provider: OpenAI Setup

OpenAI provides high-quality responses but requires an API key and usage costs.

### 1. Get OpenAI API Key

1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Navigate to API Keys section
3. Create new API key
4. Copy the key (starts with `sk-...`)

### 2. Configure API Key

```bash
# Windows (Command Prompt)
set OPENAI_API_KEY=sk-your-api-key-here

# Windows (PowerShell)
$env:OPENAI_API_KEY="sk-your-api-key-here"

# Linux/macOS
export OPENAI_API_KEY="sk-your-api-key-here"
```

### 3. OpenAI Configuration in .llm_config.json

```json
{
  "llm_providers": {
    "fallback": {
      "provider": "openai",
      "base_url": "https://api.openai.com/v1",
      "models": {
        "default": "gpt-3.5-turbo",
        "code_explanation": "gpt-3.5-turbo",
        "educational": "gpt-3.5-turbo"
      },
      "parameters": {
        "temperature": 0.7,
        "max_tokens": 2048,
        "top_p": 0.9,
        "stream": false
      },
      "timeout": 30,
      "retry_attempts": 2
    }
  }
}
```


## Educational Settings

Configure the explanation style in `.llm_config.json`:

```json
{
  "educational_settings": {
    "explanation_style": "beginner_friendly"
  }
}
```

**Available Options for `explanation_style`:**
- `beginner_friendly`: Clear, simple explanations for learners
- `detailed`: Comprehensive technical explanations
- `concise`: Brief, focused explanations


## Rate Limiting and Caching

Control usage to prevent API overuse:

```json
{
  "rate_limiting": {
    "requests_per_minute": 30,
    "burst_limit": 5
  },
  "cache": {
    "enabled": true,
    "cache_dir": "progress/.llm_cache",
    "ttl_seconds": 3600
  }
}
```

**Rate Limiting:**
- Prevents excessive API calls
- Protects against costs (OpenAI) and overuse (Ollama)
- Burst limit allows quick successive calls

**Caching:**
- Stores responses for repeated requests
- Reduces API calls and improves response time
- TTL (time-to-live) controls cache freshness

## Testing LLM Configuration

**Quick Test:**
```python
from src.llm_integration import LLMEvaluator
evaluator = LLMEvaluator()
print("LLM evaluator created successfully")
```

## Provider Switching and Failover

The system automatically handles provider switching:

1. **Primary (Ollama)**: Always tried first
2. **Fallback (OpenAI)**: Used if Ollama unavailable
3. **Error Handling**: Graceful degradation with informative messages

## Advanced Configuration

### Custom Prompts

Modify educational prompts in `.llm_config.json`:

```json
{
  "prompts": {
    "attention_explanation": "You are an educational AI helping students understand attention mechanisms. Provide clear, step-by-step explanations with visual descriptions.",
    "code_review": "Review the following attention mechanism code and provide educational feedback focusing on understanding rather than optimization.",
    "concept_check": "Ask a thoughtful question to help the student verify their understanding."
  }
}
```

### Custom Models

Add support for other Ollama models:

```json
{
  "llm_providers": {
    "primary": {
      "models": {
        "default": "mistral:7b",
        "code_explanation": "codellama:13b",
        "educational": "llama3.1:8b"
      }
    }
  }
}
```

### Development Settings

For development and testing:

```json
{
  "educational_settings": {
    "explanation_style": "detailed"
  },
  "cache": {
    "ttl_seconds": 60
  }
}
```

## Troubleshooting Configuration

### Ollama Issues

**Service not running:**
```bash
# Check service status
curl http://localhost:11434/api/tags

# Start Ollama service
ollama serve

# Windows: Check Windows Services for "Ollama"
# macOS: Check Activity Monitor
# Linux: Check systemctl status ollama
```

**Model not found:**
```bash
# List available models
ollama list

# Download required model (4-5GB)
ollama pull llama3.1:8b

# Alternative models
ollama pull codellama:7b
ollama pull mistral:7b
```

**Installation issues:**
- **Windows**: Download installer from [ollama.ai](https://ollama.ai/download/windows)
- **macOS**: `brew install ollama` or download from ollama.ai
- **Linux**: `curl -fsSL https://ollama.ai/install.sh | sh`

**Connection refused:**
- Verify firewall isn't blocking port 11434
- Check if another process is using the port
- Try restarting the Ollama service

### OpenAI Issues

**Invalid API key:**
```bash
# Verify API key format (should start with 'sk-')
echo $OPENAI_API_KEY

# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**Rate limit exceeded:**
1. Check usage on OpenAI dashboard
2. Reduce rate limiting in `.llm_config.json`:
   ```json
   "rate_limiting": {
     "requests_per_minute": 10,
     "burst_limit": 2
   }
   ```
3. Enable caching to reduce API calls:
   ```json
   "cache": {
     "enabled": true,
     "ttl_seconds": 3600
   }
   ```
4. Use `gpt-3.5-turbo` instead of `gpt-4` for cost efficiency

### General LLM Integration Issues

**LLM not working:**
```python
# Test LLM integration directly
from src.llm_integration import LLMEvaluator
evaluator = LLMEvaluator()
print("LLM evaluator created successfully")
```

**Check configuration:**
```bash
# View configuration
cat .llm_config.json | head -20

# Validate JSON format
python -c "import json; json.load(open('.llm_config.json'))"
```


### Configuration Validation

**Validate .llm_config.json:**
```python
import json
with open('.llm_config.json') as f:
    config = json.load(f)
print("Configuration valid")
```

**Reset to defaults:**
If configuration becomes corrupted, restore from the working default in the project.

## Best Practices

### Educational Use
- Use Ollama for cost-free evaluation
- Enable caching for repeated sessions
- Set appropriate difficulty levels for students
- Monitor logs for learning insights

### Production Use
- Configure rate limiting appropriately
- Use environment variables for API keys
- Enable logging for debugging
- Regular backup of configuration

### Privacy and Security
- Never commit API keys to version control
- Use environment variables or .env files
- Disable prompt logging for sensitive content
- Regularly rotate API keys

## Next Steps

After configuration:
1. **Test System**: Run integration tests to verify setup
2. **Launch Notebooks**: Start with `lesson.ipynb` for interactive learning
3. **Explore Features**: Try different LLM evaluation features
4. **Customize**: Adjust settings based on educational needs

For additional support, see `TROUBLESHOOTING.md` for common configuration issues.