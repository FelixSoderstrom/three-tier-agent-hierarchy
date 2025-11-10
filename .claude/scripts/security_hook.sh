#!/bin/bash

# Security hook for Claude Code to prevent dangerous commands
# This runs BEFORE any Bash command executes

# Read the JSON input from stdin
input=$(cat)

# Extract the command from the JSON input
# The input contains tool_name, tool_input, session_id, etc.
command=$(echo "$input" | grep -o '"command":"[^"]*"' | sed 's/"command":"\(.*\)"/\1/')

# If we can't extract the command, allow it to proceed
if [ -z "$command" ]; then
    exit 0
fi

# Log the command being checked (optional)
echo "🔍 Security check: $command" >&2

# Define dangerous command patterns
dangerous_patterns=(
    "rm -rf /"
    "rm -rf /*" 
    "rm -rf ~"
    "rm -rf $HOME"
    "rm -rf C:\\"
    "rm -rf C:/"
    "sudo rm -rf"
    "del /f /s /q C:\\"
    "rmdir /s /q C:\\"
    "format C:"
    "dd if=/dev/zero"
    "dd if=/dev/random"
    "> /dev/sda"
    "mkfs"
    "fdisk"
    "parted"
    "curl.*|.*bash"
    "wget.*|.*bash"
    "curl.*|.*sh"
    "wget.*|.*sh"
    "chmod 777 /"
    "chown.*/"
    "find.*-exec.*rm"
    "find.*-delete"
    ":(){ :|:& };:"
)

# Check if command matches any dangerous pattern
for pattern in "${dangerous_patterns[@]}"; do
    if echo "$command" | grep -qE "$pattern"; then
        echo "🚨 SECURITY VIOLATION: Blocked dangerous command '$command'" >&2
        echo "   Pattern matched: $pattern" >&2
        echo "   Reason: This command could cause system damage or data loss." >&2
        echo "   If you need to perform this operation, please do it manually outside of Claude Code." >&2
        exit 2  # Exit code 2 blocks the tool and shows stderr to Claude
    fi
done

# Additional checks for suspicious rm commands
if echo "$command" | grep -qE "rm.*-r.*-f|rm.*-rf|rm.*-fr"; then
    # Allow safe venv operations
    if echo "$command" | grep -qE "rm -rf venv$|rm -rf venv/$|rm -rf ./venv$|rm -rf ./venv/$"; then
        echo "✅ Allowing venv cleanup: '$command'" >&2
    # Check if it's trying to delete important directories
    elif echo "$command" | grep -qE "\s+/\s*$|\s+~\s*$|\s+\$HOME|\s+C:\\|\s+\*\s*$"; then
        echo "🚨 SECURITY VIOLATION: Blocked potentially dangerous rm command '$command'" >&2
        echo "   Reason: Recursive force deletion of system directories detected." >&2
        echo "   If this is intentional, please run it manually outside of Claude Code." >&2
        exit 2
    else
        # Warn about any recursive force deletions but allow them if they seem targeted
        echo "⚠️  Warning: Recursive force deletion detected: '$command'" >&2
        echo "   Please verify this is intentional." >&2
    fi
fi

# Check for commands that might be downloading and executing code
if echo "$command" | grep -qE "(curl|wget).*\|(bash|sh|python|node)"; then
    echo "🚨 SECURITY VIOLATION: Blocked command that downloads and executes code '$command'" >&2
    echo "   Reason: This pattern can be used for malicious code execution." >&2
    echo "   If legitimate, please download and review the script first." >&2
    exit 2
fi

# If we get here, the command passed all security checks
echo "✅ Security check passed for: $command" >&2
exit 0  # Allow the command to proceed