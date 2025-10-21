import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'es' | 'en';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Detect browser language
const getBrowserLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('es') ? 'es' : 'en';
};

export const useLanguage = create<LanguageStore>()(
  persist(
    (set) => ({
      language: getBrowserLanguage(),
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
    agreeToTerms: 'Acepto los',
    termsOfService: 'Términos de Servicio',
    privacyPolicy: 'Política de Privacidad',
    mustAcceptTerms: 'Debes aceptar los términos y la política de privacidad',
    
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
    
    // Card names and meanings - AHORA USANDO LOS NOMBRES DE ARCHIVO
    cardNames: {
      'el-loco': 'El Loco',
      'el-mago': 'El Mago',
      'la-sacerdotisa': 'La Sacerdotisa',
      'la-emperatriz': 'La Emperatriz',
      'el-emperador': 'El Emperador',
      'el-hierofante': 'El Hierofante',
      'los-enamorados': 'Los Enamorados',
      'el-carro': 'El Carro',
      'la-fuerza': 'La Fuerza',
      'el-ermitano': 'El Ermitaño',
      'la-rueda-de-la-fortuna': 'La Rueda de la Fortuna',
      'la-justicia': 'La Justicia',
      'el-colgado': 'El Colgado',
      'la-muerte': 'La Muerte',
      'la-templanza': 'La Templanza',
      'el-diablo': 'El Diablo',
      'la-torre': 'La Torre',
      'la-estrella': 'La Estrella',
      'la-luna': 'La Luna',
      'el-sol': 'El Sol',
      'el-juicio': 'El Juicio',
      'el-mundo': 'El Mundo',
    } as Record<string, string>,
    
    cardMeanings: {
      'el-loco': 'Nuevos viajes y espontaneidad',
      'el-mago': 'Poder de manifestación y nuevos comienzos',
      'la-sacerdotisa': 'Intuición y sabiduría interior',
      'la-emperatriz': 'Abundancia y creatividad',
      'el-emperador': 'Autoridad y estructura',
      'el-hierofante': 'Tradición y educación espiritual',
      'los-enamorados': 'Elecciones y relaciones armónicas',
      'el-carro': 'Victoria y determinación',
      'la-fuerza': 'Coraje y control interno',
      'el-ermitano': 'Introspección y búsqueda de verdad',
      'la-rueda-de-la-fortuna': 'Cambios y ciclos del destino',
      'la-justicia': 'Equilibrio y consecuencias',
      'el-colgado': 'Nueva perspectiva y sacrificio',
      'la-muerte': 'Transformación y finales necesarios',
      'la-templanza': 'Balance y moderación',
      'el-diablo': 'Liberación de ataduras',
      'la-torre': 'Cambio súbito y revelaciones',
      'la-estrella': 'Esperanza y renovación',
      'la-luna': 'Ilusiones y subconsciente',
      'el-sol': 'Éxito y claridad',
      'el-juicio': 'Renacimiento y llamado superior',
      'el-mundo': 'Completitud y logro',
    } as Record<string, string>,
    
    cardFullReadings: {
      'el-loco': 'El Loco salta alegremente al abismo, confiando en que el universo extenderá alas invisibles bajo sus pies. Representa el comienzo del viaje del alma, sin ataduras del pasado ni miedos del futuro, solo la pura confianza en el destino.',
      'el-mago': 'El Mago emerge de las sombras ancestrales como el maestro de los elementos y arquitecto de realidades. Con una mano hacia el cielo y otra hacia la tierra, canaliza las fuerzas cósmicas para manifestar sus deseos en el plano material.',
      'la-sacerdotisa': 'La Sacerdotisa guarda los misterios del velo entre mundos. Sentada entre los pilares de luz y oscuridad, te invita a confiar en tu intuición y descubrir las verdades ocultas que solo el silencio puede revelar.',
      'la-emperatriz': 'La Emperatriz reina sobre los jardines de la abundancia, donde la creatividad florece en cada pétalo. Madre de la manifestación, te recuerda que eres co-creador de tu realidad y que la vida fluye a través de ti como un río dorado.',
      'el-emperador': 'El Emperador se sienta en su trono de montaña, firme como la piedra eterna. Representa la autoridad que nace de la disciplina y la estructura que permite que tus sueños encuentren forma en el mundo material.',
      'el-hierofante': 'El Hierofante custodia las enseñanzas sagradas y las tradiciones ancestrales. Puente entre lo divino y lo terrenal, te muestra que la sabiduría verdadera se encuentra en honrar tanto las lecciones del pasado como la voz de tu espíritu.',
      'los-enamorados': 'Los Enamorados te presentan la encrucijada del corazón. Bajo la bendición angelical, debes elegir entre caminos que definirán tu alma. Recuerda que cada elección es un acto de amor hacia ti mismo y el universo.',
      'el-carro': 'El Carro avanza triunfante, guiado por la voluntad inquebrantable de quien ha dominado las fuerzas opuestas dentro de sí. Tu determinación es el timón que dirige tu destino hacia la victoria que ya es tuya.',
      'la-fuerza': 'La Fuerza no ruge con violencia, sino que susurra con compasión. La doncella que acaricia al león te enseña que el verdadero poder reside en la dulzura, el coraje del corazón y la maestría sobre tus instintos más salvajes.',
      'el-ermitano': 'El Ermitaño asciende la montaña solitaria, llevando su lámpara de verdad en la oscuridad. En el silencio sagrado de la introspección, descubrirás las respuestas que el ruido del mundo nunca podría revelar.',
      'la-rueda-de-la-fortuna': 'La Rueda de la Fortuna gira incesante, elevando a unos y desafiando a otros. Los espíritus del cambio te recuerdan que nada es permanente excepto la transformación misma. Acepta los ciclos con gracia y sabiduría.',
      'la-justicia': 'La Justicia sostiene la espada de la verdad y la balanza del equilibrio. Cada acción ha sembrado una semilla, cada pensamiento ha tejido un hilo en el tapiz de tu destino. Ahora, la cosecha de tus elecciones se revela.',
      'el-colgado': 'El Colgado pende sereno del árbol cósmico, viendo el mundo desde una nueva perspectiva. En su sacrificio voluntario descubre que soltar el control es la máxima libertad, y que en la pausa existe una sabiduría que la acción nunca conoció.',
      'la-muerte': 'La Muerte cabalga en el crepúsculo, no como final sino como transformación. Las hojas caen para que broten nuevas, el sol se oculta para renacer glorioso. Abraza el final de lo que fue, pues solo así puede nacer lo que será.',
      'la-templanza': 'La Templanza vierte las aguas entre los cálices celeste y terrenal, creando la alquimia perfecta del equilibrio. Te enseña que la paz verdadera se encuentra en la armonía de los opuestos, en el punto medio donde habita la gracia.',
      'el-diablo': 'El Diablo te muestra las cadenas que tú mismo has forjado. Pero observa: son tan frágiles que podrías romperlas con un pensamiento. Te invita a liberarte de las ataduras del ego, los miedos y los deseos que te aprisionan.',
      'la-torre': 'La Torre se derrumba bajo el rayo divino, destruyendo las ilusiones construidas sobre cimientos falsos. En el caos aparente late una bendición: solo cuando se desmorona lo que no sirve, puede emerger tu verdad más auténtica.',
      'la-estrella': 'La Estrella brilla radiante en el cielo nocturno del alma, faro de esperanza después de las tormentas más oscuras. Las diosas celestiales vierten aguas de sanación sobre tu espíritu cansado, renovando tu fe en la bondad fundamental del universo.',
      'la-luna': 'La Luna refleja sus misterios plateados sobre las aguas del subconsciente. En su luz ilusoria, los espíritus te revelan que después del caos viene la claridad, después de la noche la aurora radiante. Confía en tu intuición para navegar las sombras.',
      'el-sol': 'El Sol emerge glorioso disipando todas las sombras, irradiando vitalidad, éxito y alegría pura en cada rayo dorado. Los dioses solares te bendicen con claridad mental absoluta, energía vital desbordante y la confianza radiante de quien conoce su verdadero valor.',
      'el-juicio': 'El Juicio suena su trompeta celestial, llamándote a tu renacimiento espiritual. Los ancestros te invitan a elevarte desde las cenizas de quien fuiste, respondiendo al llamado superior de tu alma y abrazando tu propósito divino.',
      'el-mundo': 'El Mundo danza en el centro del cosmos, celebrando la completitud de tu viaje. Has cerrado el círculo sagrado, integrando todas las lecciones. Ahora, envuelto en la corona de laureles del logro, estás listo para un nuevo ciclo en una espiral más elevada.',
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
    agreeToTerms: 'I agree to the',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    mustAcceptTerms: 'You must accept the terms and privacy policy',
    
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
    
    // Card names and meanings - USANDO NOMBRES DE ARCHIVO CON TRADUCCIONES EN INGLÉS
    cardNames: {
      'el-loco': 'The Fool',
      'el-mago': 'The Magician',
      'la-sacerdotisa': 'The High Priestess',
      'la-emperatriz': 'The Empress',
      'el-emperador': 'The Emperor',
      'el-hierofante': 'The Hierophant',
      'los-enamorados': 'The Lovers',
      'el-carro': 'The Chariot',
      'la-fuerza': 'Strength',
      'el-ermitano': 'The Hermit',
      'la-rueda-de-la-fortuna': 'Wheel of Fortune',
      'la-justicia': 'Justice',
      'el-colgado': 'The Hanged Man',
      'la-muerte': 'Death',
      'la-templanza': 'Temperance',
      'el-diablo': 'The Devil',
      'la-torre': 'The Tower',
      'la-estrella': 'The Star',
      'la-luna': 'The Moon',
      'el-sol': 'The Sun',
      'el-juicio': 'Judgement',
      'el-mundo': 'The World',
    } as Record<string, string>,
    
    cardMeanings: {
      'el-loco': 'New journeys and spontaneity',
      'el-mago': 'Power of manifestation and new beginnings',
      'la-sacerdotisa': 'Intuition and inner wisdom',
      'la-emperatriz': 'Abundance and creativity',
      'el-emperador': 'Authority and structure',
      'el-hierofante': 'Tradition and spiritual education',
      'los-enamorados': 'Choices and harmonious relationships',
      'el-carro': 'Victory and determination',
      'la-fuerza': 'Courage and inner control',
      'el-ermitano': 'Introspection and search for truth',
      'la-rueda-de-la-fortuna': 'Changes and cycles of fate',
      'la-justicia': 'Balance and consequences',
      'el-colgado': 'New perspective and sacrifice',
      'la-muerte': 'Transformation and necessary endings',
      'la-templanza': 'Balance and moderation',
      'el-diablo': 'Liberation from bonds',
      'la-torre': 'Sudden change and revelations',
      'la-estrella': 'Hope and renewal',
      'la-luna': 'Illusions and subconscious',
      'el-sol': 'Success and clarity',
      'el-juicio': 'Rebirth and higher calling',
      'el-mundo': 'Completeness and achievement',
    } as Record<string, string>,
    
    cardFullReadings: {
      'el-loco': 'The Fool leaps joyfully into the abyss, trusting that the universe will extend invisible wings beneath their feet. They represent the beginning of the soul\'s journey, unburdened by the past or fears of the future, only pure trust in destiny.',
      'el-mago': 'The Magician emerges from the ancestral shadows as master of the elements and architect of realities. With one hand toward the heavens and another toward the earth, they channel cosmic forces to manifest desires in the material plane.',
      'la-sacerdotisa': 'The High Priestess guards the mysteries of the veil between worlds. Seated between the pillars of light and darkness, she invites you to trust your intuition and discover the hidden truths that only silence can reveal.',
      'la-emperatriz': 'The Empress reigns over gardens of abundance where creativity blooms in every petal. Mother of manifestation, she reminds you that you are co-creator of your reality and that life flows through you like a golden river.',
      'el-emperador': 'The Emperor sits upon his mountain throne, firm as eternal stone. He represents the authority born of discipline and the structure that allows your dreams to find form in the material world.',
      'el-hierofante': 'The Hierophant guards sacred teachings and ancestral traditions. Bridge between the divine and the earthly, he shows you that true wisdom is found in honoring both the lessons of the past and the voice of your spirit.',
      'los-enamorados': 'The Lovers present you with the crossroads of the heart. Under angelic blessing, you must choose between paths that will define your soul. Remember that every choice is an act of love toward yourself and the universe.',
      'el-carro': 'The Chariot advances triumphant, guided by the unwavering will of one who has mastered the opposing forces within. Your determination is the helm steering your destiny toward the victory that is already yours.',
      'la-fuerza': 'Strength does not roar with violence, but whispers with compassion. The maiden who caresses the lion teaches you that true power resides in gentleness, courage of the heart, and mastery over your wildest instincts.',
      'el-ermitano': 'The Hermit ascends the solitary mountain, carrying his lamp of truth in the darkness. In the sacred silence of introspection, you will discover answers that the noise of the world could never reveal.',
      'la-rueda-de-la-fortuna': 'The Wheel of Fortune spins ceaselessly, elevating some and challenging others. The spirits of change remind you that nothing is permanent except transformation itself. Accept the cycles with grace and wisdom.',
      'la-justicia': 'Justice holds the sword of truth and the scales of balance. Every action has planted a seed, every thought has woven a thread in the tapestry of your destiny. Now, the harvest of your choices is revealed.',
      'el-colgado': 'The Hanged Man hangs serene from the cosmic tree, seeing the world from a new perspective. In his voluntary sacrifice, he discovers that releasing control is the ultimate freedom, and that in stillness exists a wisdom that action never knew.',
      'la-muerte': 'Death rides in the twilight, not as an ending but as transformation. Leaves fall so new ones may sprout, the sun sets to be reborn glorious. Embrace the end of what was, for only then can what will be emerge.',
      'la-templanza': 'Temperance pours waters between celestial and earthly chalices, creating the perfect alchemy of balance. She teaches you that true peace is found in the harmony of opposites, in the middle point where grace dwells.',
      'el-diablo': 'The Devil shows you the chains you yourself have forged. But observe: they are so fragile you could break them with a thought. He invites you to free yourself from the bonds of ego, fears, and desires that imprison you.',
      'la-torre': 'The Tower crumbles under the divine lightning bolt, destroying illusions built on false foundations. In the apparent chaos pulses a blessing: only when what doesn\'t serve collapses can your most authentic truth emerge.',
      'la-estrella': 'The Star shines radiant in the night sky of the soul, beacon of hope after the darkest storms. Celestial goddesses pour healing waters upon your weary spirit, renewing your faith in the fundamental goodness of the universe.',
      'la-luna': 'The Moon reflects its silvery mysteries upon the waters of the subconscious. In its illusory light, spirits reveal to you that after chaos comes clarity, after night the radiant dawn. Trust your intuition to navigate the shadows.',
      'el-sol': 'The Sun emerges glorious, dispelling all shadows, radiating vitality, success, and pure joy in every golden ray. Solar deities bless you with absolute mental clarity, overflowing vital energy, and the radiant confidence of one who knows their true worth.',
      'el-juicio': 'Judgement sounds its celestial trumpet, calling you to your spiritual rebirth. The ancestors invite you to rise from the ashes of who you were, answering the higher calling of your soul and embracing your divine purpose.',
      'el-mundo': 'The World dances at the center of the cosmos, celebrating the completeness of your journey. You have closed the sacred circle, integrating all lessons. Now, wrapped in the laurel crown of achievement, you are ready for a new cycle on a higher spiral.',
    } as Record<string, string>,
  },
};
