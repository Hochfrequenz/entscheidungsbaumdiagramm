<script lang="ts">
  import { onMount } from "svelte";

  import { base } from "$app/paths";
  import { IconDownload } from "$lib/components";

  export let currentFormatVersion: string = "";
  export let currentEbd: string = "";
  export let isDisabled: boolean = false;

  let isExportReady = true;
  let cooldownTimer: ReturnType<typeof setTimeout>;

  onMount(() => {
    return () => {
      if (cooldownTimer) clearTimeout(cooldownTimer);
    };
  });

  async function handleExport() {
    if (isDisabled || !isExportReady || !currentFormatVersion || !currentEbd)
      return;

    isExportReady = false;
    const ebdPath = `${base}/ebd/${currentFormatVersion}/${currentEbd}.svg`;

    try {
      const response = await fetch(ebdPath);
      if (!response.ok) {
        throw new Error(`http error: ${response.status}`);
      }
      const svgContent = await response.text();

      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentFormatVersion}-${currentEbd}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`error exporting svg: ${err}`);
    }

    cooldownTimer = setTimeout(() => {
      isExportReady = true;
    }, 5000); // 5 seconds cooldown to prevent spamming the download button
  }
</script>

<button
  on:click={handleExport}
  class="flex flex-row items-center gap-2 rounded-full bg-tint text-[16px] py-4 px-5 text-secondary transition-opacity duration-200 whitespace-nowrap"
  class:opacity-30={isDisabled}
  disabled={isDisabled}
>
  <IconDownload /> Export SVG
</button>
