/**
 * Converts a tarot card name to its corresponding image URL
 * @param cardName - The name of the tarot card (e.g., "La Muerte", "El Ermitaño")
 * @returns The full image path from public folder
 */
export const getCardImagePath = (cardName: string): string => {
  if (!cardName) return '';
  
  // Use direct path to public folder - this works reliably in production
  return `/tarot-cards/${cardName}.png`;
};
