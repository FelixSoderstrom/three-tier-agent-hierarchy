# Installation and Setup Guide

## Overview

This guide provides comprehensive instructions for setting up the Attention Mechanism Educational Project on your system. The project includes interactive Jupyter notebooks, PyTorch implementations, visualization tools, and LLM integration for educational purposes.

## System Requirements

For detailed hardware and software requirements, see [TECHNICAL_SPECS.md](TECHNICAL_SPECS.md).

**Quick Requirements:**
- **Python**: 3.8-3.12 (auto-detection) or 3.13+ with explicit path
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 5GB free space recommended
- **OS**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)

## Quick Start (Automated Setup)

The project includes an automated setup script that handles most installation steps:

### Using the Setup Script

**Auto-detection (works for Python 3.8-3.12):**
```bash
./setup_venv.sh
```

**For Python 3.13+ or specific Python version (requires full path):**
```bash
# Linux/macOS
./setup_venv.sh /usr/bin/python3.13
./setup_venv.sh /usr/local/bin/python3.10

# Windows
./setup_venv.sh C:/Python313/python.exe
./setup_venv.sh C:/Python310/python.exe
```

**Get help:**
```bash
./setup_venv.sh --help
```

The setup script will:
1. Validate Python version (3.8+ required)
2. Create virtual environment in `./venv/`
3. Install all dependencies from `requirements.txt`
4. Create necessary directory structure
5. Validate installation

**Note:** The script accepts both full paths to Python executables and command names from PATH when using custom Python specification.

## Manual Installation Steps

If you prefer manual setup or the automated script encounters issues:

### 1. Python Installation Verification

Check your Python version:
```bash
python --version
# Should show Python 3.8+ (3.13.1 recommended)
```

