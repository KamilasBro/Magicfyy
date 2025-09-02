import React, { useState, useEffect } from "react";
import { CardData } from "../../interfaces/CardsInterface";
import ChooseSet from "./ChooseSet";
import GoTopArrow from "../../components/GoTopArrow/GoTopArrow";
import SendSvg from "../../assets/images/icons/send.svg?react";
import CloseSvg from "../../assets/images/icons/close.svg?react";
import LoadingCardsAnim from "../../components/LoadingCardsAnim/LoadingCardsAnim";
import { CardSymbolData } from "../../interfaces/CardsInterface";
import "./guessTheCard.scss";

const getInitialChosenMode = () => {
  const savedData = localStorage.getItem("savedData");
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      if (parsed.chosenMode && parsed.chosenMode.isChosen) {
        return parsed.chosenMode;
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
  const [chosenMode, setChosenMode] = useState<{
    mode: string
    setCode?: string;
    isChosen: boolean;
    icon_svg_uri?: string;
    name: string;
  }>(getInitialChosenMode());
  const [cardsData, setCardsData] = useState<CardData[]>([]);
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
  const filteredCards = cardsData.filter((card) => {
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
    if (chosenMode.isChosen && (chosenMode.name || chosenMode.setCode)) {
      setLoading(true);
    }
  }, [chosenMode.isChosen, chosenMode.name || chosenMode.setCode]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        if (chosenMode.isChosen) {
          setLoading(true); // Ensure loading is true
          const minLoading = new Promise((resolve) => setTimeout(resolve, 1000));
          let apiUrl = "";
          let hasMore = true;
          let page = 1;
          const allCards: CardData[] = [];

          while (hasMore) {
            await new Promise((resolve) => setTimeout(resolve, 50));
            if (chosenMode.mode === "commander") {
              const q = encodeURIComponent(
                '((type:legendary type:creature) OR (type:legendary type:artifact type:vehicle) OR (type:legendary type:Spacecraft) OR (oracletag:non-creature-commander)) legal:commander -is:token lang:en'
              );
              apiUrl = `https://api.scryfall.com/cards/search?q=${q}&page=${page}`;
            } else if (chosenMode.mode === "set") {
              apiUrl = `https://api.scryfall.com/cards/search?q=e:${chosenMode.setCode}&page=${page}`;
            }
            const response = await fetch(apiUrl);

            if (!response.ok) {
              throw new Error("Failed to fetch data");
            }

            const data = await response.json();

            // normalize names: keep only the part before " // "
            const normalizeName = (name?: string) => (name ? name.split(" // ")[0].trim() : name);

            const normalizedCards = data.data.map((card: CardData) => {
              const c = { ...card, name: normalizeName(card.name) };
              if (Array.isArray(card.card_faces)) {
                c.card_faces = card.card_faces.map((face: any) => ({
                  ...face,
                  name: normalizeName(face.name),
                }));
              }
              return c;
            });

            allCards.push(...normalizedCards);
            hasMore = data.has_more;
            page++;
          }

          setCardsData(allCards);

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
  }, [chosenMode.name, chosenMode.name || chosenMode.setCode]);

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
    console.log(cardsData);
    console.log(randomCard);
  }, [cardsData]);
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
        if (parsed.chosenMode) setChosenMode(parsed.chosenMode);
        if (typeof parsed.randomCardIndex === "number") setRandomCardIndex(parsed.randomCardIndex);
        if (parsed.guesses) setGuesses(parsed.guesses);
        if (typeof parsed.winTheGame === "boolean") setWinTheGame(parsed.winTheGame);
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);
  useEffect(() => {
    // Only save if a mode is chosen
    if (chosenMode.isChosen) {
      localStorage.setItem(
        "savedData",
        JSON.stringify({
          chosenMode,
          randomCardIndex,
          guesses,
          winTheGame,
        })
      );
    } else {
      // If not chosen, remove savedData
      localStorage.removeItem("savedData");
    }
  }, [chosenMode, randomCardIndex, guesses, winTheGame]);

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
                  resetGame();
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
  function resetGame() {
    // Remove all relevant localStorage keys
    localStorage.removeItem("savedData");

    // Reset all state
    setChosenMode({
      mode: "",
      setCode: "",
      isChosen: false,
      icon_svg_uri: "",
      name: "",
    });
    setRandomCardIndex(null);
    setRandomCard(undefined);
    setCardsData([]);
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
      {!chosenMode.isChosen ? (
        <ChooseSet setChosenMode={setChosenMode} />
      ) : (
        <>
          <div className="guess-wrap">
            <span className="set-name flex justify-center items-center">
              {chosenMode.icon_svg_uri && <img src={chosenMode.icon_svg_uri} alt="set-icon" />}
              <h2>{chosenMode.name}</h2>
            </span>
            {loading || (!randomCard && cardsData.length === 0) ? <LoadingCardsAnim /> :
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
                            if (card.name === randomCard?.name) setWinTheGame(true)
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
                        winTheGame ? resetGame() : setShowPopup({ option: "reset", show: true })
                      )}
                    >
                      {!winTheGame ? "Reset Game" : "Play Again"}
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
                              ];

                              // use only the first face's type_line if present, otherwise fallback to top-level type_line
                              const guessTypeLine = guess.card_faces?.[0]?.type_line ?? guess.type_line ?? "";
                              const randomTypeLine = randomCard?.card_faces?.[0]?.type_line ?? randomCard?.type_line ?? "";

                              const extractTypes = (typeLine: string) =>
                                (typeLine.split("—")[0] || "")
                                  .trim()
                                  .split(/\s+/)
                                  .filter((t) => basicTypes.includes(t));

                              const guessTypes = extractTypes(guessTypeLine);
                              const randomTypes = extractTypes(randomTypeLine);

                              if (
                                guessTypes.length === randomTypes.length &&
                                guessTypes.every((t) => randomTypes.includes(t))
                              ) {
                                return "correct";
                              }

                              if (guessTypes.some((t) => randomTypes.includes(t))) {
                                return "partial";
                              }

                              return "";
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

                              const guessTypeLine = guess.card_faces?.[0]?.type_line ?? guess.type_line ?? "";

                              const extractTypes = (typeLine: string) =>
                                (typeLine.split("—")[0] || "")
                                  .trim()
                                  .split(/\s+/)
                                  .filter((t) => basicTypes.includes(t));

                              const guessTypes = extractTypes(guessTypeLine);

                              if (guessTypes.length === 0) return "";

                              // Return plain text, comma-separated, no <span> tags
                              return guessTypes.join(", ");
                            })()}
                          </li>
                          <li
                            className={(() => {
                              // use only the first face's colors if present, otherwise fallback to top-level colors
                              const guessColors = guess.card_faces?.[0]?.colors ?? guess.colors ?? [];
                              const randomColors = randomCard?.card_faces?.[0]?.colors ?? randomCard?.colors ?? [];

                              // exact match
                              if (
                                guessColors.length === randomColors.length &&
                                guessColors.every((c) => randomColors.includes(c))
                              ) {
                                return "correct";
                              }

                              // partial match
                              if (guessColors.some((c) => randomColors.includes(c))) {
                                return "partial";
                              }

                              return "";
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

                              // use only the first face's colors if present, otherwise fallback to top-level colors
                              const guessColors = guess.card_faces?.[0]?.colors ?? guess.colors ?? [];

                              // handle colorless
                              if (!guessColors || guessColors.length === 0) {
                                return "Colorless";
                              }

                              // All colors shorthand
                              if (allColors.every((c) => guessColors.includes(c))) {
                                return "All Colors";
                              }

                              // Map to names and return plain comma-separated string
                              const names = guessColors.map((code: string) => colorMap[code] || code);
                              return names.join(", ");
                            })()}
                          </li>
                          <li className={guess.cmc === randomCard?.cmc ? `correct` : `incorrect`}>
                            {randomCard?.cmc && (guess.cmc < randomCard.cmc ? "Higher than" :
                              guess.cmc > randomCard.cmc ? "Lower than" : "")}
                            {" "}
                            {guess.cmc ? guess.cmc : "None"}
                          </li>
                          <li className={guess.rarity === randomCard?.rarity ? `correct` : ``}>
                            {guess.rarity}
                          </li>
                          <li className={guess.artist === randomCard?.artist ? `correct` : ``}>
                            {guess.artist}
                          </li>
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

                              // use only the main face's type_line if present, otherwise fallback to top-level type_line
                              const guessTypeLine = (guess.card_faces?.[0]?.type_line ?? guess.type_line ?? "");
                              const randomTypeLine = (randomCard?.card_faces?.[0]?.type_line ?? randomCard?.type_line ?? "");

                              const extract = (typeLine: string) =>
                                (typeLine || "")
                                  .split(/[\s//]+/)
                                  .filter((type) => superTypes.includes(type));

                              const guessSuperTypes = extract(guessTypeLine);
                              const randomCardSuperTypes = extract(randomTypeLine);

                              // prefer main face layout, fallback to top-level layout
                              const guessLayoutRaw = (guess.layout ?? "")?.toString();
                              const randomLayoutRaw = (randomCard?.layout ?? "")?.toString();

                              const guessLayout = guessLayoutRaw ? guessLayoutRaw.toLowerCase() : "";
                              const randomLayout = randomLayoutRaw ? randomLayoutRaw.toLowerCase() : "";

                              const normalizeForCompare = (arr: string[], layoutStr: string) => {
                                const norm = arr.map((s) => s.toLowerCase());
                                // include layout only if it's present and not "normal"
                                if (layoutStr && layoutStr !== "normal") {
                                  if (!norm.includes(layoutStr)) norm.push(layoutStr);
                                }
                                return norm;
                              };

                              const guessNorm = normalizeForCompare(guessSuperTypes, guessLayout);
                              const randomNorm = normalizeForCompare(randomCardSuperTypes, randomLayout);

                              // Check for exact match (same items, order not important)
                              if (
                                guessNorm.length === randomNorm.length &&
                                guessNorm.every((type) => randomNorm.includes(type))
                              ) {
                                return `correct`;
                              }

                              // Check for partial match
                              if (guessNorm.some((type) => randomNorm.includes(type))) {
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

                              const separator = guess.card_faces?.[0]?.type_line?.includes("//") || guess.type_line?.includes("//") ? " // " : ", ";
                              // use only the main face's type_line if present, otherwise fallback to top-level type_line
                              const matchingSuperTypes = (guess.card_faces?.[0]?.type_line ?? guess.type_line ?? "")
                                .split(/[\s//]+/)
                                .filter((type) => superTypes.includes(type));

                              // prefer main face layout, fallback to top-level layout
                              const layoutRaw = (guess.layout ?? "")?.toString();
                              const layout = layoutRaw ? layoutRaw.toString() : "";

                              // include layout only if present and not "normal"
                              const includeLayout = layout && layout.toLowerCase() !== "normal";
                              const parts = includeLayout ? [...matchingSuperTypes, layout] : matchingSuperTypes;

                              if (parts.length === 0) {
                                return "None";
                              }

                              // Return plain text, comma-separated (or " // " if separator chosen)
                              return parts.join(separator);
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
      {chosenMode.isChosen && <GoTopArrow />}
    </section>
  );
};

export default GuessTheCard;
