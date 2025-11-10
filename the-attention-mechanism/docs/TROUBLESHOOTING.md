# Troubleshooting Guide

## Overview

This comprehensive troubleshooting guide covers common issues encountered when setting up and using the Attention Mechanism Educational Project. Issues are organized by category with step-by-step solutions.

## Installation and Dependency Issues

### Python Version Issues

**Problem: "Python version not supported"**
```
Error: Python 3.7 is not supported. Please use Python 3.8 or higher.
```

**Solution:**
1. Check current version: `python --version`
2. Install Python 3.8+ from [python.org](https://python.org)
3. See [INSTALL.md](INSTALL.md#python-version-compatibility) for supported versions

**Problem: Multiple Python versions detection issues**

**Solution:**
- The setup script accepts Python 3.8-3.12 in auto-detection mode
- Python 3.13+ requires custom path: `./setup_venv.sh /usr/bin/python3.13`
- The script expects full paths to Python executables, not command names from PATH
- Use `./setup_venv.sh --help` for available options
- See [INSTALL.md](INSTALL.md#using-the-setup-script) for detailed usage

### Virtual Environment Issues

**Problem: Virtual environment creation fails**
```
Error: The virtual environment was not created successfully
```

**Solution:**
1. Ensure venv module is installed:
   - Ubuntu/Debian: `sudo apt install python3-venv`
   - Windows: Reinstall Python with "Add to PATH" checked
   - macOS: Usually included with Python

2. Check Python installation: `python -m venv --help`

3. Alternative: Use virtualenv instead of venv:
   ```bash
   pip install virtualenv
   virtualenv venv
   ```

**Problem: Activation script not found**
```
bash: venv/Scripts/activate: No such file or directory
```

**Solution:**
```bash
# Check correct activation path
ls venv/

# Windows Git Bash/Command Prompt
source venv/Scripts/activate

# Linux/macOS
source venv/bin/activate

# Windows PowerShell
venv\Scripts\Activate.ps1
```

### Setup Script Failures

**Problem: Setup script exits early with pip upgrade failures**

The setup script previously failed completely if pip upgrade failed (common on Windows due to permission issues).

**Solution:**
The setup script now handles this gracefully:
1. **Pip upgrade failures are non-fatal**: The script continues even if `pip install --upgrade pip` fails
2. **Removed strict error handling**: The script no longer uses `set -e` which caused early exits
3. **Better error messages**: The script now explains that pip upgrade failures are okay on Windows

If you encounter this with an older script:
```bash
# Manual approach
source venv/Scripts/activate  # or venv/bin/activate on Linux/macOS
python -m pip install --upgrade pip || echo "Pip upgrade failed - continuing anyway"
pip install -r requirements.txt
```

**Problem: Permission denied during setup**

**Solution:**
1. **Never use sudo with virtual environments**
2. On Windows, try running Git Bash as administrator
3. Check antivirus isn't blocking the script
4. Ensure the project directory has write permissions

### Package Installation Issues

**Problem: PyTorch installation fails**
```
ERROR: Could not install packages due to an EnvironmentError
```

**Solution:**
1. Upgrade pip first: `python -m pip install --upgrade pip`
2. CPU-only PyTorch: `pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu`
3. CUDA support: `pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118`
4. Python 3.13+ requires PyTorch 2.6.0+: `pip install torch>=2.6.0`

**Problem: Jupyter installation issues**
```
Error: jupyter command not found
```

**Solution:**
1. Ensure virtual environment is activated
2. Reinstall Jupyter:
   ```bash
   pip install --upgrade jupyter jupyterlab notebook
   ```
3. Check installation:
   ```bash
   jupyter --version
   jupyter notebook --help
   ```

**Problem: Requirements.txt version conflicts**

**Solution:**
- The requirements.txt uses version ranges for automatic compatibility
- If conflicts occur, check available versions: `pip index versions torch`
- Clear pip cache if needed: `pip cache purge`
- See [INSTALL.md](INSTALL.md#python-version-compatibility) for version matrix

### Permission and Access Issues

**Problem: Permission denied during installation**
```
ERROR: Could not install packages due to an EnvironmentError: [Errno 13] Permission denied
```

**Solution:**
1. **Never use sudo with virtual environments**
2. Check virtual environment is activated:
   ```bash
   which python  # Should show venv path
   ```
3. Fix virtual environment permissions:
   ```bash
   # Linux/macOS
   chmod -R u+w venv/
   
   # Windows - Run as administrator if needed
   ```

**Problem: Antivirus blocking installation**

**Solution:**
1. Add project directory to antivirus exclusions
2. Temporarily disable real-time protection during installation
3. Use alternative package mirrors:
   ```bash
   pip install -i https://pypi.org/simple/ -r requirements.txt
   ```

## Jupyter Notebook Issues

### Notebook Launch Problems

**Problem: Jupyter server won't start**
```
OSError: [Errno 48] Address already in use
```

**Solution:**
1. Check for existing Jupyter instances:
   ```bash
   jupyter notebook list
   ```
2. Kill existing processes:
   ```bash
   # Find process
   lsof -i :8888  # Linux/macOS
   netstat -ano | findstr :8888  # Windows
   
   # Kill process
   kill <PID>  # Linux/macOS
   taskkill /PID <PID> /F  # Windows
   ```
3. Start on different port:
   ```bash
   jupyter notebook --port=8889
   ```

**Problem: Notebook opens but shows wrong directory**

**Solution:**
1. Launch from correct directory:
   ```bash
   cd /path/to/attention-mechanism-project
   source venv/Scripts/activate
   jupyter notebook
   ```
2. Or specify notebook file directly:
   ```bash
   jupyter notebook lesson.ipynb
   ```

### Kernel and Execution Issues

**Problem: "Kernel not found" or "No module named 'torch'"**

**Solution:**
1. Ensure virtual environment is activated before starting Jupyter
2. Install ipykernel in virtual environment:
   ```bash
   source venv/Scripts/activate
   pip install ipykernel
   python -m ipykernel install --user --name=attention_env
   ```
3. Select correct kernel in Jupyter:
   - Kernel menu → Change kernel → attention_env

**Problem: Cell execution hangs or fails**

**Solution:**
1. Restart kernel: Kernel menu → Restart Kernel
2. Check for infinite loops in code
3. Verify imports are working:
   ```python
   import torch
   import numpy as np
   import matplotlib.pyplot as plt
   print("Imports successful")
   ```

**Problem: Visualization not displaying**

**Solution:**
1. Enable inline plotting:
   ```python
   %matplotlib inline
   ```
2. For interactive plots:
   ```python
   %matplotlib widget
   ```
3. Check matplotlib backend:
   ```python
   import matplotlib
   print(matplotlib.get_backend())
   ```

## Evaluation Context Isolation Issues

### NameError Problems During Evaluation

**Problem: NameError when running LLM evaluation**
```
NameError: name 'Q' is not defined
NameError: name 'attention_weights' is not defined
```

**Cause:** The evaluation system runs in an isolated context and doesn't automatically include variables from the notebook.

**Solution:**
1. **Run all notebook cells sequentially first**: Ensure all implementation cells have been executed before evaluation
2. **Save notebook state**: Use Ctrl+S to save before running evaluation
3. **The evaluation system now properly includes notebook context**: Recent updates ensure that evaluation functions can access notebook variables

**Temporary workaround if evaluation still fails:**
```python
# In a new cell after your implementation:
from src.evaluation import validate_tensor_output

# Manually validate your implementation
# Note: The function takes 3 parameters: output tensor, function name, and input tensors dict
try:
    validate_tensor_output(output, "attention", {"Q": Q, "K": K, "V": V, "attention_weights": attention_weights})
    print("✓ Implementation validates successfully")
except Exception as e:
    print(f"Validation failed: {e}")
```

**Advanced debugging for evaluation context:**
```python
# Check what variables are available in current namespace
print("Available variables:", [var for var in globals() if not var.startswith('_')])

# Verify tensor shapes before evaluation
print(f"Q shape: {Q.shape if 'Q' in globals() else 'Not defined'}")
print(f"K shape: {K.shape if 'K' in globals() else 'Not defined'}")
print(f"V shape: {V.shape if 'V' in globals() else 'Not defined'}")
```

### Evaluation System Improvements

**Recent fixes implemented:**
1. **Context preservation**: Evaluation functions now properly access notebook variables
2. **Better error handling**: More descriptive error messages when variables are missing
3. **Fallback mechanisms**: Alternative evaluation approaches when direct context access fails

## Unicode/Emoji Display Issues

### Windows Terminal Emoji Problems

**Problem: Emojis display as boxes or question marks in Windows terminals**
```
? Setup completed successfully  # Should show checkmark emoji
? Error occurred               # Should show X emoji
```

**Solution:**
The system now detects terminal capabilities and provides fallbacks:

1. **Modern Windows Terminal**: Install Windows Terminal from Microsoft Store for full emoji support
2. **Git Bash/MSYS2**: Limited emoji support, ASCII fallbacks are provided
3. **Command Prompt**: No emoji support, ASCII alternatives used automatically

**Manual emoji fix for Git Bash:**
```bash
# Add to ~/.bashrc for better UTF-8 support
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
```

**Terminal detection and fallbacks:**
The system now automatically:
- Detects terminal capabilities
- Uses ASCII alternatives (✓ → √, ✗ → X) when needed
- Provides clear visual feedback regardless of terminal type

## LLM Integration Issues

For comprehensive LLM configuration and troubleshooting, see [CONFIGURATION.md](CONFIGURATION.md).

### Quick Troubleshooting

**Ollama Connection Issues:**
- Check if running: `curl http://localhost:11434/api/tags`
- Start service: `ollama serve`
- Download models: `ollama pull llama3.1:8b`

**OpenAI API Issues:**
- Verify API key: `echo $OPENAI_API_KEY`
- Check rate limits in `.llm_config.json`

**General LLM Issues:**
- Test integration: `from src.llm_integration import LLMEvaluator`
- Check logs: `tail -n 50 progress/llm_interactions.log`

For detailed LLM setup and configuration, see [CONFIGURATION.md](CONFIGURATION.md#troubleshooting-configuration).

## Visualization and Display Issues

### Matplotlib Problems

**Problem: Plots not displaying in notebook**

**Solution:**
1. Set matplotlib backend:
   ```python
   %matplotlib inline
   import matplotlib.pyplot as plt
   ```
2. For interactive plots:
   ```python
   %matplotlib widget
   pip install ipympl  # If not installed
   ```
3. Restart kernel after backend changes

**Problem: "Qt platform plugin could not be initialized"**

**Solution:**
1. Install GUI backend:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install python3-tk
   
   # macOS
   # Usually works out of box
   
   # Windows
   pip install PyQt5
   ```
2. Use non-interactive backend:
   ```python
   import matplotlib
   matplotlib.use('Agg')
   import matplotlib.pyplot as plt
   ```

### Attention Visualization Issues

**Problem: Attention heatmaps not rendering correctly**

**Solution:**
1. Check tensor shapes:
   ```python
   print(f"Attention weights shape: {attention_weights.shape}")
   print(f"Expected: [1, 6, 6] for 'The cat sat on the mat'")
   ```
2. Verify visualization functions are imported:
   ```python
   from src.visualizations import visualize_attention_weights
   ```
3. Check for NaN or infinite values:
   ```python
   import torch
   print(f"Has NaN: {torch.isnan(attention_weights).any()}")
   print(f"Has Inf: {torch.isinf(attention_weights).any()}")
   ```

## Performance and Memory Issues

### Memory Issues

**Problem: "Out of memory" errors during transformer loading**

**Solution:**
1. Check available RAM:
   ```bash
   # Linux
   free -h
   
   # macOS
   vm_stat
   
   # Windows
   wmic OS get TotalVisibleMemorySize,FreePhysicalMemory /value
   ```
2. Use smaller models:
   ```python
   # In model_utils.py
   model = load_mini_transformer(model_name='distilgpt2')  # 66M params
   # Instead of larger models
   ```
3. Clear cache periodically:
   ```python
   import torch
   torch.cuda.empty_cache()  # If using GPU
   ```

**Problem: Slow notebook execution**

**Solution:**
1. Check CPU usage during execution
2. Reduce batch sizes in examples:
   ```python
   # Use smaller examples for learning
   text = "The cat sat"  # Instead of longer sequences
   ```
3. Enable tensor optimizations:
   ```python
   import torch
   torch.set_num_threads(4)  # Adjust based on CPU cores
   ```

### Storage Issues

**Problem: Insufficient disk space**

**Solution:**
1. Check space usage:
   ```bash
   du -sh cache/  # Check model cache size
   du -sh venv/   # Check virtual environment size
   ```
2. Clean up cached models:
   ```bash
   rm -rf cache/models/*  # Will re-download when needed
   ```
3. Use symbolic links for models (advanced):
   ```bash
   ln -s /external/drive/models cache/models
   ```

## Platform-Specific Issues

### Windows-Specific Problems

**Problem: "Scripts execution is disabled on this system"**

**Solution:**
1. Open PowerShell as Administrator
2. Run:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Or use Git Bash instead of PowerShell

**Problem: Long path names causing errors**

**Solution:**
1. Enable long path support in Windows 10+:
   - Group Policy: Computer Configuration → Administrative Templates → System → Filesystem → Enable Win32 long paths
2. Or move project to shorter path like `C:\attention\`

**Problem: Antivirus interfering with Python**

**Solution:**
1. Add Python installation directory to exclusions
2. Add project directory to exclusions
3. Add virtual environment to exclusions

### macOS-Specific Problems

**Problem: "Command Line Tools not installed"**

**Solution:**
```bash
xcode-select --install
```

**Problem: M1/M2 architecture issues**

**Solution:**
1. Use native packages when available:
   ```bash
   pip install --upgrade pip
   pip install torch  # Should get Apple Silicon version
   ```
2. All project dependencies support Apple Silicon

### Linux-Specific Problems

**Problem: Missing system packages**

**Solution:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3-dev python3-venv python3-pip build-essential

# CentOS/RHEL/Fedora
sudo dnf install python3-devel python3-pip gcc gcc-c++
```

**Problem: Permission issues with pip**

**Solution:**
```bash
# Never use sudo with pip in virtual environments
# If global packages needed:
python3 -m pip install --user package_name
```

## Validation and Testing Issues

### Test Failures

**Problem: Integration tests failing**

**Solution:**
1. Run tests individually to isolate issues:
   ```bash
   python test_epic3_integration.py
   python test_epic4_integration.py
   python test_epic5_integration.py
   ```
2. Check test output for specific failures
3. Verify all dependencies are installed:
   ```bash
   pip list | grep torch
   pip list | grep transformers
   ```

**Problem: Notebook validation errors**

**Solution:**
1. Check notebook file integrity:
   ```python
   import json
   with open('lesson.ipynb') as f:
       notebook = json.load(f)
   print("Notebook loads successfully")
   ```
2. Reset kernel and clear all outputs:
   - Kernel menu → Restart & Clear Output
3. Run cells sequentially to identify issues

## Getting Additional Help

### Diagnostic Information

When reporting issues, collect this information:

1. **System Information**:
   ```bash
   python --version
   pip --version
   jupyter --version
   ```

2. **Environment Check**:
   ```bash
   which python
   echo $PATH
   pip list
   ```

3. **Project Status**:
   ```bash
   ls -la  # Check file structure
   cat .llm_config.json | head -10  # Check configuration
   ```

### Log Files

Check these log files for detailed error information:
- `progress/llm_interactions.log` - LLM integration logs (created on first LLM use, not pre-existing)
- Jupyter terminal output - Notebook server logs
- Virtual environment activation logs

### Support Resources

1. **Technical Issues**: This troubleshooting guide
2. **Installation Problems**: See `INSTALL.md`
3. **Configuration Issues**: See `CONFIGURATION.md`
4. **Educational Usage**: See `EDUCATOR_GUIDE.md`
5. **System Requirements**: See `TECHNICAL_SPECS.md`

### Common Solution Patterns

Many issues can be resolved by:
1. Deactivating and reactivating virtual environment
2. Restarting Jupyter kernel
3. Clearing browser cache for Jupyter
4. Checking file permissions
5. Verifying all dependencies are installed
6. Ensuring configuration files are valid JSON
7. Using the setup script's new command-line options for Python version specification
8. Checking that evaluation context is properly preserved

### Recent Improvements Summary

**Setup Script Enhancements:**
- Command-line Python version specification: `./setup_venv.sh /path/to/python` (requires full path to executable)
- Help flag support: `./setup_venv.sh --help`
- Python 3.8-3.12 auto-detection, 3.13+ supported with custom paths
- Graceful handling of pip upgrade failures
- Removed strict error handling that caused early exits

**Requirements Management:**
- Version ranges instead of exact versions for better compatibility
- Automatic version selection for different Python versions
- Enhanced compatibility across Python 3.8-3.13

**Evaluation System:**
- Proper inclusion of notebook context in evaluations
- Better error handling for missing variables
- Fallback mechanisms for evaluation failures
- Note: validate_tensor_output function signature: (output, function_name, input_tensors_dict)

**Terminal Compatibility:**
- Automatic detection of terminal emoji capabilities
- ASCII fallbacks for limited terminals
- Better Windows terminal support

Remember: Most issues are environment-related and can be solved by careful attention to virtual environment activation, dependency installation, and using the enhanced setup script features.