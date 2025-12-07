#!/bin/bash

# Exit script if any command fails
set -e

echo "Building and deploying News Quiz Generator..."

# Step 1: Build the C# project
echo "Building C# quiz generator..."
dotnet build
dotnet publish -c Release -o ./publish

# Step 2: Build the React frontend
echo "Building React frontend..."
cd ./frontend  # Adjust this path to your React project folder
npm install
npm run build
cd ..

# Step 3: Copy the React build to where it will be served
echo "Copying frontend files to web directory..."
mkdir -p ./web
cp -r ./frontend/dist/* ./web/

# Step 4: Copy the quiz generator to the web server directory
echo "Copying quiz generator to web directory..."
mkdir -p ./web/generator
cp -r ./publish/* ./web/generator/

# Step 5: Create a directory for the questions file
mkdir -p ./web/public

# Step 6: Update configuration 
sed -i 's|"OutputPath": "questions.json"|"OutputPath": "../public/questions.json"|g' ./web/generator/appsettings.json

echo "Deployment complete!"
echo "Remember to:"
echo "1. Set up your API keys in ./web/generator/appsettings.json"
echo "2. Configure a cron job to run the generator daily"
echo "3. Ensure your web server is set up to serve files from ./web"

# Example cron job command to show the user
echo ""
echo "Example cron job (add to crontab -e):"
echo "0 0 * * * cd /path/to/web/generator && dotnet NewsQuizGenerator.dll > /path/to/logs/quiz_generator.log 2>&1"