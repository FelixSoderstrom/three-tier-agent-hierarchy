"""
LLM Integration Module for Epic 4 Code Evaluation

This module provides comprehensive LLM integration for educational code evaluation,
specifically designed for attention mechanism implementations. It supports both
Ollama (primary) and OpenAI (fallback) providers with educational prompt templates.

Features:
- Provider management with automatic fallback
- Educational code comparison prompts
- Structured output generation
- Error handling and retry mechanisms
- Response caching and rate limiting
- Educational feedback generation

Example Usage:
    from src.llm_integration import LLMEvaluator
    
    evaluator = LLMEvaluator()
    result = evaluator.compare_code(student_code, reference_code, "create_qkv_projections")
    print(result["educational_feedback"])
"""

import json
import os
import time
import hashlib
from typing import Dict, Any, Optional, List, Tuple
from datetime import datetime, timedelta
import requests
import openai
from pathlib import Path


class LLMProviderError(Exception):
    """Custom exception for LLM provider errors"""
    pass


class LLMEvaluator:
    """
    Main LLM integration class for educational code evaluation.
    
    Manages multiple LLM providers (Ollama primary, OpenAI fallback) and provides
    educational code comparison functionality specifically for attention mechanism
    implementations.
    """
    
    def __init__(self, config_path: str = "./.llm_config.json"):
        """
        Initialize LLM evaluator with configuration.

        Args:
            config_path: Path to LLM configuration file
        """
        self.config_path = config_path
        self.config = self._load_config()

        self.cache = self._setup_cache()

        self.rate_limiter = RateLimiter(
            requests_per_minute=self.config["rate_limiting"]["requests_per_minute"],
            burst_limit=self.config["rate_limiting"]["burst_limit"]
        )

        # Initialize providers
        self.primary_provider = self._init_provider("primary")

        try:
            self.fallback_provider = self._init_provider("fallback")
        except LLMProviderError as e:
            self.fallback_provider = None

        # Educational prompt templates
        self.prompt_templates = EducationalPromptTemplates(self.config)
    
    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from JSON file"""
        try:
            with open(self.config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            raise LLMProviderError(f"Configuration file not found: {self.config_path}")
        except json.JSONDecodeError as e:
            raise LLMProviderError(f"Invalid JSON in configuration file: {e}")
    
    def _setup_cache(self) -> Optional['ResponseCache']:
        """Setup response caching if enabled"""
        if self.config["cache"]["enabled"]:
            return ResponseCache(
                cache_dir=self.config["cache"]["cache_dir"],
                ttl_seconds=self.config["cache"]["ttl_seconds"]
            )
        return None
    
    def _init_provider(self, provider_type: str) -> 'LLMProvider':
        """Initialize LLM provider (primary or fallback)"""
        provider_config = self.config["llm_providers"][provider_type]

        if provider_config["provider"] == "ollama":
            return OllamaProvider(provider_config)
        elif provider_config["provider"] == "openai":
            return OpenAIProvider(provider_config)
        else:
            raise LLMProviderError(f"Unknown provider: {provider_config['provider']}")
    
    def compare_code(self, student_code: str, reference_code: str,
                    function_name: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Compare student code against reference implementation with educational feedback.

        Args:
            student_code: Student's implementation code
            reference_code: Reference implementation code
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
        # Check rate limiting
        self.rate_limiter.wait_if_needed()

        # Check cache first
        cache_key = self._generate_cache_key(student_code, reference_code, function_name)
        if self.cache:
            cached_result = self.cache.get(cache_key)
            if cached_result:
                return cached_result

        # Generate prompt
        prompt = self.prompt_templates.create_code_comparison_prompt(
            student_code, reference_code, function_name, context
        )

        # Try primary provider first, then fallback
        result = None
        providers_tried = []

        for provider_name, provider in [("primary", self.primary_provider),
                                       ("fallback", self.fallback_provider)]:
            if provider is None:
                continue

            providers_tried.append(provider_name)

            try:
                response = provider.generate_response(prompt, "educational")
                result = self._parse_comparison_response(response, function_name)
                break

            except Exception as e:
                continue

        if result is None:
            raise LLMProviderError("All LLM providers failed to generate response")

        # Cache the result
        if self.cache:
            self.cache.set(cache_key, result)

        return result
    
    def explain_concept(self, concept: str, student_level: str = "intermediate") -> str:
        """
        Generate educational explanation for attention mechanism concepts.

        Args:
            concept: The concept to explain (e.g., "scaled dot-product attention")
            student_level: Student difficulty level (beginner, intermediate, advanced)

        Returns:
            Educational explanation string
        """
        prompt = self.prompt_templates.create_concept_explanation_prompt(concept, student_level)

        for provider_name, provider in [("primary", self.primary_provider),
                                       ("fallback", self.fallback_provider)]:
            if provider is None:
                continue

            try:
                response = provider.generate_response(prompt, "educational")
                return response
            except Exception as e:
                continue

        raise LLMProviderError("All LLM providers failed to generate concept explanation")
    
    def generate_test_cases(self, function_name: str, function_signature: str) -> List[Dict[str, Any]]:
        """
        Generate test cases for attention mechanism functions.

        Args:
            function_name: Name of the function
            function_signature: Function signature and documentation

        Returns:
            List of test case dictionaries
        """
        prompt = self.prompt_templates.create_test_generation_prompt(function_name, function_signature)

        for provider_name, provider in [("primary", self.primary_provider),
                                       ("fallback", self.fallback_provider)]:
            if provider is None:
                continue

            try:
                response = provider.generate_response(prompt, "code_explanation")
                return self._parse_test_cases_response(response)
            except Exception as e:
                continue

        raise LLMProviderError("All LLM providers failed to generate test cases")
    
    def _generate_cache_key(self, student_code: str, reference_code: str, function_name: str) -> str:
        """Generate cache key for code comparison"""
        content = f"{student_code}|{reference_code}|{function_name}"
        return hashlib.md5(content.encode()).hexdigest()
    
    def _parse_comparison_response(self, response: str, function_name: str) -> Dict[str, Any]:
        """Parse LLM response into structured comparison result"""
        try:
            # Try to parse as JSON first
            if response.strip().startswith('{'):
                parsed = json.loads(response)
                return parsed
        except json.JSONDecodeError as e:
            pass

        # If not JSON, parse structured text response
        return self._parse_text_response(response, function_name)

    def _parse_text_response(self, response: str, function_name: str) -> Dict[str, Any]:
        """Parse text response into structured format"""
        lines = response.split('\n')

        result = {
            "comparison_result": "unknown",
            "educational_feedback": response,
            "suggestions": [],
            "score": 50,  # Default middle score
            "understanding_check": [],
            "function_name": function_name,
            "timestamp": datetime.now().isoformat()
        }

        # Try to extract key information from text
        for line in lines:
            line = line.strip().lower()
            if "correct" in line and "implementation" in line:
                result["comparison_result"] = "correct"
                result["score"] = 85
            elif "incorrect" in line or "error" in line:
                result["comparison_result"] = "incorrect"
                result["score"] = 25
            elif "partially" in line or "almost" in line:
                result["comparison_result"] = "partially_correct"
                result["score"] = 60

        return result
    
    def _parse_test_cases_response(self, response: str) -> List[Dict[str, Any]]:
        """Parse test cases from LLM response"""
        # Simple parsing - in practice, this would be more sophisticated
        return [{"description": "Basic test case", "input": "sample_input", "expected": "sample_output"}]


class LLMProvider:
    """Base class for LLM providers"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
    
    def generate_response(self, prompt: str, model_type: str = "default") -> str:
        """Generate response from LLM"""
        raise NotImplementedError
    
    def _get_model(self, model_type: str) -> str:
        """Get model name for specific type"""
        return self.config["models"].get(model_type, self.config["models"]["default"])


