# Implementation Plan: Svelte Migration

**Branch**: `001-svelte-migration` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-svelte-migration/spec.md`

## Summary

Migrate the Chinese poetry name generator ("你的名字") from jQuery + Webpack 3 to Svelte 5 + Vite + Tailwind CSS v4. This is a 1:1 functional migration — no new features, only a framework and tooling modernization. The app remains a client-side SPA. Poetry JSON data files are reused as-is. The visual design is replicated using Tailwind CSS and shadcn-svelte components.

## Technical Context

**Language/Version**: TypeScript 5.x, Svelte 5.50.0
**Primary Dependencies**: Svelte 5, Vite, Tailwind CSS v4, shadcn-svelte 1.1.1, bits-ui 2.15.5, lucide-svelte 0.563.0
**Storage**: Static JSON files served from `public/json/` (no database)
**Testing**: svelte-check (type checking), manual browser testing (no automated test suite — matching original project)
**Target Platform**: Modern web browsers (desktop + mobile)
**Project Type**: Single-page web application (client-side only)
**Performance Goals**: Name generation < 1 second, initial load < 3 seconds
**Constraints**: Client-side only, no server-side processing, poetry JSON loaded at runtime via fetch
**Scale/Scope**: 7 poetry collections, ~8,300 poems total, single page, 4 custom components
**Linting**: oxlint 1.43.0 (JS/TS + Svelte script blocks)
**Formatting**: oxfmt 0.28.0 (JS/TS/CSS) + prettier-plugin-svelte (Svelte files)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

No project-specific constitution principles are defined (template only). No gates to enforce. **PASS**.

Post-Phase 1 re-check: Design uses a single project structure, minimal dependencies, no unnecessary abstractions. **PASS**.

## Project Structure

### Documentation (this feature)

```text
specs/001-svelte-migration/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: Technology research
├── data-model.md        # Phase 1: Data model
├── quickstart.md        # Phase 1: Setup guide
├── contracts/           # Phase 1: Module interfaces
│   └── interfaces.md
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app.css                         # Tailwind imports + custom theme variables
├── App.svelte                      # Root component (mounts NameGenerator)
├── main.ts                         # Entry point (mounts App to DOM)
├── vite-env.d.ts                   # Vite type declarations
└── lib/
    ├── utils.ts                    # cn() helper (from shadcn-svelte init)
    ├── config.ts                   # App constants (books, defaults, bad chars)
    ├── namer.ts                    # Name generation algorithm (ported from namer.js)
    ├── rand.ts                     # Random utility functions (ported from rand.js)
    ├── types.ts                    # TypeScript interfaces
    └── components/
        ├── NameGenerator.svelte    # Main app layout + state management
        ├── BookSelector.svelte     # Poetry collection radio group
        ├── NameCard.svelte         # Individual name result card
        ├── LoadingOverlay.svelte   # Loading indicator overlay
        └── ui/                     # shadcn-svelte components (auto-generated)
            ├── button/
            ├── input/
            ├── card/
            ├── radio-group/
            └── spinner/

public/
├── json/                           # Poetry JSON data files
│   ├── shijing.json
│   ├── chuci.json
│   ├── tangshi.json
│   ├── songci.json
│   ├── yuefu.json
│   ├── gushi.json
│   └── cifu.json
└── favicon.ico

