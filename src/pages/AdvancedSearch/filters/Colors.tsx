import React, { useState, useEffect, useRef } from "react";
import ColorsSvg from "../../../assets/images/icons/colors.svg?react";
import BlackSvg from "../../../assets/images/colors/black.svg?react";
import BlueSvg from "../../../assets/images/colors/blue.svg?react";
import WhiteSvg from "../../../assets/images/colors/white.svg?react";
import ColorlessSvg from "../../../assets/images/colors/colorless.svg?react";
import GreenSvg from "../../../assets/images/colors/green.svg?react";
import RedSvg from "../../../assets/images/colors/red.svg?react";
import ArrowDownSvg from "../../../assets/images/icons/arrowDown.svg?react";

interface ColorsProps {
  selectedColors: string[];
  setSelectedColors: React.Dispatch<React.SetStateAction<string[]>>;
  colorOption: string;
  setColorOption: React.Dispatch<React.SetStateAction<string>>;
}

const Colors: React.FC<ColorsProps> = ({
  selectedColors,
  setSelectedColors,
  colorOption,
  setColorOption,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const colors = [
    { name: "W", Svg: WhiteSvg },
    { name: "U", Svg: BlueSvg },
    { name: "B", Svg: BlackSvg },
    { name: "R", Svg: RedSvg },
    { name: "G", Svg: GreenSvg },
    { name: "C", Svg: ColorlessSvg },
  ];

  const handleColorClick = (color: string) => {
    setSelectedColors((prevColors) => {
      if (color === "C") {
        // If "colorless" is clicked, deactivate all other colors
        return prevColors.includes("C") ? [] : ["C"];
      } else {
        // If any other color is clicked, deactivate "colorless" if active
        const updatedColors = prevColors.includes(color)
          ? prevColors.filter((c) => c !== color)
          : [...prevColors.filter((c) => c !== "C"), color];
        return updatedColors;
      }
    });
  };

  const handleOptionClick = (option: string) => {
    setColorOption(option);
    setShowDropdown(false);
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    const handleScroll = () => {
      if (window.innerWidth > 800) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dropdownRef]);

  return (
    <li className="filter filter-colors">
      <div className="flex justify-between">
        <label className="filter-label flex">
          <ColorsSvg />
          Colors
        </label>
        <div className="input-wrap flex justify-between items-center">
          <div className="colors-wrap " ref={dropdownRef}>
            <div
              className="colors-input flex justify-between items-center"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span>{colorOption}</span>
              <ArrowDownSvg className={`arrow ${showDropdown && "active"}`} />
            </div>
            {showDropdown && (
              <ul className="dropdown">
                <li onClick={() => handleOptionClick("Exactly these colors")}>
                  Exactly these colors
                </li>
                <li onClick={() => handleOptionClick("Including these colors")}>
                  Including these colors
                </li>
                <li onClick={() => handleOptionClick("At most these colors")}>
                  At most these colors
                </li>
              </ul>
            )}
          </div>
          <div className="flex color-icons">
            {colors.map(({ name, Svg }) => (
              <Svg
                key={name}
                onClick={() => handleColorClick(name)}
                style={{
                  filter: selectedColors.includes(name)
                    ? "none"
                    : "grayscale(100%)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <hr />
    </li>
  );
};

export default Colors;
