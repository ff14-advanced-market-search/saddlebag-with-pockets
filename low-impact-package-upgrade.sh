#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# Update only within the compatibility ranges declared in package.json.
# Using @latest here can silently install breaking majors.
yarn upgrade @datadog/browser-rum
yarn upgrade @tailwindcss/forms
yarn upgrade @tanstack/match-sorter-utils
yarn upgrade @tanstack/react-table
yarn upgrade axios
yarn upgrade update-browserslist-db
yarn upgrade highcharts-react-official
yarn upgrade react-dnd-scrolling
yarn upgrade zod
yarn upgrade wrangler

echo "All package upgrades completed successfully."
