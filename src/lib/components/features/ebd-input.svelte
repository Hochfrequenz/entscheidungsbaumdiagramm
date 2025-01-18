<script lang="ts">
  import { onMount } from "svelte";

  import type { EbdNameExtended } from "$lib/types/metadata";

  export let ebds: EbdNameExtended[] = [];
  export let disabled: boolean = false;
  export let selectedEbdCode: string = "";
  export let formatVersionChanged = false;
  export let onSelect: (ebdCode: string) => void;

  let inputValue: string = ""; // preselected EBD on dynamic routes
  let filteredEbds: EbdNameExtended[] = ebds; // by default (without filter), the list of filtered EBDs is equivalent to a list containing all fetched EBDs
  let showOptions: boolean = false; // used for setting the visibility state of the window containing the selectable EBDs
  let isFocused: boolean = false; // used for setting the focus state of the EBD input to show/hide the window containing the selectable EBDs
  let selectedEbdNameExtended: EbdNameExtended | undefined;

  $: {
    if (formatVersionChanged) {
      selectedEbdCode = "";
      selectedEbdNameExtended = undefined;
      inputValue = "";
      filteredEbds = ebds;
    }
  }

  $: {
    if (ebds) {
      filteredEbds = ebds;
      if (!ebds.find((ebd) => ebd.ebd_code === selectedEbdCode)) {
        selectedEbdCode = "";
        selectedEbdNameExtended = undefined;
        inputValue = "";
      }
    }
  }

  function updateSelectedEbdNameExtended() {
    selectedEbdNameExtended = selectedEbdCode
      ? ebds.find((ebd) => ebd.ebd_code === selectedEbdCode)
      : undefined;
    inputValue = selectedEbdNameExtended?.ebd_name ?? selectedEbdCode;
  }

  onMount(() => {
    updateSelectedEbdNameExtended();
  });

  $: {
    if (selectedEbdCode && !isFocused) {
      updateSelectedEbdNameExtended();
    }
  }

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    inputValue = input.value;
    filteredEbds = ebds.filter((ebd) =>
      ebd.ebd_name.toUpperCase().includes(inputValue.toUpperCase()),
    );
    showOptions = true;
  }

  function handleSelect(ebd: EbdNameExtended) {
    selectedEbdNameExtended = ebd;
    inputValue = ebd.ebd_name;
    selectedEbdCode = ebd.ebd_code;
    showOptions = false;
    onSelect(ebd.ebd_code);
  }

  function handleFocus() {
    isFocused = true;
    showOptions = true;
    inputValue = "";
    filteredEbds = ebds;
  }

  // closes list of selectable EBDs when removing focus
  function handleBlur() {
    isFocused = false;
    setTimeout(() => {
      showOptions = false;
      const selectedInfo = ebds.find((ebd) => ebd.ebd_code === selectedEbdCode);
      inputValue = selectedInfo?.ebd_name ?? selectedEbdCode;
    }, 200);
  }
</script>

<div class="flex flex-col items-start mt-2 w-full relative">
  <input
    type="text"
    id="ebd-input"
    {disabled}
    value={inputValue}
    on:input={handleInput}
    on:focus={handleFocus}
    on:blur={handleBlur}
    placeholder={isFocused ? "" : "Bitte auswählen"}
    class="inline-block border-2 border-white rounded-lg bg-primary py-3 px-2 ps-3 pe-4 focus:outline-none w-full placeholder-black disabled:placeholder-opacity-25 text-base leading-relaxed cursor-pointer"
  />

  <label
    for="ebd-input"
    class="absolute top-0.5 left-3 -translate-y-1/2 text-xs text-slate-500 bg-white px-1 rounded"
  >
    EBD
  </label>

  {#if showOptions && !disabled}
    <div
      class="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg max-h-60 overflow-y-auto z-50 mt-1"
    >
      {#each filteredEbds as ebd}
        <button
          on:mousedown={() => handleSelect(ebd)}
          class="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
        >
          {ebd.ebd_name}
        </button>
      {/each}
    </div>
  {/if}
</div>
