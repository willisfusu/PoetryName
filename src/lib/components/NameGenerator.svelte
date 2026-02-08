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

<div class="input-container">
  <h3 class="title">你的名字<small> 古诗文起名V2.0</small></h3>
  <div>
    <div>本项目全部开源, 作者:holynova</div>
    <a target="_blank" href="https://github.com/holynova/gushi_namer"
      >fork me on Github</a
    >
  </div>

  <BookSelector
    books={BOOKS}
    {selectedBook}
    onchange={handleBookChange}
    disabled={isLoading}
  />

  <p class="family">
    <label for="family-name">姓氏 </label>
    <input
      type="text"
      name="family-name"
      bind:value={familyName}
      placeholder="输入姓氏"
    />
  </p>

  <button
    class="btn-go"
    onclick={handleGenerate}
    disabled={isLoading || poems.length === 0}>起名</button
  >
</div>

<div class="result">
  <div class="result-container">
    {#each generatedNames as name, i (i)}
      <NameCard {familyName} generatedName={name} />
    {/each}
  </div>
</div>

<LoadingOverlay visible={isLoading} />

<style>
  .input-container {
    padding: 1rem;
  }

  .title {
    margin: 0;
  }

  .title small {
    font-size: 0.6em;
    font-weight: normal;
  }

  .family label {
    font-size: 2rem;
  }

  .family input {
    font-size: 1rem;
    padding: 0.3rem 0.5rem;
    border: 1px solid #ddd;
    border-radius: 2px;
  }

  .btn-go {
    width: 100%;
    line-height: 3;
    background-color: #c73a1e;
    color: #fff;
    border-radius: 2px;
    padding: 0.2rem 1.1rem;
    border: none;
    text-align: center;
    margin: 0.2rem auto;
    outline: none;
    cursor: pointer;
    font-size: 1rem;
  }

  .btn-go:hover {
    background-color: #d94f3a;
  }

  .btn-go:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .result {
    position: relative;
  }

  .result-container {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }

  a {
    color: #c73a1e;
  }
</style>
