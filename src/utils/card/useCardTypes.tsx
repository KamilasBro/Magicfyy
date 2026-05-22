import { useEffect, useState } from "react";

type TypeCatalogs = {
    cardTypes: string[];
    creatureTypes: string[];
    supertypes: string[];
    landTypes: string[];
    artifactTypes: string[];
    spellTypes: string[];
};

let cachedCatalogs: TypeCatalogs | null = null;
let fetchPromise: Promise<TypeCatalogs> | null = null;

const fetchCardType = async (path: string): Promise<string[]> => {
    const response = await fetch(`https://api.scryfall.com/catalog/${path}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch ${path}`);
    }

    const data = await response.json();
    return data.data;
};

const fetchAllCardTypes = async (): Promise<TypeCatalogs> => {
    const [
        cardTypes,
        creatureTypes,
        supertypes,
        landTypes,
        artifactTypes,
        spellTypes,
    ] = await Promise.all([
        fetchCardType("card-types"),
        fetchCardType("creature-types"),
        fetchCardType("supertypes"),
        fetchCardType("land-types"),
        fetchCardType("artifact-types"),
        fetchCardType("spell-types"),
    ]);

    return {
        cardTypes,
        creatureTypes,
        supertypes,
        landTypes,
        artifactTypes,
        spellTypes,
    };
};

export const useTypeCatalogs = () => {
    const [typesCatalog, setTypesCatalog] = useState<TypeCatalogs | null>(cachedCatalogs);
    const [isLoaded, setIsLoaded] = useState(Boolean(cachedCatalogs));
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let active = true;

        const run = async () => {
            try {
                if (cachedCatalogs) {
                    setTypesCatalog(cachedCatalogs);
                    setIsLoaded(true);
                    return;
                }

                if (!fetchPromise) {
                    fetchPromise = fetchAllCardTypes().then((data) => {
                        cachedCatalogs = data;
                        return data;
                    });
                }

                const result = await fetchPromise;

                if (active) {
                    setTypesCatalog(result);
                    setIsLoaded(true);
                }
            } catch (err) {
                if (active) {
                    setError(err as Error);
                    setIsLoaded(true);
                }
            }
        };

        run();

        return () => {
            active = false;
        };
    }, []);

    const typeSections = [
        { label: "Card Types", data: typesCatalog?.cardTypes },
        { label: "Creature Types", data: typesCatalog?.creatureTypes },
        { label: "Supertypes", data: typesCatalog?.supertypes },
        { label: "Land Types", data: typesCatalog?.landTypes },
        { label: "Artifact Types", data: typesCatalog?.artifactTypes },
        { label: "Spell Types", data: typesCatalog?.spellTypes },
    ];
    return { typeSections, typesCatalog, isLoaded, error };
};