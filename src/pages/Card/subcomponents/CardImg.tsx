import { CardData } from "@/interfaces/Interfaces";

import CardPlaceholder from "@/components/CardPlaceholder/CardPlaceholder";

import { handleTwoFacedLayouts } from "@/utils/card/handleTwoFacedLayouts";

const CardImg: React.FC<{
    cardData: CardData | undefined,
    isCardLoaded: boolean,
    showAltFace: boolean,
}> = ({ cardData, isCardLoaded, showAltFace }) => {
    const {
        isSpecialLayout
    } = handleTwoFacedLayouts(cardData)

    const renderCardImg = () => {
        if (!cardData) return null;

        const currentFace =
            cardData.card_faces?.[showAltFace ? 1 : 0];

        const isArvinox =
            (currentFace?.name || cardData.name) === "Arvinox, the Mind Flail" &&
            cardData.set === "sld";

        const imageSrc =
            currentFace?.image_uris?.normal ||
            cardData.card_faces?.find(face => face.image_uris?.normal)?.image_uris?.normal ||
            cardData.image_uris?.normal;

        //for better UX we style those cards
        const getLayoutClassName = () => {
            let layout = cardData?.layout;
            const currentTypeLine = currentFace?.type_line || cardData?.type_line || "";
            const keywords = cardData?.keywords ?? [];

            if (!layout || !isSpecialLayout) return "";

            if (currentTypeLine.toLowerCase().includes("battle")) {
                layout = "battle";
            } else if (currentTypeLine.toLowerCase().includes("room")) {
                layout = "room";
            } else if (keywords.some((keyword) => keyword.toLowerCase().includes("aftermath"))) {
                layout = cardData.set === "akr" ? "" : "aftermath";
            }
            return layout;
        };

        return (
            <img
                src={imageSrc}
                className={`card-img ${isSpecialLayout ? getLayoutClassName() : ""} ${showAltFace ? "alt-face" : ""}`}
                style={isArvinox ? { transform: "rotate(180deg)" } : undefined}
            />
        );
    }
    return isCardLoaded ? renderCardImg() : <CardPlaceholder />
}

export default CardImg