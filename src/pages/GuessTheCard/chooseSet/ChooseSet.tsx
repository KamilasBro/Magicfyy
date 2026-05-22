import "./chooseSet.scss"

import React, { useState, useMemo } from "react";
import { Set } from "../../../interfaces/Interfaces";
import { useSets } from "../../../utils/sets/useSets";

const allowedSetTypes = [
  "core",
  "expansion",
  "masters",
  "commander",
  "draft_innovation",
  "starter",
  "modern",
  "masterpiece"
];

const ChooseSet: React.FC<{
  setChosenMode: React.Dispatch<
    React.SetStateAction<{
      mode: string;
      setCode?: string;
      isChosen: boolean;
      icon_svg_uri?: string;
      name: string;
    }>
  >;
}> = ({ setChosenMode }) => {
  const [searchedName, setSearchedName] = useState("");
  const [inputYear, setInputYear] = useState("");
  const currentYear = new Date().getFullYear();

  const { sets, isSetLoaded } = useSets();
  const filteredSets = useMemo(() => {
    return sets.filter(
      (set) =>
        set.card_count > 25 &&
        set.set_type != null &&
        allowedSetTypes.includes(set.set_type)
    );
  }, [sets, searchedName]);

  //helpers
  const chooseSet = (set: Set) => {
    setChosenMode({
      mode: "set",
      setCode: set.code,
      isChosen: true,
      icon_svg_uri: set.icon_svg_uri,
      name: set.name,
    });
  };

  const handleRandomSetBtn = () => {
    const randomSet = sets[Math.floor(Math.random() * sets.length)];
    if (randomSet) chooseSet(randomSet);
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputYear) return;

    // Filter sets based on the release year
    const yearfilteredSets = sets.filter((set) =>
      set.released_at?.startsWith(inputYear)
    );

    if (yearfilteredSets.length > 0) {
      // Choose a random set from the filtered list
      const randomNumber = Math.floor(Math.random() * yearfilteredSets.length);
      const chosenSet = yearfilteredSets[randomNumber];

      chooseSet(chosenSet)
    } else {
      console.error("No sets found for the selected year.");
    }
  }

  return (
    <div className="flex justify-center choose-set-wrap">
      <div className="choose-set flex flex-col">
        <h2>Choose Set</h2>
        <div>
          <input
            onChange={(event) => setSearchedName(
              event.currentTarget.value
                .toLowerCase()
                .trim()
            )}
            className="set-input"
            placeholder="Enter a set name and choose from the list"
          />
          <ul className="sets-list">
            {isSetLoaded ? (
              filteredSets
                .filter((set) =>
                  set.name.toLowerCase().includes(searchedName)
                )
                .map((set) => (
                  <li
                    className="flex items-center"
                    key={set.code}
                    onClick={() => chooseSet(set)}
                  >
                    <img src={set.icon_svg_uri} alt={`${set.name} icon`} />
                    {set.name}
                  </li>
                ))
            ) : (
              <div className="set-placeholders flex flex-col">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="set-placeholder flex items-center"
                  >
                    <span></span>
                    <div></div>
                  </div>
                ))}
              </div>
            )}
          </ul>
        </div>
        <span className="btn-wrap flex">
          <button
            disabled={!isSetLoaded}
            onClick={() => setChosenMode(() => ({
              mode: "commander",
              isChosen: true,
              name: "Commander",
            }))}
          >
            Commander
          </button>
          <button
            disabled={!isSetLoaded}
            onClick={handleRandomSetBtn}
          >
            Random Set
          </button>
          <form
            className="year-input"
            onSubmit={(event) => handleFormSubmit(event)}
          >
            <button>Random Set Released In:</button>
            <input
              placeholder="Year"
              required
              type="number"
              min={1993}
              max={currentYear}
              value={inputYear}
              onChange={(event) => setInputYear(event.target.value)}
              onBlur={(event) => {
                let parsedValue = parseInt(event.target.value);

                if (parsedValue < 1993) parsedValue = 1993;
                if (parsedValue > currentYear) parsedValue = currentYear;

                setInputYear(String(parsedValue));
              }}
            />
          </form>
        </span>
      </div>
    </div>
  );
};

export default ChooseSet;
