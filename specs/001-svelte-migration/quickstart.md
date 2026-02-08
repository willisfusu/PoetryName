# Quickstart: Svelte Migration

**Feature**: 001-svelte-migration
**Date**: 2026-02-08

## Prerequisites

- Node.js 18+
- npm 9+

## Setup from Scratch

### 1. Create Svelte 5 + Vite Project

```bash
npm create vite@latest GetPoetryName -- --template svelte-ts
cd GetPoetryName
npm install
```

### 2. Install Tailwind CSS v4

```bash
npm install tailwindcss @tailwindcss/vite
```

Add to `vite.config.ts`:

```ts
import tailwindcss from "@tailwindcss/vite";
// add tailwindcss() to plugins array
```

Add to `src/app.css`:

```css
@import "tailwindcss";
```

### 3. Configure Path Aliases

In `vite.config.ts`:

```ts
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
});
```

In `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```

### 4. Initialize shadcn-svelte

```bash
npx shadcn-svelte@latest init
```

Follow prompts to configure style, base color, and aliases.

### 5. Add Required Components

```bash
npx shadcn-svelte@latest add button input card radio-group spinner
```

### 6. Install Additional Dependencies

```bash
npm install lucide-svelte
npm install -D oxlint oxfmt prettier prettier-plugin-svelte svelte-check
```

### 7. Copy Poetry Data

```bash
mkdir -p public/json
cp src/scripts/json/*.json public/json/
# Remove test.json from public/json/ (debug only)
```

### 8. Configure Scripts

In `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-check --tsconfig ./tsconfig.json",
    "lint": "oxlint",
    "lint:fix": "oxlint --fix",
    "format": "oxfmt ."
  }
}
```

## Development

```bash
npm run dev        # Start dev server (default: localhost:5173)
npm run build      # Production build to dist/
npm run preview    # Preview production build
npm run check      # Type-check Svelte files
npm run lint       # Lint with oxlint
npm run format     # Format with oxfmt
```

## Key Differences from Original

| Aspect          | Original             | Migrated                       |
| --------------- | -------------------- | ------------------------------ |
| Framework       | jQuery + vanilla JS  | Svelte 5                       |
| Bundler         | Webpack 3            | Vite                           |
| Styling         | SCSS                 | Tailwind CSS v4                |
| Components      | Manual DOM           | shadcn-svelte                  |
| Icons           | Custom SVG           | lucide-svelte                  |
| Linting         | ESLint (airbnb-base) | oxlint                         |
| Formatting      | None                 | oxfmt + prettier-plugin-svelte |
| Language        | JavaScript (ES6)     | TypeScript                     |
| Data loading    | jQuery AJAX          | Native fetch()                 |
| Dev server port | 8080                 | 5173                           |
