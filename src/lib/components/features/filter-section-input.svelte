<script lang="ts">
  import type { MetaData } from "$lib/types/metadata";

  export let metadata: Record<string, Record<string, MetaData>> = {};
  export let formatVersion: string = "";
  export let disabled: boolean = false;
  export let onSelect: (ebdCode: string) => void;

  type SectionEntry = {
    ebdCodes: string[];
    sectionHeading: string;
  };

  let inputValue: string = "";
  let sections: SectionEntry[] = [];
  let filteredSections: SectionEntry[] = [];
  let showOptions: boolean = false;
  let isFocused: boolean = false;

  // remove "<section_number> AD: " pattern
  function extractSectionHeading(section: string): string {
    const match = section.match(/AD:\s*(.*)/);
    return match ? match[1] : section;
  }

  $: if (formatVersion) {
    const formatVersionMetadata = metadata[formatVersion] || {};
    const sectionMap = new Map<string, string[]>();

    Object.entries(formatVersionMetadata).forEach(([ebdCode, data]) => {
      if (data.metadata.section) {
        const sectionHeading = extractSectionHeading(data.metadata.section);
        if (!sectionMap.has(sectionHeading)) {
          sectionMap.set(sectionHeading, []);
        }
        sectionMap.get(sectionHeading)!.push(ebdCode);
      }
    });

    sections = Array.from(sectionMap.entries())
      .map(([sectionHeading, ebdCodes]) => ({
        sectionHeading,
        ebdCodes,
      }))
      .sort((a, b) => a.sectionHeading.localeCompare(b.sectionHeading));

    filteredSections = sections;
    inputValue = "";
  } else {
    sections = [];
    filteredSections = [];
    inputValue = "";
  }

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    inputValue = input.value;
    filteredSections = sections.filter((section) =>
      section.sectionHeading.toLowerCase().includes(inputValue.toLowerCase()),
    );
    showOptions = true;
  }

  function handleSelect(section: SectionEntry) {
    inputValue = section.sectionHeading;
    showOptions = false;
    onSelect(section.ebdCodes[0]);
  }

  function handleFocus() {
    isFocused = true;
    showOptions = true;
    inputValue = "";
    filteredSections = sections;
  }

  function handleBlur() {
    isFocused = false;
    setTimeout(() => {
      showOptions = false;
    }, 200);
  }
</script>

<div class="flex flex-col items-start mt-2 w-full relative">
  <input
    type="text"
    id="section-search"
    {disabled}
    bind:value={inputValue}
    on:input={handleInput}
    on:focus={handleFocus}
    on:blur={handleBlur}
    placeholder={isFocused ? "" : 'z.B. "Lieferbeginn"'}
    class="inline-block border-2 border-white rounded-lg bg-primary py-3 px-2 ps-3 pe-4 focus:outline-none w-full placeholder-black disabled:placeholder-opacity-25 text-base leading-relaxed cursor-pointer"
  />

  <label
    for="section-search"
    class="absolute top-0.5 left-3 -translate-y-1/2 text-xs text-slate-500 bg-white px-1 rounded"
  >
    Filter: Prozess
  </label>

  {#if showOptions && !disabled}
    <div
      class="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg max-h-60 overflow-y-auto z-50 mt-1"
    >
      {#each filteredSections as section}
        <button
          on:mousedown={() => handleSelect(section)}
          class="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
        >
          {section.sectionHeading}
        </button>
      {/each}
    </div>
  {/if}
</div>
