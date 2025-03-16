import React from "react";
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

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/search?q=lang:en&page=1`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };
  return (
    <section className="Advanced-search flex justify-center">
      <form
        className="inner"
        onSubmit={handleFormSubmit}
        onKeyDown={handleKeyDown}
      >
        <h1>Advanced Search</h1>
        <ul className="filters flex flex-col">
          <Name />
          <Text />
          <Type />
          <Colors />
          <ManaSymbol />
          <Stats />
          <Games />
          <Formats />
          <Sets />
          <Rarity />
          <Flavor />
        </ul>
        <div className="flex justify-center">
          <button className="search-btn">Search with this options</button>
        </div>
      </form>
    </section>
  );
};

export default AdvancedSearch;
