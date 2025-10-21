/**
 * Converts a tarot card name to its corresponding image URL
 * @param cardName - The filename of the tarot card (e.g., "el-mago", "la-estrella")
 * @returns The image path from public folder
 */
export const getCardImagePath = (cardName: string): string => {
  if (!cardName) {
    console.error('❌ Card name is empty');
    return '';
  }
  
  const path = `/tarot-cards/${cardName}.png`;
  console.log(`🔮 Loading: ${path}`);
  
  return path;
};