class OllamaProvider(LLMProvider):
    """Ollama provider implementation"""

    def generate_response(self, prompt: str, model_type: str = "default") -> str:
        """Generate response using Ollama API"""
        model = self._get_model(model_type)
        url = f"{self.config['base_url']}/api/generate"

        payload = {
            "model": model,
            "prompt": prompt,
            "format": "json",
            "stream": self.config["parameters"]["stream"],
            "options": {
                "temperature": self.config["parameters"]["temperature"],
                "num_predict": self.config["parameters"]["max_tokens"],
                "top_p": self.config["parameters"]["top_p"]
            }
        }

        for attempt in range(self.config["retry_attempts"]):
            try:
                response = requests.post(
                    url,
                    json=payload,
                    timeout=self.config["timeout"]
                )

                response.raise_for_status()

                result = response.json()
                response_text = result.get("response", "")

                return response_text

            except Exception as e:
                if attempt == self.config["retry_attempts"] - 1:
                    raise LLMProviderError(f"Ollama provider failed after {self.config['retry_attempts']} attempts: {e}")
                time.sleep(2 ** attempt)  # Exponential backoff


class OpenAIProvider(LLMProvider):
    """OpenAI provider implementation"""

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            raise LLMProviderError("OpenAI API key not found in environment variables")
        self.client = openai.Client(api_key=api_key)

    def generate_response(self, prompt: str, model_type: str = "default") -> str:
        """Generate response using OpenAI API"""
        model = self._get_model(model_type)

        for attempt in range(self.config["retry_attempts"]):
            try:
                response = self.client.chat.completions.create(
                    model=model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=self.config["parameters"]["temperature"],
                    max_tokens=self.config["parameters"]["max_tokens"],
                    top_p=self.config["parameters"]["top_p"]
                )

                response_text = response.choices[0].message.content

                return response_text

            except Exception as e:
                if attempt == self.config["retry_attempts"] - 1:
                    raise LLMProviderError(f"OpenAI provider failed after {self.config['retry_attempts']} attempts: {e}")
                time.sleep(2 ** attempt)  # Exponential backoff


