#!/bin/bash
# GitHub Spec Kit Update Script
# Updates to the latest version using the official recommended method

echo "🔄 Updating GitHub Spec Kit to latest version..."

# Method 1: Using pip (most reliable)
echo "📦 Installing latest version via pip..."
pip install --upgrade git+https://github.com/github/spec-kit.git@main

# Method 2: Using uv tool (if available)
if command -v uv &> /dev/null; then
    echo "🔧 Updating uv tool..."
    uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
fi

echo "✅ Spec Kit update completed!"
echo "🔍 Verifying installation..."
specify --version

echo ""
echo "📋 Available commands:"
echo "- /constitution - Update project principles"
echo "- /specify      - Create feature specifications"
echo "- /clarify      - Clarify requirements (NEW!)"
echo "- /plan         - Generate implementation plans"
echo "- /tasks        - Create task lists"
echo "- /implement    - Execute implementation"
echo ""
echo "💡 Tip: Restart Windsurf to ensure all slash commands are loaded"
