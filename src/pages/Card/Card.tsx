import { useEffect, useState } from "react";
import StarSvg from "../../assets/images/icons/rarity.svg?react";
import {
  CardData,
  RulingsData,
  CardSymbolData,
} from "../../interfaces/CardsInterface";
import { useParams, Link } from "react-router-dom";
import CardPlaceholder from "../../components/CardPlaceholder/CardPlaceholder";
import "./card.scss";
import "./placeholders.scss";
const Card: React.FC = () => {
  const [isFetched, setIsFetched] = useState({
    cardFetched: false,
    printsFetched: false,
    rulesFetched: false,
    symbolsFetched: false,
    cardBackFetched: false,
  });
  const [cardData, setCardData] = useState<CardData>();
  const [printsData, setPrintsData] = useState<CardData[]>([]);
  const [rulingsData, setRulingsData] = useState<RulingsData[]>([]);
  const [cardSymbols, setCardSymbols] = useState<CardSymbolData[]>([]);
  const [showCardBack, setShowCardBack] = useState(false);
  const [printMinature, setPrintMinature] = useState({
    show: false,
    imgSrc: "",
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [setIconUrl, setSetIconUrl] = useState<string>(""); // Track set icon URL
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
  const params = useParams();
  useEffect(() => {
    const fetchCard = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Set a timeout of 100ms
        const apiUrl = `https://api.scryfall.com/cards/${params.set}/${params.code}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        } else {
          const data = await response.json();
          setCardData(data);
          setIsFetched((prevState) => ({ ...prevState, cardFetched: true }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCard();
  }, [params.set, params.code]);
  useEffect(() => {
    if (isFetched.cardFetched) {
      const fetchPrints = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 100)); // Set a timeout of 100ms
          const apiUrl = `${cardData?.prints_search_uri}`;
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          } else {
            const data = await response.json();
            setPrintsData(data.data);
            setIsFetched((prevState) => ({
              ...prevState,
              printsFetched: true,
            }));
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      setShowCardBack(false);
      fetchPrints();
    }
  }, [cardData]);
  useEffect(() => {
    if (isFetched.cardFetched) {
      const fetchRulings = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 100)); // Set a timeout of 100ms
          const apiUrl = `${cardData?.rulings_uri}`;
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          } else {
            const data = await response.json();
            setRulingsData(data.data);
            setIsFetched((prevState) => ({
              ...prevState,
              rulesFetched: true,
            }));
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchRulings();
    }
  }, [cardData]);
  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 50)); // Set a timeout of 100ms
        const apiUrl = `https://api.scryfall.com/symbology`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        } else {
          const data = await response.json();
          setCardSymbols(data.data);
          setIsFetched((prevState) => ({ ...prevState, symbolsFetched: true }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchSymbols();
  }, []);
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY + window.scrollY, // Adjust for scroll position
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  useEffect(() => {
    if (isFetched.cardFetched) {
      const fetchSetIcon = async () => {
        try {
          const apiUrl = `https://api.scryfall.com/sets/${params.set}`;
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error("Failed to fetch set icon");
          } else {
            const data = await response.json();
            setSetIconUrl(data.icon_svg_uri);
          }
        } catch (error) {
          console.error("Error fetching set icon:", error);
        }
      };

      fetchSetIcon();
    }
  }, [isFetched.cardFetched, params.set]);
  function renderTextWithSymbols(text: string) {
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
          <img key={offset} src={symbolData.svg_uri} alt={`${symbol} symbol`} />
        );
      } else {
        // If symbolData is not found, render the symbol as text
        parts.push(match);
      }

      // Update lastIndex to the end of the current match
      lastIndex = offset + match.length;
      return match; // Return the match to conform to the expected return type
    });

    // Add the remaining text after the last match
    parts.push(text.slice(lastIndex));

    return parts;
  }
  function compareData(date: string) {
    const releaseDate = new Date(date);
    const currentDate = new Date();
    return releaseDate > currentDate;
  }
  function renderLegalities(card: CardData) {
    const lowercaseLegalities = Object.fromEntries(
      Object.entries(card.legalities).map(([key, value]) => [
        key.toLowerCase(),
        value,
      ])
    );

    return mtgFormats
      .filter((format) => lowercaseLegalities[format.toLowerCase()]) // Filter only formats present in card's legalities
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
            return null; // Don't render button for formats with unknown legality
        }
      });
  }
  function renderCardImg() {
    const typeLine =
      cardData?.type_line || cardData?.card_faces?.[0]?.type_line;
    if (
      typeLine?.includes("Room") ||
      typeLine?.includes("Adventure") ||
      cardData?.layout.includes("flip")
    ) {
      return <img src={cardData?.image_uris?.normal} className="card-img" />;
    }
    if (cardData?.card_back_id && showCardBack) {
      const [firstChar, secondChar] = cardData.card_back_id.split("-")[0]; // Get the first and second characters from the ID
      return (
        <img
          src={`https://backs.scryfall.io/normal/${firstChar}/${secondChar}/${cardData.card_back_id}.jpg?1665006175`}
          className="card-img"
        />
      );
    } else {
      return (
        <img
          src={
            cardData?.card_faces
              ? cardData?.card_faces?.[showCardBack ? 1 : 0]?.image_uris?.normal
              : cardData?.image_uris?.normal
          }
          className="card-img"
        />
      );
    }
  }

  const handleMouseEnter = (print: CardData) => {
    if (
      cardData?.set !== print.set ||
      cardData?.collector_number !== print.collector_number
    ) {
      setPrintMinature({
        show: true,
        imgSrc: print.card_faces
          ? print.card_faces[0]?.image_uris?.normal ?? ""
          : print.image_uris?.normal ?? "",
      });
    }
  };

  const handleMouseLeave = () => {
    setPrintMinature({
      show: false,
      imgSrc: "",
    });
  };
  const renderViewBackButton = () => {
    const typeLine =
      cardData?.type_line ||
      cardData?.card_faces?.[0]?.type_line ||
      cardData?.card_faces?.[1]?.type_line;

    if (
      (cardData && cardData?.layout !== "normal") ||
      typeLine?.includes("Token") ||
      typeLine?.includes("Emblem")
    ) {
      return (
        <button
          className="view-back"
          onClick={() => {
            setShowCardBack((prevState) => !prevState);
          }}
        >
          View Back
        </button>
      );
    }
  };
  console.log(cardData);
  return (
    <section className="Card">
      {printMinature.show && (
        <img
          src={printMinature.imgSrc}
          className="print-minature absolute"
          style={{
            left: `${mousePosition.x - 225}px`,
            top: `${mousePosition.y - 75}px`,
          }}
        />
      )}
      <div className="card-info flex">
        <div className="flex flex-col items-center">
          {isFetched.cardFetched ? renderCardImg() : <CardPlaceholder />}
          {renderViewBackButton()}
        </div>
        <ul className="card-details flex flex-col">
          {isFetched.cardFetched && isFetched.symbolsFetched && cardData ? (
            <>
              <h2 className="flex items-center">
                {cardData.card_faces?.[showCardBack ? 1 : 0]?.name ||
                  cardData.name}
                {cardData.card_faces?.[showCardBack ? 1 : 0]?.mana_cost ||
                (cardData.card_faces && cardData.card_faces[1] && !showCardBack
                  ? null
                  : cardData.mana_cost)
                  ? renderTextWithSymbols(
                      cardData.card_faces?.[showCardBack ? 1 : 0]?.mana_cost ||
                        cardData.mana_cost
                    )
                  : null}
              </h2>
              <h3>
                {cardData.card_faces?.[showCardBack ? 1 : 0]?.type_line ||
                  cardData.type_line}
              </h3>
              {cardData.card_faces?.[showCardBack ? 1 : 0]?.oracle_text ? (
                <p className="whitespace-pre-wrap">
                  {renderTextWithSymbols(
                    cardData.card_faces[showCardBack ? 1 : 0].oracle_text
                  )}
                </p>
              ) : (
                cardData.oracle_text && (
                  <p className="whitespace-pre-wrap">
                    {renderTextWithSymbols(cardData.oracle_text)}
                  </p>
                )
              )}
              {cardData.card_faces?.[showCardBack ? 1 : 0]?.flavor_text ? (
                <p className="italic flavor">
                  {cardData.card_faces[showCardBack ? 1 : 0].flavor_text}
                </p>
              ) : (
                cardData.flavor_text && (
                  <p className="italic flavor">{cardData.flavor_text}</p>
                )
              )}
              {cardData.card_faces?.[showCardBack ? 1 : 0]?.power &&
              cardData.card_faces?.[showCardBack ? 1 : 0]?.toughness ? (
                <p>{`${cardData.card_faces[showCardBack ? 1 : 0].power}/${
                  cardData.card_faces[showCardBack ? 1 : 0].toughness
                } (Power ${
                  cardData.card_faces[showCardBack ? 1 : 0].power
                }, Toughness ${
                  cardData.card_faces[showCardBack ? 1 : 0].toughness
                })`}</p>
              ) : (
                cardData.power &&
                cardData.toughness && (
                  <p>{`${cardData.power}/${cardData.toughness} (Power ${cardData.power}, Toughness ${cardData.toughness})`}</p>
                )
              )}
              {cardData.card_faces?.[0]?.loyalty ? (
                <p>
                  Loyalty {cardData.card_faces[showCardBack ? 1 : 0].loyalty}
                </p>
              ) : (
                cardData.loyalty && <p>Loyalty {cardData.loyalty}</p>
              )}
              <p className="italic">Illustrated by {cardData.artist}</p>
              <h3 className="flex items-center">
                {setIconUrl && (
                  <img src={setIconUrl} alt="Set Icon" className="set-icon" />
                )}
                <span>
                  {`${cardData.set_name} (${cardData.set.toUpperCase()}) #${
                    cardData.collector_number
                  } · `}
                  <span className="capitalize">{cardData.rarity}</span>
                </span>
              </h3>
              <ul className="card-formats flex flex-wrap">
                {compareData(cardData.released_at) ? (
                  <button key={`format-unreleased`}>Unreleased</button>
                ) : (
                  renderLegalities(cardData)
                )}
              </ul>
            </>
          ) : (
            <div className="card-details-placeholders flex flex-col">
              <div className="card-details-placeholder"></div>
              <div className="card-details-placeholder"></div>
              <div className="card-details-placeholder"></div>
              <div className="card-details-placeholder"></div>
              <div className="card-details-placeholder"></div>
              <div className="card-details-placeholder"></div>
            </div>
          )}
        </ul>
      </div>
      <div className="prints">
        <h2 className="text-center">Prints</h2>
        <ul className="flex flex-col">
          {isFetched.printsFetched ? (
            printsData.map((print: CardData) => {
              return (
                <Link
                  onMouseEnter={() => handleMouseEnter(print)}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleMouseLeave}
                  to={`/card/${print.set}/${print.collector_number}`}
                  key={"print " + print.id}
                >
                  <li className="flex items-center">
                    <StarSvg
                      className={`${
                        print.set_name === cardData?.set_name &&
                        print.collector_number === cardData?.collector_number &&
                        "active"
                      } flex-shrink-0`}
                    />
                    <p>
                      {print.set_name} #{print.collector_number}
                    </p>
                  </li>
                </Link>
              );
            })
          ) : (
            <div className="placeholder flex flex-col">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
        </ul>
      </div>
      <div className="rules">
        <h2>Rules</h2>
        <ul className="flex flex-col">
          {isFetched.rulesFetched ? (
            rulingsData.length > 0 ? (
              rulingsData.map((rule: RulingsData, index: number) => (
                <li
                  className="flex flex-col"
                  key={"rule " + rule.oracle_id + index}
                >
                  <h3>{rule.published_at}</h3>
                  <p>{renderTextWithSymbols(rule.comment)}</p>
                </li>
              ))
            ) : (
              <p>There is no rules for this card.</p>
            )
          ) : (
            <div className="placeholder flex flex-col">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
        </ul>
      </div>
    </section>
  );
};

export default Card;
