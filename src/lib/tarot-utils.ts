// Import all tarot card images from src/assets
const imageModules = import.meta.glob<{ default: string }>('@/assets/tarot-cards/*.png', { 
  eager: true
});

// Create a map for quick lookups
const cardImageMap = new Map<string, string>();

// Process all imported images
Object.entries(imageModules).forEach(([path, module]) => {
  // Extract card name from path: "@/assets/tarot-cards/El Mago.png" -> "El Mago"
  const fileName = path.split('/').pop()?.replace('.png', '') || '';
  if (fileName && module.default) {
    cardImageMap.set(fileName, module.default);
  }
});

/**
 * Converts a tarot card name to its corresponding image URL
 * @param cardName - The name of the tarot card (e.g., "La Muerte", "El Ermitaño")
 * @returns The full image path
 */
export const getCardImagePath = (cardName: string): string => {
  if (!cardName) return '';
  
  // Get from the imported map
  const imageUrl = cardImageMap.get(cardName);
  if (imageUrl) {
    return imageUrl;
  }
  
  // This shouldn't happen if the card exists
  console.error(`Carta no encontrada en assets: "${cardName}"`);
  console.log('Cartas disponibles:', Array.from(cardImageMap.keys()));
  return '';
};
