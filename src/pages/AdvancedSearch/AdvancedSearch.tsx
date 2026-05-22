import "./advancedSearch.scss";

import Name from "./advFilters/name/Name";
import Text from "./advFilters/text/Text";
import Types from "./advFilters/types/Types";
import Colors from "./advFilters/colors/Colors";
import CMCs from "./advFilters/cmcs/CMCs";
import Stats from "./advFilters/stats/Stats";
import Games from "./advFilters/games/Games";
import Formats from "./advFilters/formats/Formats";
import Blocks from "./advFilters/blocks/Blocks";
import Rarity from "./advFilters/rarity/Rarity";
import Flavor from "./advFilters/flavor/Flavor";

import { buildQueries } from "./helpers/buildQueries";
import React, { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { initialState, advancedSearchReducer } from "./store/reducerStore";

const AdvancedSearch: React.FC = () => {
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(
    advancedSearchReducer,
    initialState
  );

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/search?${buildQueries(state)}`);
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
          <Name setNameFilter={dispatch} />
          <Text setTextFilter={dispatch} />
          <Types setTypesFilter={dispatch} />
          <Colors
            colorsFilter={state.colorsFilter}
            setColorsFilter={dispatch}
          />
          <CMCs CMCsFilter={state.CMCsFilter} setCMCsFilter={dispatch} />
          <Stats statsFilter={state.statsFilter} setStatsFilter={dispatch} />
          <Games gameModesFilter={state.gameModesFilter} setGameModesFilter={dispatch} />
          <Formats formatsFilter={state.formatsFilter} setFormatsFilter={dispatch} />
          <Blocks
            blocksFilter={state.blocksFilter}
            setBlocksFilter={dispatch}
          />
          <Rarity
            raritiesFilter={state.raritiesFilter}
            setRaritiesFilter={dispatch}
          />
          <Flavor flavorTextFilter={state.flavorTextFilter} setFlavorTextFilter={dispatch} />
        </ul>
        <div className="flex justify-center">
          <button className="search-btn">Search with these options</button>
        </div>
      </form>
    </section>
  );
};

export default AdvancedSearch;