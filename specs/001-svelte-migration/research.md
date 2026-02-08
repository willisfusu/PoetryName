# Research: Svelte Migration

**Feature**: 001-svelte-migration
**Date**: 2026-02-08

## R-001: Svelte 5 + Vite SPA Setup (without SvelteKit)

**Decision**: Use plain Svelte 5 + Vite (via `vite-plugin-svelte`) for a client-side SPA, not SvelteKit.

**Rationale**: The current app is a simple client-side SPA with no routing, no SSR, and no server-side logic. SvelteKit would add unnecessary complexity. Svelte's official docs confirm: "You can also use Svelte directly with Vite via vite-plugin-svelte by running `npm create vite@latest` and selecting the `svelte` option."

**Setup**:

```bash
npm create vite@latest -- --template svelte-ts
```

**vite.config.ts**:

```ts
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
});
```

**Alternatives considered**:

- SvelteKit: Rejected — overkill for a single-page app with no routing or SSR needs.
- Keep Webpack 3: Rejected — outdated, no Svelte support.

---

## R-002: Tailwind CSS v4 Integration

**Decision**: Use Tailwind CSS v4 with the `@tailwindcss/vite` plugin.

**Rationale**: Tailwind v4 uses a Vite plugin instead of PostCSS, simplifying configuration. No `tailwind.config.js` needed. CSS-first configuration via `@import "tailwindcss"`.

**Setup**:

```bash
npm install tailwindcss @tailwindcss/vite
```

**app.css**:

```css
@import "tailwindcss";
```

**Alternatives considered**:

- Tailwind v3: Rejected — v4 is current, simpler Vite integration, required by shadcn-svelte@latest.
- Keep SCSS: Rejected — user explicitly requested Tailwind.

---

## R-003: shadcn-svelte Component Library

**Decision**: Use shadcn-svelte v1.1.1 (latest, Svelte 5 + Tailwind v4 compatible).

**Rationale**: shadcn-svelte@latest now targets Svelte 5 and Tailwind v4. It provides all needed components (Button, Input, RadioGroup, Card, Skeleton/Spinner). Components are copied into the project, giving full ownership and customization ability. Works with plain Svelte + Vite with manual `$lib` path alias configuration.

**Setup**:

```bash
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button input card radio-group skeleton spinner
```

**Key components needed**:
| Component | Use Case |
|-----------|----------|
| Button | Generate name button |
| Input | Family name input |
| RadioGroup | Poetry collection selector |
| Card | Name result cards |
| Spinner/Skeleton | Loading indicator |

**Dependencies installed by shadcn-svelte**:

- `bits-ui` v2.15.5 (headless component primitives)
- `clsx` + `tailwind-merge` (class utilities)
- `lucide-svelte` (icons, also explicitly requested)

**Alternatives considered**:

- Custom components with Tailwind only: Rejected — shadcn-svelte provides accessible, well-tested components with less effort.
- Skeleton UI: Rejected — user explicitly requested shadcn-svelte.

---

## R-004: lucide-svelte Icons

**Decision**: Use lucide-svelte v0.563.0 for icons.

**Rationale**: Svelte 5 compatible, tree-shakeable, 1500+ icons available. Already a dependency of shadcn-svelte. Includes `LoaderCircle` icon suitable for loading states.

**Usage**:

```svelte
<script>
  import { LoaderCircle } from 'lucide-svelte';
</script>
<LoaderCircle class="animate-spin" size={48} />
```

**Alternatives considered**:

- Keep the custom SVG loading animation: Could be preserved as a custom component if desired, but lucide provides cleaner integration.

---

## R-005: oxlint Linter

**Decision**: Use oxlint v1.43.0 for linting JavaScript/TypeScript code, including `<script>` blocks in `.svelte` files.

**Rationale**: oxlint supports `.svelte` files (lints `<script>` blocks). It's extremely fast (written in Rust), has 665+ built-in rules, and requires minimal configuration. It does not lint Svelte template syntax — `svelte-check` handles that.

