import { CardData } from "@/interfaces/Interfaces";
import { handleTwoFacedLayouts } from "@/utils/card/handleTwoFacedLayouts";

const ToggleFaceButton: React.FC<{
    cardData: CardData | undefined;
    isCardLoaded: boolean;
    showAltFace: boolean;
    setShowAltFace: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ cardData, isCardLoaded, showAltFace, setShowAltFace }) => {

    const {
        typeLine,
        hasTwoFaces,
        isSpecialLayout
    } = handleTwoFacedLayouts(cardData)

    const getButtonText = () => {
        switch (cardData?.layout) {
            case "prepare":
                return showAltFace ? "View Card" : "View Prepare";
            case "adventure":
                return showAltFace ? "View Card" : "View Adventure";
            case "split":
                return cardData.keywords?.includes("Aftermath")
                    ? showAltFace ? "View Card" : "View Aftermath"
                    : showAltFace ? "View Left Half" : "View Right Half";
            case "transform":
                return showAltFace ? "View Card" : "View Transform";
            case "flip":
                return "Flip Card"
            default:
                return showAltFace ? "View Front" : "View Back";
        }
    };

    const shouldShowButton =
        !typeLine?.includes("Token") &&
        (hasTwoFaces || isSpecialLayout);

    if (isCardLoaded && shouldShowButton) {
        return (
            <button
                className="view-back"
                onClick={() => setShowAltFace((prev) => !prev)}
            >
                {getButtonText()}
            </button>
        );
    }

    return null;
};

export default ToggleFaceButton;