import React, { useState, useEffect, useRef } from "react";
import FormatsSvg from "../../../assets/images/icons/formats.svg?react";
import AddSvg from "../../../assets/images/icons/add.svg?react";
import CloseSvg from "../../../assets/images/icons/close.svg?react";
import ArrowDownSvg from "../../../assets/images/icons/arrowDown.svg?react";

interface formatsItem {
  id: number;
  legality: string;
  format: string;
}

const Formats: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [legality, setLegality] = useState<string>("Legal");
  const [format, setFormat] = useState<string>("Standard");
  const mtgFormats = [
    "Standard",
    "Alchemy",
    "Pioneer",
    "Explorer",
    "Modern",
    "Historic",
    "Legacy",
    "Brawl",
    "Vintage",
    "Commander",
    "Pauper",
    "Oathbreaker",
    "Penny",
  ];
  const [formatsList, setFormatList] = useState<formatsItem[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const formatsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        formatsDropdownRef.current &&
        !formatsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(null);
      }
    };

    const handleScroll = () => {
      setShowDropdown(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dropdownRef, formatsDropdownRef]);

  const handleDropdownToggle = (dropdown: string) => {
    setShowDropdown((prev) => (prev === dropdown ? null : dropdown));
  };
  const handleAddFormat = () => {
    const newFormat: formatsItem = {
      id: Date.now(),
      legality,
      format,
    };
    setFormatList((prev) => {
      if (
        prev.some(
          (item) => item.legality === legality && item.format === format
        )
      ) {
        return prev; // Do not add if the same legality and format already exists
      }
      return [...prev, newFormat];
    });
  };

  const handleRemoveFormat = (id: number) => {
    setFormatList((prev) => prev.filter((item) => item.id !== id));
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
            {formatsList.map(({ id, legality, format }) => (
              <li
                key={id}
                className={`flex items-center ${legality.toLowerCase()}`}
              >
                {legality} in {format}
                <CloseSvg onClick={() => handleRemoveFormat(id)} />
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
                  >
                    Legal
                  </li>
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
                  {mtgFormats.map((frmt, index) => (
                    <li
                      onClick={() => {
                        setFormat(frmt);
                        setShowDropdown(null);
                      }}
                      key={index}
                    >
                      {frmt}
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
