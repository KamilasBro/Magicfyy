import "./home.scss";
import SearchSvg from "../../assets/images/icons/search.svg?react";

import LoadingCardsAnim from "../../components/LoadingCardsAnim/LoadingCardsAnim";
import CardPlaceholder from "../../components/CardPlaceholder/CardPlaceholder";

import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CardData } from "../../interfaces/Interfaces";
import { formatString } from "../../utils/other/formatString";
import { handleImageLoad } from "../../utils/other/handleImageLoad";
import { handleImageSource } from "../../utils/card/handleImageSource";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [searchedName, setSearchedName] = useState("");
  const searchLink = `/search?q=${formatString(searchedName)}${searchedName === "" ? "lang:en" : "&lang:en"}&page=1`

  // Showcase cards for carousel (duplicated for infinite scroll effect)
  const [showcaseCards, setShowcaseCards] = useState<CardData[]>([]);
  // Flag to indicate data is ready (used to start animations/render)
  const [showcaseFetched, setShowcaseFetched] = useState(false);
  // Tracks image loading state per card (index-based)
  const [loadedCards, setLoadedCards] = useState<boolean[]>([]);
  useEffect(() => {
    const controller = new AbortController();

    const fetchShowcaseCards = async () => {
      try {
        // Pick random page to vary showcased cards
        const randomNumber = Math.floor(Math.random() * 4) + 1;

        const apiUrl = `https://api.scryfalal.com/cards/search?page=${randomNumber}&q=(game:paper)+is:fullart+lang:en`;

        const response = await fetch(apiUrl, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        const uniqueCards: CardData[] = [];

        // Select up to 15 unique random cards from response
        while (uniqueCards.length < 15 && data.data.length > 0) {
          const newCardIndex = Math.floor(Math.random() * data.data.length);
          const newCard = data.data[newCardIndex];

          if (!uniqueCards.some((card) => card.id === newCard.id)) {
            uniqueCards.push(newCard);
          }

          // Remove used card to avoid duplicates
          data.data.splice(newCardIndex, 1);
        }

        // Duplicate cards for seamless infinite carousel loop
        const duplicated = [...uniqueCards, ...uniqueCards];

        setShowcaseCards(duplicated);

        // Initialize loading state for each rendered card
        setLoadedCards(Array(duplicated.length).fill(false));

        setShowcaseFetched(true);
      } catch (error) {
        console.error("Error fetching showcase cards:", error);
      }
    };

    fetchShowcaseCards();
    return () => {
      controller.abort();
    };
  }, []);

  // Ref to carousel container for manual horizontal scroll control
  const containerRef = useRef<HTMLDivElement>(null);
  // Ref used instead of state to avoid re-renders during animation (hover pause flag)
  const isHoveredRef = useRef<boolean>(false);

  useEffect(() => {
    if (!showcaseFetched) return;

    const container = containerRef.current;
    if (!container) return;

    let rafId = 0;
    let last = performance.now();
    let accumulator = 0;

    const stepMs = 1000 / 60;
    const pixelsPerSecond = 60;

    const loop = (now: number) => {
      const delta = now - last;
      last = now;

      if (!isHoveredRef.current) {
        accumulator += delta;

        while (accumulator >= stepMs) {
          const pxPerTick = pixelsPerSecond / 60;

          container.scrollLeft += pxPerTick;

          const reset = container.scrollWidth / 2;
          if (container.scrollLeft >= reset) {
            container.scrollLeft -= reset;
          }

          accumulator -= stepMs;
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, [showcaseFetched]);
  //   if (!showcaseFetched) return;
  //   const container = containerRef.current;
  //   if (!container) return;

  //   // force exactly 60 updates per second
  //   const fps = 60;
  //   const pixelsPerSecond = 60; // adjust total px/s here if you want different speed
  //   const perFrame = pixelsPerSecond / fps; // px per frame at 60fps
  //   const intervalMs = Math.round(1000 / fps);

  //   let intervalId: number | null = window.setInterval(() => {
  //     if (!container || isHoveredRef.current) return;

  //     container.scrollLeft += perFrame;

  //     const resetScroll = Math.floor(container.scrollWidth / 2);
  //     if (container.scrollLeft >= resetScroll - 1) {
  //       container.scrollLeft = container.scrollLeft - resetScroll;
  //     }
  //   }, intervalMs);

  //   return () => {
  //     if (intervalId !== null) {
  //       clearInterval(intervalId);
  //       intervalId = null;
  //     }
  //   };
  // }, [showcaseFetched]);

  // useEffect(() => {
  //   if (!showcaseFetched) return;
  //   const container = containerRef.current;
  //   if (!container) return;

  //   let rafId: number;
  //   let accumulated = 0; // stores fractional pixels to avoid losing precision

  //   const speed = 1; // scroll speed (px per frame, accumulated)

  //   const animate = () => {
  //     // Pause scrolling when hovered
  //     if (!isHoveredRef.current) {
  //       accumulated += speed;

  //       // Apply only whole pixels (browser ignores subpixels)
  //       const move = Math.floor(accumulated);
  //       if (move > 0) {
  //         container.scrollLeft += move;
  //         accumulated -= move;
  //       }

  //       // Reset scroll for infinite loop effect (carousel is duplicated)
  //       if (container.scrollLeft >= container.scrollWidth / 2) {
  //         container.scrollLeft = 0;
  //       }
  //     }

  //     rafId = requestAnimationFrame(animate);
  //   };

  //   rafId = requestAnimationFrame(animate);

  //   return () => cancelAnimationFrame(rafId);
  // }, [showcaseFetched]);

  const [randomCard, setRandomCard] = useState<CardData>();
  const [randomCardFetched, setRandomCardFetched] = useState(false);
  useEffect(() => {
    const fetchRandomCard = async () => {
      try {
        const apiUrl = `https://api.scryfall.com/cards/random?lang:en`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setRandomCard(data);
        setRandomCardFetched(true);
      } catch (error) {
        console.error("Error fetching random card:", error);
      }
    };
    fetchRandomCard();
  }, []);

  return (
    <section className="Home">
      <div className="flex flex-col search">
        <h1 className="page-title">Search for a card</h1>
        <div className="search-bar flex">
          <Link to={searchLink}>
            <div className="search-wrap flex items-center justify-center">
              <SearchSvg />
            </div>
          </Link>
          <div className="input-wrap flex items-center">
            <input
              name="search-bar"
              placeholder='Any card name ex. "black lotus"'
              value={searchedName}
              onChange={(event) => setSearchedName(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && navigate(searchLink)
              }
            />
          </div>
        </div>
        <ul className="flex search-buttons">
          <Link to={"/advanced"}>
            <button>Advanced Search</button>
          </Link>
          <Link to={"/sets"}>
            <button>Sets</button>
          </Link>
          <Link
            to={`/card/${randomCard?.set || ""}/${randomCard?.collector_number || ""}`}
          >
            <button disabled={!randomCardFetched}>Lucky Search</button>
          </Link>
          <Link to={"/guess"}>
            <button>Guess The Card</button>
          </Link>
        </ul>
      </div>
      {showcaseCards.length !== 0 ? (
        <ul className="cards flex justify-between align-center">
          <div
            className="carousel"
            ref={containerRef}
            onMouseEnter={() => {
              if (window.innerWidth >= 1024) {
                isHoveredRef.current = true;
              }
            }}
            onMouseLeave={() => {
              isHoveredRef.current = false;
            }}
          >
            {showcaseCards.map((card, index) => {
              const { imgSrc, isArvinox } = handleImageSource(card)
              return (
                <Link
                  to={`/card/${card.set}/${card.collector_number}`}
                  key={card.id + index}
                >
                  <li>
                    {!loadedCards[index] &&
                      <CardPlaceholder />
                    }
                    <img
                      className="card"
                      src={imgSrc}
                      alt="Card"
                      loading="eager"
                      onLoad={() => handleImageLoad(index, setLoadedCards)}
                      style={{
                        display: loadedCards[index] ? "block" : "none",
                        ...(isArvinox ? { transform: "rotate(180deg)" } : {}),
                      }}
                    />
                  </li>
                </Link>
              );
            })}
          </div>
        </ul>
      ) : (
        <LoadingCardsAnim />
      )}
    </section >
  );
};

export default Home;
