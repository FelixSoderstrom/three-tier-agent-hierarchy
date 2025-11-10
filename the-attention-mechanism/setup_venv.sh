#!/bin/bash

# Cross-platform Virtual Environment Setup Script for Attention Mechanism Project
# Compatible with Windows (Git Bash/MSYS2), Linux, and macOS
#
# Usage: 
#   ./setup_venv.sh                    # Auto-detect Python
#   ./setup_venv.sh /path/to/python    # Use specific Python interpreter

# Check for command-line arguments
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    echo "Usage: $0 [PYTHON_PATH]"
    echo ""
    echo "Setup virtual environment for the Attention Mechanism project."
    echo ""
    echo "Options:"
    echo "  PYTHON_PATH    Path to specific Python interpreter (optional)"
    echo "  -h, --help     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                              # Auto-detect Python"
    echo "  $0 /usr/bin/python3.10          # Use specific Python on Linux/Mac"
    echo "  $0 C:/Python310/python.exe      # Use specific Python on Windows"
    echo "  $0 python                       # Use Python from PATH"
    echo ""
    exit 0
fi

if [ $# -eq 1 ]; then
    CUSTOM_PYTHON_PATH="$1"
    echo "Using custom Python path: $CUSTOM_PYTHON_PATH"
fi

echo "=== Attention Mechanism Project Environment Setup ==="
echo "Setting up virtual environment and dependencies..."

# Detect operating system
detect_os() {
    case "$(uname -s)" in
        Linux*)     OS=Linux;;
        Darwin*)    OS=Mac;;
        CYGWIN*)    OS=Windows;;
        MINGW*)     OS=Windows;;
        MSYS*)      OS=Windows;;
        *)          OS="Unknown";;
    esac
    echo "Detected OS: $OS"
}

