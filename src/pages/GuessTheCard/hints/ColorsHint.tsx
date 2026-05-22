import { CardData } from "../../../interfaces/Interfaces";
import { canShow, hintLeft } from "../helpers/hintCounters";
import { useCardSymbols } from "../../../utils/card/useCardSymbols";

const ColorsHint: React.FC<{
    randomCard: CardData | undefined,
    guessesLength: number,
}> = ({ randomCard, guessesLength }) => {
    if (!randomCard) return null;
    const { symbolMap } = useCardSymbols()

    const getColorSymbols = (colors: string[] = []) => {
        const colorToSymbol: Record<string, string> = {
            W: "{W}",
            U: "{U}",
            B: "{B}",
            R: "{R}",
            G: "{G}",
            C: "{C}",
        };

        const renderSymbol = (symbolKey: string, fallback: React.ReactNode, key: string) => {
            const symbol = symbolMap.get(symbolKey);

            return symbol ? (
                <img
                    key={key}
                    src={symbol.svg_uri}
                    alt={symbol.english}
                    className="color-symbol"
                />
            ) : fallback;
        };

        if (!colors?.length) {
            return renderSymbol(
                "{C}",
                <span key="colorless">Colorless</span>,
                "colorless"
            );
        }

        return colors.map((color, idx) =>
            renderSymbol(
                colorToSymbol[color],
                <span key={color + idx}>{color}</span>,
                color + idx
            )
        );
    };

    return (
        <li>
            <p>
                Colors{" "}
                {!canShow(6, guessesLength) &&
                    <span className="hint-counter">
                        Hint in {hintLeft(6, guessesLength)} guesses
                    </span>
                }
            </p>
            {canShow(6, guessesLength) &&
                <div className="color-hint flex">
                    {randomCard.colors && randomCard.colors.length > 0
                        ? getColorSymbols(randomCard.colors)
                        : getColorSymbols([])}
                </div>
            }
        </li>
    )
}

export default ColorsHint