import { CardData } from "../../../interfaces/Interfaces";
import { canShow, hintLeft } from "../helpers/hintCounters";
import { renderFormatLegalities } from "../../../utils/card/renderFormatLegalities";

const FormatsHint: React.FC<{
    randomCard: CardData | undefined,
    guessesLength: number
}> = ({ randomCard, guessesLength }) => {
    if (!randomCard) return null;

    return (
        <li>
            <p>
                Formats Legality{" "}
                {!canShow(3, guessesLength) &&
                    <span className="hint-counter">
                        Hint in {hintLeft(3, guessesLength)} guesses
                    </span>
                }
            </p>
            {canShow(3, guessesLength) &&
                <ul className="formats">
                    {renderFormatLegalities(randomCard)}
                </ul>
            }
        </li>
    );
}

export default FormatsHint