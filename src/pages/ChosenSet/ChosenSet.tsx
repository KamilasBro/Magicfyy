import React, { useState, useEffect, useRef } from "react";
import SearchSvg from "../../assets/images/icons/search.svg?react";
import GoTopArrow from "../../components/GoTopArrow/GoTopArrow";
import FormatString from "../../utils/FormatString";
import CardPlaceholder from "../../components/CardPlaceholder/CardPlaceholder";
import { CardData } from "../../interfaces/CardsInterface";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import LoadingCardsAnim from "../../components/LoadingCardsAnim/LoadingCardsAnim";
import "./chosenSet.scss";

const ChosenSet: React.FC = () => {
  const [dataFromSet, setDataFromSet] = useState<CardData[]>([]);
  const [iconUrl, setIconUrl] = useState("");
  const [nameOfSet, setNameOfSet] = useState("");
  const [isFetched, setIsFetched] = useState({
    iconFetched: false,
    cardsFetched: false,
  });
  const [searchedName, setSearchedName] = useState("");
  const { setCode } = useParams<{ setCode: string }>();
  const [visibleCards, setVisibleCards] = useState<number>(25); // Track number of visible cards
  const observer = useRef<IntersectionObserver | null>(null);
  const [loadedCards, setLoadedCards] = useState<boolean[]>([]); // Track loading state for each card
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  useEffect(() => {
    const fetchIcon = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 50)); // Set a timeout of 100ms
        const apiUrl = `https://api.scryfall.com/sets`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const matchingSet = data.data.find(
          (set: { name: string; code: string }) =>
            set.code.toLowerCase() === setCode?.toLowerCase()
        );
        if (matchingSet) {
          setIconUrl(matchingSet.icon_svg_uri);
          setNameOfSet(matchingSet.name);
          setIsFetched((prevState) => ({ ...prevState, iconFetched: true }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchIcon();
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        let hasMore = true;
        let page = 1;

        while (hasMore) {
          await new Promise((resolve) => setTimeout(resolve, 50)); // Set a timeout of 100ms
          const apiUrl = `https://api.scryfall.com/cards/search?q=e:${setCode}&page=${page}`;
          const response = await fetch(apiUrl);

          if (!response.ok) {
            throw new Error("Failed to fetch data");
          } else {
            const data = await response.json();
            setDataFromSet((prevState) => [...prevState, ...data.data]);
            setLoadedCards(Array(data.data.length).fill(false)); // Initialize loading state for cards
            hasMore = data.has_more;
            page++;
          }
        }
        setIsFetched((prevState) => ({ ...prevState, cardsFetched: true }));
        setIsLoading(false); // Set loading to false after fetching is complete
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loading to false in case of error
      }
    };

    fetchCards();
  }, []);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prevVisibleCards) =>
              Math.min(prevVisibleCards + 25, dataFromSet.length)
            );
          }
        });
      },
      {
        rootMargin: "200px", // Load cards 200px before reaching the sentinel
      }
    );

    const sentinel = document.querySelector("#sentinel");
    if (sentinel) {
      observer.current.observe(sentinel);
    }

    return () => {
      observer.current?.disconnect();
    };
  }, [dataFromSet]);

  const handleImageLoad = (index: number) => {
    setLoadedCards((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = true; // Mark the card as loaded
      return updatedState;
    });
  };

  return (
    <section className="Chosen-set">
      {/* Remove NotFound logic */}
      <>
        {isFetched.iconFetched && dataFromSet.length > 0 ? (
          <div className="flex items-center">
            <img src={iconUrl} className="h1-set-icon" />
            <h1>{nameOfSet}</h1>
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
              disabled={!isFetched.cardsFetched}
              placeholder='Any card name ex. "black lotus"'
              onChange={(event) => {
                setSearchedName(
                  FormatString(event.currentTarget.value).replace(/-/g, " ")
                );
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingCardsAnim />
        ) : (
          <ul className="cards flex flex-wrap">
            {isFetched.cardsFetched &&
              dataFromSet
                .filter((card: CardData) =>
                  searchedName
                    ? card.name
                      .toLowerCase()
                      .includes(searchedName.toLowerCase())
                    : true
                )
                .slice(0, visibleCards)
                .map((card: CardData, index: number) => {
                  const isArvinox =
                    card.name === "Arvinox, the Mind Flail" && card.set === "sld";
                  return (
                    <Link
                      to={`/card/${card.set}/${card.collector_number}`}
                      key={card.id}
                    >
                      <li>
                        {!loadedCards[index] && <CardPlaceholder />}
                        {card.image_uris ? (
                          <img
                            className="card"
                            src={card.image_uris.normal}
                            alt="Card"
                            loading="eager"
                            onLoad={() => handleImageLoad(index)}
                            style={{
                              display: loadedCards[index] ? "block" : "none",
                              ...(isArvinox ? { transform: "rotate(180deg)" } : {}),
                            }}
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
                                ...(isArvinox ? { transform: "rotate(180deg)" } : {}),
                              }}
                            />
                          )
                        )}
                      </li>
                    </Link>
                  );
                })}
          </ul>
        )}

        <div id="sentinel" style={{ height: "1px" }}></div>
        <GoTopArrow />
      </>
    </section>
  );
};

export default ChosenSet;
