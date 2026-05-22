import "./rarity.scss"
import RaritySvg from "@/assets/images/icons/rarity.svg?react";

import React from "react";

import { Action } from "../../store/reducerStore";

const cardRarities = [
  "Common",
  "Uncommon",
  "Rare",
  "Mythic Rare",
  "Special"
]
type cardRaritiesType = (typeof cardRarities)[number]

const Rarity: React.FC<{
  raritiesFilter: cardRaritiesType[];
  setRaritiesFilter: React.Dispatch<Action>
}> = ({
  raritiesFilter,
  setRaritiesFilter,
}) => {
    const handleRarityChange = (selectedRarity: cardRaritiesType) => {
      const updated = raritiesFilter.includes(selectedRarity)
        ? raritiesFilter.filter((rarity) => rarity !== selectedRarity)
        : [...raritiesFilter, selectedRarity]

      setRaritiesFilter({
        type: "SET_FILTER",
        field: "raritiesFilter",
        payload: updated,
      });
    };

    return (
      <li className="filter filter-rarity">
        <div className="flex justify-between">
          <label className="filter-label flex">
            <RaritySvg />
            Rarity
          </label>
          <div className="input-wrap flex">
            {cardRarities.map((rarity) => {
              const APIRarity = rarity.charAt(0).toLocaleLowerCase()
              return (
                <div
                  key={rarity}
                  className="radio-wrap flex items-center">
                  <span>{rarity}</span>
                  <input
                    type="checkbox"
                    className="radio"
                    checked={raritiesFilter.includes(APIRarity)}
                    onChange={() => handleRarityChange(APIRarity)}
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

export default Rarity;