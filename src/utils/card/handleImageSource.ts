import { CardData } from "../../interfaces/Interfaces";

export const handleImageSource = (card: CardData) => {
  //to detect different correct img source in API
  const imgSrc = card.image_uris
    ? card.image_uris.normal
    : card.card_faces?.[0].image_uris.normal;

  //in Scryfall image data Arvinox in sld set is upside down so i have to add this exception
  const isArvinox =
    card.name === "Arvinox, the Mind Flail" && card.set === "sld";

  return { imgSrc, isArvinox };
};
