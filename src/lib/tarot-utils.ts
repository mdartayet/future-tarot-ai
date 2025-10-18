/**
 * Converts a tarot card name to its corresponding image URL
 * @param cardName - The name of the tarot card (e.g., "La Muerte", "El Ermitaño")
 * @returns The full image path with proper encoding
 */
export const getCardImagePath = (cardName: string): string => {
  if (!cardName) return '';
  // Use encodeURIComponent to properly handle spaces and special characters
  return `/tarot-cards/${encodeURIComponent(cardName)}.png`;
};
