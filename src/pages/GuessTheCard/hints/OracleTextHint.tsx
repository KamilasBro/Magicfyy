import { CardData } from "../../../interfaces/Interfaces";
import { canShow, hintLeft } from "../helpers/hintCounters";
import { useCardSymbols } from "../../../utils/card/useCardSymbols";

const OracleTextHint: React.FC<{
    randomCard: CardData | undefined,
    guessesLength: number,
}> = ({ randomCard, guessesLength }) => {
    if (!randomCard) return null;

    const { getTextWithSymbols } = useCardSymbols()

    const removeCardNamesFromText = (text: string, names: (string | undefined)[]) => {
        if (!text) return text;
        let result = text;
        names
            .filter(Boolean)
            .forEach((nameRaw) => {
                const name = (nameRaw as string).trim();
                const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                result = result.replace(new RegExp(`\\b${escaped}\\b`, "gi"), "*this card*");
            });
        return result;
    }

    return <li>
        <p>
            Oracle Text {" "}
            {!canShow(15, guessesLength) &&
                <span className="hint-counter">
                    Hint in {hintLeft(15, guessesLength)} guesses
                </span>
            }
        </p>
        {canShow(15, guessesLength) && (
            randomCard.oracle_text
                ? <span className="oracle-text">
                    {getTextWithSymbols(
                        removeCardNamesFromText(
                            randomCard.oracle_text,
                            [randomCard.name, ...(randomCard.card_faces?.map((f: any) => f.name) ?? [])]
                        )
                    )}
                </span>
                : "No text"
        )}
    </li>
}

export default OracleTextHint