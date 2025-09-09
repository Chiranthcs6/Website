#!/bin/bash
npx tailwindcss -i ./src/input.css -o ./dist/style.css
git add dist/style.css
git commit -m "Update built CSS"
git push
echo "✅ CSS updated and pushed to GitHub!"
