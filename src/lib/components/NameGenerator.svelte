<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import type {
    PoemEntry,
    GeneratedName,
    NameEvaluation,
    EvaluationState,
  } from "$lib/types";
  import {
    DEFAULT_BOOK,
    DEFAULT_FAMILY_NAME,
    NAME_AMOUNT,
    BOOKS,
  } from "$lib/config";
  import { loadBook, genNames } from "$lib/namer";
  import { evaluateNames } from "$lib/ai";
  import { hasApiKey, getApiKey } from "$lib/ai-config";
  import NameCard from "./NameCard.svelte";
  import LoadingOverlay from "./LoadingOverlay.svelte";
  import BookSelector from "./BookSelector.svelte";
  import SettingsDialog from "./SettingsDialog.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Settings } from "lucide-svelte";

  let selectedBook = $state(DEFAULT_BOOK);
  let familyName = $state(DEFAULT_FAMILY_NAME);
  let poems: PoemEntry[] = $state([]);
  let generatedNames: GeneratedName[] = $state([]);
  let isLoading = $state(true);
  let showSettings = $state(false);
  let evaluationState: EvaluationState = $state("idle");
  let evaluations: (NameEvaluation | null)[] = $state([]);
  let abortController: AbortController | null = $state(null);
  let toastMessage = $state("");
  let toastVisible = $state(false);
  let toastTimeout: ReturnType<typeof setTimeout> | null = null;

  let topPickIndices = $derived.by(() => {
    if (evaluationState !== "completed" || evaluations.length === 0)
      return new Set<number>();
    const hasHighScore = evaluations.some((e) => e !== null && e.score >= 8);
    if (hasHighScore) {
      return new Set(
        evaluations
          .map((e, i) => (e !== null && e.score >= 8 ? i : -1))
          .filter((i) => i >= 0),
      );
    }
    const scored = evaluations
      .map((e, i) => ({ score: e?.score ?? 0, index: i }))
      .sort((a, b) => b.score - a.score);
    return new Set(scored.slice(0, 2).map((s) => s.index));
  });

  function showToast(message: string) {
    toastMessage = message;
    toastVisible = true;
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastVisible = false;
    }, 5000);
  }

  onMount(async () => {
    poems = await loadBook(DEFAULT_BOOK);
    isLoading = false;
  });

  async function handleBookChange(book: string) {
    selectedBook = book;
    isLoading = true;
    generatedNames = [];
    poems = await loadBook(book);
    isLoading = false;
  }

  async function handleGenerate() {
    // Cancel any in-progress evaluation
    if (abortController) {
      abortController.abort();
      abortController = null;
    }

    // Reset evaluation state
    evaluationState = "idle";
    evaluations = [];

    // Generate names (existing logic)
    generatedNames = genNames(poems, NAME_AMOUNT);

    // Start AI evaluation if API key is configured
    if (hasApiKey() && generatedNames.length > 0) {
      evaluationState = "evaluating";
      const controller = new AbortController();
      abortController = controller;

      try {
        const results = await evaluateNames({
          familyName,
          names: generatedNames,
          apiKey: getApiKey(),
          signal: controller.signal,
        });
        // Sort by score descending
        const pairs = generatedNames.map((name, i) => ({
          name,
          eval: results[i] ?? null,
        }));
        pairs.sort((a, b) => (b.eval?.score ?? 0) - (a.eval?.score ?? 0));
        generatedNames = pairs.map((p) => p.name);
        evaluations = pairs.map((p) => p.eval);
        evaluationState = "completed";
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        evaluationState = "failed";
        if (error instanceof Error) {
          if (error.message.includes("401")) {
            showToast("API Key 无效，请在设置中重新配置");
          } else if (error.message.includes("429")) {
            showToast("请求过于频繁，请稍后再试");
          } else {
            showToast("AI 评估暂不可用");
          }
        } else {
          showToast("AI 评估失败");
        }
      }
    } else if (generatedNames.length > 0 && !hasApiKey()) {
      showToast("请先设置 API Key 以启用 AI 评估");
    }
  }
</script>

<div class="space-y-10">
  <!-- Header section -->
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
    <p class="text-sm text-stone-500 mt-1">古诗文起名</p>
    <hr class="border-accent/30 w-16 mx-auto mt-4 mb-0" />
  </header>

  <!-- Book selector -->
  <div>
    <BookSelector
      books={BOOKS}
      {selectedBook}
      onchange={handleBookChange}
      disabled={isLoading}
    />
  </div>

  <!-- Family name input -->
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

  <!-- Generate button -->
  <div>
    <Button
      class="w-full h-12 bg-accent text-text-on-accent hover:bg-accent-hover text-base font-medium cursor-pointer"
      onclick={handleGenerate}
      disabled={isLoading || poems.length === 0}>起名</Button
    >
  </div>

  <!-- Results grid -->
  <div aria-live="polite">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      {#each generatedNames as name, i (i)}
        <NameCard
          {familyName}
          generatedName={name}
          index={i}
          evaluation={evaluations[i] ?? null}
          {evaluationState}
          isTopPick={topPickIndices.has(i)}
        />
      {/each}
    </div>
    {#if toastVisible}
      <button
        class="mt-4 w-full bg-accent-light text-stone-700 border border-accent/20 rounded-lg px-4 py-3 text-sm cursor-pointer text-left"
        type="button"
        onclick={() => (toastVisible = false)}
        transition:fade={{ duration: 200 }}
      >
        {toastMessage}
      </button>
    {/if}
  </div>
</div>

<LoadingOverlay visible={isLoading} />

<!-- Footer -->
<footer class="text-center mt-16 pb-8">
  <p class="text-xs text-stone-400">Designed by Will</p>
</footer>

<SettingsDialog open={showSettings} onclose={() => (showSettings = false)} />
