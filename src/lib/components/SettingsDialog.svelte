<script lang="ts">
  import { fade } from "svelte/transition";
  import { getProviderConfig, setProviderConfig } from "$lib/ai-config";
  import { PROVIDER_PRESETS } from "$lib/config";
  import type { ProviderType, RequestFormat } from "$lib/types";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Eye, EyeOff, X } from "lucide-svelte";

  interface Props {
    open: boolean;
    onclose: () => void;
  }

  let { open, onclose }: Props = $props();

  let providerType = $state<ProviderType>("default");
  let baseUrl = $state("");
  let model = $state("");
  let apiKeyInput = $state("");
  let requestFormat = $state<RequestFormat>("anthropic");
  let showKey = $state(false);
  let saved = $state(false);
  let validationError = $state("");

  const providerOptions: { id: ProviderType; label: string }[] = [
    ...PROVIDER_PRESETS.map((p) => ({ id: p.id, label: p.name })),
    { id: "custom" as ProviderType, label: "自定义" },
  ];

  let isCustom = $derived(providerType === "custom");

  // Reset form fields when dialog opens — intentionally using $effect
  // because these are user-editable form values, not derivations.
  $effect(() => {
    if (open) {
      const config = getProviderConfig();
      providerType = config.providerType;
      baseUrl = config.baseUrl;
      model = config.model;
      apiKeyInput = config.apiKey;
      requestFormat = config.requestFormat;
      showKey = false;
      saved = false;
      validationError = "";
    }
  });

  function handleProviderChange(id: ProviderType) {
    providerType = id;
    validationError = "";

    if (id === "custom") {
      baseUrl = "";
      model = "";
      requestFormat = "openai";
      return;
    }

    const preset = PROVIDER_PRESETS.find((p) => p.id === id);
    if (preset) {
      baseUrl = preset.baseUrl;
      model = preset.defaultModel;
      requestFormat = preset.requestFormat;
    }
  }

  function handleSave() {
    if (!apiKeyInput.trim() && providerType !== "default") {
      validationError = "请输入 API Key";
      return;
    }
    if (isCustom && !baseUrl.trim()) {
      validationError = "请输入 Base URL";
      return;
    }
    if (!model.trim()) {
      validationError = "请输入模型名称";
      return;
    }

    validationError = "";

    setProviderConfig({
      providerType,
      baseUrl: baseUrl.trim(),
      model: model.trim(),
      apiKey: apiKeyInput.trim(),
      requestFormat,
    });

    saved = true;
    setTimeout(() => {
      onclose();
    }, 800);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onclose();
    }
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onclose();
    }
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm"
    transition:fade={{ duration: 200 }}
    onkeydown={handleKeydown}
    onclick={handleBackdropClick}
  >
    <div
      class="bg-white rounded-xl border border-card-border shadow-lg p-6 w-full max-w-lg mx-4"
      role="dialog"
      aria-label="设置"
      aria-modal="true"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium text-stone-900">设置</h2>
        <button
          class="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
          onclick={onclose}
          aria-label="关闭"
        >
          <X size={18} />
        </button>
      </div>

      <!-- Provider Selection -->
      <div class="mb-4">
        <span class="block text-sm font-medium text-stone-700 mb-2">
          AI 服务商
        </span>
        <div class="flex flex-wrap gap-3">
          {#each providerOptions as option (option.id)}
            <label
              class="flex items-center gap-1.5 cursor-pointer text-sm text-stone-600"
            >
              <input
                type="radio"
                name="provider"
                value={option.id}
                checked={providerType === option.id}
                onchange={() => handleProviderChange(option.id)}
                class="accent-accent w-3.5 h-3.5 cursor-pointer"
              />
              {option.label}
            </label>
          {/each}
        </div>
      </div>

      <!-- Base URL (custom only) -->
      {#if isCustom}
        <div class="mb-3">
          <label
            for="base-url-input"
            class="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Base URL
          </label>
          <Input
            id="base-url-input"
            type="text"
            bind:value={baseUrl}
            placeholder="https://api.example.com"
          />
        </div>
      {/if}

      <!-- Model -->
      <div class="mb-3">
        <label
          for="model-input"
          class="block text-sm font-medium text-stone-700 mb-1.5"
        >
          模型
        </label>
        <Input
          id="model-input"
          type="text"
          bind:value={model}
          placeholder="输入模型名称"
        />
      </div>

      <!-- Request Format (custom only) -->
      {#if isCustom}
        <div class="mb-3">
          <span class="block text-sm font-medium text-stone-700 mb-2">
            请求格式
          </span>
          <div class="flex gap-4">
            <label
              class="flex items-center gap-1.5 cursor-pointer text-sm text-stone-600"
            >
              <input
                type="radio"
                name="request-format"
                value="anthropic"
                checked={requestFormat === "anthropic"}
                onchange={() => (requestFormat = "anthropic")}
                class="accent-accent w-3.5 h-3.5 cursor-pointer"
              />
              Anthropic 格式
            </label>
            <label
              class="flex items-center gap-1.5 cursor-pointer text-sm text-stone-600"
            >
              <input
                type="radio"
                name="request-format"
                value="openai"
                checked={requestFormat === "openai"}
                onchange={() => (requestFormat = "openai")}
                class="accent-accent w-3.5 h-3.5 cursor-pointer"
              />
              OpenAI 格式
            </label>
          </div>
        </div>
      {/if}

      <!-- API Key -->
      <div class="mb-1">
        <label
          for="api-key-input"
          class="block text-sm font-medium text-stone-700 mb-1.5"
        >
          API Key
        </label>
        <div class="flex gap-2">
          <Input
            id="api-key-input"
            type={showKey ? "text" : "password"}
            bind:value={apiKeyInput}
            placeholder="输入你的 API Key"
            class="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            class="shrink-0 cursor-pointer"
            onclick={() => (showKey = !showKey)}
            aria-label={showKey ? "隐藏密钥" : "显示密钥"}
          >
            {#if showKey}
              <EyeOff size={16} />
            {:else}
              <Eye size={16} />
            {/if}
          </Button>
        </div>
        <p class="text-xs text-stone-400 mt-1">
          {#if providerType === "default"}
            可选，用于 AI 古诗文起名服务
          {:else}
            用于 AI 古诗文起名服务
          {/if}
        </p>
      </div>

      <!-- Validation Error -->
      {#if validationError}
        <p class="text-xs text-red-500 mt-2">{validationError}</p>
      {/if}

      <!-- Actions -->
      <div class="flex items-center justify-end gap-3 mt-5">
        {#if saved}
          <span class="text-sm text-accent">已保存</span>
        {/if}
        <Button variant="outline" class="cursor-pointer" onclick={onclose}>
          取消
        </Button>
        <Button
          class="bg-accent text-text-on-accent hover:bg-accent-hover cursor-pointer"
          onclick={handleSave}
        >
          保存
        </Button>
      </div>
    </div>
  </div>
{/if}
