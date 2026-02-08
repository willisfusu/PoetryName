<script lang="ts">
  import { onMount } from "svelte";
  import type { PoemEntry, GeneratedName } from "$lib/types";
  import {
    DEFAULT_BOOK,
    DEFAULT_FAMILY_NAME,
    NAME_AMOUNT,
    BOOKS,
  } from "$lib/config";
  import { loadBook, genNames } from "$lib/namer";
  import NameCard from "./NameCard.svelte";
  import LoadingOverlay from "./LoadingOverlay.svelte";
  import BookSelector from "./BookSelector.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";

  let selectedBook = $state(DEFAULT_BOOK);
  let familyName = $state(DEFAULT_FAMILY_NAME);
  let poems: PoemEntry[] = $state([]);
  let generatedNames: GeneratedName[] = $state([]);
  let isLoading = $state(true);

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

  function handleGenerate() {
    generatedNames = genNames(poems, NAME_AMOUNT);
  }
</script>

<div class="space-y-10">
  <!-- Header section -->
  <header class="pt-12 md:pt-16 text-center">
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
        <NameCard {familyName} generatedName={name} index={i} />
      {/each}
    </div>
  </div>
</div>

<LoadingOverlay visible={isLoading} />

<!-- Footer -->
<footer class="text-center mt-16 pb-8">
  <p class="text-xs text-stone-400">Designed by Will</p>
</footer>
