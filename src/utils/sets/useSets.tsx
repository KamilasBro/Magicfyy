import { Set } from "../../interfaces/Interfaces";
import { useEffect, useState } from "react";

let cachedSets: Set[] | null = null;
let fetchPromise: Promise<Set[]> | null = null;

const fetchSets = async (): Promise<Set[]> => {
    const response = await fetch("https://api.scryfall.com/sets");

    if (!response.ok) {
        throw new Error("Failed to fetch sets");
    }

    const data = await response.json();

    return data.data;
};

export const useSets = () => {
    const [sets, setSets] = useState<Set[]>(cachedSets ?? []);
    const [isSetLoaded, setIsSetLoaded] = useState(Boolean(cachedSets));
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let active = true;

        const run = async () => {
            try {
                if (cachedSets) {
                    setSets(cachedSets);
                    setIsSetLoaded(true);
                    return;
                }

                if (!fetchPromise) {
                    fetchPromise = fetchSets().then((data) => {
                        cachedSets = data;
                        return data;
                    });
                }

                const result = await fetchPromise;

                if (active) {
                    setSets(result);
                    setIsSetLoaded(true);
                }
            } catch (err) {
                if (active) {
                    setError(err as Error);
                    setIsSetLoaded(true);
                }
            }
        };

        run();

        return () => {
            active = false;
        };
    }, []);

    return { sets, isSetLoaded, error };
};