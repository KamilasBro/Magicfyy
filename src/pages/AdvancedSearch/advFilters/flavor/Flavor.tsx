import FlavorSvg from "@/assets/images/icons/flavor.svg?react";

import React from "react";

import { Action } from "../../store/reducerStore";

const Flavor: React.FC<{
  flavorTextFilter: string;
  setFlavorTextFilter: React.Dispatch<Action>
}> = ({ flavorTextFilter, setFlavorTextFilter }) => {
  return (
    <li className="filter filter-flavor">
      <div className="flex justify-between">
        <label className="filter-label flex">
          <FlavorSvg />
          Flavor
        </label>
        <div className="input-wrap">
          <input
            placeholder="Any words in flavor text ex. “She now only hears Emrakul's murmurs”"
            value={flavorTextFilter}
            onChange={(event) => setFlavorTextFilter({
              type: "SET_FILTER",
              field: "flavorTextFilter",
              payload: event.target.value,
            })}
          />
        </div>
      </div>
      <hr />
    </li>
  );
};

export default Flavor;
