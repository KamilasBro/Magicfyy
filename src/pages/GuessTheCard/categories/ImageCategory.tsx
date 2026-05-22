import { CardData } from "../../../interfaces/Interfaces";

const ImageCategory: React.FC<{ guess: CardData }> = ({ guess }) => {
    return (
        <li>
            <img
                src={
                    guess.image_uris?.art_crop ||
                    (guess.card_faces?.[0]?.image_uris?.art_crop ?? "default-image-url")
                }
                alt="card-art"
            />
        </li>
    )
}

export default ImageCategory;