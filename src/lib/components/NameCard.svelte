<script lang="ts">
  import type {
    GeneratedName,
    NameEvaluation,
    EvaluationState,
  } from "$lib/types";
  import { Card, CardContent, CardFooter } from "$lib/components/ui/card";
  import EvalLoadingIndicator from "./EvalLoadingIndicator.svelte";

  interface Props {
    familyName: string;
    generatedName: GeneratedName;
    index?: number;
    evaluation?: NameEvaluation | null;
    evaluationState?: EvaluationState;
    isTopPick?: boolean;
  }

  let {
    familyName,
    generatedName,
    index = 0,
    evaluation = null,
    evaluationState = "idle",
    isTopPick = false,
  }: Props = $props();

  function getScoreColor(score: number): string {
    if (score >= 8) return "bg-accent text-white";
    if (score >= 5) return "bg-stone-200 text-stone-700";
    return "bg-stone-100 text-stone-500";
  }

  function highlightChars(sentence: string, name: string): string {
    const chars = name.split("");
    return sentence
      .split("")
      .map((char) => {
        if (chars.includes(char)) {
          return `<span class="font-semibold text-accent-warm">${char}</span>`;
        }
        return char;
      })
      .join("");
  }

  let highlightedSentence = $derived(
    highlightChars(generatedName.sentence, generatedName.name),
  );
</script>

<Card
  class="border-card-border shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-200 overflow-hidden relative {isTopPick
    ? 'border-accent shadow-[0_0_12px_rgba(184,134,11,0.15)]'
    : ''}"
  style="animation: fadeSlideUp 0.3s ease-out {index * 50}ms both"
>
  {#if isTopPick}
    <span
      class="absolute top-3 right-3 bg-accent text-white text-xs font-medium px-2 py-0.5 rounded-full z-10"
      >推荐</span
    >
  {/if}
  <CardContent class="pt-6">
    <h3
      class="font-serif text-5xl font-semibold text-stone-900 text-center mb-4"
    >
      {familyName}{generatedName.name}
    </h3>
    <p class="text-base text-stone-700 leading-relaxed text-center">
      「{@html highlightedSentence}」
    </p>
  </CardContent>
  <CardFooter class="text-sm text-text-muted flex justify-between">
    <span>{generatedName.book} · {generatedName.title}</span>
    <span>[{generatedName.dynasty}] {generatedName.author || "佚名"}</span>
  </CardFooter>
  {#if evaluationState === "evaluating"}
    <div class="px-6 pb-5">
      <EvalLoadingIndicator />
    </div>
  {:else if evaluation}
    <div class="px-6 pb-5 pt-1 border-t border-stone-100 mt-1 space-y-3">
      <div class="flex items-start gap-3">
        <div
          class="flex-shrink-0 w-12 h-12 rounded-full {getScoreColor(
            evaluation.score,
          )} flex items-center justify-center font-serif text-2xl font-semibold"
        >
          {evaluation.score}
        </div>
        <p class="text-sm text-stone-600 leading-relaxed flex-1">
          {evaluation.explanation}
        </p>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <span
          class="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500"
          >音韵 {evaluation.phonetic}</span
        >
        <span
          class="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500"
          >寓意 {evaluation.meaning}</span
        >
        <span
          class="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500"
          >字形 {evaluation.aesthetics}</span
        >
        <span
          class="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500"
          >搭配 {evaluation.compatibility}</span
        >
      </div>
    </div>
  {/if}
</Card>
