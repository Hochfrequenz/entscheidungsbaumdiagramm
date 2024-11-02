import { readdirSync } from "fs";
import { join } from "path";

import { getEbds } from "./ebd-loader";
import { getFormatVersions } from "./format-version-loader";

export function prerenderEntries() {
  const staticPath = join(process.cwd(), "static", "ebd");
  const buildPath = join(process.cwd(), "build", "ebd");
  const basePath = readdirSync(staticPath) ? staticPath : buildPath;

  const formatVersions = getFormatVersions();
  const ebds = getEbds();

  const entries = [];
  const formatVersionCounts: Record<string, number> = {};

  for (const formatVersion of formatVersions) {
    const ebdList = ebds[formatVersion.code] || [];
    formatVersionCounts[formatVersion.code] = ebdList.length;

    for (const ebd of ebdList) {
      entries.push({
        ebd: `${formatVersion.code}/${ebd}`,
        filePath: join(basePath, formatVersion.code, `${ebd}.svg`),
      });
    }
  }

  // logging summary for local development ($ npm run build)
  console.log("\nEBD Prerender Summary:");
  console.log(`Base path: ${basePath}`);
  console.log(`Total routes: ${entries.length}`);
  Object.entries(formatVersionCounts)
    .sort(([a], [b]) => b.localeCompare(a))
    .forEach(([fv, count]) => console.log(`${fv}: ${count} routes`));
  console.log("");

  return entries;
}