import React, { useState, useEffect } from "react";
import { CardData } from "../../interfaces/CardsInterface";
import ChooseSet from "./ChooseSet";
import SendSvg from "../../assets/images/icons/send.svg?react";
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
  const gameCategories = [
    "Card Image",
    "Type",
    "Color",
    "Base Mana Cost",
    "Rarity",
    "Art Author",
    "Super Type",
  ];
  useEffect(() => {
    const fetchCards = async () => {
      try {
        if (chosenSet.isChosen) {
          let hasMore = true;
          let page = 1;

          while (hasMore) {
            await new Promise((resolve) => setTimeout(resolve, 50)); // Set a timeout of 50ms
            const apiUrl = `https://api.scryfall.com/cards/search?q=e:${chosenSet.setCode}&page=${page}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
              throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            setDataFromSet((prevState) => [...prevState, ...data.data]);
            hasMore = data.has_more; // Check if there are more pages
            page++;
          }

          // Pick a random card from the array
          if (dataFromSet.length > 0) {
            const randomIndex = Math.floor(Math.random() * dataFromSet.length);
            setRandomCard(dataFromSet[randomIndex]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCards();
  }, [chosenSet.setCode || chosenSet.isChosen]); // Fetch cards when the chosen set changes
  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Pick a random card from the array
        if (dataFromSet.length > 0) {
          const randomIndex = Math.floor(Math.random() * dataFromSet.length);
          setRandomCard(dataFromSet[randomIndex]);
        }
      } catch (error) {
        console.error("Error fetching random Card:", error);
      }
    };

    if (chosenSet.setCode) {
      fetchCards();
    }
  }, [dataFromSet]);

  function renderPopup() {
    return (
      <div className="popup-wrap flex justify-center items-center">
        {showPopup.option === "reset" ? (
          <div className="popup popup-reset">
            <h2>Do you want to reset set?</h2>
            <span className="reset-btns-wrap flex justify-center">
              <button>Yes</button>
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
          <div className="popup popup-hints">
            <h2>Hints</h2>
            <ul>
              <li>
                <p>
                  Formats Legality: <span>Hint unlocked in x guesses</span>
                  <span></span>
                </p>
                <div></div>
              </li>
              <li>
                <p>
                  Game Changer: <span>Hint unlocked in x guesses</span>
                  <span></span>
                </p>
                <div></div>
              </li>
              <li>
                <p>
                  Oracle Text: <span>Hint unlocked in x guesses</span>
                  <span></span>
                </p>
                <div></div>
              </li>
              <li>
                <p>
                  First Letter: <span>Hint unlocked in x guesses</span>
                  <span></span>
                </p>
                <div></div>
              </li>
              <li>
                <p>
                  Artwork: <span>Hint unlocked in x guesses</span>
                  <span></span>
                </p>
                <div></div>
              </li>
            </ul>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
  console.log(dataFromSet);
  console.log(randomCard);
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
                      .filter((card, index) => {
                        // Sprawdź, czy karta nie jest już w zgadywanych i czy pasuje do wartości wyszukiwania
                        return (
                          !guesses.some((guess) => guess.name === card.name) && // Sprawdź, czy karta nie jest już zgadywana
                          card.name.toLowerCase().includes(searchValue.toLowerCase()) // Sprawdź, czy nazwa karty pasuje do wyszukiwania
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
                  Your guesses: <span>X</span>
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
                        <img src={guess?.image_uris?.art_crop} />
                      </li>
                      <li>{guess.type_line}</li>
                      <li>{guess.colors}</li>
                      <li>{guess.cmc}</li>
                      <li>{guess.rarity}</li>
                      <li>{guess.artist}</li>
                      <li>{guess.type_line}</li>
                    </ul>
                  );
                })}

              </div>
            </div>
          </div>
        </>
      )}
      {showPopup.show && renderPopup()}
    </section>
  );
};

export default GuessTheCard;