# Validate Python installation with improved version detection
validate_python() {
    echo "Validating Python installation..."
    
    PYTHON_CMD=""
    
    # If custom Python path was provided, try it first
    if [ -n "$CUSTOM_PYTHON_PATH" ]; then
        if [ -f "$CUSTOM_PYTHON_PATH" ] && [ -x "$CUSTOM_PYTHON_PATH" ]; then
            VERSION=$("$CUSTOM_PYTHON_PATH" -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")' 2>/dev/null)
            
            if [ -n "$VERSION" ]; then
                MAJOR=$(echo $VERSION | cut -d. -f1)
                MINOR=$(echo $VERSION | cut -d. -f2)
                
                echo "Custom Python version: $VERSION"
                
                # Accept any Python 3.8+ for custom path (more lenient)
                if [ "$MAJOR" -eq 3 ] && [ "$MINOR" -ge 8 ]; then
                    PYTHON_CMD="$CUSTOM_PYTHON_PATH"
                    echo "✓ Using custom Python: $CUSTOM_PYTHON_PATH (version $VERSION)"
                    return 0
                else
                    echo "ERROR: Custom Python version $VERSION is not compatible (requires Python 3.8+)"
                    exit 1
                fi
            else
                echo "ERROR: Failed to get version from custom Python path: $CUSTOM_PYTHON_PATH"
                exit 1
            fi
        else
            echo "ERROR: Custom Python path not found or not executable: $CUSTOM_PYTHON_PATH"
            exit 1
        fi
    fi
    
    # Auto-detection: Try Python versions in priority order
    for cmd in python3.10 python3.11 python3.12 python3.9 python3.8 python3 python; do
        if command -v $cmd &> /dev/null; then
            # Try to get version, but check if command actually works
            VERSION=$($cmd -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")' 2>/dev/null)
            
            # Skip if command failed (e.g., Windows Store alias)
            if [ -z "$VERSION" ]; then
                continue
            fi
            
            MAJOR=$(echo $VERSION | cut -d. -f1)
            MINOR=$(echo $VERSION | cut -d. -f2)
            
            # Check if version meets requirements (3.8-3.12)
            if [ "$MAJOR" -eq 3 ] && [ "$MINOR" -ge 8 ] && [ "$MINOR" -le 12 ]; then
                PYTHON_CMD=$cmd
                echo "Found compatible Python: $cmd (version $VERSION)"
                break
            else
                echo "Found Python $cmd (version $VERSION) - not compatible (need 3.8-3.12)"
            fi
        fi
    done
    
    if [ -z "$PYTHON_CMD" ]; then
        echo "ERROR: No compatible Python version found (requires 3.8-3.12)"
        echo ""
        echo "Checking all Python installations:"
        for cmd in python python3 python3.13 python3.12 python3.11 python3.10 python3.9 python3.8; do
            if command -v $cmd &> /dev/null; then
                VERSION=$($cmd --version 2>&1)
                if [ $? -eq 0 ]; then
                    echo "  $cmd: $VERSION"
                fi
            fi
        done
        echo ""
        echo "To fix this issue:"
        echo "1. Install Python 3.10 (recommended) from https://www.python.org/downloads/"
        echo "2. Or manually specify a Python path by editing this script"
        echo "3. On Windows, check if Python is in your PATH environment variable"
        exit 1
    fi
    
    echo "✓ Python version is compatible"
}

# Create virtual environment
create_venv() {
    echo "Creating virtual environment..."
    
    if [ -d "venv" ]; then
        echo "Virtual environment already exists. Removing old environment..."
        rm -rf venv
    fi
    
    $PYTHON_CMD -m venv venv
    echo "✓ Virtual environment created"
}

# Activate virtual environment (cross-platform)
activate_venv() {
    echo "Activating virtual environment..."
    
    if [ "$OS" = "Windows" ]; then
        source venv/Scripts/activate
    else
        source venv/bin/activate
    fi
    
    echo "✓ Virtual environment activated"
}

# Install dependencies
install_dependencies() {
    echo "Installing dependencies from requirements.txt..."
    
    if [ ! -f "requirements.txt" ]; then
        echo "ERROR: requirements.txt not found"
        exit 1
    fi
    
    # Try to upgrade pip but don't fail if it doesn't work (Windows permissions issue)
    echo "Attempting to upgrade pip..."
    python -m pip install --upgrade pip || echo "Note: pip upgrade failed (this is okay on Windows)"
    
    echo "Installing project dependencies..."
    pip install -r requirements.txt
    
    if [ $? -eq 0 ]; then
        echo "✓ Dependencies installed successfully"
    else
        echo "ERROR: Failed to install dependencies"
        echo "Try running manually: pip install -r requirements.txt"
        exit 1
    fi
}

# Validate installation
validate_installation() {
    echo "Validating installation..."
    
    # Test critical imports
    python -c "
import sys
import jupyter
import numpy
import matplotlib
import torch
import json
import pathlib
import requests
print('✓ All critical packages imported successfully')
print(f'Python version: {sys.version}')
print(f'Jupyter version: {jupyter.__version__}')
print(f'NumPy version: {numpy.__version__}')
print(f'PyTorch version: {torch.__version__}')
"
    
    echo "✓ Installation validation completed"
}

# Create directory structure
create_directories() {
    echo "Creating project directory structure..."
    
    mkdir -p src
    mkdir -p progress  
    mkdir -p grade
    
    # Create module stubs
    touch src/__init__.py
    echo "# Attention mechanism implementation modules" > src/__init__.py
    
    echo "✓ Directory structure created"
}

# Main execution
main() {
    detect_os
    validate_python
    
    # Don't use strict error handling as it causes issues with pip on Windows
    # set -e
    
    create_venv
    activate_venv
    install_dependencies
    validate_installation
    create_directories
    
    echo ""
    echo "=== Setup Complete ==="
    echo "Virtual environment created and all dependencies installed successfully!"
    echo ""
    echo "To activate the environment in future sessions:"
    if [ "$OS" = "Windows" ]; then
        echo "  source venv/Scripts/activate"
    else
        echo "  source venv/bin/activate"
    fi
    echo ""
    echo "To start Jupyter notebook:"
    echo "  jupyter notebook"
    echo ""
}

# Run main function
main