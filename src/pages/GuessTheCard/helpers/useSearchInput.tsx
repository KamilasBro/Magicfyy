import { useEffect, useRef, useMemo, useState } from "react";
import { CardData } from "../../../interfaces/Interfaces";


//here we do custom highlight and select for better UX with clean UI
//also we check if user won the game
export const useSearchInput = ({
    cardsData,
    guesses,
    setGuesses,
    winTheGame,
    setWinTheGame,
    randomCard,
}: {
    cardsData: CardData[];
    guesses: CardData[];
    setGuesses: React.Dispatch<React.SetStateAction<CardData[]>>;
    winTheGame: boolean;
    setWinTheGame: React.Dispatch<React.SetStateAction<boolean>>;
    randomCard?: CardData;
}) => {
    const [searchValue, setSearchValue] = useState<string>("");
    //current highlighted card name
    const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

    const dropdownRefs = useRef<(HTMLLIElement | null)[]>([]);

    const filteredCards = useMemo(() => {
        const query = searchValue.trim().toLowerCase();
        if (!query) return [];

        return cardsData
            .filter((card) => {
                return (
                    !guesses.some((guess) => guess.name === card.name) &&
                    card.name.toLowerCase().includes(query)
                );
            })
            .sort((a, b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();

                const aStarts = aName.startsWith(query);
                const bStarts = bName.startsWith(query);

                if (aStarts !== bStarts) {
                    return aStarts ? -1 : 1;
                }

                return aName.localeCompare(bName);
            });
    }, [cardsData, guesses, searchValue]);

    //scroll during dropdown usage
    useEffect(() => {
        if (
            highlightedIndex >= 0 &&
            dropdownRefs.current[highlightedIndex]
        ) {
            dropdownRefs.current[highlightedIndex]?.scrollIntoView({
                block: "nearest",
                behavior: "auto",
            });
        }
    }, [highlightedIndex, filteredCards.length]);

    //if search value changes we always highlight 1st item from the list
    useEffect(() => {
        setHighlightedIndex(0);
    }, [searchValue]);

    //pick highlighted item logic
    const handleChoice = () => {
        const card =
            highlightedIndex >= 0 && filteredCards[highlightedIndex]
                ? filteredCards[highlightedIndex]
                : filteredCards.length === 1
                    ? filteredCards[0]
                    : null;

        if (!card || winTheGame) return;

        setGuesses((prev) => [...prev, card]);
        setSearchValue("");
        setHighlightedIndex(-1);

        if (card.name === randomCard?.name) {
            setWinTheGame(true);
        }
    }

    //for better UX we have custom key events
    const handleInputKeys = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setHighlightedIndex((prev) =>
                prev < filteredCards.length - 1 ? prev + 1 : 0
            );
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setHighlightedIndex((prev) =>
                prev > 0 ? prev - 1 : filteredCards.length - 1
            );
        } else if (event.key === "Enter") {
            handleChoice()
        }
    };

    const renderDropDown = () => {
        return (
            <ul className="dropdown">
                {filteredCards.map((card, idx) => (
                    <li
                        key={card.id}
                        ref={(el) => (dropdownRefs.current[idx] = el)}
                        className={`flex${highlightedIndex === idx ? " highlighted" : ""}`}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        onMouseLeave={() => setHighlightedIndex(-1)}
                        onClick={() => {
                            setGuesses((prev) => [...prev, card]);
                            setSearchValue("");
                            setHighlightedIndex(-1);

                            if (card.name === randomCard?.name) {
                                setWinTheGame(true);
                            }
                        }}
                    >
                        <span className="card-name">{card.name}</span>
                    </li>
                ))}
            </ul>
        );
    };

    return {
        searchValue,
        setSearchValue,
        filteredCards,
        handleInputKeys,
        handleChoice,
        renderDropDown
    };
};