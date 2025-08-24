import React, { useState, useEffect, useRef } from "react";
import SetsSvg from "../../../assets/images/icons/sets.svg?react";
import CloseSvg from "../../../assets/images/icons/close.svg?react";
import { Set } from "../../../interfaces/CardsInterface";

interface SetsProps {
  selectedSets: { name: string; code: string }[];
  setSelectedSets: React.Dispatch<
    React.SetStateAction<{ name: string; code: string }[]>
  >;
  selectedBlocks: { name: string; code: string }[];
  setSelectedBlocks: React.Dispatch<
    React.SetStateAction<{ name: string; code: string }[]>
  >;
}

const Sets: React.FC<SetsProps> = ({
  selectedSets,
  setSelectedSets,
  selectedBlocks,
  setSelectedBlocks,
}) => {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [setsInput, setSetsInput] = useState("");
  const [blocksInput, setBlocksInput] = useState("");
  const [sets, setSets] = useState<Set[]>([]);
  const blocks = [
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
      if (window.innerWidth > 800) {
        setShowDropdown(null);
      }
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

  const handleSetSelect = (set: Set) => {
    if (!selectedSets.some((s) => s.code === set.code)) {
      setSelectedSets([...selectedSets, { name: set.name, code: set.code }]);
      setSetsInput(""); // Clear input after selection
      setShowDropdown(null); // Close dropdown after selection
    }
  };

  const handleBlockSelect = (block: { name: string; code: string }) => {
    if (!selectedBlocks.some((b) => b.code === block.code)) {
      setSelectedBlocks([...selectedBlocks, block]);
      setBlocksInput(""); // Clear input after selection
      setShowDropdown(null); // Close dropdown after selection
    }
  };

  const handleRemoveSet = (code: string) => {
    setSelectedSets(selectedSets.filter((s) => s.code !== code));
  };

  const handleRemoveBlock = (code: string) => {
    setSelectedBlocks(selectedBlocks.filter((b) => b.code !== code));
  };

  const filteredSets = (items: Set[]) =>
    items.filter(
      (set) =>
        set.name.toLowerCase().includes(setsInput.toLowerCase()) &&
        !selectedSets.some((s) => s.code === set.code)
    );

  const filteredBlocks = blocks.filter(
    (block) =>
      block.name.toLowerCase().includes(blocksInput.toLowerCase()) &&
      !selectedBlocks.some((b) => b.code === block.code)
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
                  <li key={set.code} className="set-tag flex items-center">
                    <span className="set-tag-name">{set.name}</span>
                    <CloseSvg onClick={() => handleRemoveSet(set.code)} />
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
                          key={set.code} // Use set.code as the key
                          onClick={() => handleSetSelect(set)}
                        >
                          <img
                            className="set-icon"
                            src={set.icon_svg_uri}
                            alt={set.name}
                          />
                          <span className="set-name">{`${
                            set.name
                          } (${set.code.toUpperCase()})`}</span>
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
                  <li key={block.code} className="set-tag flex items-center">
                    <span className="set-tag-name">{block.name}</span>
                    <CloseSvg onClick={() => handleRemoveBlock(block.code)} />
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
                  {filteredBlocks.length > 0 && (
                    <>
                      {filteredBlocks.map((block) => (
                        <li
                          className="block"
                          key={block.code}
                          onClick={() => handleBlockSelect(block)}
                        >
                          {block.name}
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
