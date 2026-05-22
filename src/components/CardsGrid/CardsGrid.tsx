import "./cardsGrid.scss";

import CardPlaceholder from "../../components/CardPlaceholder/CardPlaceholder";

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CardData } from "../../interfaces/Interfaces";
import { handleImageLoad } from "../../utils/other/handleImageLoad";
import { handleImageSource } from "../../utils/card/handleImageSource";

const CardsGrid: React.FC<{
    cardsList: CardData[]
}> = ({
    cardsList,
}) => {
        const initialVisibleCards = 25;
        const [visibleCards, setVisibleCards] = useState<number>(initialVisibleCards);
        const [loadedCards, setLoadedCards] = useState<boolean[]>([]);

        const observer = useRef<IntersectionObserver | null>(null);
        const sentinelRef = useRef<HTMLDivElement | null>(null);

        //reset components
        useEffect(() => {
            if (!cardsList) return;
            window.scrollTo({
                top: 0,
                behavior: "auto",
            });
            setVisibleCards(initialVisibleCards)
        }, [cardsList])

        useEffect(() => {
            if (!cardsList) return;
            observer.current = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setVisibleCards((prevVisibleCards) =>
                                Math.min(prevVisibleCards + initialVisibleCards, cardsList.length)
                            );
                        }
                    });
                },
                {
                    root: null,
                    rootMargin: "0px 0px 300px 0px",
                    threshold: 0,
                }
            );

            const sentinel = sentinelRef.current;
            if (sentinel) {
                observer.current.observe(sentinel);
            }

            return () => {
                observer.current?.disconnect();
            };
        }, [cardsList]);


        return <>
            <ul className="cards-grid">
                {cardsList
                    .slice(0, visibleCards)
                    .map((card: CardData, index: number) => {
                        const { imgSrc, isArvinox } = handleImageSource(card);
                        return (
                            <Link
                                to={`/card/${card.set}/${card.collector_number}`}
                                key={card.id}
                            >
                                <li>
                                    {!loadedCards[index] &&
                                        <CardPlaceholder />}
                                    <img
                                        className="card"
                                        src={imgSrc}
                                        alt="Card"
                                        loading="eager"
                                        onLoad={() =>
                                            handleImageLoad(index, setLoadedCards)
                                        }
                                        style={{
                                            display: loadedCards[index]
                                                ? "block"
                                                : "none",
                                            ...(isArvinox
                                                ? { transform: "rotate(180deg)" }
                                                : {}),
                                        }}
                                    />
                                </li>
                            </Link>
                        );
                    })}
            </ul>
            <div ref={sentinelRef} style={{ height: "1px" }} />
        </>
    };

export default CardsGrid