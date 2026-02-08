# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chinese name generator ("你的名字") that creates names by extracting characters from classical Chinese poetry collections (诗经, 楚辞, 唐诗, 宋词, 乐府诗集, 古诗三百首, 著名辞赋). Client-side SPA built with jQuery, Webpack 3, Babel, and SCSS.

## Commands

- `npm install` — install dependencies
- `npm start` — dev server with hot reload at localhost:8080 (uses `webpack.dev.js`)
- `npm run build` — production build to `dist/` (uses `webpack.prod.js`)
- `npx eslint src/` — lint (no npm script defined; config extends `airbnb-base`)

There is no automated test suite. Validate changes by running `npm run build` (must succeed) and manually testing in the browser via `npm start`.

## Architecture

**Entry point**: `src/scripts/index.js` — DOM-ready bootstrap, creates radio buttons for book selection, wires up event handlers, manages loading state.

**Name generation**: `src/scripts/namer.js` — `Namer` class that:
1. `loadBook(book, cb)` — AJAX-loads a poetry JSON file from `./json/{book}.json`
2. `genName()` — picks a random passage, splits into sentences, strips punctuation and inauspicious characters (`cleanBadChar`), extracts two random characters via `getTwoChar()`, returns name + source metadata
3. Characters are kept in original poem order (first index ≤ second index)

**Utilities**:
- `src/scripts/rand.js` — `choose(arr)` and `between(min, max)` helpers
- `src/scripts/config.js` — constants: `debugMode`, `defaultBook` (`'shijing'`), `defaultFamilyName` (`'李'`), `nameAmount` (`6`)
- `src/scripts/debugTools.js` — conditional logging gated by `debugMode`

**Data**: `src/scripts/json/` contains poetry corpus JSON files. Each entry has `author`, `dynasty`, `content`, `book`, `title`. These are copied to `dist/json/` by `CopyWebpackPlugin` and loaded at runtime via AJAX.

**Styles**: `src/styles/` — SCSS with `style.scss` (main), `var.scss` (color variables), `responsive.scss` (responsive mixins), `radio.scss` (custom radio buttons), `normalize.scss`.

**Build**: Three webpack configs — `webpack.common.js` (shared loaders/plugins), `webpack.dev.js` (source maps, dev server), `webpack.prod.js` (UglifyJS, chunkhash output).

## Code Style

- ESLint `airbnb-base` with relaxed rules: `func-names` off, `linebreak-style` off, `class-methods-use-this` off
- 2-space indentation, semicolons, single quotes
- `camelCase` for functions/variables, `PascalCase` for classes
- UI wiring stays in `index.js`; algorithm/data logic in dedicated modules

## Key Notes

- `dist/` is checked into the repo (not gitignored) — it contains deployable build output
- `namer_old.js` and `old.less` are legacy files, unused
- Poetry JSON is client-shipped; never store secrets in `src/scripts/json/`
- The only runtime dependency is jQuery; everything else is devDependencies
