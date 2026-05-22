import "./guessTheCard.scss";
import SendSvg from "../../assets/images/icons/send.svg?react";

import ChooseSet from "./chooseSet/ChooseSet";
import GoTopArrow from "../../components/GoTopArrow/GoTopArrow";
import LoadingCardsAnim from "../../components/LoadingCardsAnim/LoadingCardsAnim";

import ImageCategory from "./categories/ImageCategory";
import TypeCategory from "./categories/TypeCategory";
import ColorCategory from "./categories/ColorCategory";
import CMCCategory from "./categories/CMCCategory";
import RarityCategory from "./categories/RarityCategory";
import ArtistCategory from "./categories/ArtistCategory";
import SuperTypeCategory from "./categories/SuperTypeCategory";

import HintsPopup from "./popups/HintsPopup";
import ResetPopup from "./popups/ResetPopup";

import { useGameStorage } from "./helpers/useGameStorage";
import { useSearchInput } from "./helpers/useSearchInput";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { CardData, PopupState } from "../../interfaces/Interfaces";

//INIT
const gameCategories = [
  "Card Image",
  "Type",
  "Color",
  "CMC",
  "Rarity",
  "Art Author",
  "Super Type",
];

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

  // When set is chosen, start loading
  const [startLoading, setStartLoading] = useState(false);

  useEffect(() => {
    if (chosenMode.isChosen && (chosenMode.name || chosenMode.setCode)) {
      setStartLoading(true);
    }
  }, [chosenMode.isChosen, chosenMode.name, chosenMode.setCode]);

  const [cardsData, setCardsData] = useState<CardData[]>([]);
  const [randomCard, setRandomCard] = useState<CardData>();
  const [randomCardIndex, setRandomCardIndex] = useState<number | null>(null);
  const loadedRandomCard = useRef(false);

  //Game state
  const [winTheGame, setWinTheGame] = useState<boolean>(false);
  const [guesses, setGuesses] = useState<CardData[]>([]);
  //for correct UX
  const reversedGuesses = useMemo(() => {
    return [...guesses].reverse();
  }, [guesses]);

  useGameStorage({
    enabled: chosenMode.isChosen,
    chosenMode,
    setChosenMode,
    randomCardIndex,
    setRandomCardIndex,
    guesses,
    setGuesses,
    winTheGame,
    setWinTheGame,
  });

  const resetGame = () => {
    // Remove all relevant localStorage keys
    localStorage.removeItem("savedData");

    // Full reset
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
  }

  //Fetch cards and pick 1 random card to guess
  useEffect(() => {
    const controller = new AbortController();

    const fetchCards = async () => {
      try {
        if (chosenMode.isChosen) {
          setStartLoading(true); // Ensure loading is true
          const minLoading = new Promise((resolve) => setTimeout(resolve, 1000));
          let apiUrl = "";
          let hasMore = true;
          let page = 1;
          const allCards: CardData[] = [];

          while (hasMore) {
            if (chosenMode.mode === "commander") {
              const q = encodeURIComponent(
                '((type:legendary type:creature) OR (type:legendary type:artifact type:vehicle) OR (type:legendary type:Spacecraft) OR (oracletag:non-creature-commander)) legal:commander -is:token lang:en'
              );
              apiUrl = `https://api.scryfall.com/cards/search?q=${q}&page=${page}`;
            } else if (chosenMode.mode === "set") {
              apiUrl = `https://api.scryfall.com/cards/search?q=e:${chosenMode.setCode}&page=${page}`;
            }
            const response = await fetch(apiUrl, {
              signal: controller.signal,
            });
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
          setStartLoading(false);
        }
      } catch (error) {
        setStartLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchCards();

    return () => {
      controller.abort();
    };
  }, [chosenMode.isChosen, chosenMode.name, chosenMode.setCode]);

  //Popup
  const [showPopup, setShowPopup] = useState<PopupState>(
    { type: "", show: false }
  );

  useEffect(() => {
    //disable scroll on popup
    if (showPopup.show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPopup.show]);

  //Input
  const {
    searchValue,
    setSearchValue,
    filteredCards,
    handleInputKeys,
    handleChoice,
    renderDropDown
  } = useSearchInput({
    cardsData,
    guesses,
    setGuesses,
    winTheGame,
    setWinTheGame,
    randomCard
  });

  //scroll to start after selecting guess
  const guessesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (guessesContainerRef.current) {
      guessesContainerRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [guesses.length, startLoading]);

  return (
    <section className="Guess-the-card">
      <span className="title flex items-end justify-center">
        <h1>Guess The Card</h1>
      </span>
      {chosenMode.isChosen ? (
        <>
          <div className="guess-wrap">
            <span className="set-name flex justify-center items-center">
              {chosenMode.icon_svg_uri && <img src={chosenMode.icon_svg_uri} alt="set-icon" />}
              <h2>{chosenMode.name}</h2>
              {startLoading && chosenMode.name === "Commander" &&
                <sub>{`This may load for a while :)`}</sub>
              }
            </span>
            {startLoading || (!randomCard && cardsData.length === 0) ?
              <LoadingCardsAnim />
              :
              <>
                <div className="search-input flex justify-center">
                  <div>
                    <div className="input-wrap flex">
                      <input
                        value={searchValue}
                        placeholder="Any Card Name"
                        onChange={(event) => setSearchValue(event.target.value)}
                        onKeyDown={(event) => handleInputKeys(event)}
                        disabled={winTheGame}
                      />
                      <div
                        className="send-wrap flex justify-center items-center"
                        onClick={() => handleChoice()}
                      >
                        <SendSvg />
                      </div>
                    </div>
                    {
                      searchValue &&
                      filteredCards.length > 0 &&
                      !winTheGame &&
                      renderDropDown()}
                  </div>
                </div>
                <div className="panel flex justify-center">
                  <div className="btns-wrap flex  items-center">
                    <button
                      onClick={() => (
                        winTheGame
                          ? resetGame()
                          : setShowPopup({ type: "reset", show: true })
                      )}
                    >
                      {!winTheGame ? "Reset Game" : "Play Again"}
                    </button>
                    <button onClick={() => setShowPopup({ type: "hints", show: true })}>
                      Hints
                    </button>
                    <div className="guesses-counter">
                      {!winTheGame
                        ? <>Your guesses: <span>{guesses.length}</span></>
                        : <>You won in <span>{guesses.length}</span> guesses!</>
                      }
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
                      )
                    })}
                  </ul>
                  <div className="guesses flex flex-col" ref={guessesContainerRef}>
                    {reversedGuesses.map((guess, index) => {
                      return (
                        <ul className="guess" key={guess.id + index}>
                          <ImageCategory guess={guess} />
                          <TypeCategory guess={guess} randomCard={randomCard} />
                          <ColorCategory guess={guess} randomCard={randomCard} />
                          <CMCCategory guess={guess} randomCard={randomCard} />
                          <RarityCategory guess={guess} randomCard={randomCard} />
                          <ArtistCategory guess={guess} randomCard={randomCard} />
                          <SuperTypeCategory guess={guess} randomCard={randomCard} />
                        </ul>
                      );
                    })}
                  </div>
                </div>
              </>}
          </div>
          {showPopup.show &&
            <div
              className="popup-wrap flex justify-center items-center"
              onClick={() => {
                setShowPopup({ type: "", show: false });
              }}
            >
              {showPopup.type === "hints" &&
                <HintsPopup
                  guesses={guesses}
                  randomCard={randomCard}
                  setShowPopup={setShowPopup}
                />
              }
              {showPopup.type === "reset" &&
                <ResetPopup
                  showPopup={showPopup}
                  setShowPopup={setShowPopup}
                  resetGame={resetGame}
                />
              }
            </div >
          }
          {!showPopup.show && <GoTopArrow />}
        </>
      ) : (
        <ChooseSet setChosenMode={setChosenMode} />
      )}

    </section>
  );
};

export default GuessTheCard;
