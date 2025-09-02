import React, { useState, useEffect } from "react";
import { Set } from "../../interfaces/CardsInterface";

interface setChosenModeInterface {
  setChosenMode: React.Dispatch<
    React.SetStateAction<{
      mode: string;
      setCode?: string;
      isChosen: boolean;
      icon_svg_uri?: string;
      name: string;
    }>
  >;
}

const ChooseSet: React.FC<setChosenModeInterface> = ({ setChosenMode }) => {
  const [sets, setSets] = useState<Set[]>([]);
  const [searchedName, setSearchedName] = useState("");
  const [setFetched, isSetFetched] = useState(false);
  useEffect(() => {
    const fetchCards = async () => {
      try {
        await new Promise((resolve) => {
          setTimeout(resolve, 50); // Set a timeout of 50ms
        });
        const apiUrl = `https://api.scryfall.com/sets`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setSets(
          data.data.filter(
            (set: any) =>
              set.card_count > 25 && //filter the sets with small amount of cards
              (set.set_type === "core" ||
                set.set_type === "expansion" ||
                set.set_type === "masters" ||
                set.set_type === "commander" ||
                set.set_type === "draft_innovation" ||
                set.set_type === "starter"
              )
          )
        );
        isSetFetched(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCards();
  }, []);
  return (
    <div className="flex justify-center choose-set-wrap">
      <div className="choose-set flex flex-col">
        <h2>Choose Set</h2>
        <div>
          <input
            onChange={(event) => {
              setSearchedName(event.currentTarget.value);
            }}
            className="set-input"
            placeholder="Enter a set name and choose from the list"
          />
          <ul className="sets-list">
            {setFetched ? (
              sets
                .filter((set) =>
                  set.name.toLowerCase().includes(searchedName.toLowerCase())
                )
                .map((set) => (
                  <li
                    className="flex items-center"
                    key={set.code}
                    onClick={() => {
                      setChosenMode(() => ({
                        mode: "set",
                        setCode: set.code,
                        isChosen: true,
                        icon_svg_uri: set.icon_svg_uri,
                        name: set.name,
                      }));
                    }}
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
            disabled={!setFetched}
            onClick={() => {
              setChosenMode(() => ({
                mode: "commander",
                isChosen: true,
                name: "Commander",
              }));
            }}
          >
            Commander
          </button>
          <button
            disabled={!setFetched}
            onClick={() => {
              const randomNumber = Math.floor(Math.random() * sets.length);
              setChosenMode(() => ({
                mode: "set",
                setCode: sets[randomNumber].code,
                isChosen: true,
                icon_svg_uri: sets[randomNumber].icon_svg_uri,
                name: sets[randomNumber].name,
              }));
            }}
          >
            Random Set
          </button>
          <form
            className="year-input"
            onSubmit={(event) => {
              event.preventDefault();
              const inputYear = event.currentTarget.querySelector("input")?.value;
              if (!inputYear) {
                return;
              }

              // Filter sets based on the release year
              const filteredSets = sets.filter((set) =>
                set.released_at?.startsWith(inputYear)
              );

              if (filteredSets.length > 0) {
                // Choose a random set from the filtered list
                const randomNumber = Math.floor(Math.random() * filteredSets.length);
                const chosenSet = filteredSets[randomNumber];

                // Update the state with the chosen set
                setChosenMode({
                  mode: "set",
                  setCode: chosenSet.code,
                  isChosen: true,
                  icon_svg_uri: chosenSet.icon_svg_uri,
                  name: chosenSet.name,
                });
              } else {
                alert("No sets found for the selected year.");
              }
            }}
          >
            <button>Random Set Released In:</button>
            <input
              placeholder="Year"
              required
              type="number"
              min={1993}
              max={2025}
              onInput={(event) => {
                const value = event.currentTarget.value;
                event.currentTarget.value = value.replace(/[^0-9]/g, "");
              }}
              onBlur={(event) => {
                const value = parseInt(event.currentTarget.value);
                if (value < 1993) {
                  event.currentTarget.value = "1993";
                } else if (value > 2025) {
                  event.currentTarget.value = "2025";
                }
              }}
            />
          </form>
        </span>
      </div>
    </div>
  );
};

export default ChooseSet;
