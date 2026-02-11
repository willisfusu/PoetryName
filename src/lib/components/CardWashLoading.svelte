<script lang="ts">
  import { onDestroy } from "svelte";
  import { gsap } from "gsap";
  import {
    CARD_WASH_ANIMATION_DURATION,
    CARD_WASH_ANIMATION_STAGGER,
    CARD_WASH_PLACEHOLDER_COUNT,
  } from "$lib/config";
  import type { WaitingFeedbackMode } from "$lib/types";

  interface Props {
    visible: boolean;
    mode: WaitingFeedbackMode;
    message: string;
  }

  let { visible, mode, message }: Props = $props();
  let container: HTMLDivElement | null = $state(null);
  let timeline: gsap.core.Timeline | null = null;

  const placeholders = Array.from({ length: CARD_WASH_PLACEHOLDER_COUNT }, (_, idx) => idx);

  function startTimeline(
    cards: NodeListOf<HTMLDivElement>,
    lines: NodeListOf<HTMLDivElement>,
  ) {
    timeline?.kill();
    gsap.killTweensOf(cards);
    gsap.killTweensOf(lines);

    timeline = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } });
    timeline
      .set(cards, {
        opacity: 0.5,
        y: 10,
        scale: 0.98,
        transformOrigin: "50% 50%",
      })
      .to(
        cards,
        {
          opacity: 1,
          y: -6,
          scale: 1.02,
          duration: Math.max(0.4, CARD_WASH_ANIMATION_DURATION * 0.45),
          stagger: CARD_WASH_ANIMATION_STAGGER,
        },
        0,
      )
      .to(
        cards,
        {
          opacity: 0.6,
          y: 4,
          scale: 0.99,
          duration: Math.max(0.5, CARD_WASH_ANIMATION_DURATION * 0.55),
          stagger: CARD_WASH_ANIMATION_STAGGER,
        },
        ">",
      )
      .fromTo(
        lines,
        { backgroundPositionX: "0%" },
        {
          backgroundPositionX: "180%",
          duration: CARD_WASH_ANIMATION_DURATION,
          ease: "none",
          stagger: Math.max(0.02, CARD_WASH_ANIMATION_STAGGER * 0.33),
        },
        0,
      );
  }

  function stopTimeline() {
    timeline?.kill();
    timeline = null;
  }

  $effect(() => {
    if (!visible || mode !== "card_wash" || !container) {
      stopTimeline();
      return;
    }

    const cards = container.querySelectorAll<HTMLDivElement>("[data-wash-card]");
    const lines = container.querySelectorAll<HTMLDivElement>("[data-wash-line]");

    if (cards.length === 0) {
      stopTimeline();
      return;
    }

    startTimeline(cards, lines);
    return stopTimeline;
  });

  onDestroy(stopTimeline);
</script>

{#if visible}
  <section class="card-wash-wrapper" role="status" aria-live="polite">
    <p class="card-wash-message">{message}</p>

    {#if mode === "reduced_motion_fallback"}
      <div class="card-wash-grid">
        {#each placeholders as idx (idx)}
          <div class="card-wash-card card-wash-card--fallback" data-wash-card>
            <div class="card-wash-line card-wash-line--title" data-wash-line></div>
            <div class="card-wash-line" data-wash-line></div>
            <div class="card-wash-line card-wash-line--short" data-wash-line></div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="card-wash-grid" bind:this={container}>
        {#each placeholders as idx (idx)}
          <div class="card-wash-card" data-wash-card>
            <div class="card-wash-line card-wash-line--title" data-wash-line></div>
            <div class="card-wash-line" data-wash-line></div>
            <div class="card-wash-line card-wash-line--short" data-wash-line></div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
{/if}
