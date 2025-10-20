// Import all tarot card images dynamically
const cardImages = import.meta.glob('/public/tarot-cards/*.png', { eager: true, as: 'url' });

/**
 * Converts a tarot card name to its corresponding image URL
 * @param cardName - The name of the tarot card (e.g., "La Muerte", "El Ermitaño")
 * @returns The full image path
 */
export const getCardImagePath = (cardName: string): string => {
  if (!cardName) return '';
  
  // Look for the exact match in imported images
  const imagePath = `/public/tarot-cards/${cardName}.png`;
  const imageUrl = cardImages[imagePath];
  
  if (imageUrl) {
    return imageUrl as string;
  }
  
  // Fallback to encoded path if not found in imports
  const encodedName = encodeURIComponent(cardName);
  return `/tarot-cards/${encodedName}.png`;
};
