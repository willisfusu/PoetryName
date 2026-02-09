<script lang="ts">
  import type { NameCandidate } from "$lib/types";
  import { Card, CardContent, CardFooter } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";

  interface Props {
    familyName: string;
    candidate: NameCandidate;
    index?: number;
    isSelected?: boolean;
    isEntrance?: boolean;
    onselect?: (candidate: NameCandidate) => void;
  }

  let {
    familyName,
    candidate,
    index = 0,
    isSelected = false,
    isEntrance = true,
    onselect = () => {},
  }: Props = $props();

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
    highlightChars(candidate.excerpt, candidate.name),
  );

  function handleSelect() {
    onselect(candidate);
  }
</script>

<Card
  class="border-card-border shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-200 overflow-hidden relative {isSelected
    ? 'border-accent shadow-[0_0_12px_rgba(184,134,11,0.15)]'
    : ''}"
  style={isEntrance ? `animation: fadeSlideUp 0.3s ease-out ${index * 50}ms both` : ''}
>
  {#if isSelected}
    <span
      class="absolute top-3 right-3 bg-accent text-white text-xs font-medium px-2 py-0.5 rounded-full z-10"
      >已选择</span
    >
  {/if}

  <CardContent class="pt-6 space-y-4">
    <h3
      class="font-serif text-5xl font-semibold text-stone-900 text-center"
    >
      {familyName}{candidate.name}
    </h3>
    <p class="text-base text-stone-700 leading-relaxed text-center">
      「{@html highlightedSentence}」
    </p>
    <div class="candidate-reason rounded-lg bg-stone-50 border border-stone-100 px-3 py-2">
      <p class="candidate-reason-label text-xs text-stone-400 mb-1">命名理由</p>
      <p class="candidate-reason-text text-sm text-stone-600 leading-relaxed">{candidate.reason}</p>
    </div>
  </CardContent>

  <CardFooter class="text-sm text-text-muted flex justify-between items-center gap-3">
    <span>
      {candidate.sourceReference?.book || "诗文"}
      {#if candidate.sourceReference?.title}
        · {candidate.sourceReference.title}
      {/if}
    </span>
    <Button
      class="bg-accent text-text-on-accent hover:bg-accent-hover cursor-pointer"
      size="sm"
      onclick={handleSelect}
    >
      {isSelected ? "已选中" : "选择此名"}
    </Button>
  </CardFooter>
</Card>
