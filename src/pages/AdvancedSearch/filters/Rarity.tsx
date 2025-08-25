import React from "react";
import RaritySvg from "../../../assets/images/icons/rarity.svg?react";

interface RarityProps {
  selectedRarities: string[];
  setSelectedRarities: React.Dispatch<React.SetStateAction<string[]>>;
}

const Rarity: React.FC<RarityProps> = ({
  selectedRarities,
  setSelectedRarities,
}) => {
  const handleRarityChange = (selectedRarity: string) => {
    setSelectedRarities((prevRarities) =>
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
              checked={selectedRarities.includes("c")}
              onChange={() => handleRarityChange("c")}
            />
          </div>
          <div className="radio-wrap flex items-center">
            <span>Uncommon</span>
            <input
              type="checkbox"
              className="radio"
              checked={selectedRarities.includes("u")}
              onChange={() => handleRarityChange("u")}
            />
          </div>
          <div className="radio-wrap flex items-center">
            <span>Rare</span>
            <input
              type="checkbox"
              className="radio"
              checked={selectedRarities.includes("r")}
              onChange={() => handleRarityChange("r")}
            />
          </div>
          <div className="radio-wrap flex items-center">
            <span>Mythic Rare</span>
            <input
              type="checkbox"
              className="radio"
              checked={selectedRarities.includes("m")}
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