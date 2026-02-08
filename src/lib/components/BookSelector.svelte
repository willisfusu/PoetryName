<script lang="ts">
  import type { BookConfig } from "$lib/types";
  import { Check } from "lucide-svelte";

  interface Props {
    books: BookConfig[];
    selectedBook: string;
    onchange: (book: string) => void;
    disabled?: boolean;
  }

  let { books, selectedBook, onchange, disabled = false }: Props = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
  {#each books as book (book.value)}
    <label
      for={book.value}
      class="rounded-lg border bg-white py-3 px-4 cursor-pointer transition-all duration-200 flex items-center justify-between focus-within:ring-2 focus-within:ring-accent/50 focus-within:ring-offset-2 {book.value ===
      selectedBook
        ? 'border-accent bg-accent-light font-medium'
        : 'border-border hover:border-stone-400 hover:bg-stone-50'} {disabled
        ? 'opacity-50 cursor-not-allowed'
        : ''}"
    >
      <input
        id={book.value}
        name="book"
        type="radio"
        class="sr-only"
        value={book.value}
        checked={book.value === selectedBook}
        onchange={() => onchange(book.value)}
        {disabled}
      />
      <span>{book.name}</span>
      {#if book.value === selectedBook}
        <Check size={16} class="text-accent" />
      {/if}
    </label>
  {/each}
</div>
