import { CardData } from "@/interfaces/Interfaces";
const twoFacedLayoutsList = [
  "transform",
  "modal_dfc",
  "flip",
  "split",
  "adventure",
  "reversible_card",
  "prepare",
];

export const handleTwoFacedLayouts = (cardData: CardData | undefined) => {
  const typeLine =
    cardData?.type_line ||
    cardData?.card_faces?.[0]?.type_line ||
    cardData?.card_faces?.[1]?.type_line;

  const hasTwoFaces =
    Array.isArray(cardData?.card_faces) && cardData.card_faces.length > 1;

  const isSpecialLayout =
    !!cardData?.layout &&
    (twoFacedLayoutsList as readonly string[]).includes(cardData.layout);

  return {
    typeLine,
    hasTwoFaces,
    isSpecialLayout,
  };
};
