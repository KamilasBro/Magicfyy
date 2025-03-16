import React, { useState, useEffect, useRef } from "react";
import SetsSvg from "../../../assets/images/icons/sets.svg?react";
import CloseSvg from "../../../assets/images/icons/close.svg?react";
import { Set } from "../../../interfaces/CardsInterface";

const Sets: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [setsInput, setSetsInput] = useState("");
  const [blocksInput, setBlocksInput] = useState("");
  const [sets, setSets] = useState<Set[]>([]);
  const blocks = [
    "Commander",
    "Conspiracy",
    "Magic Player Rewards",
    "Arena League",
    "Judge Gift Cards",
    "Core Set",
    "Portal",
    "Innistrad: Double Feature",
    "Alchemy 2025",
    "Outlaws of Thunder Junction",
    "Alchemy 2024",
    "Alchemy 2023",
    "Alchemy 2022",
    "Guilds of Ravnica",
    "Heroes of the Realm",
    "Ixalan",
    "Amonkhet",
    "Kaladesh",
    "Shadows over Innistrad",
    "Battle for Zendikar",
    "Khans of Tarkir",
    "Theros",
    "Return to Ravnica",
    "Innistrad",
    "Scars of Mirrodin",
    "Zendikar",
    "Alara",
    "Shadowmoor",
    "Lorwyn",
    "Time Spiral",
    "Ravnica",
    "Kamigawa",
    "Mirrodin",
    "Onslaught",
    "Odyssey",
    "Invasion",
    "Masques",
    "Urza",
    "Tempest",
    "Mirage",
    "Ice Age",
  ];
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        await new Promise((resolve) => {
          setTimeout(resolve, 50); // Set a timeout of 50ms
        });
        const apiUrl = `https://api.scryfall.com/sets`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setSets(data.data.filter((set: any) => set.card_count > 0));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCards();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
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
  }, [dropdownRef]);

  const handleSetsInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSetsInput(event.target.value);
  };

  const handleBlocksInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBlocksInput(event.target.value);
  };

  const handleSetSelect = (set: string) => {
    if (!selectedSets.includes(set)) {
      setSelectedSets([...selectedSets, set]);
      setSetsInput(""); // Clear input after selection
      setShowDropdown(null); // Close dropdown after selection
    }
  };

  const handleBlockSelect = (block: string) => {
    if (!selectedBlocks.includes(block)) {
      setSelectedBlocks([...selectedBlocks, block]);
      setBlocksInput(""); // Clear input after selection
      setShowDropdown(null); // Close dropdown after selection
    }
  };

  const handleRemoveSet = (set: string) => {
    setSelectedSets(selectedSets.filter((s) => s !== set));
  };

  const handleRemoveBlock = (block: string) => {
    setSelectedBlocks(selectedBlocks.filter((b) => b !== block));
  };

  const filteredSets = (items: Set[]) =>
    items.filter(
      (set) =>
        set.name.toLowerCase().includes(setsInput.toLowerCase()) &&
        !selectedSets.includes(set.name)
    );

  const filteredBlocks = (items: string[]) =>
    items.filter(
      (block) =>
        block.toLowerCase().includes(blocksInput.toLowerCase()) &&
        !selectedBlocks.includes(block)
    );

  const handleDropdownToggle = (dropdown: string) => {
    setShowDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  return (
    <li className="filter filter-set">
      <div className="flex justify-between">
        <label className="filter-label flex">
          <SetsSvg />
          Sets
        </label>
        <div className="input-wrap" ref={dropdownRef}>
          <div className="set-wrap">
            {selectedSets.length > 0 && (
              <ul className="set-tags flex flex-wrap">
                {selectedSets.map((set) => (
                  <li key={set} className="set-tag flex items-center">
                    <span className="set-tag-name">{set}</span>
                    <CloseSvg onClick={() => handleRemoveSet(set)} />
                  </li>
                ))}
              </ul>
            )}
            <input
              className="set-input"
              placeholder="Enter a set name and choose from the list"
              value={setsInput}
              onChange={handleSetsInputChange}
              onFocus={() => handleDropdownToggle("sets")}
            />
            {showDropdown === "sets" && (
              <div className="dropdown sets-dropdown">
                <ul className="sets-list">
                  {filteredSets(sets).length > 0 && (
                    <>
                      {filteredSets(sets).map((set) => (
                        <li
                          className="set flex items-center"
                          key={set.name}
                          onClick={() => handleSetSelect(set.name)}
                        >
                          <img
                            className="set-icon"
                            src={set.icon_svg_uri}
                            alt={set.name}
                          />
                          <span className="set-name">{`${
                            set.name + " " + set.code.toUpperCase()
                          }`}</span>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className="set-wrap">
            {selectedBlocks.length > 0 && (
              <ul className="set-tags flex flex-wrap">
                {selectedBlocks.map((block) => (
                  <li key={block} className="set-tag flex items-center">
                    <span className="set-tag-name">{block}</span>
                    <CloseSvg onClick={() => handleRemoveBlock(block)} />
                  </li>
                ))}
              </ul>
            )}
            <input
              className="set-input"
              placeholder="Enter a block name and choose from the list"
              value={blocksInput}
              onChange={handleBlocksInputChange}
              onFocus={() => handleDropdownToggle("blocks")}
            />
            {showDropdown === "blocks" && (
              <div className="dropdown block-dropdown">
                <ul className="sets-list">
                  {filteredBlocks(blocks).length > 0 && (
                    <>
                      {filteredBlocks(blocks).map((block) => (
                        <li
                          className="block"
                          key={block}
                          onClick={() => handleBlockSelect(block)}
                        >
                          {block}
                        </li>
                      ))}
                    </>
                  )}
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

export default Sets;
