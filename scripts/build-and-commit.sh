#!/bin/bash
npx tailwindcss -i ./src/input.css -o ./styles/style.css
git add styles/style.css
git commit -m "Update built CSS"
git push
echo "✅ CSS updated and pushed to GitHub!"