If Python is not installed or version is too old:
- **Windows**: Download from [python.org](https://python.org)
- **macOS**: Use `brew install python` or download from python.org
- **Linux**: Use your package manager (e.g., `sudo apt install python3.13`)

### 2. Virtual Environment Setup

Create and activate virtual environment:

**Windows (Command Prompt/PowerShell):**
```cmd
python -m venv venv
venv\Scripts\activate
```

**Windows (Git Bash):**
```bash
python -m venv venv
source venv/Scripts/activate
```

**Linux/macOS:**
```bash
python -m venv venv
source venv/bin/activate
```

### 3. Dependency Installation

With virtual environment activated, install all dependencies:
```bash
pip install -r requirements.txt
```

**Key packages installed (subset of 25+ total packages):**
- **Jupyter Environment**: `jupyter`, `jupyterlab`, `notebook`, `ipykernel`, `ipywidgets`
- **Machine Learning**: `torch`, `transformers`, `numpy`, `pandas`, `scipy`
- **Visualization**: `matplotlib`, `seaborn`, `plotly`, `pillow`
- **LLM Integration**: `openai`, `requests`, `httpx`, `python-dotenv`
- **Educational Tools**: `tqdm`, `rich`, `colorama`, `alive-progress`
- **Development Tools**: `pytest`, `black`, `flake8`, `typer`

### 4. Directory Structure

The setup script automatically creates necessary directories. For full project structure details, see [TECHNICAL_SPECS.md](TECHNICAL_SPECS.md#project-structure).

### 5. Installation Validation

Verify your installation:

**Check Python packages:**
```python
python -c "import torch, numpy, matplotlib, jupyter; print('All packages imported successfully')"
```

**Check Jupyter:**
```bash
jupyter --version
```

**Test notebook launch:**
```bash
jupyter notebook
# Should open browser to http://localhost:8888
```

## Python Version Compatibility

### Supported Python Versions

| Python Version | PyTorch Version | NumPy Version   | Status          | Notes |
|----------------|-----------------|-----------------|-----------------|--------|
| 3.8            | 2.0.0+          | 1.21.0 - 1.24.4 | Fully Supported | Auto-detection works |
| 3.9            | 2.0.0+          | 1.21.0 - 1.26.4 | Fully Supported | Auto-detection works |
| 3.10           | 2.0.0+          | 1.21.0 - 1.26.4 | Fully Supported | Auto-detection works |
| 3.11           | 2.1.0+          | 1.23.0 - 1.26.4 | Fully Supported | Auto-detection works |
| 3.12           | 2.2.0+          | 1.26.0 - 1.26.4 | Fully Supported | Auto-detection works |
| 3.13           | 2.5.0+          | 1.26.0+         | Fully Supported | Requires explicit path in setup script |

**Important Notes:**
- Python 3.8-3.12 work with auto-detection in setup script
- Python 3.13+ requires explicit path: `./setup_venv.sh /usr/bin/python3.13`
- The requirements.txt uses flexible version ranges for compatibility
- NumPy < 2.0.0 constraint due to breaking API changes in NumPy 2.0

## Platform-Specific Instructions

### Windows Specific

**Using Git Bash (Recommended):**
Git Bash provides a Unix-like environment that works well with the project scripts.

1. Install Git for Windows (includes Git Bash)
2. Open Git Bash in project directory
3. Run setup script: `bash setup_venv.sh`

**Using Command Prompt/PowerShell:**
```cmd
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**Common Windows Issues:**
- **Script execution blocked**: Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` in PowerShell
- **Long path issues**: Enable long path support in Windows settings
- **antivirus interference**: Add project folder to antivirus exclusions

### macOS Specific

**Using Homebrew (Recommended):**
```bash
# Install Python if needed
brew install python@3.13

# Clone and setup project
cd project-directory
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Common macOS Issues:**
- **Xcode Command Line Tools**: Install with `xcode-select --install`
- **M1/M2 Macs**: All dependencies are compatible with Apple Silicon
- **Permission issues**: Use `sudo` only for system-wide installations

### Linux Specific

**Ubuntu/Debian:**
```bash
# Install Python and pip
sudo apt update
sudo apt install python3.13 python3.13-dev python3-pip
# Note: python3.13 may require adding a PPA on older Ubuntu versions

# Setup project
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**CentOS/RHEL/Fedora:**
```bash
# Install Python (Fedora/recent versions)
sudo dnf install python3.13 python3-pip python3-devel

# For older RHEL/CentOS versions, use yum:
# sudo yum install python3 python3-pip python3-devel

# Setup project (same as Ubuntu)
```

## LLM Integration Setup

For LLM configuration (Ollama and OpenAI setup), see [CONFIGURATION.md](CONFIGURATION.md).

## Verification and Testing

### 1. Basic Environment Test
```bash
source venv/Scripts/activate  # Windows Git Bash
# or source venv/bin/activate  # Linux/macOS

python -c "
import sys
print(f'Python version: {sys.version}')
import torch, numpy, matplotlib, jupyter
print('✓ All core packages available')
print('✓ Installation successful')
"
```

### 2. Jupyter Notebook Test
```bash
jupyter notebook
# Should open browser and show project files
```

### 3. Evaluation System Test
The project uses an integrated evaluation system:
```bash
# Test the evaluation system
python -c "from src.evaluation import LLMEvaluator; print('Evaluation system available')"

# The evaluation system is integrated into the lesson.ipynb notebook
# and provides automated feedback on attention mechanism implementations
```

## Next Steps

After successful installation:

1. **Start with Documentation**: Read `README.md` for project overview
2. **Configure LLM**: Follow `CONFIGURATION.md` for LLM setup
3. **Launch Learning Environment**: Open `index.html` in browser
4. **Begin Lesson**: Start with `lesson.ipynb` for interactive learning

## Troubleshooting Quick Reference

**Installation fails:**
- Check Python version: `python --version`
- Check internet connection for package downloads
- Try `pip install --upgrade pip` before dependency installation

**Virtual environment issues:**
- Delete `venv/` folder and recreate
- Check Python virtual environment module: `python -m venv --help`

**Package conflicts:**
- Use fresh virtual environment
- Check `requirements.txt` for pinned versions

**Permission errors:**
- Don't use `sudo` with virtual environment
- Check file/directory permissions

For detailed troubleshooting, see `TROUBLESHOOTING.md`.

## Support

- **Technical Issues**: See `TROUBLESHOOTING.md`
- **Configuration**: See `CONFIGURATION.md`
- **Teaching Usage**: See `EDUCATOR_GUIDE.md`
- **System Requirements**: See `TECHNICAL_SPECS.md`