import { getMatchClass } from "../helpers/getMatchClass";

import { CardData } from "../../../interfaces/Interfaces";

const ColorCategory: React.FC<{
    guess: CardData;
    randomCard: CardData | undefined;
}> = ({
    guess,
    randomCard
}) => {
        // use only the first face's colors if present, otherwise fallback to top-level colors
        const guessColors = guess.card_faces?.[0]?.colors ?? guess.colors ?? [];
        const randomColors = randomCard?.card_faces?.[0]?.colors ?? randomCard?.colors ?? [];

        const colorMap: { [key: string]: string } = {
            W: "White",
            U: "Blue",
            B: "Black",
            R: "Red",
            G: "Green",
        };
        const allColors = ["W", "U", "B", "R", "G"];

        const display = () => {
            if (!guessColors || guessColors.length === 0) {
                return "Colorless";
            }

            if (allColors.every((c) => guessColors.includes(c))) {
                return "All Colors";
            }

            // Map to names and return plain comma-separated string
            const names = guessColors.map((code: string) => colorMap[code] || code);
            return names.join(", ");
        }
        return (
            <li className={getMatchClass(guessColors, randomColors)}>
                {display()}
            </li>
        )
    }

export default ColorCategory;