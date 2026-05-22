import "./popups.scss"
import CloseSvg from "../../../assets/images/icons/close.svg?react";

import React from "react";
import { CardData, PopupState } from "../../../interfaces/Interfaces";

import FormatsHint from "../hints/FormatsHint";
import ColorsHint from "../hints/ColorsHint";
import PricesHint from "../hints/PricesHint";
import FirstLetterHint from "../hints/FirstLetterHint";
import OracleTextHint from "../hints/OracleTextHint";
import RandomCardImageHint from "../hints/RandomCardImageHint";



const HintsPopup: React.FC<{
    guesses: CardData[],
    randomCard: CardData | undefined,
    setShowPopup: React.Dispatch<React.SetStateAction<PopupState>>,
}> = ({ guesses, randomCard, setShowPopup }) => {
    return (
        <div className="popup popup-hints" onClick={(e) => e.stopPropagation()}>
            <CloseSvg className="close-icon" onClick={() => {
                setShowPopup({ type: "", show: false });
            }} />
            <h2>Hints</h2>
            <ul className="flex flex-col hints-list">
                <FormatsHint randomCard={randomCard} guessesLength={guesses.length} />
                <ColorsHint randomCard={randomCard} guessesLength={guesses.length} />
                <PricesHint randomCard={randomCard} guessesLength={guesses.length} />
                <FirstLetterHint randomCard={randomCard} guessesLength={guesses.length} />
                <OracleTextHint randomCard={randomCard} guessesLength={guesses.length} />
                <RandomCardImageHint randomCard={randomCard} guessesLength={guesses.length} />
            </ul>
        </div>
    );
}
export default HintsPopup