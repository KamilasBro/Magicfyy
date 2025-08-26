import { useState, useRef } from "react";
import StarSvg from "../../assets/images/icons/rarity.svg?react";
import CardPlaceholder from "../../components/CardPlaceholder/CardPlaceholder";
import { CardData, RulingsData, CardSymbolData } from "../../interfaces/CardsInterface";
import { Link } from "react-router-dom";
import "./card.scss";
import "./placeholders.scss";
interface MobileCardProps {
    isFetched: {
        cardFetched: boolean;
        printsFetched: boolean;
        rulesFetched: boolean;
        symbolsFetched: boolean;
        cardBackFetched: boolean;
    };
    cardData?: CardData;
    printsData: CardData[];
    rulingsData: RulingsData[];
    cardSymbols: CardSymbolData[];
    showCardBack: boolean;
    setIconUrl: string;
    mtgFormats: string[];
    renderTextWithSymbols: (text: string) => React.ReactNode;
    compareData: (date: string) => boolean;
    renderLegalities: (card: CardData) => React.ReactNode;
    renderCardImg: () => React.ReactNode;
    renderViewBackButton: () => React.ReactNode;
    getBestEurPrice: (prices: any, purchase_uris: any) => React.ReactNode;
    getBestUsdPrice: (prices: any, purchase_uris: any) => React.ReactNode;
}
const MobileCard: React.FC<MobileCardProps> = (props) => {
    const [currentTab, setCurrentTab] = useState("card");
    const touchStartRef = useRef({ x: 0, y: 0 });
    const touchActiveRef = useRef(false);
    const SWIPE_THRESHOLD = 150; // pixels, tweak to taste
    const TABS = ["card", "cardDetails", "prints", "rules"];
    const [loadedPrints, setLoadedPrints] = useState<Record<string, boolean>>({});
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
    function renderPrintsImg(printData: CardData) {
        const typeLine =
            printData.type_line || printData?.card_faces?.[0]?.type_line;
        const isArvinox =
            ((printData?.card_faces?.[props.showCardBack ? 1 : 0]?.name || printData?.name) === "Arvinox, the Mind Flail") &&
            (printData?.set === "sld");

        // helper to mark this print as loaded
        const markLoaded = (id?: string) => {
            if (!id) return;
            setLoadedPrints((prev) => ({ ...prev, [id]: true }));
        };

        const loaded = !!loadedPrints[printData.id];

        // Check if the card is Arvinox, the Mind Flail in the SLD set cause it is upside down from API
        if (
            typeLine?.includes("Room") ||
            typeLine?.includes("Adventure") ||
            printData?.layout.includes("flip")
        ) {
            return (
                <>
                    {!loaded && <CardPlaceholder />}
                    <img
                        src={printData?.image_uris?.normal}
                        className="card-img"
                        alt={printData.name}
                        onLoad={() => markLoaded(printData.id)}
                        onError={() => markLoaded(printData.id)}
                        style={{
                            display: loaded ? undefined : "none",
                            ...(isArvinox ? { transform: "rotate(180deg)" } : undefined),
                        }}
                    />
                </>
            );
        } else {
            const faceImg =
                printData?.card_faces
                    ? printData?.card_faces?.[props.showCardBack ? 1 : 0]?.image_uris?.normal
                    : printData?.image_uris?.normal;

            return (
                <>
                    {!loaded && <CardPlaceholder />}
                    <img
                        src={faceImg}
                        className="card-img"
                        alt={printData.name}
                        onLoad={() => markLoaded(printData.id)}
                        onError={() => markLoaded(printData.id)}
                        style={{
                            display: loaded ? undefined : "none",
                            ...(isArvinox ? { transform: "rotate(180deg)" } : undefined),
                        }}
                    />
                </>
            );
        }
    }
    function renderTabs() {
        switch (currentTab) {
            case "card":
                return (
                    <div className="card-tab card-img-wrap">
                        {props.isFetched.cardFetched ? props.renderCardImg() : <CardPlaceholder />}
                        {props.renderViewBackButton()}
                    </div>
                );
            case "cardDetails":
                return (
                    <ul className="card-details flex flex-col">
                        {props.isFetched.cardFetched &&
                            props.isFetched.symbolsFetched &&
                            props.cardData ? (
                            <>
                                <h2 className="flex items-center">
                                    {props.cardData.card_faces?.[props.showCardBack ? 1 : 0]?.name ||
                                        props.cardData.name}
                                    {props.cardData.card_faces?.[props.showCardBack ? 1 : 0]?.mana_cost ||
                                        (props.cardData.card_faces && props.cardData.card_faces[1] && !props.showCardBack
                                            ? null
                                            : props.cardData.mana_cost)
                                        ? props.renderTextWithSymbols(
                                            props.cardData.card_faces?.[props.showCardBack ? 1 : 0]?.mana_cost ||
                                            props.cardData.mana_cost
                                        )
                                        : null}
                                </h2>
                                <h3>
                                    {props.cardData.card_faces?.[props.showCardBack ? 1 : 0]?.type_line ||
                                        props.cardData.type_line}
                                </h3>
                                {props.cardData.card_faces?.[props.showCardBack ? 1 : 0]?.oracle_text ? (
                                    <p className="whitespace-pre-wrap">
                                        {props.renderTextWithSymbols(
                                            props.cardData.card_faces[props.showCardBack ? 1 : 0].oracle_text
                                        )}
                                    </p>
                                ) : (
                                    props.cardData.oracle_text && (
                                        <p className="whitespace-pre-wrap">
                                            {props.renderTextWithSymbols(props.cardData.oracle_text)}
                                        </p>
                                    )
                                )}
                                {props.cardData.card_faces?.[props.showCardBack ? 1 : 0]?.flavor_text ? (
                                    <p className="italic flavor">
                                        {props.cardData.card_faces[props.showCardBack ? 1 : 0].flavor_text}
                                    </p>
                                ) : (
                                    props.cardData.flavor_text && (
                                        <p className="italic flavor">{props.cardData.flavor_text}</p>
                                    )
                                )}
                                {props.cardData.card_faces?.[props.showCardBack ? 1 : 0]?.power &&
                                    props.cardData.card_faces?.[props.showCardBack ? 1 : 0]?.toughness ? (
                                    <p>{`${props.cardData.card_faces[props.showCardBack ? 1 : 0].power}/${props.cardData.card_faces[props.showCardBack ? 1 : 0].toughness
                                        } (Power ${props.cardData.card_faces[props.showCardBack ? 1 : 0].power
                                        }, Toughness ${props.cardData.card_faces[props.showCardBack ? 1 : 0].toughness
                                        })`}</p>
                                ) : (
                                    props.cardData.power &&
                                    props.cardData.toughness && (
                                        <p>{`${props.cardData.power}/${props.cardData.toughness} (Power ${props.cardData.power}, Toughness ${props.cardData.toughness})`}</p>
                                    )
                                )}
                                {props.cardData.card_faces?.[0]?.loyalty ? (
                                    <p>
                                        Loyalty {props.cardData.card_faces[props.showCardBack ? 1 : 0].loyalty}
                                    </p>
                                ) : (
                                    props.cardData.loyalty && <p>Loyalty {props.cardData.loyalty}</p>
                                )}
                                <p className="italic">Illustrated by {props.cardData.artist}</p>
                                <h3 className="flex items-center">
                                    {props.setIconUrl && (
                                        <img src={props.setIconUrl} alt="Set Icon" className="set-icon" />
                                    )}
                                    <span>
                                        {`${props.cardData.set_name} (${props.cardData.set.toUpperCase()}) #${props.cardData.collector_number
                                            } · `}
                                        <span className="capitalize">{props.cardData.rarity}</span>
                                    </span>
                                </h3>
                                <ul className="card-formats flex flex-wrap">
                                    {props.compareData(props.cardData.released_at) ? (
                                        <button key={`format-unreleased`}>Unreleased</button>
                                    ) : (
                                        props.renderLegalities(props.cardData)
                                    )}
                                </ul>
                            </>
                        ) : (
                            <div className="card-details-placeholders flex flex-col">
                                <div className="card-details-placeholder" />
                                <div className="card-details-placeholder" />
                                <div className="card-details-placeholder" />
                                <div className="card-details-placeholder" />
                                <div className="card-details-placeholder" />
                                <div className="card-details-placeholder" />
                            </div>
                        )}
                    </ul>
                );
            case "prints":
                return (
                    <ul className="prints flex flex-wrap">
                        {props.isFetched.printsFetched ? (
                            props.printsData.map((print: CardData) => {
                                return (
                                    <Link
                                        to={`/card/${print.set}/${print.collector_number}`}
                                        key={"print " + print.id}
                                        className="print"
                                        onClick={() => {
                                            setCurrentTab("card");
                                        }}
                                    >
                                        {renderPrintsImg(print)}
                                        <li className="flex items-center">
                                            <StarSvg
                                                className={`${print.set_name === props.cardData?.set_name &&
                                                    print.collector_number === props.cardData?.collector_number &&
                                                    "active"
                                                    } flex-shrink-0`}
                                            />
                                            <p className={`${print.set_name === props.cardData?.set_name &&
                                                print.collector_number === props.cardData?.collector_number &&
                                                "active"
                                                } flex flex-col`}>
                                                {print.set_name} #{print.collector_number}
                                                <span className="prices">
                                                    {props.getBestEurPrice(print.prices, print.purchase_uris)}
                                                    {props.getBestEurPrice(print.prices, print.purchase_uris) && props.getBestUsdPrice(print.prices, print.purchase_uris) && " | "}
                                                    {props.getBestUsdPrice(print.prices, print.purchase_uris)}
                                                </span>
                                            </p>
                                        </li>
                                    </Link>
                                );
                            })
                        ) : (
                            Array.from({ length: 6 }, (_, index) => (
                                <div className="placeholder" key={index}>
                                    <CardPlaceholder />
                                    <div className="print-detail"></div>
                                </div>
                            ))
                        )}
                    </ul>
                );
            case "rules":
                return (
                    <ul className="rules flex flex-col">
                        {props.isFetched.rulesFetched ? (
                            props.rulingsData.length > 0 ? (
                                props.rulingsData.map((rule: RulingsData, index: number) => (
                                    <li
                                        className="flex flex-col"
                                        key={"rule " + rule.oracle_id + index}
                                    >
                                        <h3>{rule.published_at}</h3>
                                        <p>{props.renderTextWithSymbols(rule.comment)}</p>
                                    </li>
                                ))
                            ) : (
                                <p className="no-rules">There is no rules for this card.</p>
                            )
                        ) : (
                            <div className="placeholder flex flex-col">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        )}
                    </ul>
                );
        }
    }
    return (
        <section className="Mobile-card"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}>
            <ul className="mobile-card-menu">
                <li className={currentTab === "card" ? "active" : ""} onClick={() => setCurrentTab("card")}>Card</li>
                <li className={currentTab === "cardDetails" ? "active" : ""} onClick={() => setCurrentTab("cardDetails")}>Card Details</li>
                <li className={currentTab === "prints" ? "active" : ""} onClick={() => setCurrentTab("prints")}>Prints</li>
                <li className={currentTab === "rules" ? "active" : ""} onClick={() => setCurrentTab("rules")}>Rules</li>
            </ul>
            <div>
                {renderTabs()}
            </div>
            <ul className="mobile-card-menu-indicators">
                <li className="indicator">
                    <button className={currentTab === "card" ? "active" : ""} onClick={() => setCurrentTab("card")} />
                </li>
                <li className="indicator">
                    <button className={currentTab === "cardDetails" ? "active" : ""} onClick={() => setCurrentTab("cardDetails")} />
                </li>
                <li className="indicator">
                    <button className={currentTab === "prints" ? "active" : ""} onClick={() => setCurrentTab("prints")} />
                </li>
                <li className="indicator">
                    <button className={currentTab === "rules" ? "active" : ""} onClick={() => setCurrentTab("rules")} />
                </li>
            </ul>
        </section>
    )
};

export default MobileCard;
