<script lang="ts">
  import type { BookConfig } from "$lib/types";

  interface Props {
    books: BookConfig[];
    selectedBook: string;
    onchange: (book: string) => void;
    disabled?: boolean;
  }

  let { books, selectedBook, onchange, disabled = false }: Props = $props();
</script>

<div class="book-selector">
  {#each books as book (book.value)}
    <div class="inputGroup">
      <input
        id={book.value}
        name="book"
        type="radio"
        value={book.value}
        checked={book.value === selectedBook}
        onchange={() => onchange(book.value)}
        {disabled}
      />
      <label for={book.value} class:checked={book.value === selectedBook}>
        {book.name}
      </label>
    </div>
  {/each}
</div>

<style>
  .book-selector {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .inputGroup {
    display: inline-block;
    width: 45%;
    background-color: white;
    margin: 8px;
    position: relative;
  }

  .inputGroup input {
    width: 32px;
    height: 32px;
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    visibility: hidden;
  }

  .inputGroup label {
    padding: 12px 30px;
    display: block;
    text-align: left;
    color: #3c454c;
    cursor: pointer;
    position: relative;
    z-index: 2;
    transition: color 100ms ease-in;
    overflow: hidden;
  }

  .inputGroup label::before {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    content: "";
    background-color: #f97b6a;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale3d(1, 1, 1);
    transition: all 100ms cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    z-index: -1;
  }

  .inputGroup label::after {
    width: 32px;
    height: 32px;
    content: "";
    border: 2px solid #d1d7dc;
    background-color: white;
    background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.414 11L4 12.414l5.414 5.414L20.828 6.414 19.414 5l-10 10z' fill='%23fff' fill-rule='nonzero'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: 2px 3px;
    border-radius: 50%;
    z-index: 2;
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    transition: all 100ms ease-in;
  }

  .inputGroup label.checked {
    color: white;
  }

  .inputGroup label.checked::before {
    transform: translate(-50%, -50%) scale3d(56, 56, 1);
    opacity: 1;
  }

  .inputGroup label.checked::after {
    background-color: #8b2010;
    border-color: #8b2010;
  }

  @media (max-width: 768px) {
    .inputGroup {
      width: 100%;
      margin: 4px 0;
    }
  }
</style>
