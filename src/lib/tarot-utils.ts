// Import all tarot card images from public folder using their exact names
// This creates a mapping of card names to their image URLs
const imageModules = import.meta.glob<string>('/public/tarot-cards/*.png', { 
  eager: true,
  query: '?url',
  import: 'default'
});

// Create a map for quick lookups
const cardImageMap = new Map<string, string>();

// Process all imported images
Object.keys(imageModules).forEach((path) => {
  // Extract card name from path: "/public/tarot-cards/El Mago.png" -> "El Mago"
  const fileName = path.split('/').pop()?.replace('.png', '') || '';
  const imageUrl = imageModules[path];
  if (fileName && imageUrl) {
    cardImageMap.set(fileName, imageUrl);
  }
});

/**
 * Converts a tarot card name to its corresponding image URL
 * @param cardName - The name of the tarot card (e.g., "La Muerte", "El Ermitaño")
 * @returns The full image path
 */
export const getCardImagePath = (cardName: string): string => {
  if (!cardName) return '';
  
  // First try to get from the imported map
  const imageUrl = cardImageMap.get(cardName);
  if (imageUrl) {
    return imageUrl;
  }
  
  // Fallback to direct path with encoding
  const encodedName = encodeURIComponent(cardName);
  return `/tarot-cards/${encodedName}.png`;
};
