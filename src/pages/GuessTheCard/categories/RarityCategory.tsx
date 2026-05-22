import { CardData } from "../../../interfaces/Interfaces";

const RarityCategory: React.FC<{
    guess: CardData,
    randomCard: CardData | undefined
}> = ({
    guess,
    randomCard
}) => {
        return (
            <li className={guess.rarity === randomCard?.rarity ? `correct` : ``}>
                {guess.rarity}
            </li>
        )
    }

export default RarityCategory;