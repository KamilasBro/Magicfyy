import "./types.scss"

import TypeSvg from "@/assets/images/icons/type.svg?react";
import CloseSvg from "@/assets/images/icons/close.svg?react";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useScrollForDropDown } from "../../helpers/useScrollForDropDown";
import { useClickOutside } from "../../helpers/useClickOutside";
import { useTypeCatalogs } from "@/utils/card/useCardTypes";

import { Action } from "../../store/reducerStore";

const Types: React.FC<{
  setTypesFilter: React.Dispatch<Action>
}> = ({ setTypesFilter }) => {
  const { typeSections } = useTypeCatalogs();

  const [typeInput, setTypeInput] = useState("");
  const [selectedTypes, setSelectedTypesState] = useState<{
    type: string; isIncluded: boolean
  }[]
  >([]);
  const filteredItems = useCallback(
    (items: string[]) =>
      items.filter(
        (type) =>
          type.toLowerCase().includes(typeInput.toLowerCase()) &&
          !selectedTypes.some((t) => t.type === type)
      ),
    [typeInput, selectedTypes]
  );

  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useClickOutside(
    [dropdownRef],
    () => setShowDropdown(false)
  );

  const scrollTick = useScrollForDropDown();
  useEffect(() => {
    setShowDropdown(false);
    inputRef.current?.blur();
  }, [scrollTick]);

  const handleTypeInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTypeInput(event.target.value);
  };

  const handleTypeSelect = (type: string) => {
    if (!selectedTypes.some((t) => t.type === type)) {
      const updatedTypes = [...selectedTypes, { type, isIncluded: true }];
      setTypesFilter({
        type: "SET_FILTER",
        field: "typesFilter",
        payload: updatedTypes,
      })
      setSelectedTypesState(updatedTypes);
      setTypeInput("");
      setShowDropdown(false);
    }
  };

  const handleRemoveType = (type: string) => {
    const updatedTypes = selectedTypes.filter((t) => t.type !== type);
    setTypesFilter({
      type: "SET_FILTER",
      field: "typesFilter",
      payload: updatedTypes,
    })
    setSelectedTypesState(updatedTypes);
  };

  const toggleTypeInclusion = (type: string) => {
    const updatedTypes = selectedTypes.map((t) =>
      t.type === type ? { ...t, isIncluded: !t.isIncluded } : t
    );
    setTypesFilter({
      type: "SET_FILTER",
      field: "typesFilter",
      payload: updatedTypes,
    })
    setSelectedTypesState(updatedTypes);
  };

  return (
    <li className="filter filter-type">
      <div className="flex justify-between">
        <label className="filter-label flex">
          <TypeSvg />
          Type
        </label>
        <div className="input-wrap" ref={dropdownRef}>
          <div className="type-wrap">
            {selectedTypes.length > 0 && (
              <ul className="type-tags flex flex-wrap">
                {selectedTypes.map(({ type, isIncluded }) => (
                  <li key={type} className="type-tag flex items-center">
                    <div
                      className={`if-not flex items-center justify-center ${isIncluded ? "included" : "excluded"
                        }`}
                      onClick={() => toggleTypeInclusion(type)}
                    >
                      {isIncluded ? "IS" : "NOT"}
                    </div>
                    <span className="type-tag-name">{type}</span>
                    <CloseSvg onClick={() => handleRemoveType(type)} />
                  </li>
                ))}
              </ul>
            )}
            <input
              ref={inputRef}
              className="type-input"
              placeholder="Enter a type and choose from the list"
              value={typeInput}
              onChange={handleTypeInputChange}
              onFocus={() => setShowDropdown(true)}
            />
            {showDropdown && (
              <div className="dropdown">
                <ul className="types-list">
                  {typeSections.map(({ label, data }) => {
                    if (!data) return
                    const filtered = filteredItems(data);

                    if (filtered.length === 0) return null;

                    return (
                      <ul key={label}>
                        <li className="type-category">{label}</li>
                        {filtered.map((type) => (
                          <li
                            key={type}
                            className="type"
                            onClick={() => handleTypeSelect(type)}
                          >
                            {type}
                          </li>
                        ))}
                      </ul>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          <span className="subnote">
            Click the "IS" or "NOT" button to toggle between including and
            excluding a type.
          </span>
        </div>
      </div>
      <hr />
    </li>
  );
};

export default Types;
