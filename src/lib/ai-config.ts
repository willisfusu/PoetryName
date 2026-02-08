import { API_KEY_STORAGE_KEY } from "./config";

export function getApiKey(): string {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
}

export function hasApiKey(): boolean {
  return getApiKey() !== "";
}
