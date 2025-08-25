import React from "react";
import TextIconSvg from "../../../assets/images/icons/textIcon.svg?react";

interface TextProps {
  setTextFilter: (text: string) => void;
}

const Text: React.FC<TextProps> = ({ setTextFilter }) => {
  return (
    <li className="filter filter-text">
      <div className="flex justify-between">
        <label className="filter-label flex">
          <TextIconSvg />
          Text
        </label>
        <div className="input-wrap">
          <input
            placeholder="Any words in the text ex. “discard a card”"
            onChange={(event) => setTextFilter(event.target.value)}
          />
        </div>
      </div>
      <hr />
    </li>
  );
};

export default Text;
