/**
 * Converts a tarot card name to its corresponding image URL
 * @param cardName - The name of the tarot card (e.g., "La Muerte", "El Ermitaño")
 * @returns The full image path from public folder
 */
export const getCardImagePath = (cardName: string): string => {
  if (!cardName) {
    console.error('❌ Card name is empty');
    return '';
  }
  
  // Use direct path to public folder - browsers handle spaces in URLs automatically
  const path = `/tarot-cards/${cardName}.png`;
  console.log(`🃏 Loading card: "${cardName}" from ${path}`);
  return path;
};
