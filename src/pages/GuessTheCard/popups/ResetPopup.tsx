import "./popups.scss"

import { PopupState } from "../../../interfaces/Interfaces";

const ResetPopup: React.FC<{
    showPopup: PopupState,
    setShowPopup: React.Dispatch<React.SetStateAction<PopupState>>,
    resetGame: () => void,
}> = ({ setShowPopup, resetGame }) => {
    return (
        <div className="popup popup-reset" onClick={(e) => e.stopPropagation()}>
            <h2>Do you want to reset?</h2>
            <span className="reset-btns-wrap flex justify-center">
                <button onClick={() => {
                    resetGame();
                    setShowPopup({ type: "", show: false });
                }}>Yes</button>
                <button
                    onClick={() => {
                        setShowPopup({ type: "", show: false });
                    }}
                >
                    No
                </button>
            </span>
        </div>
    );
}
export default ResetPopup