# CRITICAL: This is FULLY AUTOMATED Development

**IMPORTANT**: This entire project is developed through automated agents. There is NO human/student interaction during epic execution. All references to "students" in epic definitions refer to the eventual end-users AFTER the project is complete, not during development.


Every epic MUST:
1. **Read previous epic completion files** at startup (e.g., `.epic1_complete.json`, `.epic2_complete.json`)
2. **Create its own completion file** upon successful completion
3. **Stop immediately** if required dependencies are missing

Epic completion files contain critical handoff information between epics including:
- Cell positions and structure
- Function names and signatures  
- Configuration settings
- Output file locations

## Documentation Policy

**NO DOCUMENTATION FILES** should be created by Epics 1-5. Epic 6 is solely responsible for ALL documentation including:
- Installation guides
- Configuration documentation
- Troubleshooting guides
- Technical specifications
- Educator guides

Do NOT create any .md files except README.md updates unless you are Epic 6.

## Using Bash & Testing Code

When uwing the Bash tool you must **ALWAYS** validate your PWD and cd to the correct path: `/c/Users/felix/Desktop/Code/Skola/AI2/vg-assignment/the-attention-mechanism`
If you are using code that requires dependencies you must **ALWAYS** activate the venv: `source venv/scripts/activate`