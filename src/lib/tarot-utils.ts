// Import all tarot card images statically - this ensures they're included in production build
import elCarro from '@/assets/tarot-cards/El Carro.png';
import elColgado from '@/assets/tarot-cards/El Colgado.png';
import elDiablo from '@/assets/tarot-cards/El Diablo.png';
import elEmperador from '@/assets/tarot-cards/El Emperador.png';
import elErmitano from '@/assets/tarot-cards/El Ermitaño.png';
import elHierofante from '@/assets/tarot-cards/El Hierofante.png';
import elJuicio from '@/assets/tarot-cards/El Juicio.png';
import elLoco from '@/assets/tarot-cards/El Loco.png';
import elMago from '@/assets/tarot-cards/El Mago.png';
import elMundo from '@/assets/tarot-cards/El Mundo.png';
import elSol from '@/assets/tarot-cards/El Sol.png';
import laEmperatriz from '@/assets/tarot-cards/La Emperatriz.png';
import laEstrella from '@/assets/tarot-cards/La Estrella.png';
import laFuerza from '@/assets/tarot-cards/La Fuerza.png';
import laJusticia from '@/assets/tarot-cards/La Justicia.png';
import laLuna from '@/assets/tarot-cards/La Luna.png';
import laMuerte from '@/assets/tarot-cards/La Muerte.png';
import laRuedaDeLaFortuna from '@/assets/tarot-cards/La Rueda de la Fortuna.png';
import laSacerdotisa from '@/assets/tarot-cards/La Sacerdotisa.png';
import laTemplanza from '@/assets/tarot-cards/La Templanza.png';
import laTorre from '@/assets/tarot-cards/La Torre.png';
import losEnamorados from '@/assets/tarot-cards/Los Enamorados.png';

// Map exact card names to their imported images
const cardImages: Record<string, string> = {
  'El Carro': elCarro,
  'El Colgado': elColgado,
  'El Diablo': elDiablo,
  'El Emperador': elEmperador,
  'El Ermitaño': elErmitano,
  'El Hierofante': elHierofante,
  'El Juicio': elJuicio,
  'El Loco': elLoco,
  'El Mago': elMago,
  'El Mundo': elMundo,
  'El Sol': elSol,
  'La Emperatriz': laEmperatriz,
  'La Estrella': laEstrella,
  'La Fuerza': laFuerza,
  'La Justicia': laJusticia,
  'La Luna': laLuna,
  'La Muerte': laMuerte,
  'La Rueda de la Fortuna': laRuedaDeLaFortuna,
  'La Sacerdotisa': laSacerdotisa,
  'La Templanza': laTemplanza,
  'La Torre': laTorre,
  'Los Enamorados': losEnamorados,
};

/**
 * Converts a tarot card name to its corresponding image URL
 * @param cardName - The name of the tarot card (e.g., "La Muerte", "El Ermitaño")
 * @returns The imported image URL
 */
export const getCardImagePath = (cardName: string): string => {
  if (!cardName) {
    console.error('❌ Card name is empty');
    return '';
  }
  
  const image = cardImages[cardName];
  
  if (!image) {
    console.error(`❌ Card "${cardName}" not found in map`);
    console.log('Available cards:', Object.keys(cardImages));
    return '';
  }
  
  console.log(`✓ Found card: "${cardName}"`);
  return image;
};
