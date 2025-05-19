import React, { useState, useEffect } from "react";
import { CardData } from "../../interfaces/CardsInterface";
import ChooseSet from "./ChooseSet";
import SendSvg from "../../assets/images/icons/send.svg?react";
import CloseSvg from "../../assets/images/icons/close.svg?react";
import ArrowDownSvg from "../../assets/images/icons/arrowDown.svg?react";
import LoadingCardsAnim from "../../components/LoadingCardsAnim/LoadingCardsAnim";
import "./guessTheCard.scss";


const GuessTheCard: React.FC = () => {
  const [chosenSet, setChosenSet] = useState<{
    setCode: string;
    isChosen: boolean;
    icon_svg_uri: string;
    name: string;
  }>({
    setCode: "",
    isChosen: false,
    icon_svg_uri: "",
    name: "",
  });
  const [dataFromSet, setDataFromSet] = useState<CardData[]>([]);
  const [randomCard, setRandomCard] = useState<CardData>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [guesses, setGuesses] = useState<CardData[]>([]);
  const [showPopup, setShowPopup] = useState<{ option: string; show: boolean }>(
    { option: "", show: false }
  );
  const [showHints, setShowHints] = useState<{
    formatsLegality: boolean;
    color: boolean;
    oracleText: boolean;
    firstLetter: boolean;
    artwork: boolean;
  }>({
    formatsLegality: false,
    color: false,
    oracleText: false,
    firstLetter: false,
    artwork: false,
  });
  const gameCategories = [
    "Card Image",
    "Type",
    "Color",
    "CMC",
    "Rarity",
    "Art Author",
    "Super Type",
  ];
  useEffect(() => {
    const fetchCards = async () => {
      try {
        if (chosenSet.isChosen && chosenSet.setCode) {
          let hasMore = true;
          let page = 1;
          const allCards: CardData[] = []; // Temporary array for all cards

          while (hasMore) {
            await new Promise((resolve) => setTimeout(resolve, 50)); // Set a timeout of 50ms
            const apiUrl = `https://api.scryfall.com/cards/search?q=e:${chosenSet.setCode}&page=${page}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
              throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            allCards.push(...data.data); // Add fetched cards to the temporary array
            hasMore = data.has_more; // Check if there are more pages
            page++;
          }

          // After fetching, set the data and choose a random card
          setDataFromSet(allCards);
          const randomIndex = Math.floor(Math.random() * allCards.length);
          setRandomCard(allCards[randomIndex]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCards();
  }, [chosenSet.setCode, chosenSet.isChosen]); // React to changes in chosenSet

  //maintenance
  useEffect(() => {
    console.log(dataFromSet);
    console.log(randomCard);
  }, [dataFromSet]);
  //maintenance

  useEffect(() => {
    if (showPopup.show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPopup.show]);
  function resetSet() {
    setChosenSet({
      setCode: "",
      isChosen: false,
      icon_svg_uri: "",
      name: "",
    });
    setDataFromSet([]);
    setRandomCard(undefined);
    setGuesses([]);
    setSearchValue("");
  }
  function renderPopup() {
    return (
      <div className="popup-wrap flex justify-center items-center" onClick={() => {
        setShowPopup({ option: "", show: false });
      }}>
        {
          showPopup.option === "reset" ? (
            <div className="popup popup-reset" onClick={(e) => e.stopPropagation()}>
              <h2>Do you want to reset set?</h2>
              <span className="reset-btns-wrap flex justify-center">
                <button onClick={() => {
                  resetSet();
                  setShowPopup({ option: "", show: false });
                }}>Yes</button>
                <button
                  onClick={() => {
                    setShowPopup({ option: "", show: false });
                  }}
                >
                  No
                </button>
              </span>
            </div>
          ) : showPopup.option === "hints" ? (
            <div className="popup popup-hints" onClick={(e) => e.stopPropagation()}>
              <CloseSvg className="close-icon" onClick={() => {
                setShowPopup({ option: "", show: false });
              }} />
              <h2>Hints</h2>
              <ul className="flex flex-col">
                <li>
                  <p className="flex items-center">
                    Formats Legality {guesses.length < 3 ? <span className="hint-counter">Hint in {3 - guesses.length} guesses</span> : <ArrowDownSvg className="arrow-icon" onClick={() => {
                      setShowHints((prevState) => ({
                        ...prevState,
                        formatsLegality: !prevState.formatsLegality,
                      }));
                    }} />}
                  </p>
                  {showHints.formatsLegality && <ul className="formats">
                    asdasdasd
                  </ul>}
                </li>
                <li>
                  <p>
                    Color <span className="hint-counter">Hint in {6 - guesses.length} guesses</span>
                    <span></span>
                  </p>
                  <div></div>
                </li>
                <li>
                  <p>
                    Oracle Text <span className="hint-counter">Hint in {9 - guesses.length} guesses</span>
                    <span></span>
                  </p>
                  <div></div>
                </li>
                <li>
                  <p>
                    First Letter <span className="hint-counter">Hint in {12 - guesses.length} guesses</span>
                    <span></span>
                  </p>
                  <div></div>
                </li>
                <li>
                  <p>
                    Artwork <span className="hint-counter">Hint in x guesses</span>
                    <span></span>
                  </p>
                  <div></div>
                </li>
              </ul>
            </div>
          ) : (
            <></>
          )
        }
      </div >
    );
  }

  return (
    <section className="Guess-the-card">
      <span className="title flex items-end justify-center">
        <h1>Guess The Card</h1>
        <h3>Beta v1.0</h3>
      </span>
      {!chosenSet.isChosen ? (
        <ChooseSet setChosenSet={setChosenSet} />
      ) : (
        <>
          <div className="guess-wrap">
            <span className="set-name flex justify-center items-center">
              <img src={chosenSet.icon_svg_uri} alt="set-icon" />
              <h2>{chosenSet.name}</h2>
            </span>
            {!randomCard && dataFromSet.length === 0 ? <LoadingCardsAnim /> :
              <>
                <div className="search-input flex justify-center">
                  <div>
                    <div className="input-wrap flex">
                      <input
                        value={searchValue}
                        placeholder="Any Card Name"
                        onChange={(event) => {
                          setSearchValue(event.target.value);
                        }}
                      />
                      <div className="send-wrap flex justify-center items-center">
                        <SendSvg />
                      </div>
                    </div>
                    {searchValue && (
                      <ul className="dropdown">
                        {dataFromSet
                          .filter((card) => {
                            // Sprawdź, czy karta nie jest już w zgadywanych i czy nazwa zaczyna się od wpisanej frazy
                            return (
                              !guesses.some((guess) => guess.name === card.name) && // Sprawdź, czy karta nie jest już zgadywana
                              card.name.toLowerCase().startsWith(searchValue.toLowerCase()) // Sprawdź, czy nazwa karty zaczyna się od wpisanej frazy
                            );
                          })
                          .map((card) => {
                            return (
                              <li
                                key={card.id}
                                className="flex"
                                onClick={() => {
                                  setGuesses((prevState) => [...prevState, card]);
                                  setSearchValue("");
                                }}
                              >
                                <span className="card-name">{card.name}</span>
                              </li>
                            );
                          })}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="panel flex justify-center">
                  <div className="btns-wrap flex  items-center">
                    <button
                      onClick={() => setShowPopup({ option: "reset", show: true })}
                    >
                      Reset Set
                    </button>
                    <button
                      onClick={() => setShowPopup({ option: "hints", show: true })}
                    >
                      Hints
                    </button>
                    <div className="guesses-counter">
                      Your guesses: <span>{guesses.length}</span>
                    </div>
                  </div>
                </div>
                <div className="game">
                  <ul className="categories">
                    {gameCategories.map((category, index) => {
                      return (
                        <li key={index} className="category">
                          <span>{category}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="guesses flex flex-col">
                    {guesses.map((guess, index) => {
                      return (
                        <ul className="guess" key={guess.id + index}>
                          <li>
                            <img
                              src={
                                guess?.image_uris?.art_crop ||
                                (guess?.card_faces?.[0]?.image_uris?.art_crop ?? "default-image-url")
                              }
                              alt="card-art"
                            />
                          </li>
                          <li
                            className={(() => {
                              const basicTypes = [
                                "Artifact",
                                "Creature",
                                "Enchantment",
                                "Instant",
                                "Land",
                                "Planeswalker",
                                "Sorcery",
                                "Battle",
                              ]; // List of basic card types

                              // Filter and process the `type_line` for the guess and randomCard
                              const guessTypes = (guess.type_line || "")
                                .split(/[\s//]+/)
                                .filter((type) => basicTypes.includes(type));

                              const randomCardTypes = (randomCard?.type_line || "")
                                .split(/[\s//]+/)
                                .filter((type) => basicTypes.includes(type));

                              // Check for exact match
                              if (
                                guessTypes.length === randomCardTypes.length &&
                                guessTypes.every((type) => randomCardTypes.includes(type))
                              ) {
                                return `correct`;
                              }

                              // Check for partial match
                              if (guessTypes.some((type) => randomCardTypes.includes(type))) {
                                return `partial`;
                              }

                              // Default case
                              return ``;
                            })()}
                          >
                            {(() => {
                              const basicTypes = [
                                "Artifact",
                                "Creature",
                                "Enchantment",
                                "Instant",
                                "Land",
                                "Planeswalker",
                                "Sorcery",
                                "Battle",
                              ];

                              const separator = guess.type_line?.includes("//") ? " // " : ", ";
                              const matchingTypes = (guess.type_line || "")
                                .split(/[\s//]+/)
                                .filter((type) => basicTypes.includes(type));

                              return matchingTypes.join(separator);
                            })()}
                          </li>
                          <li
                            className={(() => {
                              // Check if `guess.colors` matches `randomCard.colors` exactly
                              if (
                                guess.colors?.length === randomCard?.colors?.length &&
                                guess.colors?.every((color) => randomCard?.colors?.includes(color))
                              ) {
                                return `correct`;
                              }

                              // Check if `card_faces[0].colors` or `card_faces[1].colors` matches `randomCard.colors` exactly
                              if (
                                guess.card_faces?.[0]?.colors?.length === randomCard?.colors?.length &&
                                guess.card_faces?.[0]?.colors?.every((color) => randomCard?.colors?.includes(color))
                              ) {
                                return `correct`;
                              }

                              if (
                                guess.card_faces?.[1]?.colors?.length === randomCard?.colors?.length &&
                                guess.card_faces?.[1]?.colors?.every((color) => randomCard?.colors?.includes(color))
                              ) {
                                return `correct`;
                              }

                              // Check for partial matches
                              if (
                                guess.colors?.some((color) => randomCard?.colors?.includes(color)) ||
                                guess.card_faces?.[0]?.colors?.some((color) => randomCard?.colors?.includes(color)) ||
                                guess.card_faces?.[1]?.colors?.some((color) => randomCard?.colors?.includes(color))
                              ) {
                                return `partial`;
                              }

                              // Default case
                              return ``;
                            })()}
                          >
                            {(() => {
                              const colorMap: { [key: string]: string } = {
                                W: "White",
                                U: "Blue",
                                B: "Black",
                                R: "Red",
                                G: "Green",
                              };

                              const allColors = ["W", "U", "B", "R", "G"];

                              // Handle the case where the card has no colors
                              if (!guess.colors || guess.colors.length === 0) {
                                if (guess.card_faces && guess.card_faces.length > 0) {
                                  // Map over card_faces and extract colors
                                  const faceColors = guess.card_faces
                                    .map((face) =>
                                      (face.colors || [])
                                        .map((color) => colorMap[color] || color) // Map color codes to names
                                        .join(", ")
                                    )
                                    .join(" // "); // Join each face's colors with //

                                  return faceColors || "Colorless";
                                }

                                return "Colorless";
                              }

                              // Map colors to their names
                              const colorNames = (guess.colors || []).map((color) => colorMap[color] || color);

                              // Check if all colors are included
                              if (allColors.every((color) => (guess.colors || []).includes(color))) {
                                return "All Colors";
                              }

                              return colorNames.join(", ");
                            })()}
                          </li>
                          <li className={guess.cmc === randomCard?.cmc ? `correct` : ``}>{guess.cmc ? guess.cmc : "none"}</li>
                          <li className={guess.rarity === randomCard?.rarity ? `correct` : ``}>{guess.rarity}</li>
                          <li className={guess.artist === randomCard?.artist ? `correct` : ``}>{guess.artist}</li>
                          <li
                            className={(() => {
                              const superTypes = [
                                "Legendary",
                                "Tribal",
                                "Equipment",
                                "Aura",
                                "Basic",
                                "Snow",
                                "World",
                                "Ongoing",
                              ]; // List of super types

                              // Filter and process the `type_line` for the guess and randomCard
                              const guessSuperTypes = (guess.type_line || "")
                                .split(/[\s//]+/)
                                .filter((type) => superTypes.includes(type));

                              const randomCardSuperTypes = (randomCard?.type_line || "")
                                .split(/[\s//]+/)
                                .filter((type) => superTypes.includes(type));

                              // Check for exact match
                              if (
                                guessSuperTypes.length === randomCardSuperTypes.length &&
                                guessSuperTypes.every((type) => randomCardSuperTypes.includes(type))
                              ) {
                                return `correct`;
                              }

                              // Check for partial match
                              if (guessSuperTypes.some((type) => randomCardSuperTypes.includes(type))) {
                                return `partial`;
                              }

                              // Default case
                              return ``;
                            })()}
                          >
                            {(() => {
                              const superTypes = [
                                "Legendary",
                                "Tribal",
                                "Equipment",
                                "Aura",
                                "Basic",
                                "Snow",
                                "World",
                                "Ongoing",
                              ];

                              const separator = guess.type_line?.includes("//") ? " // " : ", ";
                              const matchingSuperTypes = (guess.type_line || "")
                                .split(/[\s//]+/)
                                .filter((type) => superTypes.includes(type));

                              if (matchingSuperTypes.length === 0) {
                                return "None";
                              }

                              return matchingSuperTypes.join(separator);
                            })()}
                          </li>
                        </ul>
                      );
                    })}

                  </div>
                </div>
              </>}
          </div>
        </>
      )}
      {showPopup.show && renderPopup()}
    </section>
  );
};

export default GuessTheCard;
