#!/usr/bin/env bash

# Hardcoded project paths with forward slashes for git-bash
PROJECT_DIR="/c/Users/felix/Desktop/Code/Skola/AI2/vg-assignment/the-attention-mechanism"
LOGS_DIR="${PROJECT_DIR}/.claude/logs"

# Make sure logs directory exists
mkdir -p "$LOGS_DIR"

# Read hook input and epic name
HOOK_INPUT=$(cat)  # Read directly from stdin instead of a file
EPIC_NAME=$(cat "${PROJECT_DIR}/.claude/current_epic.txt" 2>/dev/null || echo "default")

# Capture everything to a debug file for analysis (temporary)
echo "=== HOOK DEBUG $(date) ===" >> "${LOGS_DIR}/debug.log"
echo "Epic: $EPIC_NAME" >> "${LOGS_DIR}/debug.log"
echo "Raw input: '$HOOK_INPUT'" >> "${LOGS_DIR}/debug.log"
echo "Input length: ${#HOOK_INPUT}" >> "${LOGS_DIR}/debug.log"
echo "===================" >> "${LOGS_DIR}/debug.log"

# Extract metadata
TOOL_NAME=$(echo "$HOOK_INPUT" | jq -r '.tool_name // "unknown"')
TOOL_INPUT=$(echo "$HOOK_INPUT" | jq '.tool_input // {}')

# Get current time
CURRENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')

# Format log entry based on tool type
if [[ "$TOOL_NAME" == "Task" ]]; then
    # Extract the subagent info from Task tool
    SUBAGENT=$(echo "$TOOL_INPUT" | jq -r '.subagent_type // "unknown"')
    INSTRUCTION=$(echo "$TOOL_INPUT" | jq -r '.description // "unknown"')
    
    # Format for Task tool - accurately describe what happened
    LOG_ENTRY="Epic:           $EPIC_NAME
Time:           $CURRENT_TIME
Tool used:      Task
Agent delegated: $SUBAGENT
Instruction:    $INSTRUCTION"
else
    # Get file path for other tools
    PATH_INFO=$(echo "$TOOL_INPUT" | jq -r '.file_path // .path // .notebook_path // "unknown"')
    
    # Trim the project directory from the path
    PATH_INFO=$(echo "$PATH_INFO" | sed -e "s|^C:[/\\\\]Users[/\\\\]Felix[/\\\\]Desktop[/\\\\]Code[/\\\\]Skola[/\\\\]AI2[/\\\\]vg-assignment[/\\\\]the-attention-mechanism[/\\\\]||" \
                                        -e "s|^/c/Users/felix/Desktop/Code/Skola/AI2/vg-assignment/the-attention-mechanism/||" \
                                        -e "s|^/c/Users/Felix/Desktop/Code/Skola/AI2/vg-assignment/the-attention-mechanism/||")
    
    # Format for other tools (skip the Agent line as requested)
    LOG_ENTRY="Epic:      $EPIC_NAME
Time:      $CURRENT_TIME
Tool used: $TOOL_NAME
File:      $PATH_INFO"
fi

# Write to epic-specific logfile with .log extension
echo "$LOG_ENTRY" >> "${LOGS_DIR}/${EPIC_NAME}.log"
echo "----------------------------------------" >> "${LOGS_DIR}/${EPIC_NAME}.log"

# Debug output
echo "Logged to ${EPIC_NAME}.log" >&2