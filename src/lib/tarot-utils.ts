// Import all tarot card images with safer import paths
// Using URL-friendly names for imports to avoid issues with spaces
const images = {
  'El Carro': new URL('../assets/tarot-cards/El Carro.png', import.meta.url).href,
  'El Colgado': new URL('../assets/tarot-cards/El Colgado.png', import.meta.url).href,
  'El Diablo': new URL('../assets/tarot-cards/El Diablo.png', import.meta.url).href,
  'El Emperador': new URL('../assets/tarot-cards/El Emperador.png', import.meta.url).href,
  'El Ermitaño': new URL('../assets/tarot-cards/El Ermitaño.png', import.meta.url).href,
  'El Hierofante': new URL('../assets/tarot-cards/El Hierofante.png', import.meta.url).href,
  'El Juicio': new URL('../assets/tarot-cards/El Juicio.png', import.meta.url).href,
  'El Loco': new URL('../assets/tarot-cards/El Loco.png', import.meta.url).href,
  'El Mago': new URL('../assets/tarot-cards/El Mago.png', import.meta.url).href,
  'El Mundo': new URL('../assets/tarot-cards/El Mundo.png', import.meta.url).href,
  'El Sol': new URL('../assets/tarot-cards/El Sol.png', import.meta.url).href,
  'La Emperatriz': new URL('../assets/tarot-cards/La Emperatriz.png', import.meta.url).href,
  'La Estrella': new URL('../assets/tarot-cards/La Estrella.png', import.meta.url).href,
  'La Fuerza': new URL('../assets/tarot-cards/La Fuerza.png', import.meta.url).href,
  'La Justicia': new URL('../assets/tarot-cards/La Justicia.png', import.meta.url).href,
  'La Luna': new URL('../assets/tarot-cards/La Luna.png', import.meta.url).href,
  'La Muerte': new URL('../assets/tarot-cards/La Muerte.png', import.meta.url).href,
  'La Rueda de la Fortuna': new URL('../assets/tarot-cards/La Rueda de la Fortuna.png', import.meta.url).href,
  'La Sacerdotisa': new URL('../assets/tarot-cards/La Sacerdotisa.png', import.meta.url).href,
  'La Templanza': new URL('../assets/tarot-cards/La Templanza.png', import.meta.url).href,
  'La Torre': new URL('../assets/tarot-cards/La Torre.png', import.meta.url).href,
  'Los Enamorados': new URL('../assets/tarot-cards/Los Enamorados.png', import.meta.url).href,
};

/**
 * Converts a tarot card name to its corresponding image URL
 * @param cardName - The name of the tarot card (e.g., "La Muerte", "El Ermitaño")
 * @returns The full image path
 */
export const getCardImagePath = (cardName: string): string => {
  if (!cardName) {
    console.error('❌ Card name is empty');
    return '';
  }
  
  const imagePath = images[cardName as keyof typeof images];
  
  if (!imagePath) {
    console.error(`❌ Card not found: "${cardName}"`);
    console.log('Available cards:', Object.keys(images));
    return '';
  }
  
  console.log(`✅ Card loaded: "${cardName}" -> ${imagePath}`);
  return imagePath;
};
