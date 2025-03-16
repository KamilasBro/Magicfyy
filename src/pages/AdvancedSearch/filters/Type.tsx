import React, { useState, useEffect, useRef } from "react";
import TypeSvg from "../../../assets/images/icons/type.svg?react";
import CloseSvg from "../../../assets/images/icons/close.svg?react";

const Type: React.FC = () => {
  const [allowPartialMatches, setAllowPartialMatches] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [typeInput, setTypeInput] = useState("");
  const [cardTypes, setCardTypes] = useState<string[]>([]);
  const [creatureTypes, setCreatureTypes] = useState<string[]>([]);
  const [supertypes, setSupertypes] = useState<string[]>([]);
  const [landTypes, setLandTypes] = useState<string[]>([]);
  const [artifactTypes, setArtifactTypes] = useState<string[]>([]);
  const [spellTypes, setSpellTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<
    { type: string; isIncluded: boolean }[]
  >([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCardTypes = async () => {
      try {
        const response = await fetch(
          "https://api.scryfall.com/catalog/card-types"
        );
        const data = await response.json();
        setCardTypes(data.data);
      } catch (error) {
        console.error("Error fetching card types:", error);
      }
    };

    const fetchCreatureTypes = async () => {
      try {
        const response = await fetch(
          "https://api.scryfall.com/catalog/creature-types"
        );
        const data = await response.json();
        setCreatureTypes(data.data);
      } catch (error) {
        console.error("Error fetching creature types:", error);
      }
    };

    const fetchSupertypes = async () => {
      try {
        const response = await fetch(
          "https://api.scryfall.com/catalog/supertypes"
        );
        const data = await response.json();
        setSupertypes(data.data);
      } catch (error) {
        console.error("Error fetching supertypes:", error);
      }
    };

    const fetchLandTypes = async () => {
      try {
        const response = await fetch(
          "https://api.scryfall.com/catalog/land-types"
        );
        const data = await response.json();
        setLandTypes(data.data);
      } catch (error) {
        console.error("Error fetching land types:", error);
      }
    };

    const fetchArtifactTypes = async () => {
      try {
        const response = await fetch(
          "https://api.scryfall.com/catalog/artifact-types"
        );
        const data = await response.json();
        setArtifactTypes(data.data);
      } catch (error) {
        console.error("Error fetching artifact types:", error);
      }
    };

    const fetchSpellTypes = async () => {
      try {
        const response = await fetch(
          "https://api.scryfall.com/catalog/spell-types"
        );
        const data = await response.json();
        setSpellTypes(data.data);
      } catch (error) {
        console.error("Error fetching spell types:", error);
      }
    };

    fetchCardTypes();
    fetchCreatureTypes();
    fetchSupertypes();
    fetchLandTypes();
    fetchArtifactTypes();
    fetchSpellTypes();
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

  const handleTypeInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTypeInput(event.target.value);
  };

  const handleTypeSelect = (type: string) => {
    if (!selectedTypes.some((t) => t.type === type)) {
      setSelectedTypes([...selectedTypes, { type, isIncluded: true }]);
      setTypeInput(""); // Clear input after selection
      setShowDropdown(false); // Close dropdown after selection
    }
  };

  const handleRemoveType = (type: string) => {
    setSelectedTypes(selectedTypes.filter((t) => t.type !== type));
  };

  const toggleTypeInclusion = (type: string) => {
    setSelectedTypes(
      selectedTypes.map((t) =>
        t.type === type ? { ...t, isIncluded: !t.isIncluded } : t
      )
    );
  };

  const filteredItems = (items: string[]) =>
    items.filter(
      (type) =>
        type.toLowerCase().includes(typeInput.toLowerCase()) &&
        !selectedTypes.some((t) => t.type === type)
    );

  return (
    <li className="filter filter-type">
      <div className="flex justify-between">
        <label className="filter-label flex">
          <TypeSvg />
          Type
        </label>
        <div className="input-wrap" ref={dropdownRef}>
          <div className="type-wrap">
            {selectedTypes.length > 0 && (
              <ul className="type-tags flex flex-wrap">
                {selectedTypes.map(({ type, isIncluded }) => (
                  <li key={type} className="type-tag flex items-center">
                    <div
                      className={`if-not flex items-center justify-center ${
                        isIncluded ? "included" : "excluded"
                      }`}
                      onClick={() => toggleTypeInclusion(type)}
                    >
                      {isIncluded ? "IS" : "NOT"}
                    </div>
                    <span className="type-tag-name">{type}</span>
                    <CloseSvg onClick={() => handleRemoveType(type)} />
                  </li>
                ))}
              </ul>
            )}
            <input
              className="type-input"
              placeholder="Enter a type and choose from the list"
              value={typeInput}
              onChange={handleTypeInputChange}
              onFocus={() => setShowDropdown(true)}
            />
            {showDropdown && (
              <div className="dropdown">
                <ul className="types-list">
                  {filteredItems(cardTypes).length > 0 && (
                    <ul>
                      <li className="type-category">Card Types</li>
                      {filteredItems(cardTypes).map((type) => (
                        <li
                          className="type"
                          key={type}
                          onClick={() => handleTypeSelect(type)}
                        >
                          {type}
                        </li>
                      ))}
                    </ul>
                  )}
                  {filteredItems(creatureTypes).length > 0 && (
                    <ul>
                      <li className="type-category">Creature Types</li>
                      {filteredItems(creatureTypes).map((type) => (
                        <li
                          className="type"
                          key={type}
                          onClick={() => handleTypeSelect(type)}
                        >
                          {type}
                        </li>
                      ))}
                    </ul>
                  )}
                  {filteredItems(supertypes).length > 0 && (
                    <ul>
                      <li className="type-category">Supertypes</li>
                      {filteredItems(supertypes).map((type) => (
                        <li
                          className="type"
                          key={type}
                          onClick={() => handleTypeSelect(type)}
                        >
                          {type}
                        </li>
                      ))}
                    </ul>
                  )}
                  {filteredItems(landTypes).length > 0 && (
                    <ul>
                      <li className="type-category">Land Types</li>
                      {filteredItems(landTypes).map((type) => (
                        <li
                          className="type"
                          key={type}
                          onClick={() => handleTypeSelect(type)}
                        >
                          {type}
                        </li>
                      ))}
                    </ul>
                  )}
                  {filteredItems(artifactTypes).length > 0 && (
                    <ul>
                      <li className="type-category">Artifact Types</li>
                      {filteredItems(artifactTypes).map((type) => (
                        <li
                          className="type"
                          key={type}
                          onClick={() => handleTypeSelect(type)}
                        >
                          {type}
                        </li>
                      ))}
                    </ul>
                  )}
                  {filteredItems(spellTypes).length > 0 && (
                    <ul>
                      <li className="type-category">Spell Types</li>
                      {filteredItems(spellTypes).map((type) => (
                        <li
                          className="type"
                          key={type}
                          onClick={() => handleTypeSelect(type)}
                        >
                          {type}
                        </li>
                      ))}
                    </ul>
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className="flex items-center radio-wrap">
            <input
              type="checkbox"
              className="radio"
              checked={allowPartialMatches}
              onChange={() => {
                setAllowPartialMatches((prevState: boolean) => !prevState);
              }}
            />
            <span>Allow partial type matches</span>
          </div>
          <span className="subnote">
            Click the "IS" or "NOT" button to toggle between including and
            excluding a type.
          </span>
        </div>
      </div>
      <hr />
    </li>
  );
};

export default Type;
