import React from "react";
import NameSvg from "../../../assets/images/icons/name.svg?react";
const Name: React.FC = () => {
  return (
    <li className="filter filter-name">
      <div className="flex justify-between">
        <label className="filter-label flex">
          <NameSvg />
          Name
        </label>
        <div className="input-wrap">
          <input placeholder="Any words in the name ex. “jace”" />
        </div>
      </div>
      <hr />
    </li>
  );
};

export default Name;
