import FormatsSvg from "@/assets/images/icons/formats.svg?react";
import AddSvg from "@/assets/images/icons/add.svg?react";
import CloseSvg from "@/assets/images/icons/close.svg?react";
import ArrowDownSvg from "@/assets/images/icons/arrowDown.svg?react";

import React, { useState, useEffect, useRef } from "react";
import { mtgFormats } from "@/utils/card/renderFormatLegalities";
import { useScrollForDropDown } from "../../helpers/useScrollForDropDown";
import { useClickOutside } from "../../helpers/useClickOutside";

import { Action } from "../../store/reducerStore";

type legalitiesTypes = "Legal" | "Restricted" | "Banned"
type dropDownTypes = "legality" | "formats"

const Formats: React.FC<{
  formatsFilter: {
    legality: string;
    format: string;
  }[];
  setFormatsFilter: React.Dispatch<Action>
}> = ({ formatsFilter, setFormatsFilter }) => {
  const [legality, setLegality] = useState<legalitiesTypes>("Legal");
  const [format, setFormat] = useState<(typeof mtgFormats)[number]>("Standard");

  const handleAddFormat = () => {
    const newFormat = {
      legality,
      format,
    };

    const index = formatsFilter.findIndex(
      (item) => item.format === format
    );

    let updated;

    if (index !== -1) {
      updated = formatsFilter.map((item, i) =>
        i === index ? newFormat : item
      );
    } else {
      updated = [...formatsFilter, newFormat];
    }

    setFormatsFilter({
      type: "SET_FILTER",
      field: "formatsFilter",
      payload: updated,
    });

  };

  const handleRemoveFormat = (index: number) => {
    const updated = formatsFilter.filter((_, i) => i !== index)
    setFormatsFilter({
      type: "SET_FILTER",
      field: "formatsFilter",
      payload: updated,
    });
  };

  const [showDropdown, setShowDropdown] = useState<dropDownTypes | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const formatsDropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    [dropdownRef, formatsDropdownRef],
    () => setShowDropdown(null)
  );

  const scrollTick = useScrollForDropDown();
  useEffect(() => {
    setShowDropdown(null);
  }, [scrollTick]);

  const handleDropdownToggle = (dropdown: dropDownTypes) => {
    setShowDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  return (
    <li className="filter filter-formats">
      <div className="flex justify-between">
        <label className="filter-label flex">
          <FormatsSvg />
          Formats
        </label>
        <div className="input-wrap">
          <ul className="formats-list flex flex-wrap">
            {formatsFilter.map(({ legality, format }, index) => (
              <li
                key={index}
                className={`flex items-center ${legality.toLowerCase()}`}
              >
                {legality} in {format}
                <CloseSvg onClick={() => handleRemoveFormat(index)} />
              </li>
            ))}
          </ul>
          <div className="formats-wrap flex items-center">
            <div ref={dropdownRef}>
              <div
                onClick={() => handleDropdownToggle("legality")}
                className="formats-input flex justify-between items-center"
              >
                <span>{legality}</span>
                <ArrowDownSvg
                  className={`arrow ${showDropdown === "legality" && "active"}`}
                />
              </div>
              {showDropdown === "legality" && (
                <ul className="dropdown">
                  <li
                    onClick={() => {
                      setLegality("Legal");
                      setShowDropdown(null);
                    }}
                  >Legal</li>
                  <li
                    onClick={() => {
                      setLegality("Restricted");
                      setShowDropdown(null);
                    }}
                  >
                    Restricted
                  </li>
                  <li
                    onClick={() => {
                      setLegality("Banned");
                      setShowDropdown(null);
                    }}
                  >
                    Banned
                  </li>
                </ul>
              )}
            </div>
            <div ref={formatsDropdownRef}>
              <div
                onClick={() => handleDropdownToggle("formats")}
                className="formats-input flex justify-between items-center"
              >
                <span>{format}</span>
                <ArrowDownSvg
                  className={`arrow ${showDropdown === "formats" && "active"}`}
                />
              </div>
              {showDropdown === "formats" && (
                <ul className="dropdown">
                  {mtgFormats.map((format, index) => (
                    <li
                      onClick={() => {
                        setFormat(format);
                        setShowDropdown(null);
                      }}
                      key={index}
                    >
                      {format}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <AddSvg className="add-btn" onClick={handleAddFormat} />
          </div>
        </div>
      </div>
      <hr />
    </li>
  );
};

export default Formats;