class EducationalPromptTemplates:
    """Educational prompt templates for attention mechanism evaluation"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.style = config["educational_settings"]["explanation_style"]
        self.include_comments = config["educational_settings"]["include_code_comments"]
        self.step_by_step = config["educational_settings"]["step_by_step_breakdown"]
    
    def create_code_comparison_prompt(self, student_code: str, reference_code: str, 
                                    function_name: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Create prompt for comparing student code against reference"""
        
        context_info = ""
        if context:
            context_info = f"\nAdditional Context:\n{json.dumps(context, indent=2)}\n"
        
        prompt = f"""
You are an expert educator helping students learn attention mechanisms in deep learning. 
Your role is to provide educational feedback that helps students understand concepts rather than just identifying errors.

TASK: Compare the student's implementation of '{function_name}' against the reference implementation and provide educational feedback.

STUDENT CODE:
```python
{student_code}
```

REFERENCE IMPLEMENTATION:
```python
{reference_code}
```
{context_info}
EVALUATION CRITERIA:
1. Correctness: Does the implementation produce correct results?
2. Understanding: Does the code demonstrate understanding of attention mechanisms?
3. Code Quality: Is the code well-structured and readable?
4. Mathematical Accuracy: Are the mathematical operations correct?

RESPONSE FORMAT:
Please provide your response as a JSON object with the following structure:
{{
    "comparison_result": "correct|partially_correct|incorrect",
    "score": <number 0-100>,
    "educational_feedback": "<detailed explanation focusing on learning>",
    "suggestions": ["<specific improvement suggestion 1>", "<suggestion 2>"],
    "understanding_check": ["<question to verify understanding>"],
    "key_concepts": ["<concept 1>", "<concept 2>"],
    "mathematical_accuracy": "<assessment of mathematical correctness>",
    "common_mistakes": ["<if any common mistakes are present>"]
}}

EDUCATIONAL FOCUS:
- Explain WHY something is correct or incorrect, not just WHAT is wrong
- Connect implementation details to attention mechanism concepts
- Provide learning opportunities rather than just corrections
- Use {self.style} explanations appropriate for intermediate level students
- Help the student understand the mathematical intuition behind the operations
"""
        
        return prompt
    
    def create_concept_explanation_prompt(self, concept: str, level: str) -> str:
        """Create prompt for explaining attention mechanism concepts"""
        
        prompt = f"""
You are an expert educator explaining attention mechanisms to students. Provide a clear, educational explanation of the concept '{concept}' at a {level} level.

REQUIREMENTS:
- Use {self.style} language
- Include mathematical intuition where appropriate
- Provide concrete examples when helpful
- Connect to the broader context of attention mechanisms
- Focus on building understanding step by step

Please explain '{concept}' in a way that helps the student build intuitive understanding of how attention mechanisms work.
"""
        
        return prompt
    
    def create_test_generation_prompt(self, function_name: str, function_signature: str) -> str:
        """Create prompt for generating test cases"""
        
        prompt = f"""
Generate educational test cases for the attention mechanism function '{function_name}'.

FUNCTION SIGNATURE:
{function_signature}

Create test cases that help students understand:
1. Basic functionality
2. Edge cases
3. Expected input/output shapes
4. Mathematical properties (e.g., attention weights summing to 1)

Provide test cases as a JSON array with educational descriptions.
"""
        
        return prompt


