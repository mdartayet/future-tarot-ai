/**
 * Converts a tarot card name to its corresponding image filename
 * @param cardName - The name of the tarot card (e.g., "La Muerte", "El Ermitaño")
 * @returns The filename without extension (e.g., "la-muerte", "el-ermitano")
 */
export const getCardImageFilename = (cardName: string): string => {
  return cardName
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
    .replace(/ /g, '-'); // Replace spaces with hyphens
};
