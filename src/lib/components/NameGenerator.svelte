<script lang="ts">
  import { onMount } from "svelte";
  import type {
    NameCandidate,
    PoemEntry,
    PoetrySource,
    SelectedName,
  } from "$lib/types";
  import {
    BAD_CHARS,
    BOOKS,
    DEFAULT_BOOK,
    DEFAULT_FAMILY_NAME,
    NAME_GENERATION_AMOUNT,
  } from "$lib/config";
  import { loadBook } from "$lib/namer";
  import { generateNameCandidates } from "$lib/ai";
  import {
    clearSelectedName,
    getSelectedName,
    hasApiKey,
    setSelectedName,
  } from "$lib/ai-config";
  import { sanitizeCandidates } from "$lib/utils";
  import NameCard from "./NameCard.svelte";
  import LoadingOverlay from "./LoadingOverlay.svelte";
  import BookSelector from "./BookSelector.svelte";
  import SettingsDialog from "./SettingsDialog.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Settings } from "lucide-svelte";

  let selectedBook = $state(DEFAULT_BOOK);
  let familyName = $state(DEFAULT_FAMILY_NAME);
  let customPoetryInput = $state("");
  let poems: PoemEntry[] = $state([]);
  let candidates: NameCandidate[] = $state([]);
  let isLoading = $state(true);
  let isGenerating = $state(false);
  let showSettings = $state(false);
  let generationId = $state("");
  let requestId = $state("");
  let selectedCandidateId = $state("");
  let selectedNameInfo: SelectedName | null = $state(null);
  let abortController: AbortController | null = $state(null);
  let toastMessage = $state("");
  let toastVisible = $state(false);
  let toastTimeout: ReturnType<typeof setTimeout> | null = null;
  let isEntrance = $state(true);

  function showToast(message: string) {
    toastMessage = message;
    toastVisible = true;
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    toastTimeout = setTimeout(() => {
      toastVisible = false;
    }, 5000);
  }

  function buildBuiltinPoetryText(entries: PoemEntry[]): string {
    return entries
      .slice(0, 12)
      .map((entry) => `${entry.title}：${entry.content}`)
      .join("\n");
  }

  function getActivePoetrySource(): PoetrySource | null {
    const customText = customPoetryInput.trim();
    if (customText) {
      if (customText.length < 6) {
        showToast("自定义诗文过短，请输入至少 6 个字");
        return null;
      }

      return {
        sourceType: "custom_text",
        poetryText: customText,
      };
    }

    if (poems.length === 0) {
      showToast("当前诗文库尚未加载完成，请稍后再试");
      return null;
    }

    return {
      sourceType: "builtin",
      sourceId: selectedBook,
      book: selectedBook,
      poetryText: buildBuiltinPoetryText(poems),
    };
  }

  function mapErrorMessage(error: unknown): string {
    if (!(error instanceof Error)) {
      return "AI 起名失败，请稍后再试";
    }

    if (error.message.includes("401")) {
      return "API Key 无效，请在设置中重新配置";
    }
    if (error.message.includes("429")) {
      return "请求过于频繁，请稍后再试";
    }
    if (error.message.includes("parse")) {
      return "AI 返回格式异常，请重新生成";
    }

    return "AI 起名暂不可用";
  }

  async function generate(excludedNames: string[] = []) {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }

    if (!hasApiKey()) {
      showToast("请先在设置中配置 API Key 以启用 AI 起名");
      return;
    }

    const poetrySource = getActivePoetrySource();
    if (!poetrySource) {
      return;
    }

    const controller = new AbortController();
    abortController = controller;
    isGenerating = true;

    try {
      const result = await generateNameCandidates({
        poetrySource,
        requestedCount: NAME_GENERATION_AMOUNT,
        excludedNames,
        signal: controller.signal,
      });

      const nextCandidates = sanitizeCandidates(
        result.candidates,
        BAD_CHARS,
        NAME_GENERATION_AMOUNT,
      );

      if (nextCandidates.length === 0) {
        showToast("未能生成有效名字，请更换诗文或重试");
        return;
      }

      isEntrance = candidates.length === 0;
      candidates = nextCandidates;
      generationId = result.generationId;
      requestId = result.requestId;
      selectedCandidateId = "";
      clearSelectedName();
      selectedNameInfo = null;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      showToast(mapErrorMessage(error));
    } finally {
      isGenerating = false;
      abortController = null;
    }
  }

  async function handleBookChange(book: string) {
    selectedBook = book;
    isLoading = true;
    candidates = [];
    selectedCandidateId = "";
    clearSelectedName();
    poems = await loadBook(book);
    isLoading = false;
  }

  async function handleGenerate() {
    await generate();
  }

  async function handleRegenerate() {
    const excludedNames = candidates.map((candidate) => candidate.name);
    await generate(excludedNames);
  }

  function handleSelect(candidate: NameCandidate) {
    if (!generationId) {
      showToast("请先生成名字再进行选择");
      return;
    }

    selectedCandidateId = candidate.candidateId;
    const selected: SelectedName = {
      selectionId: `sel_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      generationId,
      candidateId: candidate.candidateId,
      selectedAt: new Date().toISOString(),
    };
    setSelectedName(selected);
    selectedNameInfo = selected;
    showToast(`已选择：${familyName}${candidate.name}`);
  }

  onMount(async () => {
    poems = await loadBook(DEFAULT_BOOK);
    selectedNameInfo = getSelectedName();
    selectedCandidateId = selectedNameInfo?.candidateId ?? "";
    isLoading = false;
  });
</script>

<div class="space-y-10">
  <header class="pt-12 md:pt-16 text-center relative">
    <button
      class="absolute right-0 top-12 md:top-16 text-stone-400 hover:text-accent transition-colors cursor-pointer p-1 rounded"
      onclick={() => (showSettings = true)}
      aria-label="设置"
    >
      <Settings size={18} />
    </button>
    <h1 class="font-serif text-3xl font-bold tracking-tight text-stone-900">
      你的名字
    </h1>
    <p class="text-sm text-stone-500 mt-1">古诗文 AI 起名</p>
    <hr class="border-accent/30 w-16 mx-auto mt-4 mb-0" />
  </header>

  <div>
    <BookSelector
      books={BOOKS}
      {selectedBook}
      onchange={handleBookChange}
      disabled={isLoading || isGenerating}
    />
  </div>

  <div class="flex items-center gap-3">
    <label for="family-name" class="text-base font-medium text-stone-700"
      >姓氏</label
    >
    <Input
      id="family-name"
      type="text"
      class="max-w-30"
      bind:value={familyName}
      placeholder="李"
    />
  </div>

  <div class="space-y-2">
    <label for="custom-poetry" class="text-sm font-medium text-stone-700"
      >自定义诗文（可选）</label
    >
    <textarea
      id="custom-poetry"
      class="w-full min-h-28 rounded-md border border-card-border px-3 py-2 text-sm text-stone-700 bg-white"
      bind:value={customPoetryInput}
      placeholder="不填则使用当前诗文库；填写后优先按自定义诗文生成"
    ></textarea>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <Button
      class="w-full h-12 bg-accent text-text-on-accent hover:bg-accent-hover text-base font-medium cursor-pointer"
      onclick={handleGenerate}
      disabled={isLoading || isGenerating || poems.length === 0}>AI 起名</Button
    >
    <Button
      variant="outline"
      class="w-full h-12 cursor-pointer"
      onclick={handleRegenerate}
      disabled={isGenerating || candidates.length === 0}
      >再来一组</Button
    >
  </div>

  <div aria-live="polite" class="space-y-3">
    {#if selectedNameInfo}
      <p class="text-sm text-accent">
        已选中候选（generationId: {selectedNameInfo.generationId}, candidateId: {selectedNameInfo.candidateId})
      </p>
    {/if}

    {#if requestId}
      <p class="text-xs text-stone-400">请求编号：{requestId}</p>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      {#each candidates as candidate, i (candidate.candidateId)}
        <NameCard
          {familyName}
          {candidate}
          index={i}
          isSelected={selectedCandidateId === candidate.candidateId}
          {isEntrance}
          onselect={handleSelect}
        />
      {/each}
    </div>

    {#if toastVisible}
      <button
        class="w-full bg-accent-light text-stone-700 border border-accent/20 rounded-lg px-4 py-3 text-sm cursor-pointer text-left"
        type="button"
        onclick={() => (toastVisible = false)}
      >
        {toastMessage}
      </button>
    {/if}
  </div>
</div>

<LoadingOverlay visible={isLoading || isGenerating} />

<footer class="text-center mt-16 pb-8">
  <p class="text-xs text-stone-400">Designed by Will</p>
</footer>

<SettingsDialog open={showSettings} onclose={() => (showSettings = false)} />
