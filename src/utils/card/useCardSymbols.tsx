import { useEffect, useMemo, useState } from "react";
import { CardSymbolData } from "../../interfaces/Interfaces";

let cachedSymbols: CardSymbolData[] | null = null;
let fetchPromise: Promise<CardSymbolData[]> | null = null;

const fetchSymbols = async (): Promise<CardSymbolData[]> => {
    const res = await fetch("https://api.scryfall.com/symbology");

    if (!res.ok) {
        throw new Error("Failed to fetch symbols");
    }

    const data = await res.json();

    return data.data;
};

export const useCardSymbols = () => {
    const [symbols, setSymbols] = useState<CardSymbolData[]>(
        cachedSymbols ?? []
    );

    const [isSymbolLoaded, setIsSymbolLoaded] = useState(
        Boolean(cachedSymbols)
    );

    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let active = true;

        const run = async () => {
            try {
                if (cachedSymbols) {
                    setSymbols(cachedSymbols);
                    setIsSymbolLoaded(true);
                    return;
                }

                if (!fetchPromise) {
                    fetchPromise = fetchSymbols().then((data) => {
                        cachedSymbols = data;
                        return data;
                    });
                }

                const result = await fetchPromise;

                if (active) {
                    setSymbols(result);
                    setIsSymbolLoaded(true);
                }
            } catch (err) {
                if (active) {
                    setError(err as Error);
                    setIsSymbolLoaded(true);
                }
            }
        };

        run();

        return () => {
            active = false;
        };
    }, []);

    const symbolMap = useMemo(() => {
        const map = new Map<string, CardSymbolData>();

        symbols.forEach((s) => {
            map.set(s.symbol, s);
        });

        return map;
    }, [symbols]);

    const getTextWithSymbols = (text: string) => {
        if (!text) return null;

        const regex = /\{([^}]+)\}/g;

        const parts: (string | JSX.Element)[] = [];

        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(text)) !== null) {
            const [fullMatch, symbol] = match;

            const offset = match.index;

            if (offset > lastIndex) {
                parts.push(text.slice(lastIndex, offset));
            }

            const symbolData = symbolMap.get(`{${symbol}}`);

            parts.push(
                symbolData ? (
                    <img
                        key={`${symbol}-${offset}`}
                        src={symbolData.svg_uri}
                        alt={`${symbol} symbol`}
                        className="oracle-symbol"
                    />
                ) : (
                    fullMatch
                )
            );

            lastIndex = offset + fullMatch.length;
        }

        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }

        return parts;
    };

    return {
        symbols,
        symbolMap,
        getTextWithSymbols,
        isSymbolLoaded,
        error,
    };
};