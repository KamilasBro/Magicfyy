import { getMatchClass } from "../helpers/getMatchClass";

import { CardData } from "../../../interfaces/Interfaces";

const TypeCategory: React.FC<{
    guess: CardData;
    randomCard: CardData | undefined;
}> = ({
    guess,
    randomCard
}) => {
        // use only the first face's type_line if present, otherwise fallback to top-level type_line
        const guessTypeLine = guess.card_faces?.[0]?.type_line ?? guess.type_line ?? "";
        const randomTypeLine = randomCard?.card_faces?.[0]?.type_line ?? randomCard?.type_line ?? "";

        const basicTypes = [
            "Artifact",
            "Creature",
            "Enchantment",
            "Instant",
            "Land",
            "Planeswalker",
            "Sorcery",
            "Battle",
        ];

        const extractTypes = (typeLine: string) =>
            (typeLine.split("—")[0] || "")
                .trim()
                .split(/\s+/)
                .filter((t) => basicTypes.includes(t));

        const guessTypes = extractTypes(guessTypeLine);
        const randomTypes = extractTypes(randomTypeLine);

        const display = guessTypes.length > 0 ? guessTypes.join(", ") : "";
        return (
            <li className={getMatchClass(guessTypes, randomTypes)}>
                {display}
            </li>
        )
    }

export default TypeCategory;