import "./desktopCard.scss"
import "./desktopCardPlaceholders.scss"

import { CardData } from "../../../interfaces/Interfaces";

import CardDetails from "../subcomponents/CardDetails";
import CardImg from "../subcomponents/CardImg";
import ToggleFaceButton from "../subcomponents/ToggleFaceButton";
import DesktopPrints from "../subcomponents/DesktopPrints";
import Rules from "../subcomponents/Rules";

const DesktopCard: React.FC<{
  cardData: CardData | undefined,
  isCardLoaded: boolean,
  getTextWithSymbols: (text: string) => (string | JSX.Element)[] | null,
  showAltFace: boolean,
  setShowAltFace: React.Dispatch<React.SetStateAction<boolean>>,
}> = ({
  cardData,
  isCardLoaded,
  getTextWithSymbols,
  showAltFace,
  setShowAltFace
}) => {

    return (
      <section className="Card">
        <div className="card-info flex">
          <div className="flex flex-col items-center">
            <CardImg
              cardData={cardData}
              isCardLoaded={isCardLoaded}
              showAltFace={showAltFace}
            />
            <ToggleFaceButton
              cardData={cardData}
              isCardLoaded={isCardLoaded}
              showAltFace={showAltFace}
              setShowAltFace={setShowAltFace}
            />
          </div>
          <CardDetails
            cardData={cardData}
            isCardLoaded={isCardLoaded}
            getTextWithSymbols={getTextWithSymbols}
            showAltFace={showAltFace}
          />
        </div>
        <DesktopPrints
          cardData={cardData}
          isCardLoaded={isCardLoaded}
        />
        <div className="rules">
          <h2>Rules</h2>
          <Rules
            cardData={cardData}
            isCardLoaded={isCardLoaded}
            getTextWithSymbols={getTextWithSymbols}
          />
        </div>
      </section>
    );
  };

export default DesktopCard;
