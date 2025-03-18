import React, { useState, useEffect, useRef } from "react";
import ManaCostSvg from "../../../assets/images/icons/manaCost.svg?react";
import AddSvg from "../../../assets/images/icons/add.svg?react";

interface ManaCostProps {
  manaCost: string;
  setManaCost: React.Dispatch<React.SetStateAction<string>>;
}

const ManaCost: React.FC<ManaCostProps> = ({ manaCost, setManaCost }) => {
  const [manaSymbolsList, setManaSymbolsList] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 50)); // Set a timeout of 100ms
        const apiUrl = `https://api.scryfall.com/symbology`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        } else {
          const data = await response.json();
          const filteredSymbols = data.data.filter(
            (symbol: any) =>
              symbol.represents_mana &&
              symbol.mana_value !== 0.5 &&
              symbol.mana_value <= 16 &&
              symbol.symbol !== "{∞}" &&
              symbol.symbol !== "{H}" &&
              symbol.symbol !== "{L}" &&
              symbol.symbol !== "{Y}" &&
              symbol.symbol !== "{Z}"
          );
          setManaSymbolsList(filteredSymbols);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchSymbols();
  }, []);

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
      setShowDropdown(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dropdownRef]);

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
              value={manaCost}
              onChange={(e) => setManaCost(e.target.value)}
            />
            <AddSvg
              className="add-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            />
          </div>
          {showDropdown && <ul className="dropdown">
            {manaSymbolsList.map((symbol) => (
              <li
                key={symbol.symbol}
                onClick={() => {
                  setManaCost((prev) => prev + symbol.symbol);
                  setShowDropdown(false);
                }}
              >
                {symbol.symbol} - {symbol.english}
              </li>
            ))}
            </ul>}
          <span className="subnote">
            Find cards that require exactly this amount of mana to cast.
          </span>
        </div>
      </div>
      <hr />
    </li>
  );
};

export default ManaCost;
