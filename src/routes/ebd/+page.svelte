<script lang="ts">
  import { onMount } from "svelte";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { ExportButton, Header } from "$lib/components";
  import type { EbdNameExtended } from "$lib/types/metadata";

  import type { PageData } from "./$types";

  export let data: PageData;

  let selectedFormatVersion: string = data.initialState.formatVersion;
  let selectedEbd: string = data.initialState.ebd;
  let selectedRoles: string[] = data.initialState.roles || [];
  let ebdList: EbdNameExtended[] = filterEbdsByRole(
    selectedFormatVersion,
    selectedRoles,
  );

  let svgContainer: HTMLDivElement;
  let svgContent = "";
  let isLoading = false;
  let error: string | null = null;

  $: if (selectedFormatVersion) {
    ebdList = filterEbdsByRole(selectedFormatVersion, selectedRoles);
  }

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const formatVersion = urlParams.get("fv");
    const ebd = urlParams.get("ebd");
    const rolesParam = urlParams.get("roles");

    if (formatVersion) {
      selectedFormatVersion = formatVersion;
    }
    if (ebd) {
      selectedEbd = ebd;
    }
    if (rolesParam) {
      selectedRoles = rolesParam.split(",");
    }

    if (selectedFormatVersion) {
      ebdList = filterEbdsByRole(selectedFormatVersion, selectedRoles);
    }

    if (selectedFormatVersion && selectedEbd) {
      await loadSvg();
    }
  });

  function updateURL() {
    const params = new URLSearchParams();
    if (selectedFormatVersion) params.set("fv", selectedFormatVersion);
    if (selectedEbd) params.set("ebd", selectedEbd);
    if (selectedRoles.length > 0) params.set("roles", selectedRoles.join(","));

    const url = `${base}/ebd/?${params.toString()}`;
    goto(url, { replaceState: true, keepFocus: true });
  }

  $: {
    console.log("selectedRoles changed:", selectedRoles);
  }

  async function loadSvg() {
    if (!selectedFormatVersion || !selectedEbd) {
      svgContent = "";
      return;
    }

    isLoading = true;
    error = null;
    const ebdPath = `${base}/ebd/${selectedFormatVersion}/${selectedEbd}.svg`;

    try {
      const response = await fetch(ebdPath);
      if (!response.ok) {
        throw new Error(`http error: ${response.status}`);
      }
      svgContent = await response.text();
    } catch (err) {
      console.error(`error loading svg: ${err}`);
      error = String(err);
      svgContent = "";
    } finally {
      isLoading = false;
    }
  }

  function updateSvgSize() {
    const svg = svgContainer?.querySelector("svg");
    if (svg) {
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.style.display = "block";
    }
  }

  function handleFormatVersionSelect(version: string) {
    selectedFormatVersion = version;
    selectedRoles = [];
    selectedEbd = "";
    svgContent = "";
    ebdList = version ? filterEbdsByRole(version, []) : [];
    updateURL();
  }

  function handleEbdInput(ebdCode: string) {
    selectedEbd = ebdCode;
    loadSvg();
    updateURL();
  }

  function handleRoleSelect(roles: string[]) {
    selectedRoles = roles;
    ebdList = selectedFormatVersion
      ? filterEbdsByRole(selectedFormatVersion, roles)
      : [];
    updateURL();
  }

  function filterEbdsByRole(
    formatVersion: string,
    roles: string[],
  ): EbdNameExtended[] {
    if (!roles.length) return data.ebds[formatVersion] || [];

    const filteredEbds: EbdNameExtended[] = [];
    const formatVersionMetadata = data.metadata[formatVersion] || {};

    data.ebds[formatVersion]?.forEach((ebd) => {
      const ebdMetadata = formatVersionMetadata[ebd.ebd_code];
      if (
        ebdMetadata?.metadata.role &&
        roles.includes(ebdMetadata.metadata.role)
      ) {
        filteredEbds.push(ebd);
      }
    });

    return filteredEbds;
  }

  $: if (svgContent) {
    setTimeout(updateSvgSize, 0);
  }
</script>

<div class="flex flex-col h-full">
  <Header
    formatVersions={data.formatVersions}
    {selectedFormatVersion}
    onFormatVersionSelect={handleFormatVersionSelect}
    {ebdList}
    {selectedEbd}
    onEbdSelect={handleEbdInput}
    roles={data.roles}
    {selectedRoles}
    onRoleSelect={handleRoleSelect}
  >
    <svelte:fragment slot="actions">
      <ExportButton
        currentFormatVersion={selectedFormatVersion}
        currentEbd={selectedEbd}
        isDisabled={!selectedFormatVersion || !selectedEbd || !svgContent}
      />
    </svelte:fragment>
  </Header>

  <div class="flex-1 p-4">
    {#if isLoading}
      <div class="flex items-center justify-center h-full">
        <p>Loading SVG...</p>
      </div>
    {:else if error}
      <div class="flex items-center justify-center h-full">
        <p>{error}</p>
      </div>
    {:else if svgContent}
      <div
        class="max-w-[95vw] mx-auto h-full flex items-center justify-center"
        bind:this={svgContainer}
      >
        {@html svgContent}
      </div>
    {/if}
  </div>
</div>

<style>
  div :global(svg) {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }
</style>
