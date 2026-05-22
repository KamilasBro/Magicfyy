import { CardData } from "../../../interfaces/Interfaces";
import { canShow, hintLeft } from "../helpers/hintCounters";
import { handleImageSource } from "../../../utils/card/handleImageSource";

import React, { useMemo } from "react";

const RandomCardImageHint: React.FC<{
    randomCard: CardData | undefined,
    guessesLength: number
}> = ({ randomCard, guessesLength }) => {
    if (!randomCard) return null;

    const blurValue = useMemo(() => {
        const baseBlur = 4;
        const minBlur = 0;
        const revealStart = 18;
        const revealEnd = 30;

        if (guessesLength < revealStart) return baseBlur;

        return Math.max(
            minBlur,
            baseBlur - ((guessesLength - revealStart) * baseBlur) / (revealEnd - revealStart)
        );
    }, [guessesLength]);

    const { imgSrc, isArvinox } = handleImageSource(randomCard)

    return <li className="card-art">
        <p>
            Card Art {" "}
            {!canShow(18, guessesLength) &&
                <span className="hint-counter">
                    Hint in {hintLeft(18, guessesLength)} guesses
                </span>
            }
        </p>
        {canShow(18, guessesLength) && (
            <>
                <span>Card will slowly lose blur with each guess.</span>
                <img
                    src={imgSrc}
                    className="card-img"
                    alt="Card Art"
                    style={{ filter: `blur(${blurValue}px)`, ...(isArvinox ? { transform: "rotate(180deg)" } : {}) }}
                    draggable={false}
                    onContextMenu={e => e.preventDefault()}
                />
            </>
        )}
    </li>
}

export default RandomCardImageHint