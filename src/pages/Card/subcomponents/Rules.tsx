import { CardData, RulingsData } from "@/interfaces/Interfaces";

import { useEffect, useState } from "react";

const Rules: React.FC<{
    cardData: CardData | undefined,
    isCardLoaded: boolean,
    getTextWithSymbols: (text: string) => (string | JSX.Element)[] | null
}> = ({ cardData, isCardLoaded, getTextWithSymbols }) => {

    const [rulingsData, setRulingsData] = useState<RulingsData[]>([]);
    const [areRulesLoaded, setAreRulesLoaded] = useState(false)

    useEffect(() => {
        const controller = new AbortController();

        if (!cardData || !isCardLoaded) return;

        const fetchRulings = async () => {
            try {
                const response = await fetch(cardData.rulings_uri, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();

                setRulingsData(data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setAreRulesLoaded(true);
            }
        };

        fetchRulings();

        return () => {
            controller.abort();
        };
    }, [cardData]);

    return (
        <ul className="rules-list flex flex-col">
            {areRulesLoaded ? (
                rulingsData.length > 0 ? (
                    rulingsData.map((rule: RulingsData, index: number) => (
                        <li
                            className="flex flex-col"
                            key={"rule " + rule.oracle_id + index}
                        >
                            <h3>{rule.published_at}</h3>
                            <p>{getTextWithSymbols(rule.comment)}</p>
                        </li>
                    ))
                ) : (
                    <p>There are no rules for this card.</p>
                )
            ) : (
                <div className="placeholders flex flex-col">
                    {Array(8).fill(null).map((_, index) => <div key={index} className="placeholder" />)}
                </div>
            )}
        </ul>
    )
}

export default Rules