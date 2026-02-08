# Data Model: Svelte Migration

**Feature**: 001-svelte-migration
**Date**: 2026-02-08

## Entities

### PoemEntry

Represents a single poem or passage within a poetry collection. Loaded from JSON at runtime.

| Field   | Type   | Description                                   |
| ------- | ------ | --------------------------------------------- |
| author  | string | Poet's name (e.g., "佚名" for anonymous)      |
| dynasty | string | Historical dynasty (e.g., "春秋", "唐")       |
| content | string | Poem content with HTML markup (`<p>`, `<br>`) |
| book    | string | Display name of the collection (e.g., "诗经") |
| title   | string | Poem title (e.g., "关雎")                     |

### BookConfig

Configuration for a selectable poetry collection.

| Field | Type   | Description                            |
| ----- | ------ | -------------------------------------- |
| value | string | JSON filename key (e.g., "shijing")    |
| name  | string | Display name in Chinese (e.g., "诗经") |

### GeneratedName

Result of the name generation algorithm.

| Field    | Type   | Description                                     |
| -------- | ------ | ----------------------------------------------- |
| name     | string | Two-character given name                        |
| sentence | string | Source sentence (with punctuation, for display) |
| content  | string | Full poem content                               |
| title    | string | Poem title                                      |
| author   | string | Poet's name                                     |
| book     | string | Collection display name                         |
| dynasty  | string | Historical dynasty                              |

### AppConfig

Application-level constants.

| Field             | Type    | Default   |
| ----------------- | ------- | --------- |
| debugMode         | boolean | false     |
| defaultBook       | string  | "shijing" |
| defaultFamilyName | string  | "李"      |
| nameAmount        | number  | 6         |

## State Model (Svelte 5 Runes)

### Application State

```
selectedBook: string          — $state, currently selected book key
familyName: string            — $state, user-entered family name
poems: PoemEntry[]            — $state, loaded poem data for current book
generatedNames: GeneratedName[] — $state, current batch of generated names
isLoading: boolean            — $state, whether a book is being loaded
```

### Derived State

```
hasResults: boolean           — $derived, generatedNames.length > 0
canGenerate: boolean          — $derived, poems.length > 0 && !isLoading
```

## Data Flow

1. **App init** → Load default book (shijing) → Set `poems`
2. **Book selection change** → Set `isLoading=true` → Fetch JSON → Set `poems` → Set `isLoading=false`
3. **Generate click** → Run `genName()` × 6 using `poems` → Set `generatedNames`
4. **Family name change** → Update `familyName` (names re-render reactively)

## Inauspicious Characters List

Preserved from the original implementation — a curated set of Chinese characters excluded from name generation:

```
胸鬼懒禽鸟鸡我邪罪凶丑仇鼠蟋蟀淫秽妹狐鸡鸭蝇悔鱼肉苦犬吠窥血丧饥女搔父母昏狗蟊痛死潦哀痒害蛇牲妇狸鹅穴畜烂兽靡爪氓劫鬣螽婚姻匪婆羞辱
```
