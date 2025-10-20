import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'es' | 'en';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'es',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'tarot-language',
    }
  )
);

export const translations = {
  es: {
    // Header
    appName: 'Tarot Futura',
    tagline: 'Descubre los secretos que las sombras ocultan...',
    signOut: 'Salir',
    
    // Onboarding
    greeting: '¿Cómo te llamas, viajero?',
    namePlaceholder: 'Tu nombre',
    step1: 'Paso 1: ¿Qué misterio deseas desentrañar?',
    step2: 'Paso 2: ¿Qué pregunta deseas hacerle al tarot?',
    love: 'Amor y Relaciones',
    career: 'Carrera y Propósito',
    money: 'Dinero y Abundancia',
    questionPlaceholder: 'Escribe tu pregunta aquí (mínimo 10 caracteres)...',
    revealDestiny: 'Revelar mi Destino',
    warningName: '⚠️ Debes ingresar tu nombre',
    warningQuestion: '⚠️ Debes escribir una pregunta',
    warningLength: '⚠️ La pregunta debe tener al menos 10 caracteres',
    footer: 'Las cartas ancestrales te esperan en la penumbra...',
    
    // Reading
    welcome: 'Bienvenido',
    revealCards: 'Las cartas ancestrales revelarán tu',
    and: 'y',
    selectCards: 'Selecciona',
    cards: 'Cartas',
    shuffleCards: 'Barajar Cartas',
    revealMessage: 'Revelar el Mensaje',
    
    // Auth
    authTagline: 'Ingresa al reino de los misterios ancestrales',
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    email: 'Email',
    password: 'Contraseña',
    name: 'Nombre',
    enterSanctuary: 'Entrar al Santuario',
    createAccount: 'Crear Cuenta',
    forgotPassword: '¿Olvidaste tu contraseña?',
    
    // Results
    yourReading: 'Tu Lectura del Tarot',
    yourQuestion: 'Tu Pregunta:',
    oracleReading: 'Lectura del Oráculo',
    consulting: 'El oráculo está consultando las estrellas...',
    past: 'Pasado',
    present: 'Presente',
    future: 'Futuro',
    premiumContent: 'Contenido Premium',
    unlockFuture: 'Desbloquea tu futuro con la lectura completa',
    unlockButton: 'Desbloquear Futuro',
    unlocked: 'Lectura Completa Desbloqueada',
    newReading: 'Nueva Lectura',
    wisdom: 'Que la sabiduría ancestral ilumine tu camino...',
    
    // Card names and meanings
    cardNames: {
      'El Mago': 'El Mago',
      'La Sacerdotisa': 'La Sacerdotisa',
      'La Emperatriz': 'La Emperatriz',
      'El Emperador': 'El Emperador',
      'El Hierofante': 'El Hierofante',
      'Los Enamorados': 'Los Enamorados',
      'El Carro': 'El Carro',
      'La Fuerza': 'La Fuerza',
      'El Ermitaño': 'El Ermitaño',
      'La Rueda de la Fortuna': 'La Rueda de la Fortuna',
      'La Justicia': 'La Justicia',
      'El Colgado': 'El Colgado',
      'La Muerte': 'La Muerte',
      'La Templanza': 'La Templanza',
      'El Diablo': 'El Diablo',
      'La Torre': 'La Torre',
      'La Estrella': 'La Estrella',
      'La Luna': 'La Luna',
      'El Sol': 'El Sol',
      'El Juicio': 'El Juicio',
      'El Mundo': 'El Mundo',
      'El Loco': 'El Loco',
    } as Record<string, string>,
    cardMeanings: {
      'El Mago': 'Poder de manifestación y nuevos comienzos',
      'La Sacerdotisa': 'Intuición y sabiduría interior',
      'La Emperatriz': 'Abundancia y creatividad',
      'El Emperador': 'Autoridad y estructura',
      'El Hierofante': 'Tradición y educación espiritual',
      'Los Enamorados': 'Elecciones y relaciones armónicas',
      'El Carro': 'Victoria y determinación',
      'La Fuerza': 'Coraje y control interno',
      'El Ermitaño': 'Introspección y búsqueda de verdad',
      'La Rueda de la Fortuna': 'Cambios y ciclos del destino',
      'La Justicia': 'Equilibrio y consecuencias',
      'El Colgado': 'Nueva perspectiva y sacrificio',
      'La Muerte': 'Transformación y finales necesarios',
      'La Templanza': 'Balance y moderación',
      'El Diablo': 'Liberación de ataduras',
      'La Torre': 'Cambio súbito y revelaciones',
      'La Estrella': 'Esperanza y renovación',
      'La Luna': 'Ilusiones y subconsciente',
      'El Sol': 'Éxito y claridad',
      'El Juicio': 'Renacimiento y llamado superior',
      'El Mundo': 'Completitud y logro',
      'El Loco': 'Nuevos viajes y espontaneidad',
    } as Record<string, string>,
    cardFullReadings: {
      'El Mago': 'El Mago emerge de las sombras ancestrales como el maestro de los elementos y arquitecto de realidades.',
      'La Sacerdotisa': 'La Sacerdotisa guarda los misterios del velo entre mundos.',
      'El Loco': 'El Loco salta alegremente al abismo, confiando en que el universo extenderá alas invisibles bajo sus pies.',
    } as Record<string, string>,
  },
  en: {
    // Header
    appName: 'Tarot Futura',
    tagline: 'Discover the secrets hidden in the shadows...',
    signOut: 'Sign Out',
    
    // Onboarding
    greeting: 'What is your name, traveler?',
    namePlaceholder: 'Your name',
    step1: 'Step 1: What mystery do you wish to unravel?',
    step2: 'Step 2: What question do you want to ask the tarot?',
    love: 'Love & Relationships',
    career: 'Career & Purpose',
    money: 'Money & Abundance',
    questionPlaceholder: 'Write your question here (minimum 10 characters)...',
    revealDestiny: 'Reveal my Destiny',
    warningName: '⚠️ You must enter your name',
    warningQuestion: '⚠️ You must write a question',
    warningLength: '⚠️ The question must be at least 10 characters',
    footer: 'The ancestral cards await you in the shadows...',
    
    // Reading
    welcome: 'Welcome',
    revealCards: 'The ancestral cards will reveal your',
    and: 'and',
    selectCards: 'Select',
    cards: 'Cards',
    shuffleCards: 'Shuffle Cards',
    revealMessage: 'Reveal the Message',
    
    // Auth
    authTagline: 'Enter the realm of ancestral mysteries',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    enterSanctuary: 'Enter the Sanctuary',
    createAccount: 'Create Account',
    forgotPassword: 'Forgot your password?',
    
    // Results
    yourReading: 'Your Tarot Reading',
    yourQuestion: 'Your Question:',
    oracleReading: 'Oracle Reading',
    consulting: 'The oracle is consulting the stars...',
    past: 'Past',
    present: 'Present',
    future: 'Future',
    premiumContent: 'Premium Content',
    unlockFuture: 'Unlock your future with the complete reading',
    unlockButton: 'Unlock Future',
    unlocked: 'Complete Reading Unlocked',
    newReading: 'New Reading',
    wisdom: 'May ancestral wisdom illuminate your path...',
    
    // Card names and meanings
    cardNames: {
      'El Mago': 'The Magician',
      'La Sacerdotisa': 'The High Priestess',
      'La Emperatriz': 'The Empress',
      'El Emperador': 'The Emperor',
      'El Hierofante': 'The Hierophant',
      'Los Enamorados': 'The Lovers',
      'El Carro': 'The Chariot',
      'La Fuerza': 'Strength',
      'El Ermitaño': 'The Hermit',
      'La Rueda de la Fortuna': 'Wheel of Fortune',
      'La Justicia': 'Justice',
      'El Colgado': 'The Hanged Man',
      'La Muerte': 'Death',
      'La Templanza': 'Temperance',
      'El Diablo': 'The Devil',
      'La Torre': 'The Tower',
      'La Estrella': 'The Star',
      'La Luna': 'The Moon',
      'El Sol': 'The Sun',
      'El Juicio': 'Judgement',
      'El Mundo': 'The World',
      'El Loco': 'The Fool',
    } as Record<string, string>,
    cardMeanings: {
      'El Mago': 'Power of manifestation and new beginnings',
      'La Sacerdotisa': 'Intuition and inner wisdom',
      'La Emperatriz': 'Abundance and creativity',
      'El Emperador': 'Authority and structure',
      'El Hierofante': 'Tradition and spiritual education',
      'Los Enamorados': 'Choices and harmonious relationships',
      'El Carro': 'Victory and determination',
      'La Fuerza': 'Courage and inner control',
      'El Ermitaño': 'Introspection and search for truth',
      'La Rueda de la Fortuna': 'Changes and cycles of fate',
      'La Justicia': 'Balance and consequences',
      'El Colgado': 'New perspective and sacrifice',
      'La Muerte': 'Transformation and necessary endings',
      'La Templanza': 'Balance and moderation',
      'El Diablo': 'Liberation from bonds',
      'La Torre': 'Sudden change and revelations',
      'La Estrella': 'Hope and renewal',
      'La Luna': 'Illusions and subconscious',
      'El Sol': 'Success and clarity',
      'El Juicio': 'Rebirth and higher calling',
      'El Mundo': 'Completeness and achievement',
      'El Loco': 'New journeys and spontaneity',
    } as Record<string, string>,
    cardFullReadings: {
      'El Mago': 'The Magician emerges from the ancestral shadows as master of the elements.',
      'La Sacerdotisa': 'The High Priestess guards the mysteries of the veil between worlds.',
      'El Loco': 'The Fool leaps joyfully into the abyss, trusting the universe.',
    } as Record<string, string>,
  },
};
