import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./advancedSearch.scss";
import Name from "./filters/Name";
import Text from "./filters/Text";
import Type from "./filters/Type";
import Colors from "./filters/Colors";
import ManaSymbol from "./filters/ManaCost";
import Stats from "./filters/Stats";
import Games from "./filters/Games";
import Formats from "./filters/Formats";
import Sets from "./filters/Sets";
import Rarity from "./filters/Rarity";
import Flavor from "./filters/Flavor";

const AdvancedSearch: React.FC = () => {
  const navigate = useNavigate();
  const [nameFilter, setNameFilter] = useState("");
  const [textFilter, setTextFilter] = useState("");
  const [gameModes, setGameModes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<
    { type: string; isIncluded: boolean }[]
  >([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [colorOption, setColorOption] = useState<string>(
    "Exactly these colors"
  );
  const [manaCost, setManaCost] = useState<string>("");
  const [statsList, setStatsList] = useState<
    { stat: string; condition: string; value: string }[]
  >([]);
  const [formatsList, setFormatsList] = useState<
    { legality: string; format: string }[]
  >([]);
  const [selectedSets, setSelectedSets] = useState<
    { name: string; code: string }[]
  >([]);
  const [selectedBlocks, setSelectedBlocks] = useState<
    { name: string; code: string }[]
  >([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [flavorText, setFlavorText] = useState<string>("");

  const buildTextQuery = (text: string) => {
    return text
      ? `(${text
          .split(" ")
          .map((word) => `oracle:${word}`)
          .join("+")})`
      : "";
  };

  const buildGameModesQuery = (modes: string[]) => {
    return modes.length > 0
      ? modes.map((mode) => `game:${mode}`).join("+")
      : "";
  };

  const buildTypeQuery = (
    types: { type: string; isIncluded: boolean }[]
  ) => {
    return types
      .map(({ type, isIncluded }) => `${isIncluded ? "" : "-"}type:${type}`)
      .join("+");
  };

  const buildColorsQuery = (colors: string[], option: string) => {
    if (colors.length === 0) return "";
    const prefix =
      option === "Exactly these colors"
        ? "color="
        : option === "Including these colors"
        ? "color>="
        : "color<=";
    return `${prefix}${colors.join("")}`;
  };

  const buildManaCostQuery = (manaCost: string) => {
    return manaCost ? `mana=${manaCost}` : "";
  };

  const buildStatsQuery = (
    stats: { stat: string; condition: string; value: string }[]
  ) => {
    return stats
      .map(({ stat, condition, value }) => `${stat}${condition}${value}`)
      .join("+");
  };

  const buildFormatsQuery = (
    formats: { legality: string; format: string }[]
  ) => {
    return formats
      .map(({ legality, format }) => `${legality.toLowerCase()}:${format}`)
      .join("+");
  };

  const buildSetsQuery = (
    sets: { name: string; code: string }[],
    blocks: { name: string; code: string }[]
  ) => {
    const setsQuery = sets.map((set) => `set:${set.code}`).join("+");
    const blocksQuery = blocks.map((block) => `block:${block.code}`).join("+");
    return [setsQuery, blocksQuery].filter(Boolean).join("+");
  };

  const buildRarityQuery = (rarities: string[]) => {
    return rarities.length > 0 ? `rarity:${rarities.join(",")}` : "";
  };

  const buildFlavorQuery = (flavor: string) => {
    return flavor
      ? `(${flavor
          .split(" ")
          .map((word) => `flavor:${word}`)
          .join(" ")})`
      : "";
  };

  const buildQuery = (
    name: string,
    textQuery: string,
    gameModesQuery: string,
    typeQuery: string,
    colorsQuery: string,
    manaCostQuery: string,
    statsQuery: string,
    formatsQuery: string,
    setsQuery: string,
    rarityQuery: string,
    flavorQuery: string
  ) => {
    const query = `q=${name ? `name:${name}` : ""}${
      textQuery ? `+${textQuery}` : ""
    }${gameModesQuery ? `+(${gameModesQuery})` : ""}${
      typeQuery ? `+${typeQuery}` : ""
    }${colorsQuery ? `+${colorsQuery}` : ""}${
      manaCostQuery ? `+${manaCostQuery}` : ""
    }${statsQuery ? `+${statsQuery}` : ""}${
      formatsQuery ? `+${formatsQuery}` : ""
    }${setsQuery ? `+${setsQuery}` : ""}${
      rarityQuery ? `+${rarityQuery}` : ""
    }${flavorQuery ? `+${flavorQuery}` : ""}`;

    const hasFilters = query !== "q="; // Check if query contains any filters
    return hasFilters ? `${query}&lang:en&page=1` : `${query}lang:en&page=1`;
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const textQuery = buildTextQuery(textFilter);
    const gameModesQuery = buildGameModesQuery(gameModes);
    const typeQuery = buildTypeQuery(selectedTypes);
    const colorsQuery = buildColorsQuery(selectedColors, colorOption);
    const manaCostQuery = buildManaCostQuery(manaCost);
    const statsQuery = buildStatsQuery(statsList);
    const formatsQuery = buildFormatsQuery(formatsList);
    const setsQuery = buildSetsQuery(selectedSets, selectedBlocks);
    const rarityQuery = buildRarityQuery(selectedRarities);
    const flavorQuery = buildFlavorQuery(flavorText);
    const query = buildQuery(
      nameFilter,
      textQuery,
      gameModesQuery,
      typeQuery,
      colorsQuery,
      manaCostQuery,
      statsQuery,
      formatsQuery,
      setsQuery,
      rarityQuery,
      flavorQuery
    );
    navigate(`/search?${query}`);
  };

  // const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
  //   if (event.key === "Enter") {
  //     event.preventDefault();
  //   }
  // };

  return (
    <section className="Advanced-search flex justify-center">
      <form
        className="inner"
        onSubmit={handleFormSubmit}
        // onKeyDown={handleKeyDown}
      >
        <h1>Advanced Search</h1>
        <ul className="filters flex flex-col">
          <Name setNameFilter={setNameFilter} />
          <Text setTextFilter={setTextFilter} />
          <Type
            setSelectedTypes={setSelectedTypes}
          />
          <Colors
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            colorOption={colorOption}
            setColorOption={setColorOption}
          />
          <ManaSymbol manaCost={manaCost} setManaCost={setManaCost} />
          <Stats statsList={statsList} setStatsList={setStatsList} />
          <Games gameModes={gameModes} setGameModes={setGameModes} />
          <Formats formatsList={formatsList} setFormatsList={setFormatsList} />
          <Sets
            selectedSets={selectedSets}
            setSelectedSets={setSelectedSets}
            selectedBlocks={selectedBlocks}
            setSelectedBlocks={setSelectedBlocks}
          />
          <Rarity
            selectedRarities={selectedRarities}
            setSelectedRarities={setSelectedRarities}
          />
          <Flavor flavorText={flavorText} setFlavorText={setFlavorText} />
        </ul>
        <div className="flex justify-center">
          <button className="search-btn">Search with these options</button>
        </div>
      </form>
    </section>
  );
};

export default AdvancedSearch;