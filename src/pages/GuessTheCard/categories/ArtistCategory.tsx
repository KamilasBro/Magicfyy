import { CardData } from "../../../interfaces/Interfaces";

const ArtistCategory: React.FC<{
    guess: CardData,
    randomCard: CardData | undefined
}> = ({
    guess,
    randomCard
}) => {
        return (
            <li className={guess.artist === randomCard?.artist ? `correct` : ``}>
                {guess.artist}
            </li>
        )
    }

export default ArtistCategory;