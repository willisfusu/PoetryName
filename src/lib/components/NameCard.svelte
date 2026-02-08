<script lang="ts">
  import type { GeneratedName } from "$lib/types";

  interface Props {
    familyName: string;
    generatedName: GeneratedName;
  }

  let { familyName, generatedName }: Props = $props();

  function highlightChars(sentence: string, name: string): string {
    const chars = name.split("");
    return sentence
      .split("")
      .map((char) => {
        if (chars.includes(char)) {
          return `<span style="font-weight:bold;font-size:1.2rem;padding:0 2px;font-style:normal">${char}</span>`;
        }
        return char;
      })
      .join("");
  }

  let highlightedSentence = $derived(
    highlightChars(generatedName.sentence, generatedName.name),
  );
</script>

<div class="name-card">
  <h3 class="name-heading">{familyName}{generatedName.name}</h3>
  <p class="sentence">「{@html highlightedSentence}」</p>
  <div class="source-row">
    <span class="book">{generatedName.book} • {generatedName.title}</span>
    <span class="author"
      >[{generatedName.dynasty}] {generatedName.author || "佚名"}</span
    >
  </div>
</div>

<style>
  .name-card {
    background-color: #e7b375;
    margin: 1rem;
    padding: 2rem 1rem;
    border-radius: 2px;
    box-shadow:
      0 2px 2px 0 rgba(0, 0, 0, 0.05),
      0 1px 4px 0 rgba(0, 0, 0, 0.08),
      0 3px 1px -2px rgba(0, 0, 0, 0.2);
    min-height: 280px;
    min-width: 320px;
  }

  .name-heading {
    font-size: 3rem;
    text-align: center;
    line-height: 1.6;
    margin: 0;
    color: white;
  }

  .sentence {
    line-height: 1.5rem;
    color: white;
  }

  .source-row {
    display: flex;
    color: #f8f8f4;
  }

  .book {
    flex: 1;
  }

  .author {
    flex: 1;
    text-align: right;
  }

  @media (max-width: 768px) {
    .name-card {
      min-height: auto;
      min-width: 90%;
    }
  }
</style>
