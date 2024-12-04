<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import {
    EbdInput,
    FilterRoleSelect,
    FormatVersionSelect,
    Header,
  } from "$lib/components";
  import type { EbdNameExtended } from "$lib/types/metadata";

  import type { PageData } from "./$types";

  export let data: PageData;

  let selectedFormatVersion = "";
  let selectedEbd = "";
  let selectedRoles: string[] = [];
  let ebdList: EbdNameExtended[] = [];

  $: if (selectedFormatVersion && selectedRoles !== undefined) {
    ebdList = filterEbdsByRole(selectedFormatVersion, selectedRoles);
  }

  function handleFormatVersionSelect(version: string) {
    selectedFormatVersion = version;
    selectedRoles = [];
    ebdList = selectedFormatVersion
      ? data.ebds[selectedFormatVersion] || []
      : [];
  }

  function handleEbdInput(ebdCode: string) {
    selectedEbd = ebdCode;
    if (selectedFormatVersion && selectedEbd) {
      goto(`${base}/ebd/${selectedFormatVersion}/${selectedEbd}`);
    }
  }

  function handleRoleSelect(roles: string[]) {
    selectedRoles = roles;
    ebdList = selectedFormatVersion
      ? filterEbdsByRole(selectedFormatVersion, roles)
      : [];
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
</script>

<Header />
<div
  class="container mx-auto flex flex-1 max-w-5xl justify-between items-center gap-20"
>
  <div class="w-3/5">
    <h2
      class="border-b border-secondary inline-block pb-[10px] text-xl uppercase"
    >
      Entscheidungsbaumdiagramme - ???
    </h2>
    <p class="text-base text-justify pt-[20px]">
      Wer mit den vom BDEW veröffentlichten Entscheidungsbaum-”Diagrammen“
      (EBDs) arbeitet weiß: Die tabellarische Form ist sperrig und mindestens
      unübersichtlich. Unsere automatisch generierten EBDs von Hochfrequenz sind
      hingegen echte Diagramme - lesbar und nutzungsfreundlich.
    </p>
    <p class="text-base text-justify pt-[20px]">
      Die auf edi@energy veröffentlichten Word-Dateien werden von uns
      vollautomatisch ausgelesen. Aus den so gewonnenen Rohdaten erstellt unsere
      Software anschließend ebenso automatisiert Diagramme, welche inhaltlich zu
      100% den offiziellen BDEW-Dokumenten entsprechen. Die Diagramme helfen
      Fachbereichen und Menschen mit Prozess-Expertise dabei, ihre Systeme fit
      für neue oder angepasste Prüflogiken zu machen. Auf Grundlage echter
      Diagramme lässt sich viel leichter überblicken, an welcher Stelle
      Implementierungsaufwände anfallen, ohne dabei den Gesamtprozess aus den
      Augen zu verlieren.
    </p>
    <p class="text-base text-justify pt-[20px]">
      Die Diagramme können entweder als SVG-Dateien heruntergeladen werden, oder
      auch als puml, um entsprechend eigene Erweiterungen, Notizen usw. darin
      abzubilden.
    </p>
  </div>

  <div class="w-2/5 flex flex-col">
    <div class="mb-4">
      <FormatVersionSelect
        formatVersions={data.formatVersions}
        selectedVersion={selectedFormatVersion}
        onSelect={handleFormatVersionSelect}
      />
    </div>
    <div class="my-4">
      <FilterRoleSelect
        isDisabled={!selectedFormatVersion}
        formatVersion={selectedFormatVersion}
        roles={data.roles}
        onSelect={handleRoleSelect}
      />
    </div>
    <div class="mt-4">
      <EbdInput
        ebds={ebdList}
        disabled={!selectedFormatVersion}
        selectedEbdCode={selectedEbd}
        formatVersionChanged={false}
        onSelect={handleEbdInput}
      />
    </div>
  </div>
</div>
