# Tasks: Svelte Migration

**Input**: Design documents from `/specs/001-svelte-migration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/interfaces.md, quickstart.md

**Tests**: No automated tests requested. Validation is via `npm run build`, `npm run check`, and manual browser testing.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Scaffold the Svelte 5 + Vite project, install all dependencies, configure tooling

- [X] T001 Scaffold Svelte 5 + Vite project using `npm create vite@latest -- --template svelte-ts`, replacing the existing src/ and build files. Preserve `src/scripts/json/` poetry data and `specs/` directory
- [X] T002 Install Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`) and configure the Vite plugin in `vite.config.ts` per research.md R-002
- [X] T003 Configure `$lib` path alias in `vite.config.ts` (resolve.alias) and `tsconfig.json` (paths) per research.md R-001
- [X] T004 Initialize shadcn-svelte (`npx shadcn-svelte@latest init`) and add required components: button, input, card, radio-group, spinner via `npx shadcn-svelte@latest add`
- [X] T005 Install additional dependencies: `lucide-svelte`, and dev dependencies: `oxlint`, `oxfmt`, `prettier`, `prettier-plugin-svelte`, `svelte-check`
- [X] T006 [P] Configure package.json scripts: dev, build, preview, check, lint, lint:fix, format per quickstart.md
- [X] T007 [P] Copy poetry JSON files from original `src/scripts/json/` to `public/json/` (shijing.json, chuci.json, tangshi.json, songci.json, yuefu.json, gushi.json, cifu.json). Exclude test.json
- [X] T008 [P] Update `index.html` with correct meta tags: charset UTF-8, viewport, description ("你的名字-用诗经 楚辞 唐诗 宋词起名字"), keywords ("起名,诗经,楚辞,唐诗,宋词"), title ("你的名字-用诗经 楚辞 唐诗 宋词起名字"), lang="zh-CN"
- [X] T009 Create `src/app.css` with Tailwind import (`@import "tailwindcss"`) and custom theme: map original SCSS color variables to CSS custom properties — background `#fbd8b0`, card `#e7b375`, white `#f8f8f4`, accent (lighten #f74b2b 20% ≈ `#f97b6a`), Chinese font stack from original `style.scss`

**Checkpoint**: Project scaffolded, all dependencies installed, dev server starts with `npm run dev`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core TypeScript modules that ALL user stories depend on — types, config, random utilities, and the name generation algorithm

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T010 [P] Create TypeScript interfaces in `src/lib/types.ts`: `PoemEntry` (author, dynasty, content, book, title), `BookConfig` (value, name), `GeneratedName` (name, sentence, content, title, author, book, dynasty) per contracts/interfaces.md
- [X] T011 [P] Port `src/scripts/rand.js` → `src/lib/rand.ts`: typed `choose<T>(arr: T[]): T` and `between(min: number, max: number): number` functions, preserving exact logic (max exclusive) per contracts/interfaces.md
- [X] T012 [P] Port `src/scripts/config.js` → `src/lib/config.ts`: export typed constants `DEBUG_MODE`, `DEFAULT_BOOK`, `DEFAULT_FAMILY_NAME`, `NAME_AMOUNT`, `BOOKS` array (all 7 collections with value/name pairs), and `BAD_CHARS` string per contracts/interfaces.md
- [X] T013 Port `src/scripts/namer.js` → `src/lib/namer.ts`: convert Namer class to pure functions — `formatStr`, `splitSentence`, `cleanPunctuation`, `cleanBadChar`, `getTwoChar`, `genName(poems: PoemEntry[]): GeneratedName | null`, `genNames(poems: PoemEntry[], count?: number): GeneratedName[]`, and `loadBook(book: string): Promise<PoemEntry[]>` using native `fetch()` instead of jQuery AJAX. Preserve exact algorithm logic per contracts/interfaces.md and original `src/scripts/namer.js`

**Checkpoint**: All core logic modules compile. `npm run check` passes for these files

---

## Phase 3: User Story 1 — Generate Names from Classical Poetry (Priority: P1) 🎯 MVP

**Goal**: User can load the app, see the default poetry collection selected, enter a family name, click generate, and see 6 name cards with highlighted source text and metadata

**Independent Test**: Load app → default 诗经 selected, 李 pre-filled → click 起名 → 6 name cards appear with name, highlighted sentence, book • title, [dynasty] author

### Implementation for User Story 1

- [X] T014 [P] [US1] Create `src/lib/components/NameCard.svelte`: accepts `familyName: string` and `generatedName: GeneratedName` props. Displays full name (familyName + given name) as large heading, source sentence with selected characters highlighted using `<i>` bold tags wrapped in 「」, and metadata row with book • title and [dynasty] author. Use shadcn-svelte Card component. Style: card background `#e7b375`, white text, 3rem name font, shadow per original `style.scss`
- [X] T015 [P] [US1] Create `src/lib/components/LoadingOverlay.svelte`: accepts `visible: boolean` prop. Full-screen semi-transparent overlay (`rgba(0,0,0,0.05)`) with centered lucide-svelte `LoaderCircle` icon (animate-spin, size 100px). Conditionally rendered based on `visible` prop. Style per original `.loader` CSS
- [X] T016 [US1] Create `src/lib/components/NameGenerator.svelte`: main component with Svelte 5 runes state management — `$state` for `selectedBook` (default: 'shijing'), `familyName` (default: '李'), `poems` (PoemEntry[]), `generatedNames` (GeneratedName[]), `isLoading` (boolean). On mount: call `loadBook(DEFAULT_BOOK)` to load default collection. On generate button click: call `genNames(poems, NAME_AMOUNT)` and set results. Include family name Input (shadcn-svelte), generate Button (shadcn-svelte, full width, accent color), results grid displaying NameCard components, and LoadingOverlay. Wire up header with title "你的名字" and subtitle "古诗文起名V2.0", author credit with GitHub link
- [X] T017 [US1] Create `src/App.svelte`: root component that imports and renders NameGenerator. Apply wrapper layout: 60% width desktop (max-width 800px), centered with `margin: 0 auto`, background color `#fbd8b0`
- [X] T018 [US1] Update `src/main.ts`: import `./app.css`, import App from `./App.svelte`, use Svelte 5 `mount(App, { target: document.getElementById('app') })` to mount the application

**Checkpoint**: App loads, shows title + family name input + generate button. Clicking generate shows 6 name cards from 诗经 with correct formatting. `npm run build` succeeds

---

## Phase 4: User Story 2 — Switch Between Poetry Collections (Priority: P2)

**Goal**: User can select any of the 7 poetry collections via radio buttons, see a loading indicator while data loads, and generate names from the selected collection

**Independent Test**: Click each of the 7 radio buttons → loading indicator appears → disappears when loaded → generate names → metadata on cards matches selected collection

### Implementation for User Story 2

- [X] T019 [US2] Create `src/lib/components/BookSelector.svelte`: accepts `books: BookConfig[]`, `selectedBook: string`, `onchange: (book: string) => void`, `disabled?: boolean` props. Render radio group using shadcn-svelte RadioGroup component. Each option shows the Chinese display name. Style to replicate the original animated radio button effect: white background, expand colored background on selection (accent color), checkmark circle, 45% width per item on desktop, 100% on mobile. Import BOOKS from config
- [X] T020 [US2] Integrate BookSelector into `src/lib/components/NameGenerator.svelte`: add BookSelector above the family name input, bind `selectedBook` state, wire `onchange` handler to call `loadBook()` with the new book key — set `isLoading=true` before fetch, set `poems` and `isLoading=false` after fetch completes. Show LoadingOverlay during loading. Clear previous `generatedNames` when switching collections

**Checkpoint**: All 7 collections selectable, loading indicator works, names generated from correct collection. Cards show matching book/dynasty/author metadata

---

## Phase 5: User Story 3 — Responsive Experience Across Devices (Priority: P3)

**Goal**: Layout adapts to screen size — multi-column name cards on desktop, single column on mobile, all interactive elements remain usable

**Independent Test**: Resize browser from 320px to 1920px → layout adapts, radio buttons stack on mobile, name cards go single-column, all buttons/inputs remain tappable

### Implementation for User Story 3

- [X] T021 [US3] Add responsive Tailwind classes to `src/lib/components/NameGenerator.svelte`: wrapper width 60% on desktop / 80% on mobile (max-width 800px), results container as flex-wrap grid with min-width 320px per card, single column below 768px breakpoint
- [X] T022 [US3] Add responsive styles to `src/lib/components/BookSelector.svelte`: radio items 45% width on desktop, 100% width on mobile (below 768px), reduce margin/padding on mobile
- [X] T023 [US3] Add responsive styles to `src/lib/components/NameCard.svelte`: min-height 280px on desktop, auto on mobile, min-width 320px on desktop, 90% on mobile. Ensure text remains readable and card padding adjusts for small screens

**Checkpoint**: App renders correctly at 320px, 768px, 1024px, 1920px widths. All interactive elements usable at every size

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Build verification, linting, formatting, cleanup

- [X] T024 Run `npm run build` and fix any build errors in `dist/`
- [X] T025 Run `npm run check` (svelte-check) and fix any type errors across all `.svelte` and `.ts` files
- [X] T026 Run `npm run lint` (oxlint) and fix any linting issues across the project
- [X] T027 Run `npm run format` (oxfmt) to format all JS/TS/CSS files, and run `npx prettier --write "src/**/*.svelte"` for Svelte files
- [X] T028 Remove old source files no longer needed on this branch: `src/scripts/` (index.js, namer.js, namer_old.js, config.js, rand.js, debugTools.js), `src/styles/` (all .scss files), `src/index.html`, webpack config files (webpack.common.js, webpack.dev.js, webpack.prod.js), `old.less`
- [X] T029 Update `CLAUDE.md` to reflect the new project structure, commands, and architecture for the Svelte migration branch
- [ ] T030 Verify visual parity: compare the migrated app side-by-side with the original at multiple viewport sizes, confirm colors, typography, card layout, radio button styling, and loading indicator match

**Checkpoint**: Production build succeeds, no type errors, no lint errors, visual parity confirmed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion
- **User Story 2 (Phase 4)**: Depends on Phase 3 (NameGenerator component must exist to integrate BookSelector)
- **User Story 3 (Phase 5)**: Depends on Phase 4 (all components must exist to add responsive styles)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). Creates the core NameGenerator, NameCard, LoadingOverlay components
- **User Story 2 (P2)**: Depends on US1 — adds BookSelector to the existing NameGenerator component
- **User Story 3 (P3)**: Depends on US2 — adds responsive styles to all existing components

