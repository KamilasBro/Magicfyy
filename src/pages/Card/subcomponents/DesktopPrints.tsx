import StarSvg from "@/assets/images/icons/rarity.svg?react";;

import { CardData } from "@/interfaces/Interfaces";
import { handleImageSource } from "@/utils/card/handleImageSource";
import { useCardPrints } from "../helpers/useCardPrints";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DesktopPrints: React.FC<{
    cardData: CardData | undefined,
    isCardLoaded: boolean
}> = ({ cardData, isCardLoaded }) => {
    const { printsData, arePrintsLoaded, getEuroPrice, getUsdPrice } = useCardPrints(cardData, isCardLoaded)
    const [printMiniature, setPrintMiniature] = useState<{
        show: boolean,
        data: CardData | undefined
    }>({
        show: false,
        data: undefined
    })

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!printMiniature.show) return;

        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({
                x: event.clientX,
                y: event.clientY + window.scrollY,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [printMiniature.show]);

    const handleMouseEnter = (
        event: React.MouseEvent,
        print: CardData
    ) => {
        if (
            print.set === cardData?.set &&
            print.collector_number === cardData.collector_number
        ) {
            return;
        }

        setMousePosition({
            x: event.clientX,
            y: event.clientY + window.scrollY,
        });

        setPrintMiniature({
            show: true,
            data: print
        });
    };

    const handleMouseLeave = () => {
        setPrintMiniature(() => ({
            show: false,
            data: undefined
        }));
    };

    const renderPrintImg = () => {
        if (!printMiniature.data) return null;
        const { imgSrc, isArvinox } = handleImageSource(printMiniature.data)
        return (
            printMiniature.show && (
                <img
                    src={imgSrc}
                    className="print-minature absolute"
                    style={{
                        left: `${mousePosition.x - 225}px`,
                        top: `${mousePosition.y - 75}px`,
                        ...(isArvinox ? { transform: "rotate(180deg)" } : {}),
                    }}
                />

            )
        )
    }
    return (
        <>
            {renderPrintImg()}
            <div className="prints">
                <h2 className="text-center">Prints</h2>
                <ul className="flex flex-col">
                    {arePrintsLoaded ? (
                        printsData.map((print: CardData) => {
                            return (
                                <Link
                                    key={"print " + print.id}
                                    onMouseEnter={(e) => handleMouseEnter(e, print)}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={handleMouseLeave}
                                    to={`/card/${print.set}/${print.collector_number}`}
                                >
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
                        <div className="placeholder flex flex-col">
                            {Array(6).fill(null).map((_, index) => <div key={index} />)}
                        </div>
                    )}
                </ul>
            </div>
        </>
    )
}

export default DesktopPrints