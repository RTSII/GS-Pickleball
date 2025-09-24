#!/usr/bin/env python3
"""
Simple clarify script for GitHub Spec Kit functionality
This provides basic clarification workflow until the full CLI can be installed
"""

import sys
import json
from pathlib import Path

def main():
    print("🔍 GitHub Spec Kit - Clarify Feature")
    print("=" * 50)

    if len(sys.argv) < 2:
        print("Usage: python clarify.py <feature-description>")
        print("Example: python clarify.py \"Add user authentication with email and password\"")
        return

    feature_desc = " ".join(sys.argv[1:])
    print(f"📝 Clarifying feature: {feature_desc}")
    print()

    # Check if we're in a git repository with spec files
    if not Path(".git").exists():
        print("⚠️  Not in a git repository. Make sure you're in your project directory.")
        return

    # Look for existing spec files
    spec_files = list(Path(".").glob("*.md"))
    spec_file = None
    for f in spec_files:
        if "spec" in f.name.lower():
            spec_file = f
            break

    if spec_file:
        print(f"📄 Found existing spec file: {spec_file}")
        print("💡 You can now use /clarify in Windsurf to get structured clarification questions.")
    else:
        print("📄 No existing spec file found.")
        print("💡 Use /specify first to create a feature specification, then /clarify to refine it.")

    print()
    print("🔧 To get the latest Spec Kit with full /clarify support:")
    print("1. Make sure you have Python 3.11+ installed")
    print("2. Run: pip install --upgrade git+https://github.com/github/spec-kit.git@main")
    print("3. Restart Windsurf to load the new slash commands")
    print("4. The /clarify command should then be available")

if __name__ == "__main__":
    main()
