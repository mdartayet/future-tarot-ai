// Import all tarot card images directly as ES6 modules
import ElCarro from '@/assets/tarot-cards/El Carro.png';
import ElColgado from '@/assets/tarot-cards/El Colgado.png';
import ElDiablo from '@/assets/tarot-cards/El Diablo.png';
import ElEmperador from '@/assets/tarot-cards/El Emperador.png';
import ElErmitano from '@/assets/tarot-cards/El Ermitaño.png';
import ElHierofante from '@/assets/tarot-cards/El Hierofante.png';
import ElJuicio from '@/assets/tarot-cards/El Juicio.png';
import ElLoco from '@/assets/tarot-cards/El Loco.png';
import ElMago from '@/assets/tarot-cards/El Mago.png';
import ElMundo from '@/assets/tarot-cards/El Mundo.png';
import ElSol from '@/assets/tarot-cards/El Sol.png';
import LaEmperatriz from '@/assets/tarot-cards/La Emperatriz.png';
import LaEstrella from '@/assets/tarot-cards/La Estrella.png';
import LaFuerza from '@/assets/tarot-cards/La Fuerza.png';
import LaJusticia from '@/assets/tarot-cards/La Justicia.png';
import LaLuna from '@/assets/tarot-cards/La Luna.png';
import LaMuerte from '@/assets/tarot-cards/La Muerte.png';
import LaRuedaDeLaFortuna from '@/assets/tarot-cards/La Rueda de la Fortuna.png';
import LaSacerdotisa from '@/assets/tarot-cards/La Sacerdotisa.png';
import LaTemplanza from '@/assets/tarot-cards/La Templanza.png';
import LaTorre from '@/assets/tarot-cards/La Torre.png';
import LosEnamorados from '@/assets/tarot-cards/Los Enamorados.png';

// Create a static map for reliable lookups
const cardImageMap: Record<string, string> = {
  'El Carro': ElCarro,
  'El Colgado': ElColgado,
  'El Diablo': ElDiablo,
  'El Emperador': ElEmperador,
  'El Ermitaño': ElErmitano,
  'El Hierofante': ElHierofante,
  'El Juicio': ElJuicio,
  'El Loco': ElLoco,
  'El Mago': ElMago,
  'El Mundo': ElMundo,
  'El Sol': ElSol,
  'La Emperatriz': LaEmperatriz,
  'La Estrella': LaEstrella,
  'La Fuerza': LaFuerza,
  'La Justicia': LaJusticia,
  'La Luna': LaLuna,
  'La Muerte': LaMuerte,
  'La Rueda de la Fortuna': LaRuedaDeLaFortuna,
  'La Sacerdotisa': LaSacerdotisa,
  'La Templanza': LaTemplanza,
  'La Torre': LaTorre,
  'Los Enamorados': LosEnamorados,
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
  
  const imagePath = cardImageMap[cardName];
  
  if (!imagePath) {
    console.error(`❌ Card not found: "${cardName}"`);
    console.log('Available cards:', Object.keys(cardImageMap));
    return '';
  }
  
  console.log(`✅ Card loaded: "${cardName}"`);
  return imagePath;
};