**Setup**:

```bash
npm install -D oxlint
```

**package.json scripts**:

```json
{
  "lint": "oxlint",
  "lint:fix": "oxlint --fix"
}
```

**Complement with `svelte-check`** for Svelte-specific diagnostics:

```bash
npm install -D svelte-check
```

**Alternatives considered**:

- ESLint with eslint-plugin-svelte: Rejected — user explicitly requested oxlint.

---

## R-006: oxfmt Formatter

**Decision**: Use oxfmt v0.28.0 for formatting JS/TS/CSS/HTML files. Use `prettier-plugin-svelte` (or the community `oxfmt-prettier-svelte` package) for `.svelte` file formatting.

**Rationale**: oxfmt is the official OXC formatter (alpha stage). It supports JS, TS, JSX, TSX, CSS, SCSS, HTML, JSON, Markdown, and more. It is ~30x faster than Prettier and passes ~95% of Prettier's JS/TS test suite. However, **oxfmt does not natively support `.svelte` files**. A community package `oxfmt-prettier-svelte` (v0.0.1) exists but is very new. The practical approach is to use oxfmt for JS/TS/CSS and Prettier with `prettier-plugin-svelte` as a fallback for `.svelte` files, or use oxfmt for all non-Svelte files and `svelte-check` for Svelte formatting.

**Setup**:

```bash
npm install -D oxfmt prettier prettier-plugin-svelte
```

**Alternatives considered**:

- Prettier only: Rejected — user explicitly requested oxfmt.
- Biome: Not requested.

---

## R-007: Poetry JSON Data Handling

**Decision**: Place poetry JSON files in `public/json/` directory. Load at runtime via `fetch()`.

**Rationale**: Vite serves files from `public/` as static assets at the root URL. Placing JSON files in `public/json/` means they are accessible at `/json/{book}.json` at runtime, matching the current AJAX loading pattern. This avoids bundling large JSON files into the JavaScript bundle.

**Loading pattern in Svelte**:

```ts
async function loadBook(book: string): Promise<PoemEntry[]> {
  const response = await fetch(`/json/${book}.json`);
  return response.json();
}
```

**Alternatives considered**:

- Import JSON statically: Rejected — would bundle all poetry data into JS, increasing initial load.
- Keep jQuery AJAX: Rejected — native `fetch()` is standard and eliminates the jQuery dependency.

---

## R-008: Project Structure

**Decision**: Use a flat Svelte 5 + Vite SPA structure with `$lib` alias.

**Rationale**: Simple SPA with no routing. Components organized under `src/lib/components/`, utilities under `src/lib/`, shadcn-svelte components under `src/lib/components/ui/`.

```
src/
├── app.css                    # Tailwind imports + custom theme
├── App.svelte                 # Root component
├── main.ts                    # Entry point (mounts App)
├── vite-env.d.ts              # Vite type declarations
└── lib/
    ├── utils.ts               # cn() helper (from shadcn-svelte)
    ├── config.ts              # App constants (defaultBook, nameAmount, etc.)
    ├── namer.ts               # Name generation logic (ported from namer.js)
    ├── rand.ts                # Random utility functions (ported from rand.js)
    ├── types.ts               # TypeScript interfaces
    └── components/
        ├── NameGenerator.svelte    # Main app layout + logic
        ├── BookSelector.svelte     # Poetry collection radio group
        ├── NameCard.svelte         # Individual name result card
        ├── LoadingOverlay.svelte   # Loading indicator overlay
        └── ui/                     # shadcn-svelte components (auto-generated)
public/
├── json/                      # Poetry JSON data files (copied from src/scripts/json/)
│   ├── shijing.json
│   ├── chuci.json
│   ├── tangshi.json
│   ├── songci.json
│   ├── yuefu.json
│   ├── gushi.json
│   └── cifu.json
└── favicon.ico
```

**Alternatives considered**:

- SvelteKit file-based routing structure: Rejected — no routing needed for this SPA.
