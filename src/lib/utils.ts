import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { NameCandidate } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type WithElementRef<T, El extends HTMLElement = HTMLElement> = T & {
  ref?: El | null;
};

export type WithoutChildrenOrChild<T> = Omit<T, "children" | "child">;

export function normalizeName(name: string): string {
  return name.replace(/\s+/g, "").trim();
}

export function isValidCandidateName(name: string, badChars: string): boolean {
  const normalized = normalizeName(name);
  if (!normalized) {
    return false;
  }

  return normalized.split("").every((char) => !badChars.includes(char));
}

export function uniqueCandidates(candidates: NameCandidate[]): NameCandidate[] {
  const seen = new Set<string>();
  const result: NameCandidate[] = [];

  candidates.forEach((candidate) => {
    const key = normalizeName(candidate.name);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(candidate);
    }
  });

  return result;
}

export function sanitizeCandidates(
  candidates: NameCandidate[],
  badChars: string,
  count: number,
): NameCandidate[] {
  return uniqueCandidates(candidates)
    .filter(
      (candidate) =>
        isValidCandidateName(candidate.name, badChars) &&
        candidate.excerpt.trim() !== "" &&
        candidate.reason.trim() !== "",
    )
    .slice(0, count)
    .map((candidate) => ({
      ...candidate,
      name: normalizeName(candidate.name),
      isValid: true,
    }));
}
