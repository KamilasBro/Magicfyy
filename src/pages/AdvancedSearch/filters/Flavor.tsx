import React from "react";
import FlavorSvg from "../../../assets/images/icons/flavor.svg?react";
const Flavor: React.FC = () => {
  return (
    <li className="filter filter-flavor">
      <div className="flex justify-between">
        <label className="filter-label flex">
          <FlavorSvg />
          Flavor
        </label>
        <div className="input-wrap">
          <input placeholder="Any words in flavor text ex. “She now only hears Emrakul's murmurs”" />
        </div>
      </div>
      <hr />
    </li>
  );
};

export default Flavor;
