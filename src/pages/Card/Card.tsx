import { CardData } from "../../interfaces/Interfaces";

import NotFound from "../NotFound/NotFound";

import DesktopCard from "./desktop/DesktopCards";
import MobileCard from "./mobile/MobileCard";

import { useCardSymbols } from "../../utils/card/useCardSymbols";
import { useIsMobile } from "../../utils/other/useIsMobile";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Card: React.FC = () => {
  const params = useParams();
  const { getTextWithSymbols } = useCardSymbols();

  const [cardData, setCardData] = useState<CardData>();
  const [isCardLoaded, setIsCardLoaded] = useState(false)
  const [cardNotFound, setCardNotFound] = useState(false)

  const [showAltFace, setShowAltFace] = useState(false);


  useEffect(() => {
    const controller = new AbortController();

    const fetchCard = async () => {
      setCardNotFound(false)
      try {
        const apiUrl = `https://api.scryfall.com/cards/${params.set}/${params.code}`;
        const response = await fetch(apiUrl, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        } else {
          const data = await response.json();
          setCardData(data);
          setIsCardLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setCardNotFound(true)
      }
    };
    fetchCard();

    return () => {
      controller.abort();
    };
  }, [params.set, params.code]);

  const isMobile = useIsMobile();

  return (
    !cardNotFound
      ? (!isMobile
        ? <DesktopCard
          cardData={cardData}
          isCardLoaded={isCardLoaded}
          getTextWithSymbols={getTextWithSymbols}
          showAltFace={showAltFace}
          setShowAltFace={setShowAltFace}
        />
        : <MobileCard
          cardData={cardData}
          isCardLoaded={isCardLoaded}
          getTextWithSymbols={getTextWithSymbols}
          showAltFace={showAltFace}
          setShowAltFace={setShowAltFace}
        />)

      : <NotFound />
  );
};

export default Card;
