# Repository Guidelines

## Project Structure & Module Organization
- `src/scripts/` contains core app logic. Main entry is `src/scripts/index.js`; name generation logic lives in `src/scripts/namer.js`.
- `src/scripts/json/` stores poem corpora (`shijing.json`, `chuci.json`, etc.) used at runtime.
- `src/styles/` contains SCSS styles (`style.scss`, `responsive.scss`, shared vars in `var.scss`).
- `src/index.html` is the webpack HTML template; `src/images/` holds static assets.
- `dist/` is generated build output (deployable bundle). Treat it as build artifacts, not source.

## Build, Test, and Development Commands
- `npm install` — install dependencies.
- `npm start` — run `webpack-dev-server` with `webpack.dev.js` for local development.
- `npm run build` — create a production bundle via `webpack.prod.js` in `dist/`.
- Quick smoke test after build: open the generated page in `dist/` and verify name generation and book switching.

## Coding Style & Naming Conventions
- JavaScript follows `airbnb-base` via `.eslintrc.js` with a few relaxed rules.
- Use 2-space indentation, semicolons, and single quotes to match existing files.
- Naming: `camelCase` for functions/variables, `PascalCase` for classes (for example, `Namer`).
- Keep modules focused: UI wiring in `index.js`, algorithm/data handling in dedicated files.

## Testing Guidelines
- There is no automated test suite currently.
- Validate changes with:
  - `npm run build` (must succeed)
  - Manual browser checks in `npm start` for core flows (book selection, generated names, rendering).
- If introducing tests, place them near related source (for example, `src/scripts/__tests__/`) and keep file names aligned with target modules.

## Commit & Pull Request Guidelines
- This workspace snapshot does not include `.git` history, so no enforceable legacy commit pattern is visible.
- Preferred commit style: concise, imperative messages (recommended Conventional Commits, e.g., `feat: improve name filtering`).
- PRs should include: summary of behavior changes, affected files/JSON datasets, manual test steps, and screenshots/GIFs for UI updates.

## Security & Data Notes
- All corpus JSON files are client-shipped; never store secrets or private data in `src/scripts/json/`.
- Keep third-party dependency updates intentional and review `package-lock.json` diffs carefully.
