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
  const [guesses, setGuesses] = useState<string[]>([]);
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
              <button className="reset-btn">Reset Set</button>
            </span>
            <div className="search-input flex justify-center">
              <div>
                <div className="input-wrap flex">
                  <input
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
                        return card.name
                          .toLowerCase()
                          .includes(searchValue.toLowerCase());
                      })
                      .map((card) => {
                        return (
                          <li key={card.id} className="flex">
                            <span className="card-name">{card.name}</span>
                          </li>
                        );
                      })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default GuessTheCard;
