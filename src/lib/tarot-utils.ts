/**
 * Converts a tarot card name to its corresponding image URL
 * @param cardName - The name of the tarot card (e.g., "La Muerte", "El Ermitaño")
 * @returns The image path from public folder
 */
export const getCardImagePath = (cardName: string): string => {
  if (!cardName) {
    console.error('❌ Card name is empty');
    return '';
  }
  
  // Normalizar el nombre: convertir a minúsculas y reemplazar espacios por guiones
  // "El Mago" -> "el-mago"
  // "La Muerte" -> "la-muerte"
  const normalizedName = cardName
    .toLowerCase()
    .normalize('NFD')  // Descomponer caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '')  // Eliminar marcas diacríticas (acentos)
    .replace(/\s+/g, '-')  // Reemplazar espacios por guiones
    .replace(/ñ/g, 'n');  // Reemplazar ñ por n
  
  const path = `/tarot-cards/${normalizedName}.png`;
  console.log(`✓ Loading card: "${cardName}" -> normalized: "${normalizedName}" from "${path}"`);
  return path;
};
