# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chinese name generator ("你的名字") that creates names by extracting characters from classical Chinese poetry collections (诗经, 楚辞, 唐诗, 宋词, 乐府诗集, 古诗三百首, 著名辞赋). Client-side SPA built with Svelte 5, TypeScript, Vite, and Tailwind CSS v4.

## Commands

- `npm install` — install dependencies
- `npm run dev` — dev server with hot reload at localhost:5173
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build
- `npm run check` — type-check Svelte and TypeScript files (svelte-check)
- `npm run lint` — lint with oxlint
- `npm run lint:fix` — lint and auto-fix with oxlint
- `npm run format` — format with prettier (includes prettier-plugin-svelte for .svelte files)

There is no automated test suite. Validate changes by running `npm run build` and `npm run check` (both must succeed) and manually testing in the browser via `npm run dev`.

## Architecture

**Entry point**: `src/main.ts` — mounts the root `App.svelte` component using Svelte 5 `mount()`.

**Root component**: `src/App.svelte` — wrapper layout (60% width desktop, 80% mobile, max-width 800px), renders `NameGenerator`.

**Components** (`src/lib/components/`):

- `NameGenerator.svelte` — main component with Svelte 5 runes state (`$state`, `$derived`). Manages book selection, family name input, name generation, and loading state. Integrates all other components.
- `BookSelector.svelte` — radio group for selecting poetry collections. Custom animated radio button styling replicating the original design.
- `NameCard.svelte` — displays a generated name with highlighted source sentence and metadata (book, title, dynasty, author).
- `LoadingOverlay.svelte` — full-screen semi-transparent overlay with spinning loader icon (lucide-svelte `LoaderCircle`).
- `ui/` — shadcn-svelte components (button, card, input, radio-group).

**Name generation**: `src/lib/namer.ts` — pure functions ported from the original `Namer` class:

- `loadBook(book)` — fetches poetry JSON from `/json/{book}.json` via native `fetch()`
- `genName(poems)` — picks a random passage, splits into sentences, strips punctuation and inauspicious characters (`cleanBadChar`), extracts two random characters via `getTwoChar()`, returns name + source metadata
- `genNames(poems, count)` — generates multiple names (default: 6), filters nulls
- Characters are kept in original poem order (first index ≤ second index)

**Utilities**:

- `src/lib/rand.ts` — `choose<T>(arr)` and `between(min, max)` typed helpers
- `src/lib/config.ts` — constants: `DEBUG_MODE`, `DEFAULT_BOOK` (`'shijing'`), `DEFAULT_FAMILY_NAME` (`'李'`), `NAME_AMOUNT` (`6`), `BOOKS` array, `BAD_CHARS` string
- `src/lib/types.ts` — TypeScript interfaces: `PoemEntry`, `BookConfig`, `GeneratedName`
- `src/lib/utils.ts` — `cn()` helper from shadcn-svelte (clsx + tailwind-merge)

**Data**: `public/json/` contains poetry corpus JSON files (shijing, chuci, tangshi, songci, yuefu, gushi, cifu). Each entry has `author`, `dynasty`, `content`, `book`, `title`. Served as static assets by Vite and loaded at runtime via `fetch()`.

**Styles**: `src/app.css` — Tailwind CSS v4 import with custom theme variables (background `#fbd8b0`, card `#e7b375`, accent `#f97b6a`, Chinese font stack). Component-scoped styles in `<style>` blocks.

**Build**: Vite with `@sveltejs/vite-plugin-svelte` and `@tailwindcss/vite`. Path alias `$lib` → `src/lib/`.

## Code Style

- oxlint for linting, prettier + prettier-plugin-svelte for formatting
- TypeScript strict mode, 2-space indentation
- `camelCase` for functions/variables, `PascalCase` for components and interfaces
- Svelte 5 runes (`$state`, `$derived`, `$props`) for reactivity
- Component logic in dedicated `.svelte` files; algorithm/data logic in `.ts` modules

## Key Notes

- `dist/` is gitignored — build output is not checked in
- Poetry JSON is client-shipped; never store secrets in `public/json/`
- No runtime dependencies beyond Svelte, Tailwind, bits-ui, and lucide-svelte
- shadcn-svelte components are copied into `src/lib/components/ui/` (full ownership)

## Tech Stack

- TypeScript 5.x, Svelte 5, Vite 7, Tailwind CSS v4
- shadcn-svelte 1.1.1, bits-ui 2.15.5, lucide-svelte 0.563.0
- oxlint, prettier + prettier-plugin-svelte, svelte-check
- Static JSON files served from `public/json/` (no database)

## Active Technologies
- TypeScript 5.9, Svelte 5.43 + Svelte 5 built-in `animate:flip` (from `svelte/animate`) — no new dependencies (004-card-rerank-animation)
- N/A (client-side animation only) (004-card-rerank-animation)
- Browser localStorage (API key, provider config) (005-api-provider-config)

- TypeScript 5.9, Svelte 5.43 + Svelte 5, Tailwind CSS v4.1, bits-ui 2.15.5, lucide-svelte 0.563.0, shadcn-svelte 1.1.1 (003-ai-name-eval)
- Browser localStorage (API key only) (003-ai-name-eval)

- TypeScript 5.9, Svelte 5.43 + Svelte 5, Tailwind CSS v4.1, shadcn-svelte 1.1.1, bits-ui 2.15.5, lucide-svelte 0.563.0 (002-ui-redesign)
- N/A (static JSON, no changes) (002-ui-redesign)

## Recent Changes

- 002-ui-redesign: Added TypeScript 5.9, Svelte 5.43 + Svelte 5, Tailwind CSS v4.1, shadcn-svelte 1.1.1, bits-ui 2.15.5, lucide-svelte 0.563.0
