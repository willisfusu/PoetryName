<script lang="ts">
  import { fade } from "svelte/transition";
  import { LoaderCircle } from "lucide-svelte";

  interface Props {
    visible: boolean;
  }

  let { visible }: Props = $props();
</script>

{#if visible}
  <div
    class="fixed inset-0 z-40 flex items-center justify-center bg-bg/80 backdrop-blur-sm"
    role="status"
    aria-live="polite"
    transition:fade={{ duration: 200 }}
  >
    <LoaderCircle size={80} class="animate-spin text-accent" />
  </div>
{/if}
