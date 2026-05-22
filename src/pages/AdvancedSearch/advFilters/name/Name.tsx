import NameSvg from "@/assets/images/icons/name.svg?react";

import React from "react";

import { Action } from "../../store/reducerStore";

const Name: React.FC<
  { setNameFilter: React.Dispatch<Action> }
> = ({ setNameFilter }) => {
  return (
    <li className="filter filter-name">
      <div className="flex justify-between">
        <label className="filter-label flex">
          <NameSvg />
          Name
        </label>
        <div className="input-wrap">
          <input
            placeholder="Any words in the name ex. “jace”"
            onChange={(event) => setNameFilter({
              type: "SET_FILTER",
              field: "nameFilter",
              payload: event.target.value,
            })}
          />
        </div>
      </div>
      <hr />
    </li>
  );
};

export default Name;
