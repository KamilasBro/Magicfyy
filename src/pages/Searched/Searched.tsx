import "./searched.scss";

import GoTopArrow from "../../components/GoTopArrow/GoTopArrow";
import NotFound from "../NotFound/NotFound";
import LoadingCardsAnim from "../../components/LoadingCardsAnim/LoadingCardsAnim";
import CardsGrid from "../../components/CardsGrid/CardsGrid";

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CardlistData } from "../../interfaces/Interfaces";


const Searched: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);

  const currentPage = urlParams.get("page") as string;
  const parsedCurrentPage = Math.abs(parseInt(currentPage));

  const [searchedCards, setSearchedCards] = useState<CardlistData>({
    has_more: false,
    total_cards: 0,
    data: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [cardsNotFound, setCardsNotFound] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    //reset
    setSearchedCards({
      has_more: false,
      total_cards: 0,
      data: [],
    });
    setIsLoading(true)
    //if page index is not correct we set it here to 1
    if (currentPage !== null && isNaN(parsedCurrentPage)) {
      return navigate(handlePage("start"));
    }
    //reset

    const fetchCards = async () => {
      try {
        const apiUrl = `https://api.scryfall.com/cards/${location.pathname}${location.search}`;

        const response = await fetch(apiUrl, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Failed to fetch data");

        const data: CardlistData = await response.json();

        setSearchedCards(data);
        setIsLoading(false);
      } catch (error: any) {
        if (error.name === "AbortError") return;
        setCardsNotFound(true);
        console.error(error);
      }
    };

    fetchCards();

    return () => {
      controller.abort();
    };
  }, [currentPage]);

  const cardsAtPage = 175; // Scryfall API paginates results in chunks of 175 cards per page

  // Builds Scryfall pagination URL based on current route + query params
  // URLSearchParams is mutated and reused within this function
  const handlePage = (action: "start" | "previous" | "next" | "end") => {
    if (typeof currentPage !== "string") {
      urlParams.set("page", "2"); // default fallback when page param is missing/invalid
    } else {
      urlParams.delete("page");
      switch (action) {
        case "start":
          urlParams.set("page", "1");
          break;
        case "previous":
          urlParams.set("page", (parsedCurrentPage - 1).toString());
          break;
        case "next":
          urlParams.set("page", (parsedCurrentPage + 1).toString());
          break;
        case "end":
          // Calculate last page based on total cards / page size (Scryfall pagination)
          // Handles remainder when total_cards is not divisible by cardsAtPage
          if (searchedCards.total_cards % cardsAtPage === 0) {
            urlParams.set(
              "page",
              `${Math.floor(searchedCards.total_cards / cardsAtPage)}`
            );
          } else {
            urlParams.set(
              "page",
              `${Math.floor(searchedCards.total_cards / cardsAtPage) + 1}`
            );
          }
          break;
      }
    }
    return `${location.pathname}?${urlParams.toString()}`;
  }


  const returnCardsCounter = () => {
    // Calculates displayed card range (e.g. "176 - 350 of 1200")
    // Depends on Scryfall pagination rules (175 cards per page)
    const handleCardCounter = (pageIndex: "previous" | "current") => {
      switch (pageIndex) {
        case "previous":
          return cardsAtPage * (parsedCurrentPage - 1) + 1;
        case "current":
          // If last page, clamp to total_cards to avoid overflow range display
          if (!searchedCards.has_more) {
            return searchedCards.total_cards;
          } else {
            return cardsAtPage * parsedCurrentPage;
          }
      }
    }

    const parsedCurrentPage = Number(currentPage);
    const safePage = Number.isFinite(parsedCurrentPage) && parsedCurrentPage > 0
      ? parsedCurrentPage
      : 1;

    return (
      <div className="flex justify-between items-center cards-counter-wrap">
        <div className="cards-counter">
          {searchedCards.data.length > 0
            ? `${handleCardCounter("previous")} - ${handleCardCounter("current")} of ${searchedCards.total_cards} cards`
            : `Searching`}
        </div>
        <ul className="counter-buttons-wrap flex">
          <button
            className={!isLoading && safePage > 1 ? "active" : ""}
            disabled={isLoading || safePage <= 1}
            onClick={() => {
              navigate(handlePage("start"));
            }}
          >
            {"<<"}
          </button>
          <button
            className={!isLoading && safePage > 1 ? "active" : ""}
            disabled={isLoading || safePage <= 1}
            onClick={() => {
              navigate(handlePage("previous"));
            }}
          >
            {"< Previous"}
          </button>
          <button
            className={`${!isLoading && searchedCards.has_more ? "active" : ""}`}
            disabled={isLoading || !searchedCards.has_more}
            onClick={() => {
              navigate(handlePage("next"));
            }}
          >
            {"Next >"}
          </button>
          <button
            className={`${!isLoading && searchedCards.has_more ? "active" : ""}`}
            disabled={isLoading || !searchedCards.has_more}
            onClick={() => {
              navigate(handlePage("end"));
            }}
          >
            {">>"}
          </button>
        </ul>
      </div>
    );
  }

  return (
    <section className="Searched">
      {!cardsNotFound ?
        <>
          <GoTopArrow />
          {returnCardsCounter()}
          {isLoading
            ? <LoadingCardsAnim />
            : <CardsGrid cardsList={searchedCards.data} />
          }
          {searchedCards.data.length > 0 && returnCardsCounter()}
        </>
        :
        <NotFound />
      }
    </section>
  );
};

export default Searched;
