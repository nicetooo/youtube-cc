#!/bin/bash

# YouTube CC Extension - Development Helper Script
# This script helps you quickly load the extension in Chrome for development

set -e

echo "🚀 YouTube CC Extension - Dev Helper"
echo "===================================="
echo ""

# Check if Chrome is running
if pgrep -x "Google Chrome" > /dev/null; then
    echo "⚠️  Chrome is currently running."
    echo "   For best results, close Chrome and run this script again."
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build the extension
echo "📦 Building extension..."
npm run build

# Get the extension path
EXT_PATH="$(pwd)/.output/chrome-mv3"

echo ""
echo "✅ Extension built successfully!"
echo ""
echo "📍 Extension location: $EXT_PATH"
echo ""
echo "📖 To load the extension in Chrome:"
echo ""
echo "   1. Open Chrome and go to: chrome://extensions"
echo "   2. Enable 'Developer mode' (toggle in top-right)"
echo "   3. Click 'Load unpacked'"
echo "   4. Select this folder: .output/chrome-mv3"
echo ""
echo "💡 Or run this command to open Chrome extensions page:"
echo "   open -a 'Google Chrome' 'chrome://extensions'"
echo ""
echo "🔄 For development with auto-reload:"
echo "   1. Keep 'npm run dev' running in another terminal"
echo "   2. The extension will auto-update when you make changes"
echo "   3. Just refresh the YouTube page to see changes"
echo ""

# Offer to open Chrome extensions page
read -p "Open Chrome extensions page now? (Y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    open -a "Google Chrome" "chrome://extensions" || echo "Failed to open Chrome"
fi

echo ""
echo "✨ Happy coding!"