### Within Each User Story

- Components marked [P] can be built in parallel (different files)
- Integration tasks depend on parallel component tasks completing first
- NameGenerator is the integration point for all components

### Parallel Opportunities

- **Phase 1**: T006, T007, T008 can run in parallel (different files)
- **Phase 2**: T010, T011, T012 can run in parallel (different files). T013 depends on T010, T011, T012
- **Phase 3**: T014, T015 can run in parallel (different component files). T016 depends on T014, T015. T017 depends on T016. T018 depends on T017
- **Phase 4**: Sequential (T019 then T020)
- **Phase 5**: T021, T022, T023 can run in parallel (different component files)

---

## Parallel Example: Phase 2 (Foundational)

```
# Launch all independent type/utility modules together:
Task: "Create TypeScript interfaces in src/lib/types.ts"
Task: "Port rand.js → src/lib/rand.ts"
Task: "Port config.js → src/lib/config.ts"

# Then (after above complete):
Task: "Port namer.js → src/lib/namer.ts"
```

## Parallel Example: Phase 3 (User Story 1)

```
# Launch independent components together:
Task: "Create NameCard.svelte"
Task: "Create LoadingOverlay.svelte"

# Then (after above complete):
Task: "Create NameGenerator.svelte (integrates NameCard + LoadingOverlay)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup — project scaffolded, dependencies installed
2. Complete Phase 2: Foundational — types, config, rand, namer modules ready
3. Complete Phase 3: User Story 1 — app generates names from default 诗经 collection
4. **STOP and VALIDATE**: App loads, generates 6 names, displays cards correctly
5. This is a functional MVP — name generation works with one collection

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Name generation works with default collection (MVP!)
3. Add User Story 2 → All 7 collections selectable with loading indicator
4. Add User Story 3 → Responsive layout for all screen sizes
5. Polish → Build verification, linting, cleanup, visual parity check

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No automated tests — validation via `npm run build`, `npm run check`, and manual browser testing
- Commit after each phase or logical group of tasks
- Stop at any checkpoint to validate independently
- The original source files are preserved on the `main` branch; cleanup (T028) removes them only from this feature branch
