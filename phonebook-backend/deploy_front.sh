#!/bin/bash

# Stop the script if any command fails
set -e

# Define the paths to the frontend and backend directories
FRONTEND_DIR="/Users/verdant/Documents/FullStackOpenPartSolutions/part2/phonebook-frontend"
BACKEND_DIR="/Users/verdant/Documents/FSO-Part3/phonebook-backend"

echo "Starting UI deployment script..."

# Remove the current build directory
echo "Removing existing build directory..."
rm -rf "$BACKEND_DIR/dist"

# Navigate to the frontend directory, build the project, and copy the build to the backend
echo "Building the frontend..."
cd "$FRONTEND_DIR" && npm run build

echo "Copying new build to the backend directory..."
cp -r dist "$BACKEND_DIR"

# Add changes to git and commit
echo "Adding changes to Git..."
cd "$BACKEND_DIR"
git add .

echo "Committing changes..."
git commit -m "UI build"

echo "Pushing changes to remote repository..."
git push

echo "UI build and deployment script executed successfully."
