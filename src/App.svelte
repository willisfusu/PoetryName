<script lang="ts">
  import NameGenerator from "$lib/components/NameGenerator.svelte";
</script>

<div class="wrapper">
  <NameGenerator />
</div>

<style>
  .wrapper {
    width: 60%;
    max-width: 800px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .wrapper {
      width: 80%;
    }
  }
</style>
