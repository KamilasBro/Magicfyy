import React, { useState } from "react";
import RaritySvg from "../../../assets/images/icons/rarity.svg?react";

const Rarity: React.FC = () => {
  const [rarities, setRarities] = useState<string[]>([]);

  const handleRarityChange = (selectedRarity: string) => {
    setRarities((prevRarities) =>
      prevRarities.includes(selectedRarity)
        ? prevRarities.filter((rarity) => rarity !== selectedRarity)
        : [...prevRarities, selectedRarity]
    );
  };

  return (
    <li className="filter filter-rarity">
      <div className="flex justify-between">
        <label className="filter-label flex">
          <RaritySvg />
          Rarity
        </label>
        <div className="input-wrap flex">
          <div className="radio-wrap flex items-center">
            <span>Common</span>
            <input
              type="checkbox"
              className="radio"
              checked={rarities.includes("c")}
              onChange={() => handleRarityChange("c")}
            />
          </div>
          <div className="radio-wrap flex items-center">
            <span>Uncommon</span>
            <input
              type="checkbox"
              className="radio"
              checked={rarities.includes("u")}
              onChange={() => handleRarityChange("u")}
            />
          </div>
          <div className="radio-wrap flex items-center">
            <span>Rare</span>
            <input
              type="checkbox"
              className="radio"
              checked={rarities.includes("r")}
              onChange={() => handleRarityChange("r")}
            />
          </div>
          <div className="radio-wrap flex items-center">
            <span>Mythic Rare</span>
            <input
              type="checkbox"
              className="radio"
              checked={rarities.includes("m")}
              onChange={() => handleRarityChange("m")}
            />
          </div>
        </div>
      </div>
      <hr />
    </li>
  );
};

export default Rarity;