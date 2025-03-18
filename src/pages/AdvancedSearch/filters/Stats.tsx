import React, { useState, useEffect, useRef } from "react";
import StatsSvg from "../../../assets/images/icons/stats.svg?react";
import AddSvg from "../../../assets/images/icons/add.svg?react";
import CloseSvg from "../../../assets/images/icons/close.svg?react";
import ArrowDownSvg from "../../../assets/images/icons/arrowDown.svg?react";

interface StatItem {
  stat: string;
  condition: string;
  value: string;
}

interface StatsProps {
  statsList: StatItem[];
  setStatsList: React.Dispatch<React.SetStateAction<StatItem[]>>;
}

const Stats: React.FC<StatsProps> = ({ statsList, setStatsList }) => {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [stat, setStat] = useState<string>("cmc");
  const [condition, setCondition] = useState<string>("=");
  const [statValue, setStatValue] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const conditionDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        conditionDropdownRef.current &&
        !conditionDropdownRef.current.contains(event.target as Node)
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
  }, [dropdownRef, conditionDropdownRef]);

  const handleDropdownToggle = (dropdown: string) => {
    setShowDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const handleStatSelect = (selectedStat: string) => {
    setStat(selectedStat);
    setShowDropdown(null);
  };

  const handleConditionSelect = (selectedCondition: string) => {
    setCondition(selectedCondition);
    setShowDropdown(null);
  };

  const handleStatValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setStatValue(value);
    }
  };

  const handleAddStat = () => {
    if (statValue) {
      const newStat: StatItem = {
        stat,
        condition,
        value: statValue,
      };
      setStatsList((prev) => {
        if (
          prev.some(
            (item) =>
              item.stat === stat &&
              item.condition === condition &&
              item.value === statValue
          )
        ) {
          return prev; // Do not add if the same stat, condition, and value already exists
        }
        return [...prev, newStat];
      });
      setStatValue("");
    }
  };

  const handleRemoveStat = (id: number) => {
    setStatsList((prev) => prev.filter((_, index) => index !== id));
  };

  return (
    <li className="filter filter-stats">
      <div className="flex justify-between">
        <label className="filter-label flex">
          <StatsSvg />
          Stats
        </label>
        <div className="input-wrap">
          <ul className="stats-list flex flex-wrap">
            {statsList.map(({ stat, condition, value }, index) => (
              <li key={index} className="flex items-center">
                {stat} {condition} {value}
                <CloseSvg onClick={() => handleRemoveStat(index)} />
              </li>
            ))}
          </ul>
          <div className="stats-wrap flex items-center">
            <div ref={dropdownRef}>
              <div
                onClick={() => handleDropdownToggle("stat")}
                className="stats-input flex justify-between items-center"
              >
                <span>
                  {stat === "cmc"
                    ? "Mana value"
                    : stat === "pow"
                    ? "Power"
                    : stat === "tou"
                    ? "Toughness"
                    : "Loyality"}
                </span>
                <ArrowDownSvg
                  className={`arrow ${showDropdown === "stat" && "active"}`}
                />
              </div>
              {showDropdown === "stat" && (
                <ul className="dropdown stat-dropdown">
                  <li onClick={() => handleStatSelect("cmc")}>Mana value</li>
                  <li onClick={() => handleStatSelect("pow")}>Power</li>
                  <li onClick={() => handleStatSelect("tou")}>Toughness</li>
                  <li onClick={() => handleStatSelect("loy")}>Loyality</li>
                </ul>
              )}
            </div>
            <div ref={conditionDropdownRef}>
              <div
                onClick={() => handleDropdownToggle("condition")}
                className="stats-input flex justify-between items-center"
              >
                <span>
                  {condition === "="
                    ? "Equal to"
                    : condition === ">"
                    ? "Greater than"
                    : condition === "<"
                    ? "Less than"
                    : condition === "<="
                    ? "Less than or equal to"
                    : condition === ">="
                    ? "Greater than or equal to"
                    : "Not equal to"}
                </span>
                <ArrowDownSvg
                  className={`arrow ${
                    showDropdown === "condition" && "active"
                  }`}
                />
              </div>
              {showDropdown === "condition" && (
                <ul className="dropdown">
                  <li onClick={() => handleConditionSelect("=")}>Equal to</li>
                  <li onClick={() => handleConditionSelect(">")}>
                    Greater than
                  </li>
                  <li onClick={() => handleConditionSelect("<")}>Less than</li>
                  <li onClick={() => handleConditionSelect("<=")}>
                    Less than or equal to
                  </li>
                  <li onClick={() => handleConditionSelect(">=")}>
                    Greater than or equal to
                  </li>
                  <li onClick={() => handleConditionSelect("!=")}>
                    Not equal to
                  </li>
                </ul>
              )}
            </div>
            <input
              type="text"
              className="stat-value"
              placeholder="Any number ex. “2”"
              value={statValue}
              onChange={handleStatValueChange}
            />
            <AddSvg className="add-btn" onClick={handleAddStat} />
          </div>
        </div>
      </div>
      <hr />
    </li>
  );
};

export default Stats;
