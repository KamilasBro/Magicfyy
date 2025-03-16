import React from "react";
import TextSvg from "../../../assets/images/icons/text.svg?react";
const Text: React.FC = () => {
  return (
    <li className="filter filter-text">
      <div className="flex justify-between">
        <label className="filter-label flex">
          <TextSvg />
          Text
        </label>
        <div className="input-wrap">
          <input placeholder="Any words in the text ex. “discard a card”" />
        </div>
      </div>
      <hr />
    </li>
  );
};

export default Text;
