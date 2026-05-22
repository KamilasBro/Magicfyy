import "./cmcs.scss"
import ManaCostSvg from "@/assets/images/icons/manaCost.svg?react";
import AddSvg from "@/assets/images/icons/add.svg?react";

import { CardSymbolData } from "@/interfaces/Interfaces";

import React, { useState, useEffect, useRef } from "react";
import { useCardSymbols } from "@/utils/card/useCardSymbols";
import { useClickOutside } from "../../helpers/useClickOutside";
import { useScrollForDropDown } from "../../helpers/useScrollForDropDown";

import { Action } from "../../store/reducerStore";

const CMCs: React.FC<{
  CMCsFilter: string;
  setCMCsFilter: React.Dispatch<Action>;
}> = ({ CMCsFilter, setCMCsFilter }) => {

  const { symbols } = useCardSymbols()
  const filteredManaSymbols = symbols.filter(
    (symbol: CardSymbolData) =>
      symbol.represents_mana &&
      symbol.mana_value !== 0.5 &&
      symbol.mana_value <= 16 &&
      symbol.symbol !== "{∞}" &&
      symbol.symbol !== "{H}" &&
      symbol.symbol !== "{L}" &&
      symbol.symbol !== "{Y}" &&
      symbol.symbol !== "{Z}"
  );

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

  return (
    <li className="filter filter-mana-cost">
      <div className="flex justify-between">
        <label className="filter-label flex">
          <ManaCostSvg />
          Mana Cost
        </label>
        <div className="input-wrap" ref={dropdownRef}>
          <div className="mana-cost-input flex items-center">
            <input
              placeholder="Any mana symbol ex. “{G}{G}”"
              value={CMCsFilter}
              onChange={(e) =>
                setCMCsFilter({
                  type: "SET_FILTER",
                  field: "CMCsFilter",
                  payload: e.target.value,
                })
              }
            />
            <AddSvg
              className="add-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            />
          </div>
          {showDropdown &&
            <ul className="dropdown">
              {filteredManaSymbols.map((symbol) => (
                <li
                  key={symbol.symbol}
                  onClick={() => {
                    setCMCsFilter({
                      type: "SET_FILTER",
                      field: "CMCsFilter",
                      payload: CMCsFilter + symbol.symbol
                    })
                    setShowDropdown(false);
                  }}
                >
                  {symbol.symbol} - {symbol.english}
                </li>
              ))}
            </ul>}
          <span className="subnote">
            Find cards that require exactly this mana symbols to cast.
          </span>
        </div>
      </div>
      <hr />
    </li>
  );
};

export default CMCs;
