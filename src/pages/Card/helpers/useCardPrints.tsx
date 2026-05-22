import { useEffect, useState } from "react";
import { CardData, CardPrices } from "@/interfaces/Interfaces";

export const useCardPrints = (cardData: CardData | undefined, isCardLoaded: boolean) => {
    const [printsData, setPrintsData] = useState<CardData[]>([]);
    const [arePrintsLoaded, setArePrintsLoaded] = useState(false);

    useEffect(() => {
        if (!cardData?.prints_search_uri || !isCardLoaded) return;

        const controller = new AbortController();

        const fetchPrints = async () => {
            try {
                const response = await fetch(cardData.prints_search_uri, {
                    signal: controller.signal,
                });

                if (!response.ok) throw new Error("Failed to fetch prints");

                const data = await response.json();
                setPrintsData(data.data);
            } catch (error) {
                console.error("Error fetching prints:", error);
                setPrintsData([]);
            } finally {
                setArePrintsLoaded(true);
            }
        };

        fetchPrints();

        return () => controller.abort();
    }, [cardData?.prints_search_uri, isCardLoaded]);

    const getEuroPrice = (prices: CardPrices) => {
        let price;
        if (prices.eur) {
            price = prices.eur
        } else {
            price = prices.eur_foil
        }
        return price;
    }

    const getUsdPrice = (prices: CardPrices) => {
        let price;
        if (prices.usd) {
            price = prices.usd
        } else if (prices.usd_foil) {
            price = prices.usd_foil
        } else {
            price = prices.usd_etched
        }
        return price;
    }


    return { printsData, arePrintsLoaded, getEuroPrice, getUsdPrice };
};