import { AdvancedSearchFilters } from "@/interfaces/Interfaces";

export const buildQueries = (state: AdvancedSearchFilters) => {
  const {
    nameFilter,
    textFilter,
    typesFilter,
    colorsFilter,
    CMCsFilter,
    statsFilter,
    gameModesFilter,
    formatsFilter,
    blocksFilter,
    raritiesFilter,
    flavorTextFilter,
  } = state;

  const buildTextQuery = () =>
    textFilter
      ? `(${textFilter
          .split(" ")
          .map((word) => `oracle:${word}`)
          .join("+")})`
      : "";

  const buildTypesQuery = () =>
    typesFilter
      .map((type) => `${type.isIncluded ? "" : "-"}type:${type.type}`)
      .join("+");

  const buildColorsQuery = () => {
    if (!colorsFilter.colors.length) return "";

    const prefix =
      colorsFilter.option === "Exactly these colors"
        ? "color="
        : colorsFilter.option === "Including these colors"
          ? "color>="
          : "color<=";

    return `${prefix}${colorsFilter.colors.join("")}`;
  };

  const buildCMCsQuery = () => (CMCsFilter ? `mana=${CMCsFilter}` : "");

  const buildStatsQuery = () =>
    statsFilter
      .map((stat) => `${stat.stat}${stat.condition}${stat.value}`)
      .join("+");

  const buildGameModesQuery = () =>
    gameModesFilter.length
      ? gameModesFilter.map((mode) => `game:${mode}`).join("+")
      : "";

  const buildFormatsQuery = () =>
    formatsFilter
      .map(
        (formatEle) =>
          `${formatEle.legality.toLowerCase()}:${formatEle.format}`,
      )
      .join("+");

  const buildBlocksQuery = () => {
    const parts = [
      ...blocksFilter.sets.map((set) => `set:${set.code}`),
      ...blocksFilter.blocks.map((block) => `block:${block.code}`),
    ];

    return parts.length ? `(${parts.join("+OR+")})` : "";
  };

  const buildRarityQuery = () => {
    if (!raritiesFilter.length) return "";
    if (raritiesFilter.length === 1) return `rarity:${raritiesFilter[0]}`;

    return `(${raritiesFilter.map((rarity) => `rarity:${rarity}`).join(" OR ")})`;
  };

  const buildFlavorQuery = () =>
    flavorTextFilter
      ? `(${flavorTextFilter
          .split(" ")
          .map((word) => `flavor:${word}`)
          .join(" ")})`
      : "";

  const buildQuery = () => {
    const add = (part: string) =>
      part ? (part.startsWith("(") ? part : `+${part}`) : "";

    const query =
      `q=${nameFilter ? `name:${nameFilter}` : ""}` +
      add(buildTextQuery()) +
      (buildGameModesQuery() ? `+(${buildGameModesQuery()})` : "") +
      add(buildTypesQuery()) +
      add(buildColorsQuery()) +
      add(buildCMCsQuery()) +
      add(buildStatsQuery()) +
      add(buildFormatsQuery()) +
      add(buildBlocksQuery()) +
      add(buildRarityQuery()) +
      add(buildFlavorQuery());

    const hasFilters = query !== "q=";
    return hasFilters ? `${query}&lang:en&page=1` : `${query}lang:en&page=1`;
  };

  return buildQuery();
};
