<script lang="ts">
  import { fade } from "svelte/transition";
  import { getApiKey, setApiKey } from "$lib/ai-config";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Eye, EyeOff, X } from "lucide-svelte";

  interface Props {
    open: boolean;
    onclose: () => void;
  }

  let { open, onclose }: Props = $props();

  let apiKeyInput = $state("");
  let showKey = $state(false);
  let saved = $state(false);

  $effect(() => {
    if (open) {
      apiKeyInput = getApiKey();
      showKey = false;
      saved = false;
    }
  });

  function handleSave() {
    setApiKey(apiKeyInput);
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
      class="bg-white rounded-xl border border-card-border shadow-lg p-6 w-full max-w-md mx-4"
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

      <div>
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
        <p class="text-xs text-stone-400 mt-1">用于 AI 名字评估服务</p>
      </div>

      <div class="flex items-center justify-end gap-3 mt-6">
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
