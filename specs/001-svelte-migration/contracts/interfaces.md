# Contracts: Internal Module Interfaces

**Feature**: 001-svelte-migration
**Date**: 2026-02-08

> This is a client-side SPA with no API endpoints. These contracts define the internal module interfaces.

## Types (`src/lib/types.ts`)

```ts
export interface PoemEntry {
  author: string;
  dynasty: string;
  content: string;
  book: string;
  title: string;
}

export interface BookConfig {
  value: string;
  name: string;
}

export interface GeneratedName {
  name: string;
  sentence: string;
  content: string;
  title: string;
  author: string;
  book: string;
  dynasty: string;
}
```

## Namer Module (`src/lib/namer.ts`)

```ts
/**
 * Load a poetry collection from the public JSON directory.
 * @param book - The book key (e.g., "shijing")
 * @returns Array of poem entries
 * @throws Error if fetch fails
 */
export async function loadBook(book: string): Promise<PoemEntry[]>;

/**
 * Generate a single name from the loaded poems.
 * @param poems - Array of poem entries to draw from
 * @returns A generated name with source metadata, or null if generation fails
 */
export function genName(poems: PoemEntry[]): GeneratedName | null;

/**
 * Generate multiple names.
 * @param poems - Array of poem entries
 * @param count - Number of names to generate (default: 6)
 * @returns Array of generated names (nulls filtered out)
 */
export function genNames(poems: PoemEntry[], count?: number): GeneratedName[];
```

## Config Module (`src/lib/config.ts`)

```ts
export const DEBUG_MODE: boolean; // false
export const DEFAULT_BOOK: string; // "shijing"
export const DEFAULT_FAMILY_NAME: string; // "李"
export const NAME_AMOUNT: number; // 6

export const BOOKS: BookConfig[];
// [
//   { value: 'shijing', name: '诗经' },
//   { value: 'chuci', name: '楚辞' },
//   { value: 'tangshi', name: '唐诗' },
//   { value: 'songci', name: '宋词' },
//   { value: 'yuefu', name: '乐府诗集' },
//   { value: 'gushi', name: '古诗三百首' },
//   { value: 'cifu', name: '著名辞赋' },
// ]

export const BAD_CHARS: string;
// "胸鬼懒禽鸟鸡我邪罪凶丑仇鼠蟋蟀淫秽妹狐鸡鸭蝇悔鱼肉苦犬吠窥血丧饥女搔父母昏狗蟊疾病痛死潦哀痒害蛇牲妇狸鹅穴畜烂兽靡爪氓劫鬣螽毛婚姻匪婆羞辱"
```

## Rand Module (`src/lib/rand.ts`)

```ts
/**
 * Pick a random element from an array.
 */
export function choose<T>(arr: T[]): T;

/**
 * Return a random integer in [min, max) range.
 */
export function between(min: number, max: number): number;
```

## Component Props

### BookSelector

```ts
{
  books: BookConfig[];
  selectedBook: string;
  onchange: (book: string) => void;
  disabled?: boolean;
}
```

### NameCard

```ts
{
  familyName: string;
  generatedName: GeneratedName;
}
```

### LoadingOverlay

```ts
{
  visible: boolean;
}
```
