import { CardData } from "../../../interfaces/Interfaces";
import { canShow, hintLeft } from "../helpers/hintCounters";

const PricesHint: React.FC<{
    randomCard: CardData | undefined,
    guessesLength: number
}> = ({ randomCard, guessesLength }) => {
    if (!randomCard) return null;
    return <li>
        <p>
            Price{" "}
            {!canShow(9, guessesLength) &&
                <span className="hint-counter">
                    Hint in {hintLeft(9, guessesLength)} guesses
                </span>
            }
        </p>
        {canShow(9, guessesLength) &&
            <ul className="price-hint">
                {randomCard.prices.eur && <li>{randomCard.prices.eur}<span>€</span></li>}
                {randomCard.prices.eur_foil && <li>{randomCard.prices.eur_foil}<span>€ Foil</span></li>}
                {randomCard.prices.usd && <li>{randomCard.prices.usd}<span>$</span></li>}
                {randomCard.prices.usd_etchced && <li>{randomCard.prices.usd_etchced}<span>$ Foil</span></li>}
                {randomCard.prices.usd_foil && <li>{randomCard.prices.usd_foil}<span>$ Foil</span></li>}
                {randomCard.prices.tix && <li>{randomCard.prices.tix}<span>tix</span></li>}
            </ul>
        }
    </li>
}

export default PricesHint