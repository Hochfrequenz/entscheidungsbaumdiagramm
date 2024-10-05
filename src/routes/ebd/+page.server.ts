import { getFormatVersions } from "../../server/format-version-loader";
// eslint-disable-next-line import/order
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const formatVersions = getFormatVersions();

  return {
    formatVersions,
  };
};