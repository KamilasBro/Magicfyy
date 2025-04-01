import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CardPlaceholder from "../../components/CardPlaceholder/CardPlaceholder";
import { CardData, CardlistData } from "../../interfaces/CardsInterface";
import GoTopArrow from "../../components/GoTopArrow/GoTopArrow";
import "./searched.scss";
import NotFound from "../NotFound/NotFound";
import LoadingCardsAnim from "../../components/LoadingCardsAnim/LoadingCardsAnim";

const Searched: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchedCards, setSearchedCards] = useState<CardlistData>({
    has_more: false,
    total_cards: 0,
    data: [],
  });
  const [loadedCards, setLoadedCards] = useState<boolean[]>([]); // Track loading state for each card
  const [cardNotFound, setCardNotFound] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number>(25); // Track number of visible cards
  const observer = useRef<IntersectionObserver | null>(null);

  const urlParams = new URLSearchParams(location.search);
  let currentPage = urlParams.get("page");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
    setCardNotFound(false);
    setSearchedCards({
      has_more: false,
      total_cards: 0,
      data: [],
    }); // Reset card list data
    setLoadedCards([]); // Reset loaded cards state
    setVisibleCards(50); // Reset visible cards

    if (currentPage !== null && isNaN(parseInt(currentPage))) {
      return navigate(handlePage("start"));
    }

    const fetchCards = async () => {
      try {
        await new Promise((resolve) => {
          setTimeout(resolve, 50); // Set a timeout of 50ms
        });
        const apiUrl = `https://api.scryfall.com/cards/${location.pathname}${location.search}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        } else {
          const data: CardlistData = await response.json();
          setSearchedCards(data);
          setLoadedCards(Array(data.data.length).fill(false)); // Initialize loading state for cards
        }
      } catch (error) {
        setCardNotFound(true);
        console.error("Error fetching data:", error);
      }
    };
    fetchCards();
  }, [currentPage]);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleCards((prevVisibleCards) =>
            Math.min(prevVisibleCards + 25, searchedCards.data.length)
          );
        }
      });
    });

    const sentinel = document.querySelector("#sentinel");
    if (sentinel) {
      observer.current.observe(sentinel);
    }

    return () => {
      observer.current?.disconnect();
    };
  }, [searchedCards]);

  function handlePage(action: string) {
    if (typeof currentPage !== "string") {
      urlParams.set("page", "2");
    } else {
      urlParams.delete("page");
      switch (action) {
        case "start":
          urlParams.set("page", "1");
          break;
        case "remove":
          urlParams.set("page", (parseInt(currentPage) - 1).toString());
          break;
        case "add":
          urlParams.set("page", (parseInt(currentPage) + 1).toString());
          break;
        case "end":
          if (searchedCards.total_cards % 175 === 0) {
            urlParams.set(
              "page",
              `${Math.floor(searchedCards.total_cards / 175)}`
            );
          } else {
            urlParams.set(
              "page",
              `${Math.floor(searchedCards.total_cards / 175) + 1}`
            );
          }
          break;
      }
    }
    return `${location.pathname}?${urlParams.toString()}`;
  }

  function handleCardCounter(order: number) {
    if (currentPage) {
      switch (order) {
        case 1:
          return 175 * (parseInt(currentPage) - 1) + 1;
        case 2:
          if (!searchedCards.has_more) {
            return searchedCards.total_cards;
          } else {
            return 175 * parseInt(currentPage);
          }
      }
    }
  }

  const handleImageLoad = (index: number) => {
    setLoadedCards((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = true; // Mark the card as loaded
      return updatedState;
    });
  };

  function returnCardsCounter() {
    return (
      <div className="flex justify-between items-center">
        <div className="cards-counter">
          {searchedCards.data.length > 0
            ? `${handleCardCounter(1)} - ${handleCardCounter(2)} of ${
                searchedCards.total_cards
              } cards`
            : `Searching`}
        </div>
        <ul className={"counter-buttons-wrap flex"}>
          <button
            className={`${
              currentPage && parseInt(currentPage) > 1 && "active"
            }`}
            disabled={!!currentPage && parseInt(currentPage) === 1}
            onClick={() => {
              navigate(handlePage("start"));
            }}
          >
            {"<<"}
          </button>
          <button
            className={`${
              currentPage && parseInt(currentPage) > 1 && "active"
            }`}
            disabled={!!currentPage && parseInt(currentPage) === 1}
            onClick={() => {
              navigate(handlePage("remove"));
            }}
          >
            {"< Previous"}
          </button>
          <button
            className={`${searchedCards.has_more && "active"}`}
            disabled={!searchedCards.has_more}
            onClick={() => {
              navigate(handlePage("add"));
            }}
          >
            {"Next >"}
          </button>
          <button
            className={`${searchedCards.has_more && "active"}`}
            disabled={!searchedCards.has_more}
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
      {cardNotFound ? (
        <NotFound />
      ) : (
        <>
          <GoTopArrow />
          {returnCardsCounter()}
          {searchedCards.data.length === 0 ? (
            <LoadingCardsAnim />
          ) : (
            <>
              <ul className="cards flex flex-wrap">
                {searchedCards.data
                  .slice(0, visibleCards)
                  .map((card: CardData, index: number) => (
                    <Link
                      to={`/card/${card.set}/${card.collector_number}`}
                      key={card.id}
                    >
                      <li>
                        {!loadedCards[index] && <CardPlaceholder />}{" "}
                        {/* Placeholder */}
                        {card.image_uris ? (
                          <img
                            className="card"
                            src={card.image_uris.normal}
                            alt="Card"
                            loading="eager"
                            onLoad={() => handleImageLoad(index)} // Update load state
                            style={{
                              display: loadedCards[index] ? "block" : "none",
                            }} // Hide until loaded
                          />
                        ) : (
                          card.card_faces && (
                            <img
                              className="card"
                              src={card.card_faces[0].image_uris.normal}
                              alt="Card"
                              loading="eager"
                              onLoad={() => handleImageLoad(index)}
                              style={{
                                display: loadedCards[index] ? "block" : "none",
                              }}
                            />
                          )
                        )}
                      </li>
                    </Link>
                  ))}
              </ul>
              <div id="sentinel" style={{ height: "1px" }}></div>
            </>
          )}

          {searchedCards.data.length > 0 && returnCardsCounter()}
        </>
      )}
    </section>
  );
};

export default Searched;
