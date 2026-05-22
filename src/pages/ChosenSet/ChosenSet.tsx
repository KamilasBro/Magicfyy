import "./chosenSet.scss";

import React, { useState, useEffect, useMemo } from "react";
import SearchSvg from "../../assets/images/icons/search.svg?react";

import LoadingCardsAnim from "../../components/LoadingCardsAnim/LoadingCardsAnim";
import CardsGrid from "../../components/CardsGrid/CardsGrid";
import GoTopArrow from "../../components/GoTopArrow/GoTopArrow";
import NotFound from "../NotFound/NotFound";

import { formatString } from "../../utils/other/formatString";
import { useSets } from "../../utils/sets/useSets";
import { CardData } from "../../interfaces/Interfaces";

import { useParams } from "react-router-dom";

const ChosenSet: React.FC = () => {
  const [dataFromSet, setDataFromSet] = useState<CardData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cardsNotFound, setCardsNotFound] = useState(false);

  const [searchedName, setSearchedName] = useState("");

  const { setCode } = useParams<{ setCode: string }>();
  const { sets } = useSets();
  const matchingSet = sets.find(
    (set) => set.code.toLowerCase() === setCode?.toLowerCase()
  );

  //fetch cards
  useEffect(() => {
    const controller = new AbortController();

    const fetchCards = async () => {
      setIsLoaded(false);
      setCardsNotFound(false);
      setDataFromSet([]);

      try {
        let hasMore = true;
        let page = 1;
        const allCards: CardData[] = [];

        while (hasMore) {
          const apiUrl = `https://api.scryfall.com/cards/search?q=e:${setCode}&page=${page}`;

          const response = await fetch(apiUrl, {
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }

          const data = await response.json();

          allCards.push(...data.data);

          hasMore = data.has_more;
          page++;
        }

        setDataFromSet(allCards);
        setIsLoaded(true);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error fetching data:", error);
          setCardsNotFound(true);
        }
      }
    };

    fetchCards();

    return () => {
      controller.abort();
    };
  }, [setCode]);

  const filteredCards = useMemo(() => {
    return dataFromSet.filter((card: CardData) =>
      searchedName
        ? card.name
          .toLowerCase()
          .includes(searchedName.toLowerCase())
        : true
    );
  }, [dataFromSet, searchedName]);

  return (
    !cardsNotFound
      ? <section className="Chosen-set">
        {isLoaded && dataFromSet.length > 0 ? (
          <div className="flex items-center">
            <img src={matchingSet?.icon_svg_uri} className="h1-set-icon" />
            <h1>{matchingSet?.name}</h1>
          </div>
        ) : (
          <h1>Loading Set</h1>
        )}
        <div className="search-bar flex">
          <div className="search-wrap flex items-center justify-center">
            <SearchSvg />
          </div>
          <div className="input-wrap flex items-center">
            <input
              disabled={!isLoaded}
              placeholder='Any card name ex. "black lotus"'
              onChange={(event) => {
                setSearchedName(
                  formatString(event.currentTarget.value).replace(/-/g, " ")
                );
              }}
            />
          </div>
        </div>
        {isLoaded ? (
          <CardsGrid cardsList={filteredCards} />
        ) : (
          <LoadingCardsAnim />
        )}
        <GoTopArrow />
      </section>
      : <NotFound />
  );
};

export default ChosenSet;
