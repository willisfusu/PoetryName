<script lang="ts">
  import { LoaderCircle } from "lucide-svelte";

  interface Props {
    visible: boolean;
  }

  let { visible }: Props = $props();
</script>

{#if visible}
  <div class="absolute z-100 left-0 top-0 min-h-screen w-full bg-black/5">
    <LoaderCircle
      size={100}
      class="animate-spin block mx-auto mt-[40vh]"
      color="#f8f8f4"
    />
  </div>
{/if}
