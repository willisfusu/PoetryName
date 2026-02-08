<script lang="ts">
  import type { GeneratedName } from "$lib/types";
  import { Card, CardContent, CardFooter } from "$lib/components/ui/card";

  interface Props {
    familyName: string;
    generatedName: GeneratedName;
    index?: number;
  }

  let { familyName, generatedName, index = 0 }: Props = $props();

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
  class="border-card-border shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-200 overflow-hidden"
  style="animation: fadeSlideUp 0.3s ease-out {index * 50}ms both"
>
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
</Card>
