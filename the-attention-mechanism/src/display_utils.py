"""
Display utilities for handling Unicode/emoji output with cross-platform compatibility.

This module provides functions to detect terminal capabilities and provide
appropriate symbols (Unicode or ASCII) based on the environment.
"""

import sys
import os
import locale


def supports_unicode():
    """
    Detect if the current terminal supports Unicode/emoji display.
    
    Returns:
        bool: True if Unicode is supported, False otherwise
    """
    # Check if running in Jupyter notebook (always supports Unicode)
    try:
        get_ipython().__class__.__name__
        return True
    except (NameError, AttributeError):
        pass
    
    # Windows console often has issues with Unicode
    if sys.platform == 'win32':
        # Check if running in Windows Terminal, Git Bash, or other Unicode-capable terminals
        term = os.environ.get('TERM', '')
        term_program = os.environ.get('TERM_PROGRAM', '')
        wt_session = os.environ.get('WT_SESSION', '')
        
        # These terminals generally support Unicode well
        if any([
            'xterm' in term.lower(),
            'mintty' in term.lower(),
            wt_session,  # Windows Terminal
            term_program == 'vscode',  # VS Code terminal
        ]):
            return True
        
        # Check locale encoding
        try:
            encoding = locale.getpreferredencoding()
            if 'utf' in encoding.lower():
                return True
        except:
            pass
        
        # Default to ASCII for Windows console
        return False
    
    # Most Unix terminals support Unicode
    return True


class DisplaySymbols:
    """Provides appropriate symbols based on terminal capabilities."""
    
    def __init__(self, force_unicode=None):
        """
        Initialize display symbols.
        
        Args:
            force_unicode: If True, always use Unicode. If False, always use ASCII.
                          If None (default), auto-detect.
        """
        if force_unicode is None:
            self.use_unicode = supports_unicode()
        else:
            self.use_unicode = force_unicode
        
        # Define symbol mappings
        self._symbols = {
            'success': {'unicode': '✅', 'ascii': '[OK]'},
            'failure': {'unicode': '❌', 'ascii': '[FAIL]'},
            'warning': {'unicode': '⚠️', 'ascii': '[WARN]'},
            'info': {'unicode': 'ℹ️', 'ascii': '[INFO]'},
            'folder': {'unicode': '📁', 'ascii': '[DIR]'},
            'check': {'unicode': '✓', 'ascii': '[✓]'},
            'cross': {'unicode': '✗', 'ascii': '[X]'},
            'arrow': {'unicode': '→', 'ascii': '->'},
            'bullet': {'unicode': '•', 'ascii': '*'},
            'star': {'unicode': '⭐', 'ascii': '[*]'},
        }
    
    def get(self, symbol_type):
        """
        Get appropriate symbol for the given type.
        
        Args:
            symbol_type: Type of symbol (e.g., 'success', 'failure', 'warning')
        
        Returns:
            str: Unicode or ASCII symbol based on terminal capabilities
        """
        mode = 'unicode' if self.use_unicode else 'ascii'
        return self._symbols.get(symbol_type, {}).get(mode, f'[{symbol_type.upper()}]')
    
    # Convenience properties
    @property
    def success(self):
        return self.get('success')
    
    @property
    def failure(self):
        return self.get('failure')
    
    @property
    def warning(self):
        return self.get('warning')
    
    @property
    def info(self):
        return self.get('info')
    
    @property
    def folder(self):
        return self.get('folder')
    
    @property
    def check(self):
        return self.get('check')
    
    @property
    def cross(self):
        return self.get('cross')
    
    @property
    def arrow(self):
        return self.get('arrow')
    
    @property
    def bullet(self):
        return self.get('bullet')
    
    @property
    def star(self):
        return self.get('star')


# Global instance for convenience
symbols = DisplaySymbols()


def format_message(message, symbol_type=None):
    """
    Format a message with an appropriate symbol prefix.
    
    Args:
        message: The message to format
        symbol_type: Type of symbol to prefix (e.g., 'success', 'failure')
    
    Returns:
        str: Formatted message with symbol
    """
    if symbol_type:
        symbol = symbols.get(symbol_type)
        return f"{symbol} {message}"
    return message


def print_status(message, status='info'):
    """
    Print a status message with appropriate symbol.
    
    Args:
        message: Message to print
        status: Status type ('success', 'failure', 'warning', 'info')
    """
    print(format_message(message, status))


# Environment detection functions for debugging
def get_terminal_info():
    """Get information about the current terminal environment."""
    info = {
        'platform': sys.platform,
        'encoding': sys.stdout.encoding,
        'locale': locale.getpreferredencoding(),
        'term': os.environ.get('TERM', 'unknown'),
        'term_program': os.environ.get('TERM_PROGRAM', 'unknown'),
        'wt_session': bool(os.environ.get('WT_SESSION')),
        'colorterm': os.environ.get('COLORTERM', 'unknown'),
        'supports_unicode': supports_unicode(),
    }
    
    # Check if running in Jupyter
    try:
        get_ipython().__class__.__name__
        info['jupyter'] = True
    except (NameError, AttributeError):
        info['jupyter'] = False
    
    return info


def test_display():
    """Test function to show all symbols in current environment."""
    print("Terminal Information:")
    info = get_terminal_info()
    for key, value in info.items():
        print(f"  {key}: {value}")
    
    print("\nSymbol Display Test:")
    print("-" * 40)
    
    # Test with auto-detection
    auto_symbols = DisplaySymbols()
    print(f"Auto-detected mode: {'Unicode' if auto_symbols.use_unicode else 'ASCII'}")
    print(f"  Success: {auto_symbols.success}")
    print(f"  Failure: {auto_symbols.failure}")
    print(f"  Warning: {auto_symbols.warning}")
    print(f"  Info: {auto_symbols.info}")
    print(f"  Folder: {auto_symbols.folder}")
    
    print("\nForced ASCII mode:")
    ascii_symbols = DisplaySymbols(force_unicode=False)
    print(f"  Success: {ascii_symbols.success}")
    print(f"  Failure: {ascii_symbols.failure}")
    print(f"  Warning: {ascii_symbols.warning}")
    print(f"  Info: {ascii_symbols.info}")
    print(f"  Folder: {ascii_symbols.folder}")
    
    if auto_symbols.use_unicode:
        print("\nForced Unicode mode:")
        unicode_symbols = DisplaySymbols(force_unicode=True)
        print(f"  Success: {unicode_symbols.success}")
        print(f"  Failure: {unicode_symbols.failure}")
        print(f"  Warning: {unicode_symbols.warning}")
        print(f"  Info: {unicode_symbols.info}")
        print(f"  Folder: {unicode_symbols.folder}")


if __name__ == "__main__":
    # Run display test when module is executed directly
    test_display()