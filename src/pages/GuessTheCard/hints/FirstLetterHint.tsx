import { CardData } from "../../../interfaces/Interfaces";
import { canShow, hintLeft } from "../helpers/hintCounters";

const FirstLetterHint: React.FC<{
    randomCard: CardData | undefined,
    guessesLength: number
}> = ({ randomCard, guessesLength }) => {
    if (!randomCard) return null;
    return <li>
        <p>
            First Letter {" "}
            {!canShow(12, guessesLength) &&
                <span className="hint-counter">
                    Hint in {hintLeft(12, guessesLength)} guesses
                </span>
            }
        </p>
        {canShow(12, guessesLength) && <span className="first-letter">{randomCard.name.charAt(0)}</span>
        }
    </li>
}

export default FirstLetterHint