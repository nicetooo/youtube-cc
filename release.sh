#!/bin/bash

# Check if version argument is provided
if [ -z "$1" ]; then
  echo "Error: No version provided."
  echo "Usage: ./release.sh v0.2.4"
  exit 1
fi

VERSION=$1

# Ensure version starts with 'v'
if [[ ! $VERSION =~ ^v ]]; then
  echo "Error: Version must start with 'v' (e.g., v0.2.4)"
  exit 1
fi

# Check if tag already exists locally
if git rev-parse "$VERSION" >/dev/null 2>&1; then
  echo "Error: Tag $VERSION already exists. Please use a new version number."
  exit 1
fi

echo "🚀 Starting release for $VERSION..."

# Handle changes (including untracked files)
if [[ -n $(git status --porcelain) ]]; then
  echo "📦 Found changes, committing them..."
  git add .
  git commit -m "chore: release $VERSION"
  echo "📤 Pushing changes to remote..."
  git push
else
  echo "✨ No changes found."
fi

# Create the tag
echo "📌 Creating git tag $VERSION..."
git tag "$VERSION"

# Push the tag to origin
echo "📤 Pushing tag $VERSION to origin..."
git push origin "$VERSION"

echo "✅ Release tag $VERSION pushed successfully!"
echo "GitHub Action will now start the build and publish process."