index.html                          # Vite HTML entry point
vite.config.ts                      # Vite + Svelte + Tailwind config
tsconfig.json                       # TypeScript config with $lib alias
package.json                        # Dependencies and scripts
oxlintrc.json                       # oxlint configuration
```

**Structure Decision**: Single-project SPA structure. No routing, no backend, no separate packages. All source code under `src/` with `$lib` alias for imports. shadcn-svelte components auto-generated under `src/lib/components/ui/`. Poetry data served as static files from `public/json/`.

## Implementation Phases

### Phase 1: Project Scaffolding & Tooling

1. Create new Svelte 5 + Vite project using `npm create vite@latest -- --template svelte-ts`
2. Install and configure Tailwind CSS v4 with `@tailwindcss/vite` plugin
3. Configure `$lib` path alias in `vite.config.ts` and `tsconfig.json`
4. Initialize shadcn-svelte (`npx shadcn-svelte@latest init`)
5. Add required shadcn-svelte components (button, input, card, radio-group, spinner)
6. Install lucide-svelte, oxlint, oxfmt, prettier, prettier-plugin-svelte, svelte-check
7. Configure package.json scripts (dev, build, check, lint, format)
8. Copy poetry JSON files from `src/scripts/json/` to `public/json/` (exclude test.json)
9. Set up `index.html` with correct meta tags (charset, viewport, description, keywords, title)

### Phase 2: Core Logic Migration

1. Create `src/lib/types.ts` — TypeScript interfaces for PoemEntry, BookConfig, GeneratedName
2. Port `src/scripts/rand.js` → `src/lib/rand.ts` — add types, keep logic identical
3. Port `src/scripts/config.js` → `src/lib/config.ts` — add BOOKS array, BAD_CHARS constant, typed exports
4. Port `src/scripts/namer.js` → `src/lib/namer.ts`:
   - Convert class to pure functions (no jQuery dependency)
   - Replace `$.ajax` with `async fetch()`
   - Add TypeScript types
   - Preserve exact algorithm: `formatStr`, `splitSentence`, `cleanPunctuation`, `cleanBadChar`, `getTwoChar`, `genName`
   - Add `genNames()` convenience function

### Phase 3: Component Development

1. Create `src/lib/components/LoadingOverlay.svelte` — full-screen overlay with lucide-svelte LoaderCircle spinner
2. Create `src/lib/components/BookSelector.svelte` — radio group using shadcn-svelte RadioGroup, styled to match original custom radio buttons
3. Create `src/lib/components/NameCard.svelte` — card displaying name, highlighted source sentence, and metadata using shadcn-svelte Card
4. Create `src/lib/components/NameGenerator.svelte` — main component with all state management:
   - `$state` for selectedBook, familyName, poems, generatedNames, isLoading
   - Book loading via `loadBook()` on selection change
   - Name generation on button click
   - Responsive grid layout for name cards
5. Create `src/App.svelte` — root component mounting NameGenerator with header/footer
6. Update `src/main.ts` — mount App to DOM

### Phase 4: Styling & Visual Parity

1. Define custom theme in `src/app.css`:
   - Map original SCSS color variables to Tailwind CSS custom properties
   - `$color_bg: #fbd8b0` → background color
   - `$color_card: #e7b375` → card background
   - `$color_white: #f8f8f4` → text color on cards
   - `$my_green: lighten(#f74b2b, 20%)` → accent/button color
   - Chinese font stack
2. Style BookSelector to replicate the animated radio button effect (expand background on selection)
3. Style NameCard to match original: 3rem name, white text, card shadow, highlighted characters with `<i>` bold styling
4. Style responsive layout: 60% width desktop (max 800px), 80% mobile, flex-wrap card grid
5. Style loading overlay: semi-transparent background, centered spinner

### Phase 5: Integration & Verification

1. Verify all 7 poetry collections load correctly
2. Verify name generation produces valid results with correct character ordering
3. Verify inauspicious character filtering works
4. Verify responsive layout at 320px, 768px, 1024px, 1920px widths
5. Run `npm run build` — must succeed with no errors
6. Run `npm run check` — must pass with no type errors
7. Run `npm run lint` — fix any linting issues
8. Compare visual output side-by-side with original app
9. Clean up old source files (original src/scripts/, src/styles/, webpack configs) or document that they remain on the original branch

## Key Migration Mappings

| Original                             | Migrated                                                   |
| ------------------------------------ | ---------------------------------------------------------- |
| `src/scripts/index.js` (DOM wiring)  | `src/lib/components/NameGenerator.svelte` (reactive state) |
| `src/scripts/namer.js` (Namer class) | `src/lib/namer.ts` (pure functions)                        |
| `src/scripts/config.js`              | `src/lib/config.ts`                                        |
| `src/scripts/rand.js`                | `src/lib/rand.ts`                                          |
| `src/scripts/debugTools.js`          | Removed (use browser devtools)                             |
| `src/index.html`                     | `index.html` (Vite root)                                   |
| `src/styles/*.scss`                  | `src/app.css` + Tailwind utilities                         |
| `$.ajax()`                           | `fetch()`                                                  |
| jQuery DOM manipulation              | Svelte reactive declarations                               |
| `genRadio()` HTML string             | `BookSelector.svelte` component                            |
| `genNameHtml()` HTML string          | `NameCard.svelte` component                                |
| `setLoading()`/`clearLoading()`      | `LoadingOverlay.svelte` with `$state`                      |

## Complexity Tracking

No constitution violations to justify.
