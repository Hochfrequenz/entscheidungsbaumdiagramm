<script lang="ts">
  import {
    EbdInput,
    EbdNavigation,
    FilterChapterSelect,
    FilterRoleSelect,
    FilterSectionInput,
    FormatVersionSelect,
  } from "$lib/components";
  import type { EbdNameExtended, MetaData } from "$lib/types/metadata";

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
  export let chapters: Record<string, string[]> = {};
  export let selectedChapters: string[] = [];
  export let onChapterSelect: (chapters: string[]) => void;
  export let metadata: Record<string, Record<string, MetaData>> = {};
  export let onSectionSelect: (ebdCode: string) => void;
</script>

<header class="bg-primary">
  <div class="mx-auto">
    <nav
      class="flex items-center justify-between px-6 py-4 border-b border-white/10"
      aria-label="Global"
    >
      <div class="flex items-center gap-4 w-[45%]">
        <div class="w-2/5">
          <FormatVersionSelect
            {formatVersions}
            selectedVersion={selectedFormatVersion}
            onSelect={onFormatVersionSelect}
          />
        </div>
        <div class="flex items-center gap-1 w-2/5">
          <div class="flex-1">
            <EbdInput
              ebds={ebdList}
              disabled={!selectedFormatVersion}
              selectedEbdCode={selectedEbd}
              formatVersionChanged={false}
              onSelect={onEbdSelect}
            />
          </div>
          <div class="mt-2">
            <EbdNavigation
              currentEbds={ebdList}
              selectedEbdCode={selectedEbd}
              currentFormatVersion={selectedFormatVersion}
              onSelect={onEbdSelect}
              isDisabled={!selectedFormatVersion || !selectedEbd}
            />
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4 w-[55%]">
        <div class="w-1/3">
          <FilterRoleSelect
            isDisabled={!selectedFormatVersion}
            formatVersion={selectedFormatVersion}
            {roles}
            onSelect={onRoleSelect}
            initialRoles={selectedRoles}
          />
        </div>
        <div class="w-1/3">
          <FilterChapterSelect
            isDisabled={!selectedFormatVersion}
            formatVersion={selectedFormatVersion}
            chapter={chapters}
            onSelect={onChapterSelect}
            initialChapters={selectedChapters}
          />
        </div>
        <div class="w-1/3">
          <FilterSectionInput
            {metadata}
            formatVersion={selectedFormatVersion}
            disabled={!selectedFormatVersion}
            onSelect={onSectionSelect}
          />
        </div>
        <div class="ml-4">
          <slot name="actions" />
        </div>
      </div>
    </nav>
  </div>
</header>
