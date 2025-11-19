#!/bin/bash
# Quick script to push all changes to GitHub

echo "🚀 Pushing SmartAannemer to GitHub..."
echo ""

# Show what will be pushed
echo "📦 Commits to push:"
git log origin/feature/nextjs-setup..HEAD --oneline 2>/dev/null || git log --oneline -15
echo ""

# Push to GitHub
echo "⬆️  Pushing to origin/feature/nextjs-setup..."
git push -u origin feature/nextjs-setup

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🔗 Create a pull request at:"
    echo "   https://github.com/MaydayTM/smartaannemer/compare/feature/nextjs-setup"
else
    echo ""
    echo "❌ Push failed. GitHub might be experiencing issues."
    echo "   Try again later or check your internet connection."
fi
