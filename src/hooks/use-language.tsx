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
  },
};
