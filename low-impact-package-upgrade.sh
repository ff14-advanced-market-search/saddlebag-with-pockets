#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# Minor/Patch updates (safer)
yarn upgrade @datadog/browser-rum@latest
yarn upgrade @tailwindcss/forms@latest
yarn upgrade @tanstack/match-sorter-utils@latest
yarn upgrade @tanstack/react-table@latest
yarn upgrade axios@latest
yarn upgrade caniuse-lite@latest
yarn upgrade update-browserslist-db@latest
yarn upgrade highcharts-react-official@latest
yarn upgrade react-dnd-scrolling@latest
yarn upgrade zod@latest
yarn upgrade wrangler@latest

echo "All package upgrades completed successfully."