class RateLimiter:
    """Simple rate limiter for LLM requests"""
    
    def __init__(self, requests_per_minute: int, burst_limit: int):
        self.requests_per_minute = requests_per_minute
        self.burst_limit = burst_limit
        self.requests = []
    
    def wait_if_needed(self):
        """Wait if rate limit would be exceeded"""
        now = datetime.now()
        
        # Remove old requests
        self.requests = [req_time for req_time in self.requests 
                        if now - req_time < timedelta(minutes=1)]
        
        # Check if we need to wait
        if len(self.requests) >= self.requests_per_minute:
            sleep_time = 60 - (now - self.requests[0]).total_seconds()
            if sleep_time > 0:
                time.sleep(sleep_time)
        
        # Add current request
        self.requests.append(now)


class ResponseCache:
    """Simple file-based response cache"""
    
    def __init__(self, cache_dir: str, ttl_seconds: int):
        self.cache_dir = Path(cache_dir)
        self.ttl_seconds = ttl_seconds
        self.cache_dir.mkdir(parents=True, exist_ok=True)
    
    def get(self, key: str) -> Optional[Dict[str, Any]]:
        """Get cached response if not expired"""
        cache_file = self.cache_dir / f"{key}.json"
        
        if not cache_file.exists():
            return None
        
        try:
            with open(cache_file, 'r') as f:
                cached_data = json.load(f)
            
            # Check if expired
            cache_time = datetime.fromisoformat(cached_data["timestamp"])
            if datetime.now() - cache_time > timedelta(seconds=self.ttl_seconds):
                cache_file.unlink()  # Remove expired cache
                return None
            
            return cached_data["data"]
            
        except (json.JSONDecodeError, KeyError, ValueError):
            # Remove corrupted cache file
            cache_file.unlink()
            return None
    
    def set(self, key: str, data: Dict[str, Any]):
        """Cache response data"""
        cache_file = self.cache_dir / f"{key}.json"
        
        cached_data = {
            "timestamp": datetime.now().isoformat(),
            "data": data
        }
        
        with open(cache_file, 'w') as f:
            json.dump(cached_data, f, indent=2)


# Example usage and testing functions
def test_llm_integration():
    """Test function for LLM integration"""
    print("Testing LLM Integration...")
    
    try:
        evaluator = LLMEvaluator()
        print("[SUCCESS] LLM Evaluator initialized successfully")
        
        # Test concept explanation
        explanation = evaluator.explain_concept("scaled dot-product attention")
        print(f"[SUCCESS] Concept explanation generated: {explanation[:100]}...")
        
        # Test code comparison (with sample code)
        student_code = """
def create_qkv_projections(embeddings, d_model=64):
    Q = torch.nn.Linear(embeddings.shape[-1], d_model)(embeddings)
    K = torch.nn.Linear(embeddings.shape[-1], d_model)(embeddings)
    V = torch.nn.Linear(embeddings.shape[-1], d_model)(embeddings)
    return Q, K, V
"""
        
        reference_code = """
def create_qkv_projections(embeddings, d_model=64):
    W_q = nn.Linear(embeddings.shape[-1], d_model, bias=False)
    W_k = nn.Linear(embeddings.shape[-1], d_model, bias=False)
    W_v = nn.Linear(embeddings.shape[-1], d_model, bias=False)
    Q = W_q(embeddings)
    K = W_k(embeddings)
    V = W_v(embeddings)
    return Q, K, V
"""
        
        result = evaluator.compare_code(student_code, reference_code, "create_qkv_projections")
        print(f"[SUCCESS] Code comparison completed: Score {result.get('score', 'N/A')}")
        
        return True
        
    except Exception as e:
        print(f"[ERROR] LLM Integration test failed: {e}")
        return False


if __name__ == "__main__":
    # Run tests
    test_llm_integration()