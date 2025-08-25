import React, { useState, useEffect } from "react";
import { CardData } from "../../interfaces/CardsInterface";
import ChooseSet from "./ChooseSet";
import GoTopArrow from "../../components/GoTopArrow/GoTopArrow";
import SendSvg from "../../assets/images/icons/send.svg?react";
import CloseSvg from "../../assets/images/icons/close.svg?react";
import LoadingCardsAnim from "../../components/LoadingCardsAnim/LoadingCardsAnim";
import { CardSymbolData } from "../../interfaces/CardsInterface";
import "./guessTheCard.scss";

const getInitialChosenSet = () => {
  const savedData = localStorage.getItem("savedData");
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      if (parsed.chosenSet && parsed.chosenSet.isChosen) {
        return parsed.chosenSet;
      }
    } catch (e) { }
  }
  return {
    setCode: "",
    isChosen: false,
    icon_svg_uri: "",
    name: "",
  };
};

const GuessTheCard: React.FC = () => {
  const [chosenSet, setChosenSet] = useState<{
    setCode: string;
    isChosen: boolean;
    icon_svg_uri: string;
    name: string;
  }>(getInitialChosenSet());
  // const [commanders, setCommanders] = useState<{
  //   setCode: string;
  //   isChosen: boolean;
  //   icon_svg_uri: string;
  //   name: string;
  // }>();
  const [dataFromSet, setDataFromSet] = useState<CardData[]>([]);
  const [randomCard, setRandomCard] = useState<CardData>();
  const [randomCardIndex, setRandomCardIndex] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [guesses, setGuesses] = useState<CardData[]>([]);
  const [showPopup, setShowPopup] = useState<{ option: string; show: boolean }>(
    { option: "", show: false }
  );
  const [cardSymbols, setCardSymbols] = useState<CardSymbolData[]>([]);
  const [winTheGame, setWinTheGame] = useState<boolean>(false);
  const gameCategories = [
    "Card Image",
    "Type",
    "Color",
    "CMC",
    "Rarity",
    "Art Author",
    "Super Type",
  ];
  const loadedRandomCard = React.useRef(false);
  const [loading, setLoading] = useState(false);
  const filteredCards = dataFromSet.filter((card) => {
    return (
      !guesses.some((guess) => guess.name === card.name) &&
      card.name.toLowerCase().startsWith(searchValue.toLowerCase())
    );
  });
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const dropdownRefs = React.useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    if (
      highlightedIndex >= 0 &&
      dropdownRefs.current[highlightedIndex]
    ) {
      dropdownRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex, filteredCards.length]);
  // When set is chosen, start loading
  useEffect(() => {
    if (chosenSet.isChosen && chosenSet.setCode) {
      setLoading(true);
    }
  }, [chosenSet.isChosen, chosenSet.setCode]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        if (chosenSet.isChosen && chosenSet.setCode) {
          setLoading(true); // Ensure loading is true
          const minLoading = new Promise((resolve) => setTimeout(resolve, 1000));
          let hasMore = true;
          let page = 1;
          const allCards: CardData[] = [];

          while (hasMore) {
            await new Promise((resolve) => setTimeout(resolve, 50));
            const apiUrl = `https://api.scryfall.com/cards/search?q=e:${chosenSet.setCode}&page=${page}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
              throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            allCards.push(...data.data);
            hasMore = data.has_more;
            page++;
          }

          setDataFromSet(allCards);

          // Only pick a new random card index if not already loaded from localStorage
          if (!loadedRandomCard.current) {
            const savedData = localStorage.getItem("savedData");
            let savedRandomCardIndex: number | null = null;
            if (savedData) {
              try {
                const parsed = JSON.parse(savedData);
                savedRandomCardIndex = typeof parsed.randomCardIndex === "number" ? parsed.randomCardIndex : null;
              } catch (e) { }
            }
            if (
              savedRandomCardIndex !== null &&
              savedRandomCardIndex >= 0 &&
              savedRandomCardIndex < allCards.length
            ) {
              setRandomCardIndex(savedRandomCardIndex);
              setRandomCard(allCards[savedRandomCardIndex]);
              loadedRandomCard.current = true;
            } else {
              const randomIndex = Math.floor(Math.random() * allCards.length);
              setRandomCardIndex(randomIndex);
              setRandomCard(allCards[randomIndex]);
              loadedRandomCard.current = true;
            }
          }
          await minLoading;
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchCards();
  }, [chosenSet.setCode, chosenSet.isChosen]);

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 50));
        const apiUrl = `https://api.scryfall.com/symbology`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setCardSymbols(data.data);
      } catch (error) {
        console.error("Error fetching symbols:", error);
      }
    };
    fetchSymbols();
  }, []);
  //maintenance
  useEffect(() => {
    console.log(dataFromSet);
    console.log(randomCard);
  }, [dataFromSet]);
  //maintenance

  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchValue]);

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

  // Load from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("savedData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.chosenSet) setChosenSet(parsed.chosenSet);
        if (typeof parsed.randomCardIndex === "number") setRandomCardIndex(parsed.randomCardIndex);
        if (parsed.guesses) setGuesses(parsed.guesses);
        if (typeof parsed.winTheGame === "boolean") setWinTheGame(parsed.winTheGame);
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);
  useEffect(() => {
    // Only save if a set is chosen
    if (chosenSet.isChosen) {
      localStorage.setItem(
        "savedData",
        JSON.stringify({
          chosenSet,
          randomCardIndex,
          guesses,
          winTheGame,
        })
      );
    } else {
      // If not chosen, remove savedData
      localStorage.removeItem("savedData");
    }
  }, [chosenSet, randomCardIndex, guesses, winTheGame]);

  function renderRandomCardImg() {
    const baseBlur = 4; // starting blur in px
    const minBlur = 0;  // minimum blur
    const revealStart = 18; // number of guesses after which blur starts decreasing
    const revealEnd = 30;   // number of guesses after which blur is gone

    const blurValue =
      guesses.length < revealStart
        ? baseBlur
        : Math.max(
          minBlur,
          baseBlur - ((guesses.length - revealStart) * baseBlur) / (revealEnd - revealStart)
        );
    if (!randomCard) return null;
    const typeLine =
      randomCard?.type_line || randomCard?.card_faces?.[0]?.type_line;
    if (
      typeLine?.includes("Room") ||
      typeLine?.includes("Adventure") ||
      randomCard?.layout?.includes("flip")
    ) {
      return (
        <img
          src={randomCard?.image_uris?.normal}
          className="card-img"
          alt="Card Art"
          style={{ filter: `blur(${blurValue}px)` }}
          draggable={false}
          onContextMenu={e => e.preventDefault()}
        />
      );
    }
    return (
      <img
        src={
          randomCard?.card_faces
            ? randomCard?.card_faces?.[0]?.image_uris?.normal
            : randomCard?.image_uris?.normal
        }
        className="card-img"
        alt="Card Art"
        style={{ filter: `blur(${blurValue}px)` }}
        draggable={false}
        onContextMenu={e => e.preventDefault()}
      />
    );
  }
  function renderTextWithSymbols(text: string) {
    if (!text) return null;
    const symbolRegex = /\{([^}]+)\}/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    text.replace(symbolRegex, (match, symbol, offset) => {
      // Add the text before the current match
      parts.push(text.slice(lastIndex, offset));

      // Find the symbol data in cardSymbols
      const symbolData = cardSymbols.find(
        (symbolData) => symbolData.symbol === `{${symbol}}`
      );

      // If symbolData is found, render the image
      if (symbolData) {
        parts.push(
          <img
            key={offset}
            src={symbolData.svg_uri}
            alt={`${symbol} symbol`}
            className="oracle-symbol"
            style={{ width: 22, height: 22, verticalAlign: "middle", margin: "0 2px" }}
          />
        );
      } else {
        // If symbolData is not found, render the symbol as text
        parts.push(match);
      }

      // Update lastIndex to the end of the current match
      lastIndex = offset + match.length;
      return match;
    });

    // Add the remaining text after the last match
    parts.push(text.slice(lastIndex));

    return parts;
  }
  function renderColorSymbols(colors: string[] = []) {
    const colorToSymbol: { [key: string]: string } = {
      W: "{W}",
      U: "{U}",
      B: "{B}",
      R: "{R}",
      G: "{G}",
      C: "{C}",
    };

    // If no colors, render colorless symbol
    if (!colors || colors.length === 0) {
      const symbol = cardSymbols.find(s => s.symbol === "{C}");
      if (symbol) {
        return (
          <img
            key="colorless"
            src={symbol.svg_uri}
            alt={symbol.english}
            className="color-symbol"
          />
        );
      }
      return <span key="colorless">Colorless</span>;
    }

    return colors.map((color, idx) => {
      const symbol = cardSymbols.find(s => s.symbol === colorToSymbol[color]);
      if (symbol) {
        return (
          <img
            key={color + idx}
            src={symbol.svg_uri}
            alt={symbol.english}
            className="color-symbol"
          />
        );
      }
      return <span key={color + idx}>{color}</span>;
    });
  }
  function renderPopup() {
    return (
      <div className="popup-wrap flex justify-center items-center" onClick={() => {
        setShowPopup({ option: "", show: false });
      }}>
        {
          showPopup.option === "reset" ? (
            <div className="popup popup-reset" onClick={(e) => e.stopPropagation()}>
              <h2>Do you want to reset?</h2>
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
              <ul className="flex flex-col hints-list">
                <li>
                  <p>
                    Formats Legality {guesses.length < 3 && <span className="hint-counter">Hint in {3 - guesses.length} guesses</span>}
                  </p>
                  {guesses.length >= 3 && randomCard && (
                    <ul className="formats">
                      {(() => {
                        const mtgFormats = [
                          "Standard",
                          "Alchemy",
                          "Pioneer",
                          "Explorer",
                          "Modern",
                          "Historic",
                          "Legacy",
                          "Brawl",
                          "Vintage",
                          "Commander",
                          "Pauper",
                          "Oathbreaker",
                          "Penny",
                        ];
                        const lowercaseLegalities = Object.fromEntries(
                          Object.entries(randomCard.legalities).map(([key, value]) => [
                            key.toLowerCase(),
                            value,
                          ])
                        );
                        return mtgFormats
                          .filter((format) => lowercaseLegalities[format.toLowerCase()])
                          .map((format) => {
                            const legality = lowercaseLegalities[format.toLowerCase()];
                            switch (legality) {
                              case "legal":
                                return (
                                  <button className={`format-${format} legal`} key={format}>
                                    {format}
                                  </button>
                                );
                              case "not_legal":
                                return (
                                  <button className={`format-${format} not-legal`} key={format}>
                                    {format}
                                  </button>
                                );
                              case "restricted":
                                return (
                                  <button className={`format-${format} restricted`} key={format}>
                                    {format}
                                  </button>
                                );
                              case "banned":
                                return (
                                  <button className={`format-${format} banned`} key={format}>
                                    {format}
                                  </button>
                                );
                              default:
                                return null;
                            }
                          });
                      })()}
                    </ul>
                  )}
                </li>
                <li>
                  <p>
                    Colors {guesses.length < 6 && <span className="hint-counter">Hint in {6 - guesses.length} guesses</span>}
                  </p>
                  {guesses.length >= 6 && randomCard && (
                    <div className="color-hint flex">
                      {randomCard.colors && randomCard.colors.length > 0
                        ? renderColorSymbols(randomCard.colors)
                        : renderColorSymbols([])}
                    </div>
                  )}
                </li>
                <li>
                  <p>
                    Price {guesses.length < 9 && <span className="hint-counter">Hint in {9 - guesses.length} guesses</span>}
                  </p>
                  {guesses.length >= 9 && randomCard && (
                    <ul className="price-hint">
                      {randomCard.prices.eur && <li>{randomCard.prices.eur}<span>€</span></li>}
                      {randomCard.prices.eur_foil && <li>{randomCard.prices.eur_foil}<span>€ Foil</span></li>}
                      {randomCard.prices.usd && <li>{randomCard.prices.usd}<span>$</span></li>}
                      {randomCard.prices.usd_etchced && <li>{randomCard.prices.usd_etchced}<span>$ Foil</span></li>}
                      {randomCard.prices.usd_foil && <li>{randomCard.prices.usd_foil}<span>$ Foil</span></li>}
                      {randomCard.prices.tix && <li>{randomCard.prices.tix}<span>tix</span></li>}
                    </ul>
                  )}
                </li>
                <li>
                  <p>
                    First Letter {guesses.length < 12 && <span className="hint-counter">Hint in {12 - guesses.length} guesses</span>}
                  </p>
                  {guesses.length >= 12 && randomCard && <span className="first-letter">{randomCard.name.charAt(0)}</span>}
                </li>
                <li>
                  <p>
                    Oracle Text {guesses.length < 15 && <span className="hint-counter">Hint in {15 - guesses.length} guesses</span>}
                  </p>
                  {guesses.length >= 15 && randomCard && (
                    randomCard.oracle_text
                      ? <span className="oracle-text">{renderTextWithSymbols(randomCard.oracle_text)}</span>
                      : "No text"
                  )}
                </li>

                <li className="card-art">
                  <p>
                    Card Art {guesses.length < 18 && <span className="hint-counter">Hint in {18 - guesses.length} guesses</span>}
                  </p>

                  {guesses.length >= 18 && randomCard && (
                    <>
                      <span>Card will slowly lose blur with each guess.</span>
                      {renderRandomCardImg()}
                    </>
                  )}
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
  function resetSet() {
    // Remove all relevant localStorage keys
    localStorage.removeItem("savedData");

    // Reset all state
    setChosenSet({
      setCode: "",
      isChosen: false,
      icon_svg_uri: "",
      name: "",
    });
    setRandomCardIndex(null);
    setRandomCard(undefined);
    setDataFromSet([]);
    setGuesses([]);
    setWinTheGame(false);
    loadedRandomCard.current = false;
    //localStorage.clear();
  }
  return (
    <section className="Guess-the-card">
      <span className="title flex items-end justify-center">
        <h1>Guess The Card</h1>
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
            {loading || (!randomCard && dataFromSet.length === 0) ? <LoadingCardsAnim /> :
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
                        onKeyDown={(event) => {
                          if (event.key === "ArrowDown") {
                            event.preventDefault();
                            setHighlightedIndex((prev) =>
                              prev < filteredCards.length - 1 ? prev + 1 : 0
                            );
                          } else if (event.key === "ArrowUp") {
                            event.preventDefault();
                            setHighlightedIndex((prev) =>
                              prev > 0 ? prev - 1 : filteredCards.length - 1
                            );
                          } else if (event.key === "Enter") {
                            if (highlightedIndex >= 0 && filteredCards[highlightedIndex] && !winTheGame) {
                              const card = filteredCards[highlightedIndex];
                              setGuesses((prevState) => [...prevState, card]);
                              setSearchValue("");
                              setHighlightedIndex(-1);
                              if (card.name === randomCard?.name) setWinTheGame(true);
                            } else if (filteredCards.length === 1 && !winTheGame) {
                              const card = filteredCards[0];
                              setGuesses((prevState) => [...prevState, card]);
                              setSearchValue("");
                              setHighlightedIndex(-1);
                              if (card.name === randomCard?.name) setWinTheGame(true);
                            }
                          }
                        }}
                        disabled={winTheGame}
                      />
                      <div
                        className="send-wrap flex justify-center items-center"
                        onClick={() => {
                          if (
                            filteredCards.length === 1 &&
                            !winTheGame
                          ) {
                            const card = filteredCards[0];
                            setGuesses((prevState) => [...prevState, card]);
                            setSearchValue("");
                            if (card.name === randomCard?.name) setWinTheGame(true);
                          }
                        }}
                      >
                        <SendSvg />
                      </div>
                    </div>
                    {searchValue && filteredCards.length > 0 && (
                      <ul className="dropdown">
                        {filteredCards.map((card, idx) => (
                          <li
                            key={card.id}
                            ref={el => (dropdownRefs.current[idx] = el)}
                            className={`flex${highlightedIndex === idx ? " highlighted" : ""}`}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            onMouseLeave={() => setHighlightedIndex(-1)}
                            onClick={() => {
                              setGuesses((prevState) => [...prevState, card]);
                              setSearchValue("");
                              setHighlightedIndex(-1);
                              card.name === randomCard?.name && setWinTheGame(true);
                            }}
                          >
                            <span className="card-name">{card.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="panel flex justify-center">
                  <div className="btns-wrap flex  items-center">
                    <button
                      onClick={() => (
                        winTheGame ? resetSet() : setShowPopup({ option: "reset", show: true })
                      )}
                    >
                      {!winTheGame ? "Reset Set" : "Play Again"}
                    </button>
                    <button
                      onClick={() => setShowPopup({ option: "hints", show: true })}
                    >
                      Hints
                    </button>
                    <div className="guesses-counter">
                      {!winTheGame ? (
                        <>Your guesses: <span>{guesses.length}</span></>
                      ) : <>You won in <span>{guesses.length}</span> guesses!</>}
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
      {chosenSet.isChosen && <GoTopArrow />}
    </section>
  );
};

export default GuessTheCard;
