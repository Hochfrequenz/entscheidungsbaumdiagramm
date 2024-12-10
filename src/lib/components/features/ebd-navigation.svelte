<script lang="ts">
  import type { EbdNameExtended } from "$lib/types/metadata";

  import IconArrow from "../shared/icon-arrow.svelte";

  export let currentEbds: EbdNameExtended[] = [];
  export let currentFormatVersion: string = "";
  export let selectedEbdCode: string = "";
  export let onSelect: (ebdCode: string) => void;
  export let isDisabled: boolean = false;

  $: currentIndex = currentEbds.findIndex(
    (ebd) => ebd.ebd_code === selectedEbdCode,
  );

  $: isFirstEbd = currentIndex === 0;
  $: isLastEbd = currentIndex === currentEbds.length - 1;

  function handleNavigation(event: MouseEvent): void {
    if (isDisabled) return;

    const target = event.target as HTMLElement;
    const ebdListIndex = target.closest("svg")?.id;

    if (
      !ebdListIndex ||
      !currentFormatVersion ||
      !selectedEbdCode ||
      !currentEbds.length
    ) {
      return;
    }

    if (currentIndex === -1) return;

    // set boundaries to disable navigation once the first/last EBD is reached
    if (ebdListIndex === "previousEbd" && isFirstEbd) return;
    if (ebdListIndex === "nextEbd" && isLastEbd) return;

    let newIndex: number;
    if (ebdListIndex === "nextEbd") {
      newIndex = currentIndex + 1;
    } else if (ebdListIndex === "previousEbd") {
      newIndex = currentIndex - 1;
    } else {
      return;
    }

    const newEbd = currentEbds[newIndex];
    onSelect(newEbd.ebd_code);
  }
</script>

<div class="flex flex-col gap-1">
  <button
    on:click={handleNavigation}
    class="cursor-pointer"
    class:opacity-35={isLastEbd || isDisabled}
    disabled={isDisabled}
  >
    <IconArrow id="nextEbd" />
  </button>
  <button
    on:click={handleNavigation}
    class="cursor-pointer"
    class:opacity-35={isFirstEbd || isDisabled}
    disabled={isDisabled}
  >
    <IconArrow orientation="rotate-180" id="previousEbd" />
  </button>
</div>
