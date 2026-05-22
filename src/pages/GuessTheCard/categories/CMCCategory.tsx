import { CardData } from "../../../interfaces/Interfaces";

const CMCCategory: React.FC<{
    guess: CardData,
    randomCard: CardData | undefined
}> = ({ guess, randomCard }) => {

    const hasRandomCMC = randomCard?.cmc !== undefined && randomCard?.cmc !== null;

    return (
        <li className={guess.cmc === randomCard?.cmc ? "correct" : "incorrect"}>
            {hasRandomCMC && (
                guess.cmc < randomCard!.cmc
                    ? "Higher than"
                    : guess.cmc > randomCard!.cmc
                        ? "Lower than"
                        : ""
            )}
            {" "}
            {guess.cmc ?? 0}
        </li>
    );
};

export default CMCCategory;