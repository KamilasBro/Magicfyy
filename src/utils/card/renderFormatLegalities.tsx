import { CardData } from "../../interfaces/Interfaces";

export const mtgFormats = [
  "Standard",
  "Alchemy",
  "Pioneer",
  "Explorer",
  "Modern",
  "Historic",
  "Legacy",
  "Brawl",
  "Vintage",
  "Commander",
  "Pauper",
  "Oathbreaker",
  "Penny",
];

export const renderFormatLegalities = (card: CardData) => {

  const compareDate = (date: string) => {
    const releaseDate = new Date(date);
    const currentDate = new Date();
    return releaseDate > currentDate;
  }

  const lowercaseLegalities = Object.fromEntries(
    Object.entries(card.legalities).map(([key, value]) => [
      key.toLowerCase(),
      value,
    ])
  );

  return (
    <>
      {compareDate(card.released_at) ? (
        <button key={`format-unreleased`}>Unreleased</button>
      ) : (
        mtgFormats
          .filter((format) => lowercaseLegalities[format.toLowerCase()]) // Filter only formats present in card's legalities
          .map((format) => {
            const legality = lowercaseLegalities[format.toLowerCase()];
            switch (legality) {
              case "legal":
                return (
                  <button className={`format-${format} legal`} key={format}>
                    {format}
                  </button>
                );
              case "not_legal":
                return (
                  <button className={`format-${format} not-legal`} key={format}>
                    {format}
                  </button>
                );
              case "restricted":
                return (
                  <button className={`format-${format} restricted`} key={format}>
                    {format}
                  </button>
                );
              case "banned":
                return (
                  <button className={`format-${format} banned`} key={format}>
                    {format}
                  </button>
                );
              default:
                return null; // Don't render button for formats with unknown legality
            }
          }))}
    </>
  )

}