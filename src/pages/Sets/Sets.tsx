import "./sets.scss";

import SearchSvg from "../../assets/images/icons/search.svg?react";
import GoTopArrow from "../../components/GoTopArrow/GoTopArrow";

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

import { useSets } from "../../utils/sets/useSets";

const Sets: React.FC = () => {
  const [searchedName, setSearchedName] = useState("");

  const { sets, isSetLoaded } = useSets();
  const filteredSets = useMemo(() => {
    return sets
      .filter((set) => set.card_count > 0)
      .filter((set) =>
        set.name.toLowerCase().includes(searchedName.toLowerCase())
      );
  }, [sets, searchedName]);

  return (
    <section className="Sets">
      <h1>Search for a set</h1>
      <div className="search-bar flex">
        <div className="search-wrap flex items-center justify-center">
          <SearchSvg />
        </div>
        <div className="input-wrap flex items-center">
          <input
            disabled={!isSetLoaded}
            placeholder='Any set name ex. "dominaria"'
            value={searchedName}
            onChange={(event) => {
              setSearchedName(event.currentTarget.value);
            }}
          />
        </div>
      </div>
      <ul className="sets-wrap flex flex-wrap">
        {isSetLoaded ? filteredSets.map((set) => (
          <Link to={`/sets/${set.code}`} key={set.id}>
            <li
              className="set-tile flex items-center justify-center"
              onMouseEnter={(event) => {
                event.currentTarget.classList.add("active");
              }}
              onMouseLeave={(event) => {
                event.currentTarget.classList.remove("active");
              }}
            >
              <img src={set.icon_svg_uri} alt={set.name} />
              {set.name}
            </li>
          </Link>
        ))
          /* Placeholders */
          : Array(18).fill(null).map((_, index) => (
            <li
              key={index}
              className="set-tile-placeholder flex items-center justify-center"
            />
          ))}
      </ul>
      <GoTopArrow />
    </section>
  );
};

export default Sets;
