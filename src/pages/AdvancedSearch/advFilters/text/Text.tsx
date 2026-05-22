import TextIconSvg from "@/assets/images/icons/textIcon.svg?react";

import React from "react";

import { Action } from "../../store/reducerStore";

const Text: React.FC<{
  setTextFilter: React.Dispatch<Action>
}> = ({ setTextFilter }) => {
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
            onChange={(event) => setTextFilter({
              type: "SET_FILTER",
              field: "textFilter",
              payload: event.target.value,
            })}
          />
        </div>
      </div>
      <hr />
    </li>
  );
};

export default Text;
