import StarSvg from "@/assets/images/icons/rarity.svg?react";

import { CardData } from "@/interfaces/Interfaces";
import { handleImageSource } from "@/utils/card/handleImageSource";
import CardPlaceholder from "@/components/CardPlaceholder/CardPlaceholder";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MobilePrints: React.FC<{
    cardData: CardData | undefined;
    setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
    printsData: CardData[]
    arePrintsLoaded: boolean
    getEuroPrice: any
    getUsdPrice: any
}> = ({ cardData, setCurrentTab, printsData, arePrintsLoaded, getEuroPrice, getUsdPrice }) => {

    const [loadedPrints, setLoadedPrints] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setLoadedPrints({});
    }, [cardData?.id]);

    const handlePrintLoad = (id: string) => {
        setLoadedPrints((prev) => {
            if (prev[id]) return prev;
            return {
                ...prev,
                [id]: true,
            };
        });
    };

    return (
        <ul className="prints flex flex-wrap">
            {arePrintsLoaded ? (
                printsData.map((print: CardData) => {
                    const { imgSrc, isArvinox } = handleImageSource(print);
                    const loaded = !!loadedPrints[print.id];

                    return (
                        <Link
                            to={`/card/${print.set}/${print.collector_number}`}
                            key={"print " + print.id}
                            className="print"
                            onClick={() => setCurrentTab("Card")}
                        >
                            {!loaded && <CardPlaceholder />}

                            <img
                                src={imgSrc}
                                className="card-img"
                                alt={print.name}
                                onLoad={() => handlePrintLoad(print.id)}
                                onError={() => handlePrintLoad(print.id)}
                                ref={(img) => {
                                    if (img?.complete) {
                                        handlePrintLoad(print.id);
                                    }
                                }}
                                style={{
                                    display: loaded ? "block" : "none",
                                    ...(isArvinox
                                        ? { transform: "rotate(180deg)" }
                                        : undefined),
                                }} />
                            <li className="flex items-center">
                                <StarSvg
                                    className={`${print.set_name === cardData?.set_name &&
                                        print.collector_number === cardData?.collector_number &&
                                        "active"
                                        } flex-shrink-0`}
                                />
                                <p className="flex flex-col">
                                    {print.set_name} #{print.collector_number}
                                    <span className="prices">
                                        <span
                                            className="price-link"
                                            onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                window.open(print.purchase_uris.cardmarket, "_blank");
                                            }}
                                            title="Buy on Cardmarket"
                                        >
                                            {getEuroPrice(print.prices) && getEuroPrice(print.prices) + "€"}
                                        </span>
                                        {getEuroPrice(print.prices) && getUsdPrice(print.prices) && " | "}
                                        <span
                                            className="price-link"
                                            onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                window.open(print.purchase_uris.tcgplayer, "_blank");
                                            }}
                                            title="Buy on TCGPlayer"
                                        >
                                            {getUsdPrice(print.prices) && getUsdPrice(print.prices) + "$"}
                                        </span>
                                    </span>
                                </p>
                            </li>
                        </Link>
                    );
                })
            ) : (
                Array.from({ length: 6 }, (_, index) => (
                    <li className="placeholder flex flex-col items-center" key={index}>
                        <CardPlaceholder />
                        <div className="print-detail"></div>
                    </li>
                ))
            )}
        </ul >
    );
}

export default MobilePrints