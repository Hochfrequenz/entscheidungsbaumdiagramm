<script lang="ts">
  import { onMount } from "svelte";

  export let isDisabled: boolean = false; // controls whether the role filter is disabled (depending on state of <FormatVersionSelect />)
  export let formatVersion: string = ""; // currently selected format version that determines available roles
  export let roles: Record<string, string[]> = {}; // maps format versions to their available roles for EBD filtering
  export let initialRoles: string[] = []; // initialize the roles in both the page and the component
  export let onSelect: (selectedRoles: string[]) => void;

  let selectedRoles: Set<string> = new Set(initialRoles);
  let selectElement: HTMLSelectElement;
  let isSelectFocused = false;
  let isInitialized = false;

  $: availableRoles = formatVersion ? roles[formatVersion] || [] : [];

  // initialize selectedRoles when initialRoles changes
  $: if (!isInitialized && initialRoles.length > 0) {
    selectedRoles = new Set(initialRoles);
    isInitialized = true;
  }

  // reset role filter select upon changing format version
  $: if (formatVersion && isInitialized) {
    if (!selectedRoles.size) {
      selectedRoles = new Set(initialRoles);
    }
  }

  onMount(() => {
    if (initialRoles.length > 0) {
      selectedRoles = new Set(initialRoles);
      onSelect([...selectedRoles]);
    }
    isInitialized = true;
  });

  function handleSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const role = select.value;
    if (role && !selectedRoles.has(role)) {
      selectedRoles = new Set([...selectedRoles, role]);
      onSelect([...selectedRoles]);
    }
    select.value = "";
  }

  function removeRole(role: string) {
    selectedRoles = new Set([...selectedRoles].filter((r) => r !== role));
    onSelect([...selectedRoles]);
  }

  // visual indicator that all roles are selected and no EBDs are filtered (by role)
  function removePlaceholderChip() {
    selectedRoles = new Set();
    onSelect([]);
  }

  function handleFocus() {
    isSelectFocused = true;
  }

  function handleBlur() {
    setTimeout(() => {
      isSelectFocused = false;
    }, 200);
  }
</script>

<div class="flex flex-col items-start mt-2 w-full relative">
  <div class="w-full">
    <label
      for="role-select"
      class="absolute top-0.5 left-3 -translate-y-1/2 text-xs text-slate-500 bg-white px-1 rounded z-10"
    >
      Filter: prüfende Rollen
    </label>

    <div
      class="border-2 border-white rounded-lg bg-primary p-3 flex flex-wrap items-center gap-2"
    >
      {#if selectedRoles.size === 0 && !isSelectFocused}
        <button
          type="button"
          class="inline-flex items-center border-2 border-tint rounded-full px-3 py-1 text-sm text-black disabled:opacity-25"
          on:click={removePlaceholderChip}
          disabled={isDisabled}
        >
          alle
          <svg
            class="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      {:else}
        {#each [...selectedRoles] as role}
          <button
            type="button"
            class="inline-flex items-center border-2 border-tint rounded-full px-3 py-1 text-sm text-black"
            on:click={() => removeRole(role)}
            disabled={isDisabled}
          >
            {role}
            <svg
              class="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        {/each}
      {/if}

      <select
        id="role-select"
        bind:this={selectElement}
        on:change={handleSelect}
        on:focus={handleFocus}
        on:blur={handleBlur}
        disabled={isDisabled}
        class="flex-1 min-w-[120px] bg-transparent text-black disabled:text-black/25 cursor-pointer disabled:cursor-not-allowed appearance-none focus:outline-none"
      >
        <option value="" class="hidden"> </option>
        {#each availableRoles as role}
          {#if !selectedRoles.has(role)}
            <option value={role} class="bg-primary">{role}</option>
          {/if}
        {/each}
      </select>
    </div>
  </div>
</div>
