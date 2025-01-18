<script lang="ts">
  type FormatVersion = {
    code: string;
    detailedFormatVersion: string;
  };

  export let formatVersions: FormatVersion[] = [];
  export let selectedVersion: string = "";
  export let onSelect: (version: string) => void;

  function handleSelect() {
    onSelect(selectedVersion);
  }
</script>

<div class="flex flex-col items-start mt-2 w-full relative">
  <select
    id="format-version-select"
    bind:value={selectedVersion}
    on:change={handleSelect}
    class="inline-block border-2 border-white rounded-lg bg-primary py-3 px-2 ps-3 pe-4 focus:outline-0 w-full cursor-pointer text-base leading-relaxed"
  >
    <option value="">Bitte auswählen</option>
    {#each formatVersions as version}
      <option value={version.code}>{version.detailedFormatVersion}</option>
    {/each}
  </select>
  <label
    for="format-version-select"
    class="absolute top-0.5 left-3 -translate-y-1/2 text-xs text-slate-500 bg-white px-1 rounded"
  >
    Formatversion
  </label>
</div>
