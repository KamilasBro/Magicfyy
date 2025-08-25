import React from "react";
import GamesSvg from "../../../assets/images/icons/games.svg?react";

interface GamesProps {
  gameModes: string[];
  setGameModes: (modes: (prevGameModes: string[]) => string[]) => void;
}

const Games: React.FC<GamesProps> = ({ gameModes, setGameModes }) => {
  const handleGameModeChange = (selectedGameMode: string) => {
    setGameModes((prevGameModes) =>
      prevGameModes.includes(selectedGameMode)
        ? prevGameModes.filter((gameMode) => gameMode !== selectedGameMode)
        : [...prevGameModes, selectedGameMode]
    );
  };

  return (
    <li className="filter filter-games">
      <div className="flex justify-between">
        <label className="filter-label flex">
          <GamesSvg />
          Games
        </label>
        <div className="input-wrap flex">
          <div className="radio-wrap flex items-center">
            <span>Paper</span>
            <input
              type="checkbox"
              className="radio"
              checked={gameModes.includes("paper")}
              onChange={() => handleGameModeChange("paper")}
            />
          </div>
          <div className="radio-wrap flex items-center">
            <span>Arena</span>
            <input
              type="checkbox"
              className="radio"
              checked={gameModes.includes("arena")}
              onChange={() => handleGameModeChange("arena")}
            />
          </div>
          <div className="radio-wrap flex items-center">
            <span>Magic Online</span>
            <input
              type="checkbox"
              className="radio"
              checked={gameModes.includes("mtgo")}
              onChange={() => handleGameModeChange("mtgo")}
            />
          </div>
        </div>
      </div>
      <hr />
    </li>
  );
};

export default Games;