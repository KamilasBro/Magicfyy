import "./blocks.scss"
import SetsSvg from "@/assets/images/icons/sets.svg?react";
import CloseSvg from "@/assets/images/icons/close.svg?react";

import { Set } from "@/interfaces/Interfaces";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSets } from "@/utils/sets/useSets";
import { useScrollForDropDown } from "../../helpers/useScrollForDropDown";
import { useClickOutside } from "../../helpers/useClickOutside";

import { Action } from "../../store/reducerStore";

const blocksList = [
  { name: "Commander", code: "cmd" },
  { name: "Conspiracy", code: "cns" },
  { name: "Magic Player Rewards", code: "mpr" },
  { name: "Arena League", code: "arl" },
  { name: "Judge Gift Cards", code: "jgp" },
  { name: "Core Set", code: "lea" },
  { name: "Portal", code: "por" },
  { name: "Innistrad: Double Feature", code: "dbl" },
  { name: "Outlaws of Thunder Junction", code: "otj" },
  { name: "Guilds of Ravnica", code: "grn" },
  { name: "Heroes of the Realm", code: "htr" },
  { name: "Ixalan", code: "xln" },
  { name: "Amonkhet", code: "akh" },
  { name: "Kaladesh", code: "kld" },
  { name: "Shadows over Innistrad", code: "soi" },
  { name: "Battle for Zendikar", code: "bfz" },
  { name: "Khans of Tarkir", code: "ktk" },
  { name: "Theros", code: "ths" },
  { name: "Return to Ravnica", code: "rtr" },
  { name: "Innistrad", code: "isd" },
  { name: "Scars of Mirrodin", code: "som" },
  { name: "Zendikar", code: "zen" },
  { name: "Alara", code: "ala" },
  { name: "Shadowmoor", code: "shm" },
  { name: "Lorwyn", code: "lrw" },
  { name: "Time Spiral", code: "tsp" },
  { name: "Ravnica", code: "rav" },
  { name: "Kamigawa", code: "chk" },
  { name: "Mirrodin", code: "mrd" },
  { name: "Onslaught", code: "ons" },
  { name: "Odyssey", code: "ody" },
  { name: "Invasion", code: "inv" },
  { name: "Masques", code: "mmq" },
  { name: "Urza", code: "usg" },
  { name: "Tempest", code: "tmp" },
  { name: "Mirage", code: "mir" },
  { name: "Ice Age", code: "ice" },
];

type dropDownTypes = "sets" | "blocks" | null

const Blocks: React.FC<{
  blocksFilter: {
    sets: { name: string; code: string }[];
    blocks: { name: string; code: string }[];
  }
  setBlocksFilter: React.Dispatch<Action>
}> = ({
  blocksFilter,
  setBlocksFilter,
}) => {

    const { sets } = useSets();
    const fixedSets = useMemo(() => {
      return sets.filter((set: Set) => set.card_count > 0)
    }, [sets]);

    const [setsInput, setSetsInput] = useState("");
    const [blocksInput, setBlocksInput] = useState("");

    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputSetsRef = useRef<HTMLInputElement>(null);
    const inputBlockRef = useRef<HTMLInputElement>(null);
    const [showDropdown, setShowDropdown] = useState<dropDownTypes | null>(null);

    useClickOutside(
      [dropdownRef],
      () => setShowDropdown(null)
    );

    const scrollTick = useScrollForDropDown();
    useEffect(() => {
      setShowDropdown(null);
      inputSetsRef.current?.blur();
      inputBlockRef.current?.blur();
    }, [scrollTick]);

    const handleDropdownToggle = (dropdown: dropDownTypes) => {
      setShowDropdown((prev) => (prev === dropdown ? null : dropdown));
    };

    const handleSelect = (
      target: "set" | "block",
      data: { name: string; code: string }
    ) => {
      const list = target === "set" ? blocksFilter.sets : blocksFilter.blocks;

      const exists = list.some((item) => item.code === data.code);

      if (exists) return;

      const updated = {
        ...blocksFilter,
        [target === "set" ? "sets" : "blocks"]: [...list, data],
      };

      setBlocksFilter({
        type: "SET_FILTER",
        field: "blocksFilter",
        payload: updated,
      });

      if (target === "set") setSetsInput("");
      else setBlocksInput("");

      setShowDropdown(null);
    };

    const handleRemove = (target: "set" | "block", code: string) => {
      const key = target === "set" ? "sets" : "blocks";

      const list = blocksFilter[key];

      const updatedList = list.filter((item) => item.code !== code);

      const updated = {
        ...blocksFilter,
        [key]: updatedList,
      };

      setBlocksFilter({
        type: "SET_FILTER",
        field: "blocksFilter",
        payload: updated,
      });
    };

    const filteredSets = (items: Set[]) =>
      items.filter(
        (set) =>
          set.name.toLowerCase().includes(setsInput.toLowerCase()) &&
          !blocksFilter.sets.some((s) => s.code === set.code)
      );

    const filteredBlocks = blocksList.filter(
      (block) =>
        block.name.toLowerCase().includes(blocksInput.toLowerCase()) &&
        !blocksFilter.blocks.some((b) => b.code === block.code)
    );

    return (
      <li className="filter filter-set">
        <div className="flex justify-between">
          <label className="filter-label flex">
            <SetsSvg />
            Sets
          </label>
          <div className="input-wrap" ref={dropdownRef}>
            <div className="set-wrap">
              {blocksFilter.sets.length > 0 && (
                <ul className="set-tags flex flex-wrap">
                  {blocksFilter.sets.map((set) => (
                    <li
                      key={set.code}
                      className="set-tag flex items-center">
                      <span className="set-tag-name">{set.name}</span>
                      <CloseSvg onClick={() => handleRemove("set", set.code)} />
                    </li>
                  ))}
                </ul>
              )}
              <input
                ref={inputSetsRef}
                className="set-input"
                placeholder="Enter a set name and choose from the list"
                value={setsInput}
                onChange={(event) => setSetsInput(event.target.value)}
                onFocus={() => handleDropdownToggle("sets")}
              />
              {showDropdown === "sets" && (
                <div className="dropdown sets-dropdown">
                  <ul className="sets-list">
                    {filteredSets(fixedSets).map((set) => (
                      <li
                        className="set flex items-center"
                        key={set.code} // Use set.code as the key
                        onClick={() => handleSelect("set", set)}
                      >
                        <img
                          className="set-icon"
                          src={set.icon_svg_uri}
                          alt={set.name}
                        />
                        <span className="set-name">
                          {`${set.name} (${set.code.toUpperCase()})`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="set-wrap">
              {blocksFilter.blocks.length > 0 && (
                <ul className="set-tags flex flex-wrap">
                  {blocksFilter.blocks.map((block) => (
                    <li key={block.code} className="set-tag flex items-center">
                      <span className="set-tag-name">
                        {block.name}
                      </span>
                      <CloseSvg onClick={() => handleRemove("block", block.code)} />
                    </li>
                  ))}
                </ul>
              )}
              <input
                ref={inputBlockRef}
                className="set-input"
                placeholder="Enter a block name and choose from the list"
                value={blocksInput}
                onChange={(event) => setBlocksInput(event.target.value)}
                onFocus={() => handleDropdownToggle("blocks")}
              />
              {showDropdown === "blocks" && (
                <div className="dropdown block-dropdown">
                  <ul className="sets-list">
                    {filteredBlocks.map((block) => (
                      <li
                        className="block"
                        key={block.code}
                        onClick={() => handleSelect("block", block)}
                      >
                        {block.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <hr />
      </li>
    );
  };

export default Blocks;
