import "./mobileCard.scss"
import "./mobileCardPlaceholders.scss"

import { useState, useRef } from "react";

import { CardData } from "../../../interfaces/Interfaces";

import CardDetails from "../subcomponents/CardDetails";
import CardImg from "../subcomponents/CardImg";
import ToggleFaceButton from "../subcomponents/ToggleFaceButton";
import MobilePrints from "../subcomponents/MobilePrints";
import Rules from "../subcomponents/Rules";
import { useCardPrints } from "../helpers/useCardPrints";

const TABS = ["Card", "Card Details", "Prints", "Rules"];
const SWIPE_THRESHOLD = 100; // pixels to trigger swipe

const MobileCard: React.FC<{
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
        const { printsData, arePrintsLoaded, getEuroPrice, getUsdPrice } = useCardPrints(
            cardData,
            isCardLoaded
        );

        const [currentTab, setCurrentTab] = useState("Card");

        const touchStartRef = useRef({ x: 0, y: 0 });
        const touchActiveRef = useRef(false);


        const goToNextTab = () => {
            const idx = TABS.indexOf(currentTab);
            const next = Math.min(TABS.length - 1, idx + 1);
            if (next !== idx) setCurrentTab(TABS[next]);
        };

        const goToPrevTab = () => {
            const idx = TABS.indexOf(currentTab);
            const prev = Math.max(0, idx - 1);
            if (prev !== idx) setCurrentTab(TABS[prev]);
        };


        const handleTouchStart = (e: React.TouchEvent) => {
            const t = e.touches[0];
            touchStartRef.current = { x: t.clientX, y: t.clientY };
            touchActiveRef.current = true;
        };

        const handleTouchEnd = (e: React.TouchEvent) => {
            if (!touchActiveRef.current) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - touchStartRef.current.x;
            const dy = t.clientY - touchStartRef.current.y;

            // only trigger when horizontal movement is dominant and over threshold
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
                if (dx < 0) {
                    goToNextTab(); // swipe left -> next tab
                } else {
                    goToPrevTab(); // swipe right -> prev tab
                }
            }

            touchActiveRef.current = false;
        };

        const handleTouchCancel = () => {
            touchActiveRef.current = false;
        };

        return (
            <section className="Mobile-card">
                <ul className="mobile-card-menu">
                    {TABS.map((tab) => {
                        return (
                            <li
                                key={tab}
                                className={currentTab === tab ? "active" : ""}
                                onClick={() => setCurrentTab(tab)}>
                                {tab}
                            </li>
                        )
                    })}
                </ul>
                <div
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchCancel}
                >
                    {currentTab === "Card" &&
                        <div className="card-tab card-img-wrap">
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
                    }
                    {currentTab === "Card Details" &&
                        <>
                            <CardDetails
                                cardData={cardData}
                                isCardLoaded={isCardLoaded}
                                getTextWithSymbols={getTextWithSymbols}
                                showAltFace={showAltFace}
                            />
                            <ToggleFaceButton
                                cardData={cardData}
                                isCardLoaded={isCardLoaded}
                                showAltFace={showAltFace}
                                setShowAltFace={setShowAltFace}
                            />
                        </>
                    }
                    {currentTab === "Prints" &&
                        <MobilePrints
                            cardData={cardData}
                            setCurrentTab={setCurrentTab}
                            printsData={printsData}
                            arePrintsLoaded={arePrintsLoaded}
                            getEuroPrice={getEuroPrice}
                            getUsdPrice={getUsdPrice}
                        />
                    }
                    {currentTab === "Rules" &&
                        <Rules
                            cardData={cardData}
                            isCardLoaded={isCardLoaded}
                            getTextWithSymbols={getTextWithSymbols}
                        />
                    }
                </div>
                <ul className="mobile-card-menu-indicators">
                    {TABS.map((tab) => {
                        return (
                            <li key={`${tab}Indicator`} className="indicator">
                                <button
                                    className={currentTab === tab ? "active" : ""}
                                    onClick={() => setCurrentTab(tab)}
                                />
                            </li>
                        )
                    })}
                </ul>
            </section>
        )
    };

export default MobileCard;
