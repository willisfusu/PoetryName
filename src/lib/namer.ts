import type { PoemEntry, GeneratedName } from "./types";
import { choose, between } from "./rand";
import { BAD_CHARS, NAME_AMOUNT } from "./config";

export function formatStr(str: string): string {
  let res = str.replace(/(\s|　|"|"){1,}|<br>|<p>|<\/p>/g, "");
  res = res.replace(/\(.+\)/g, "");
  return res;
}

export function splitSentence(content: string): string[] {
  if (!content) {
    return [];
  }
  let str = formatStr(content);
  str = str.replace(/！|。|？|；/g, (s) => `${s}|`);
  str = str.replace(/\|$/g, "");
  const arr = str.split("|");
  return arr.filter((item) => item.length >= 2);
}

export function cleanPunctuation(str: string): string {
  const puncReg = /[<>《》！*(^)$%~!@#…&%￥—+=、。，？；''""：·`]/g;
  return str.replace(puncReg, "");
}

export function cleanBadChar(str: string): string {
  const badChars = BAD_CHARS.split("");
  return str
    .split("")
    .filter((char) => badChars.indexOf(char) === -1)
    .join("");
}

export function getTwoChar(arr: string[]): string {
  const len = arr.length;
  const first = between(0, len);
  let second = between(0, len);
  let cnt = 0;
  while (second === first) {
    second = between(0, len);
    cnt++;
    if (cnt > 100) {
      break;
    }
  }
  return first <= second
    ? `${arr[first]}${arr[second]}`
    : `${arr[second]}${arr[first]}`;
}

export function genName(poems: PoemEntry[]): GeneratedName | null {
  if (!poems || poems.length === 0) {
    return null;
  }
  try {
    const passage = choose(poems);
    const { content, title, author, book, dynasty } = passage;
    if (!content) {
      return null;
    }

    const sentenceArr = splitSentence(content);

    if (!(Array.isArray(sentenceArr) && sentenceArr.length > 0)) {
      return null;
    }

    const sentence = choose(sentenceArr);

    const cleanSentence = cleanBadChar(cleanPunctuation(sentence));
    if (cleanSentence.length <= 2) {
      return null;
    }

    const name = getTwoChar(cleanSentence.split(""));
    return {
      name,
      sentence,
      content,
      title,
      author,
      book,
      dynasty,
    };
  } catch {
    return null;
  }
}

export function genNames(
  poems: PoemEntry[],
  count: number = NAME_AMOUNT,
): GeneratedName[] {
  const results: GeneratedName[] = [];
  for (let i = 0; i < count; i++) {
    const name = genName(poems);
    if (name) {
      results.push(name);
    }
  }
  return results;
}

export async function loadBook(book: string): Promise<PoemEntry[]> {
  const response = await fetch(`/json/${book}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load book: ${book}`);
  }
  return response.json();
}
