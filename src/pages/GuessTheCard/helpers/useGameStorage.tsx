import { useEffect, useRef } from "react";
import { CardData } from "../../../interfaces/Interfaces";

interface ChosenMode {
    mode: string;
    setCode?: string;
    isChosen: boolean;
    icon_svg_uri?: string;
    name: string;
};

interface SavedState {
    chosenMode: ChosenMode;
    randomCardIndex: number | null;
    guesses: CardData[];
    winTheGame: boolean;
};

export const useGameStorage = (params: {
    enabled: boolean;
    chosenMode: ChosenMode;
    randomCardIndex: number | null;
    guesses: CardData[];
    winTheGame: boolean;

    setChosenMode: (v: ChosenMode) => void;
    setRandomCardIndex: (v: number | null) => void;
    setGuesses: (v: CardData[]) => void;
    setWinTheGame: (v: boolean) => void;
}) => {
    const hydrated = useRef(false);

    // LOAD
    useEffect(() => {
        if (!params.enabled) return;

        const saved = localStorage.getItem("savedData");
        if (!saved) {
            hydrated.current = true;
            return;
        }
        try {
            const parsed: SavedState = JSON.parse(saved);

            params.setChosenMode(parsed.chosenMode);
            params.setRandomCardIndex(parsed.randomCardIndex);
            params.setGuesses(parsed.guesses);
            params.setWinTheGame(parsed.winTheGame);

        } catch (e) {
            console.error("Failed to load saved game", e);
        } finally {
            hydrated.current = true;
        }
    }, [params.enabled]);

    // SAVE
    useEffect(() => {
        if (!params.enabled) return;
        if (!hydrated.current) return;

        localStorage.setItem(
            "savedData",
            JSON.stringify({
                chosenMode: params.chosenMode,
                randomCardIndex: params.randomCardIndex,
                guesses: params.guesses,
                winTheGame: params.winTheGame,
            })
        );
    }, [
        params.enabled,
        params.chosenMode,
        params.randomCardIndex,
        params.guesses,
        params.winTheGame,
    ]);
};