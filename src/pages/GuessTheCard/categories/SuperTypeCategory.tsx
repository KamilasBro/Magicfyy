import { getMatchClass } from "../helpers/getMatchClass";

import { CardData } from "../../../interfaces/Interfaces";

const SuperTypeCategory: React.FC<{
    guess: CardData,
    randomCard: CardData | undefined
}> = ({
    guess,
    randomCard
}) => {
        const superTypes = [
            "Legendary",
            "Tribal",
            "Equipment",
            "Aura",
            "Basic",
            "Snow",
            "World",
            "Ongoing",
        ];

        // use only the main face's type_line if present, otherwise fallback to top-level type_line
        const guessTypeLine = (guess.card_faces?.[0]?.type_line ?? guess.type_line ?? "");
        const randomTypeLine = (randomCard?.card_faces?.[0]?.type_line ?? randomCard?.type_line ?? "");

        const extractSuperTypes = (typeLine: string) =>
            (typeLine || "")
                .split(/[\s//]+/)
                .filter((type) => superTypes.includes(type));

        const guessSuperTypes = extractSuperTypes(guessTypeLine);
        const randomCardSuperTypes = extractSuperTypes(randomTypeLine);

        // prefer main face layout, fallback to top-level layout
        const guessLayout = (guess.layout ?? "")?.toString().toLocaleLowerCase();
        const randomLayout = (randomCard?.layout ?? "")?.toString().toLocaleLowerCase();

        const normalizeForCompare = (arr: string[], layoutStr: string) => {
            const norm = arr.map((s) => s.toLowerCase());
            // include layout only if it's present and not "normal"
            if (layoutStr && layoutStr !== "normal") {
                if (!norm.includes(layoutStr)) norm.push(layoutStr);
            }
            return norm;
        };

        const guessNormalized = normalizeForCompare(guessSuperTypes, guessLayout);
        const randomNormalized = normalizeForCompare(randomCardSuperTypes, randomLayout);

        const display = () => {
            const separator = guess.card_faces?.[0]?.type_line?.includes("//") || guess.type_line?.includes("//") ? " // " : ", ";

            // use only the main face's type_line if present, otherwise fallback to top-level type_line
            const matchingSuperTypes = (guess.card_faces?.[0]?.type_line ?? guess.type_line ?? "")
                .split(/[\s//]+/)
                .filter((type) => superTypes.includes(type));

            // prefer main face layout, fallback to top-level layout
            const layout = guessLayout ? guessLayout.toString() : "";

            // include layout only if present and not "normal"
            const includeLayout = layout !== "normal";
            const parts = includeLayout ? [...matchingSuperTypes, layout] : matchingSuperTypes;

            if (parts.length === 0) {
                return "None";
            }

            // Return plain text, comma-separated (or " // " if separator chosen)
            return parts.join(separator);
        }

        return (
            <li className={getMatchClass(guessNormalized, randomNormalized)}>
                {display()}
            </li>
        )
    }

export default SuperTypeCategory;