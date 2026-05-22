import "./games.scss"
import GamesSvg from "@/assets/images/icons/games.svg?react";

import React from "react";

import { Action } from "../../store/reducerStore";

const gameModes = [
  "Paper",
  "Arena",
  "Magic Online"
]
type gameModeType = (typeof gameModes)[number]

const Games: React.FC<{
  gameModesFilter: gameModeType[]
  setGameModesFilter: React.Dispatch<Action>
}> = ({ gameModesFilter, setGameModesFilter }) => {

  const handleGameModeChange =
    (selectedGameMode: gameModeType) => {
      const updated = gameModesFilter.includes(selectedGameMode)
        ? gameModesFilter.filter((gameMode) => gameMode !== selectedGameMode)
        : [...gameModesFilter, selectedGameMode]
      setGameModesFilter({
        type: "SET_FILTER",
        field: "gameModesFilter",
        payload: updated,
      });
    };

  return (
    <li className="filter filter-games">
      <div className="flex justify-between">
        <label className="filter-label flex">
          <GamesSvg />
          Games
        </label>
        <div className="input-wrap flex">
          {gameModes.map((mode: gameModeType) => {
            return (
              <div
                key={mode}
                className="radio-wrap flex items-center">
                <span>{mode}</span>
                <input
                  type="checkbox"
                  className="radio"
                  checked={gameModesFilter.includes(mode.toLowerCase())}
                  onChange={() => handleGameModeChange(mode.toLowerCase())}
                />
              </div>
            )
          })}
        </div>
      </div>
      <hr />
    </li>
  );
};

export default Games;