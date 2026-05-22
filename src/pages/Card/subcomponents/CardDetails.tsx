import { CardData } from "@/interfaces/Interfaces";

import { renderFormatLegalities } from "@/utils/card/renderFormatLegalities";
import { useSets } from "@/utils/sets/useSets";

import { useParams } from "react-router-dom";

const CardDescription: React.FC<{
    cardData: CardData | undefined,
    isCardLoaded: boolean,
    getTextWithSymbols: (text: string) => (string | JSX.Element)[] | null
    showAltFace: boolean
}> = ({ cardData, isCardLoaded, getTextWithSymbols, showAltFace }) => {
    const params = useParams();

    const { sets, isSetLoaded } = useSets();
    const matchingSet = sets.find(
        (set) => set.code.toLowerCase() === params.set?.toLowerCase()
    );
    const currentFace =
        cardData?.card_faces?.[showAltFace ? 1 : 0];

    return (
        <ul className="card-details flex flex-col">
            {isCardLoaded && cardData && isSetLoaded ?
                <>
                    <h2 className="flex items-center">
                        {currentFace?.name || cardData.name}
                        {(currentFace?.mana_cost ||
                            (!cardData.card_faces?.[1] || showAltFace) &&
                            cardData.mana_cost)
                            ? getTextWithSymbols(
                                currentFace?.mana_cost || cardData.mana_cost
                            )
                            : null}
                    </h2>
                    <h3>
                        {currentFace?.type_line || cardData.type_line}
                    </h3>
                    {currentFace?.oracle_text ?
                        <p className="whitespace-pre-wrap">
                            {getTextWithSymbols(currentFace.oracle_text)}
                        </p>
                        :
                        cardData.oracle_text &&
                        <p className="whitespace-pre-wrap">
                            {getTextWithSymbols(cardData.oracle_text)}
                        </p>
                    }
                    {currentFace?.flavor_text
                        ? <p className="italic flavor">{currentFace.flavor_text}</p>
                        : cardData.flavor_text &&
                        <p className="italic flavor">{cardData.flavor_text}</p>
                    }
                    {currentFace?.power != null &&
                        currentFace?.toughness != null ?
                        <p>
                            {`${currentFace.power}/${currentFace.toughness}
                                 (Power ${currentFace.power}, 
                                 Toughness ${currentFace.toughness})`}
                        </p>
                        :
                        cardData.power != null &&
                        cardData.toughness != null && (
                            <p>
                                {`${cardData.power}/${cardData.toughness} 
                                    (Power ${cardData.power}, 
                                    Toughness ${cardData.toughness})`}
                            </p>

                        )}
                    {currentFace?.loyalty
                        ? <p>Loyalty {currentFace.loyalty}</p>
                        : cardData.loyalty && <p>Loyalty {cardData.loyalty}</p>
                    }
                    <p className="italic">{cardData.artist && `Illustrated by ${cardData.artist}`}</p>
                    <h3 className="flex items-center">
                        {matchingSet &&
                            <img
                                src={matchingSet.icon_svg_uri}
                                alt="Set Icon"
                                className="set-icon"
                            />
                        }
                        <span>
                            {`${cardData.set_name} 
                                (${cardData.set.toUpperCase()}) 
                                #${cardData.collector_number} · `}
                            <span className="capitalize">{cardData.rarity}</span>
                        </span>
                    </h3>
                    <ul className="card-formats flex flex-wrap">
                        {renderFormatLegalities(cardData)}
                    </ul>
                </>
                :
                <div className="card-details-placeholders flex flex-col">
                    {Array(6).fill(null).map((_, index) => <div key={index} className="card-details-placeholder" />)}
                </div>
            }
        </ul>
    )
}

export default CardDescription