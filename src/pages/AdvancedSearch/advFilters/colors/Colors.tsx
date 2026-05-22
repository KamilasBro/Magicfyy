import "./colors.scss"
import ColorsSvg from "@/assets/images/icons/colors.svg?react";
import BlackSvg from "@/assets/images/colors/black.svg?react";
import BlueSvg from "@/assets/images/colors/blue.svg?react";
import WhiteSvg from "@/assets/images/colors/white.svg?react";
import ColorlessSvg from "@/assets/images/colors/colorless.svg?react";
import GreenSvg from "@/assets/images/colors/green.svg?react";
import RedSvg from "@/assets/images/colors/red.svg?react";
import ArrowDownSvg from "@/assets/images/icons/arrowDown.svg?react";

import React, { useState, useEffect, useRef } from "react";
import { useScrollForDropDown } from "../../helpers/useScrollForDropDown";
import { useClickOutside } from "../../helpers/useClickOutside";

import { Action } from "../../store/reducerStore";

const colors = [
  { name: "W", Svg: WhiteSvg },
  { name: "U", Svg: BlueSvg },
  { name: "B", Svg: BlackSvg },
  { name: "R", Svg: RedSvg },
  { name: "G", Svg: GreenSvg },
  { name: "C", Svg: ColorlessSvg },
];

const Colors: React.FC<{
  colorsFilter: {
    colors: string[],
    option: string
  }
  setColorsFilter: React.Dispatch<Action>
}> = ({
  colorsFilter,
  setColorsFilter,
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(
      [dropdownRef],
      () => setShowDropdown(false)
    );

    const scrollTick = useScrollForDropDown();
    useEffect(() => {
      setShowDropdown(false);
    }, [scrollTick]);

    const handleColorClick = (color: (typeof colors)[number]["name"]) => {
      const currentColors = colorsFilter.colors ?? [];

      const updatedColors = (() => {
        if (color === "C") {
          return currentColors.includes("C")
            ? []
            : ["C"];
        }

        const hasColor = currentColors.includes(color);

        if (hasColor) {
          return currentColors.filter((c) => c !== color);
        }

        return [
          ...currentColors.filter((c) => c !== "C"),
          color,
        ];
      })();

      setColorsFilter({
        type: "SET_FILTER",
        field: "colorsFilter",
        payload: {
          ...colorsFilter,
          colors: updatedColors,
        },
      });
    };

    const handleOptionClick = (targetOption: string) => {
      const updatedOption = {
        ...colorsFilter,
        option: targetOption,
      };

      setColorsFilter({
        type: "SET_FILTER",
        field: "colorsFilter",
        payload: updatedOption,
      });

      setShowDropdown(false);
    };

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
                <span>{colorsFilter.option}</span>
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
                    filter: (colorsFilter.colors ?? []).includes(name)
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
