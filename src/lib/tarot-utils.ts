/**
 * Converts a tarot card name to its corresponding image URL
 * @param cardName - The name of the tarot card (e.g., "La Muerte", "El Ermitaño")
 * @returns The full image path
 */
export const getCardImagePath = (cardName: string): string => {
  if (!cardName) return '';
  // Encode the card name to handle special characters like tildes and spaces
  const encodedName = encodeURIComponent(cardName);
  // Public folder assets must use absolute paths starting with /
  return `/tarot-cards/${encodedName}.png`;
};
