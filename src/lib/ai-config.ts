import {
  SELECTED_NAME_STORAGE_KEY,
  PROVIDER_CONFIG_STORAGE_KEY,
  PROVIDER_PRESETS,
} from "./config";
import type { ProviderConfig, SelectedName } from "./types";

function getDefaultProviderConfig(): ProviderConfig {
  const defaultPreset = PROVIDER_PRESETS[0];
  return {
    providerType: defaultPreset.id,
    baseUrl: defaultPreset.baseUrl,
    model: defaultPreset.defaultModel,
    apiKey: "",
    requestFormat: defaultPreset.requestFormat,
  };
}

export function getProviderConfig(): ProviderConfig {
  try {
    const raw = localStorage.getItem(PROVIDER_CONFIG_STORAGE_KEY);
    if (raw) {
      const config = JSON.parse(raw) as ProviderConfig;
      if (config.providerType !== "custom") {
        const preset = PROVIDER_PRESETS.find((p) => p.id === config.providerType);
        if (preset) {
          config.baseUrl = preset.baseUrl;
          config.requestFormat = preset.requestFormat;
        }
      }
      return config;
    }
  } catch {
    // Fall through to default
  }

  return getDefaultProviderConfig();
}

export function setProviderConfig(config: ProviderConfig): void {
  localStorage.setItem(PROVIDER_CONFIG_STORAGE_KEY, JSON.stringify(config));
}

export function getApiKey(): string {
  return getProviderConfig().apiKey;
}

export function hasApiKey(): boolean {
  return getApiKey() !== "";
}

export function setSelectedName(selectedName: SelectedName): void {
  localStorage.setItem(SELECTED_NAME_STORAGE_KEY, JSON.stringify(selectedName));
}

export function getSelectedName(): SelectedName | null {
  try {
    const raw = localStorage.getItem(SELECTED_NAME_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as SelectedName;
  } catch {
    return null;
  }
}

export function clearSelectedName(): void {
  localStorage.removeItem(SELECTED_NAME_STORAGE_KEY);
}
