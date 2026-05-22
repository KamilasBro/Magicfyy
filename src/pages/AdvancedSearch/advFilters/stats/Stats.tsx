import "./stats.scss"
import StatsSvg from "@/assets/images/icons/stats.svg?react";
import AddSvg from "@/assets/images/icons/add.svg?react";
import CloseSvg from "@/assets/images/icons/close.svg?react";
import ArrowDownSvg from "@/assets/images/icons/arrowDown.svg?react";

import React, { useState, useEffect, useRef } from "react";
import { useScrollForDropDown } from "../../helpers/useScrollForDropDown";
import { useClickOutside } from "../../helpers/useClickOutside";

import { Action } from "../../store/reducerStore";


const avalibleConditions = [
  {
    name: "Equal to",
    symbol: "=",
  },
  {
    name: "Not equal to",
    symbol: "!=",
  },
  {
    name: "Greater than",
    symbol: ">",
  },
  {
    name: "Less than",
    symbol: "<",
  },
  {
    name: "Greater than or equal to",
    symbol: ">=",
  },
  {
    name: "Less than or equal to",
    symbol: "<=",
  },
]

const avalibleStats = [
  {
    name: "Mana Value",
    code: "cmc"
  },
  {
    name: "Power",
    code: "pow"
  },
  {
    name: "Toughness",
    code: "tou"
  },
  {
    name: "Loyality",
    code: "loy"
  },
]

type statType = (typeof avalibleStats)[number]["code"]
type conditionType = (typeof avalibleConditions)[number]["symbol"]
type dropDownType = "stat" | "condition" | null

const Stats: React.FC<{
  statsFilter: {
    stat: string;
    condition: string;
    value: string
  }[]
  setStatsFilter: React.Dispatch<Action>
}> = ({ statsFilter, setStatsFilter }) => {
  const [stat, setStat] = useState<statType>("cmc");
  const [condition, setCondition] = useState<conditionType>("=");
  const [statValue, setStatValue] = useState<string>("");

  const [showDropdown, setShowDropdown] = useState<dropDownType>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const conditionDropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    [dropdownRef, conditionDropdownRef],
    () => setShowDropdown(null)
  );

  const scrollTick = useScrollForDropDown();
  useEffect(() => {
    setShowDropdown(null);
  }, [scrollTick]);

  const handleDropdownToggle = (dropdown: dropDownType) => {
    setShowDropdown((prev) => (prev === dropdown ? null : dropdown));
  };


  const handleStatSelect = (selectedStat: statType) => {
    setStat(selectedStat);
    setShowDropdown(null);
  };

  const handleConditionSelect = (selectedCondition: conditionType) => {
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
    if (!statValue) return;

    const newStat = {
      stat,
      condition,
      value: statValue,
    };

    const index = statsFilter.findIndex(
      (item) => item.stat === stat && item.condition === condition
    );

    let updated;

    if (index !== -1) {
      updated = statsFilter.map((item, i) =>
        i === index ? newStat : item
      );
    } else {
      updated = [...statsFilter, newStat];
    }

    setStatsFilter({
      type: "SET_FILTER",
      field: "statsFilter",
      payload: updated,
    });

    setStatValue("");
  };

  const handleRemoveStat = (id: number) => {
    const updatedStat = statsFilter.filter((_, index) => index !== id)
    setStatsFilter({
      type: "SET_FILTER",
      field: "statsFilter",
      payload: updatedStat,
    })
  }

  return (
    <li className="filter filter-stats">
      <div className="flex justify-between">
        <label className="filter-label flex">
          <StatsSvg />
          Stats
        </label>
        <div className="input-wrap">
          <ul className="stats-list flex flex-wrap">
            {statsFilter.map(({ stat, condition, value }, index) => (
              <li
                key={stat + condition + value}
                className="flex items-center">
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
                  {avalibleStats.find((avlStat) => avlStat.code === stat)?.name}
                </span>
                <ArrowDownSvg
                  className={`arrow ${showDropdown === "stat" && "active"}`}
                />
              </div>
              {showDropdown === "stat" && (
                <ul className="dropdown stat-dropdown">
                  {avalibleStats.map((avlStat) =>
                    <li
                      key={`dropdown ${avlStat.code}`}
                      onClick={() => handleStatSelect(avlStat.code)}
                    >
                      {avlStat.name}
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div ref={conditionDropdownRef}>
              <div
                onClick={() => handleDropdownToggle("condition")}
                className="stats-input flex justify-between items-center"
              >
                <span>
                  {avalibleConditions.find((avlCond) => avlCond.symbol === condition)?.name}
                </span>
                <ArrowDownSvg
                  className={`arrow ${showDropdown === "condition" && "active"
                    }`}
                />
              </div>
              {showDropdown === "condition" && (
                <ul className="dropdown">
                  {avalibleConditions.map((avlCond) =>
                    <li
                      key={`dropdown ${avlCond.symbol}`}
                      onClick={() => handleConditionSelect(avlCond.symbol)}
                    >
                      {avlCond.name}
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="flex items-center">
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
      </div>
      <hr />
    </li>
  );
};

export default Stats;
