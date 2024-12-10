<script lang="ts">
  import { base } from "$app/paths";
  import {
    EbdInput,
    EbdNavigation,
    FilterRoleSelect,
    FormatVersionSelect,
    IconLogo,
  } from "$lib/components";
  import type { EbdNameExtended } from "$lib/types/metadata";

  export let formatVersions: Array<{
    code: string;
    detailedFormatVersion: string;
  }> = [];
  export let selectedFormatVersion: string = "";
  export let onFormatVersionSelect: (version: string) => void;
  export let ebdList: EbdNameExtended[] = [];
  export let selectedEbd: string = "";
  export let onEbdSelect: (ebdCode: string) => void;
  export let roles: Record<string, string[]> = {};
  export let selectedRoles: string[] = [];
  export let onRoleSelect: (roles: string[]) => void;
</script>

<header class="bg-primary">
  <div class="mx-auto">
    <nav
      class="flex items-center justify-between px-6 py-4 border-b border-white/10"
      aria-label="Global"
    >
      <div class="flex items-center w-4/5">
        <a href="{base}/" title="landingpage" class="flex-none items-center">
          <IconLogo />
        </a>
        <span class="text-xl text-white">EBD.HOCHFREQUENZ.DE</span>
        <div class="-mt-2 pl-10 w-1/5">
          <FormatVersionSelect
            {formatVersions}
            selectedVersion={selectedFormatVersion}
            onSelect={onFormatVersionSelect}
          />
        </div>
        <div class="-mt-2 pl-5 w-1/5">
          <FilterRoleSelect
            isDisabled={!selectedFormatVersion}
            formatVersion={selectedFormatVersion}
            {roles}
            onSelect={onRoleSelect}
            initialRoles={selectedRoles}
          />
        </div>
        <div class="-mt-2 pl-5 w-1/3 mr-1">
          <EbdInput
            ebds={ebdList}
            disabled={!selectedFormatVersion}
            selectedEbdCode={selectedEbd}
            formatVersionChanged={false}
            onSelect={onEbdSelect}
          />
        </div>
        <EbdNavigation
          currentEbds={ebdList}
          selectedEbdCode={selectedEbd}
          currentFormatVersion={selectedFormatVersion}
          onSelect={onEbdSelect}
          isDisabled={!selectedFormatVersion || !selectedEbd}
        />
      </div>
      <div class="ml-auto">
        <slot name="actions" />
      </div>
    </nav>
  </div>
</header>
