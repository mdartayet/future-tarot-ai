// Datos predefinidos de cada carta del tarot con su descripción de personalidad

export interface CardPersonality {
  name: string;
  nameEs: string;
  imagePath: string;
  numerology: number;
  color: string;
  colorEs: string;
  personality: {
    es: string;
    en: string;
  };
  traits: {
    es: string[];
    en: string[];
  };
  description: {
    es: string;
    en: string;
  };
}

export const tarotPersonalities: Record<string, CardPersonality> = {
  "el-loco": {
    name: "The Fool",
    nameEs: "El Loco",
    imagePath: "el-loco",
    numerology: 0,
    color: "Yellow/White",
    colorEs: "Amarillo/Blanco",
    personality: {
      es: "Espíritu libre, aventurero e innovador",
      en: "Free spirit, adventurous and innovative"
    },
    traits: {
      es: ["Espontáneo", "Optimista", "Inocente", "Curioso", "Valiente"],
      en: ["Spontaneous", "Optimistic", "Innocent", "Curious", "Brave"]
    },
    description: {
      es: "Tu personalidad refleja la energía pura del inicio. Eres alguien que abraza lo desconocido con valentía y entusiasmo. Tu capacidad para comenzar de nuevo y ver posibilidades donde otros ven obstáculos te hace único. Aunque a veces puedas parecer imprudente, tu fe en el universo y en ti mismo te guía.",
      en: "Your personality reflects the pure energy of beginnings. You embrace the unknown with courage and enthusiasm. Your ability to start fresh and see possibilities where others see obstacles makes you unique. While you may sometimes appear reckless, your faith in the universe and yourself guides you."
    }
  },
  "el-mago": {
    name: "The Magician",
    nameEs: "El Mago",
    imagePath: "el-mago",
    numerology: 1,
    color: "Red/Yellow",
    colorEs: "Rojo/Amarillo",
    personality: {
      es: "Creativo, hábil y manifestador de sueños",
      en: "Creative, skillful and dream manifestor"
    },
    traits: {
      es: ["Carismático", "Hábil", "Creativo", "Comunicativo", "Confiado"],
      en: ["Charismatic", "Skillful", "Creative", "Communicative", "Confident"]
    },
    description: {
      es: "Posees el don de transformar ideas en realidad. Tu personalidad es magnética y tienes la habilidad de usar todos los recursos a tu disposición de manera creativa. Eres un maestro de la comunicación y la manifestación, capaz de hacer que las cosas sucedan.",
      en: "You possess the gift of transforming ideas into reality. Your personality is magnetic and you have the ability to use all resources at your disposal creatively. You are a master of communication and manifestation, capable of making things happen."
    }
  },
  "la-sacerdotisa": {
    name: "The High Priestess",
    nameEs: "La Sacerdotisa",
    imagePath: "la-sacerdotisa",
    numerology: 2,
    color: "Blue/Silver",
    colorEs: "Azul/Plateado",
    personality: {
      es: "Intuitiva, sabia y misteriosa",
      en: "Intuitive, wise and mysterious"
    },
    traits: {
      es: ["Intuitiva", "Sabia", "Reservada", "Espiritual", "Perceptiva"],
      en: ["Intuitive", "Wise", "Reserved", "Spiritual", "Perceptive"]
    },
    description: {
      es: "Tu personalidad está conectada con el mundo invisible. Posees una sabiduría profunda y una intuición excepcional. Eres guardián de secretos y conocimientos ocultos. Tu naturaleza reflexiva y tu capacidad para entender lo no dicho te hacen una persona única.",
      en: "Your personality is connected to the invisible world. You possess deep wisdom and exceptional intuition. You are a keeper of secrets and hidden knowledge. Your reflective nature and ability to understand the unspoken make you unique."
    }
  },
  "la-emperatriz": {
    name: "The Empress",
    nameEs: "La Emperatriz",
    imagePath: "la-emperatriz",
    numerology: 3,
    color: "Green/Pink",
    colorEs: "Verde/Rosa",
    personality: {
      es: "Nurturante, creativa y abundante",
      en: "Nurturing, creative and abundant"
    },
    traits: {
      es: ["Maternal", "Creativa", "Sensual", "Abundante", "Compasiva"],
      en: ["Maternal", "Creative", "Sensual", "Abundant", "Compassionate"]
    },
    description: {
      es: "Tu esencia es pura creatividad y amor. Tienes una habilidad natural para nutrir y hacer crecer todo lo que tocas. Tu personalidad irradia calidez y belleza, y posees una conexión especial con la naturaleza y la creatividad.",
      en: "Your essence is pure creativity and love. You have a natural ability to nurture and grow everything you touch. Your personality radiates warmth and beauty, and you possess a special connection with nature and creativity."
    }
  },
  "el-emperador": {
    name: "The Emperor",
    nameEs: "El Emperador",
    imagePath: "el-emperador",
    numerology: 4,
    color: "Red/Orange",
    colorEs: "Rojo/Naranja",
    personality: {
      es: "Líder, estructurado y protector",
      en: "Leader, structured and protective"
    },
    traits: {
      es: ["Líder", "Disciplinado", "Protector", "Autoritario", "Estable"],
      en: ["Leader", "Disciplined", "Protective", "Authoritative", "Stable"]
    },
    description: {
      es: "Tu personalidad refleja estructura y liderazgo natural. Eres alguien que construye imperios y protege a los suyos. Tu disciplina y capacidad organizativa son excepcionales. Sabes establecer límites y crear orden del caos.",
      en: "Your personality reflects structure and natural leadership. You are someone who builds empires and protects your own. Your discipline and organizational capacity are exceptional. You know how to set boundaries and create order from chaos."
    }
  },
  "el-hierofante": {
    name: "The Hierophant",
    nameEs: "El Hierofante",
    imagePath: "el-hierofante",
    numerology: 5,
    color: "Gold/White",
    colorEs: "Dorado/Blanco",
    personality: {
      es: "Sabio, tradicional y guía espiritual",
      en: "Wise, traditional and spiritual guide"
    },
    traits: {
      es: ["Sabio", "Tradicional", "Maestro", "Ético", "Espiritual"],
      en: ["Wise", "Traditional", "Teacher", "Ethical", "Spiritual"]
    },
    description: {
      es: "Eres un puente entre lo divino y lo terrenal. Tu personalidad busca conocimiento profundo y significado espiritual. Tienes un don para enseñar y guiar a otros en su camino. Valoras la tradición y la sabiduría ancestral.",
      en: "You are a bridge between the divine and the earthly. Your personality seeks deep knowledge and spiritual meaning. You have a gift for teaching and guiding others on their path. You value tradition and ancestral wisdom."
    }
  },
  "los-enamorados": {
    name: "The Lovers",
    nameEs: "Los Enamorados",
    imagePath: "los-enamorados",
    numerology: 6,
    color: "Pink/Purple",
    colorEs: "Rosa/Morado",
    personality: {
      es: "Romántico, decisivo y armonioso",
      en: "Romantic, decisive and harmonious"
    },
    traits: {
      es: ["Romántico", "Decisivo", "Armonioso", "Leal", "Apasionado"],
      en: ["Romantic", "Decisive", "Harmonious", "Loyal", "Passionate"]
    },
    description: {
      es: "Tu personalidad está marcada por la búsqueda de unión y armonía. Eres alguien que valora profundamente las relaciones y las conexiones auténticas. Tienes la habilidad de ver ambos lados de cada situación y tomar decisiones desde el corazón.",
      en: "Your personality is marked by the search for union and harmony. You are someone who deeply values relationships and authentic connections. You have the ability to see both sides of every situation and make decisions from the heart."
    }
  },
  "el-carro": {
    name: "The Chariot",
    nameEs: "El Carro",
    imagePath: "el-carro",
    numerology: 7,
    color: "Blue/Gray",
    colorEs: "Azul/Gris",
    personality: {
      es: "Determinado, victorioso y controlado",
      en: "Determined, victorious and controlled"
    },
    traits: {
      es: ["Determinado", "Victorioso", "Controlado", "Ambicioso", "Enfocado"],
      en: ["Determined", "Victorious", "Controlled", "Ambitious", "Focused"]
    },
    description: {
      es: "Tu personalidad es la de un guerrero conquistador. Posees una voluntad férrea y la capacidad de superar cualquier obstáculo. Sabes mantener el control incluso en situaciones caóticas y avanzas con determinación hacia tus metas.",
      en: "Your personality is that of a conquering warrior. You possess an iron will and the ability to overcome any obstacle. You know how to maintain control even in chaotic situations and move forward with determination towards your goals."
    }
  },
  "la-fuerza": {
    name: "Strength",
    nameEs: "La Fuerza",
    imagePath: "la-fuerza",
    numerology: 8,
    color: "Gold/Red",
    colorEs: "Dorado/Rojo",
    personality: {
      es: "Valiente, compasiva y resiliente",
      en: "Brave, compassionate and resilient"
    },
    traits: {
      es: ["Valiente", "Compasiva", "Resiliente", "Paciente", "Gentil"],
      en: ["Brave", "Compassionate", "Resilient", "Patient", "Gentle"]
    },
    description: {
      es: "Tu fuerza no es bruta sino sutil y compasiva. Tienes la habilidad de domar a las bestias con amor y paciencia. Tu personalidad combina coraje con gentileza, y posees una resistencia extraordinaria ante las adversidades.",
      en: "Your strength is not brute but subtle and compassionate. You have the ability to tame beasts with love and patience. Your personality combines courage with gentleness, and you possess extraordinary resilience in the face of adversity."
    }
  },
  "el-ermitano": {
    name: "The Hermit",
    nameEs: "El Ermitaño",
    imagePath: "el-ermitano",
    numerology: 9,
    color: "Gray/Purple",
    colorEs: "Gris/Morado",
    personality: {
      es: "Introspectivo, sabio y solitario",
      en: "Introspective, wise and solitary"
    },
    traits: {
      es: ["Introspectivo", "Sabio", "Solitario", "Iluminado", "Contemplativo"],
      en: ["Introspective", "Wise", "Solitary", "Enlightened", "Contemplative"]
    },
    description: {
      es: "Tu personalidad busca la verdad en la soledad y la contemplación. Eres alguien que necesita tiempo a solas para recargarse y reflexionar. Posees una luz interior que guía tanto tu camino como el de otros que buscan sabiduría.",
      en: "Your personality seeks truth in solitude and contemplation. You are someone who needs alone time to recharge and reflect. You possess an inner light that guides both your path and that of others seeking wisdom."
    }
  },
  "la-rueda-de-la-fortuna": {
    name: "Wheel of Fortune",
    nameEs: "La Rueda de la Fortuna",
    imagePath: "la-rueda-de-la-fortuna",
    numerology: 10,
    color: "Blue/Gold",
    colorEs: "Azul/Dorado",
    personality: {
      es: "Adaptable, afortunado y cíclico",
      en: "Adaptable, fortunate and cyclical"
    },
    traits: {
      es: ["Adaptable", "Afortunado", "Optimista", "Flexible", "Destinado"],
      en: ["Adaptable", "Fortunate", "Optimistic", "Flexible", "Destined"]
    },
    description: {
      es: "Tu personalidad fluye con los ciclos de la vida. Entiendes que todo cambia y tienes una habilidad especial para adaptarte a las circunstancias. Eres consciente de que la suerte y el destino juegan su papel, y sabes aprovechar las oportunidades.",
      en: "Your personality flows with the cycles of life. You understand that everything changes and have a special ability to adapt to circumstances. You are aware that luck and destiny play their role, and you know how to seize opportunities."
    }
  },
  "la-justicia": {
    name: "Justice",
    nameEs: "La Justicia",
    imagePath: "la-justicia",
    numerology: 11,
    color: "Purple/Red",
    colorEs: "Morado/Rojo",
    personality: {
      es: "Justo, equilibrado y honesto",
      en: "Fair, balanced and honest"
    },
    traits: {
      es: ["Justo", "Equilibrado", "Honesto", "Objetivo", "Íntegro"],
      en: ["Fair", "Balanced", "Honest", "Objective", "Integral"]
    },
    description: {
      es: "Tu personalidad busca el equilibrio y la verdad en todas las cosas. Tienes un fuerte sentido de la justicia y la equidad. Eres alguien en quien se puede confiar para tomar decisiones imparciales y ver todas las perspectivas.",
      en: "Your personality seeks balance and truth in all things. You have a strong sense of justice and fairness. You are someone who can be trusted to make impartial decisions and see all perspectives."
    }
  },
  "el-colgado": {
    name: "The Hanged Man",
    nameEs: "El Colgado",
    imagePath: "el-colgado",
    numerology: 12,
    color: "Blue/Green",
    colorEs: "Azul/Verde",
    personality: {
      es: "Perspicaz, sacrificado y trascendente",
      en: "Insightful, sacrificial and transcendent"
    },
    traits: {
      es: ["Perspicaz", "Sacrificado", "Paciente", "Visionario", "Desapegado"],
      en: ["Insightful", "Sacrificial", "Patient", "Visionary", "Detached"]
    },
    description: {
      es: "Tu personalidad ve el mundo desde una perspectiva única. Estás dispuesto a sacrificar el confort inmediato por una visión mayor. Tienes la habilidad de encontrar paz en la suspensión y ver oportunidades donde otros ven limitaciones.",
      en: "Your personality sees the world from a unique perspective. You are willing to sacrifice immediate comfort for a greater vision. You have the ability to find peace in suspension and see opportunities where others see limitations."
    }
  },
  "la-muerte": {
    name: "Death",
    nameEs: "La Muerte",
    imagePath: "la-muerte",
    numerology: 13,
    color: "Black/White",
    colorEs: "Negro/Blanco",
    personality: {
      es: "Transformador, renovador y profundo",
      en: "Transformative, renewing and profound"
    },
    traits: {
      es: ["Transformador", "Renovador", "Profundo", "Liberador", "Valiente"],
      en: ["Transformative", "Renewing", "Profound", "Liberating", "Brave"]
    },
    description: {
      es: "Tu personalidad abraza el cambio y la transformación. No temes dejar ir lo viejo para dar paso a lo nuevo. Posees una comprensión profunda de los ciclos de la vida y la muerte, y ayudas a otros a atravesar sus propias transformaciones.",
      en: "Your personality embraces change and transformation. You don't fear letting go of the old to make way for the new. You possess a deep understanding of life and death cycles, and help others through their own transformations."
    }
  },
  "la-templanza": {
    name: "Temperance",
    nameEs: "La Templanza",
    imagePath: "la-templanza",
    numerology: 14,
    color: "Blue/Orange",
    colorEs: "Azul/Naranja",
    personality: {
      es: "Equilibrado, moderado y sanador",
      en: "Balanced, moderate and healing"
    },
    traits: {
      es: ["Equilibrado", "Moderado", "Sanador", "Paciente", "Armonioso"],
      en: ["Balanced", "Moderate", "Healing", "Patient", "Harmonious"]
    },
    description: {
      es: "Tu personalidad es el arte del balance perfecto. Sabes mezclar opuestos para crear algo nuevo y mejor. Tienes un don sanador y la paciencia necesaria para lograr cambios graduales pero significativos.",
      en: "Your personality is the art of perfect balance. You know how to mix opposites to create something new and better. You have a healing gift and the patience necessary to achieve gradual but significant changes."
    }
  },
  "el-diablo": {
    name: "The Devil",
    nameEs: "El Diablo",
    imagePath: "el-diablo",
    numerology: 15,
    color: "Red/Black",
    colorEs: "Rojo/Negro",
    personality: {
      es: "Apasionado, intenso y liberador",
      en: "Passionate, intense and liberating"
    },
    traits: {
      es: ["Apasionado", "Intenso", "Material", "Tentador", "Magnético"],
      en: ["Passionate", "Intense", "Material", "Tempting", "Magnetic"]
    },
    description: {
      es: "Tu personalidad es intensa y magnética. Entiendes el poder de los deseos y las pasiones materiales. Aunque puedas ser tentador, también tienes el poder de liberarte y liberar a otros de las cadenas autoimpuestas.",
      en: "Your personality is intense and magnetic. You understand the power of desires and material passions. While you may be tempting, you also have the power to free yourself and others from self-imposed chains."
    }
  },
  "la-torre": {
    name: "The Tower",
    nameEs: "La Torre",
    imagePath: "la-torre",
    numerology: 16,
    color: "Gray/Red",
    colorEs: "Gris/Rojo",
    personality: {
      es: "Disruptivo, revelador y catalizador",
      en: "Disruptive, revealing and catalyzing"
    },
    traits: {
      es: ["Disruptivo", "Revelador", "Catalizador", "Honesto", "Revolucionario"],
      en: ["Disruptive", "Revealing", "Catalyzing", "Honest", "Revolutionary"]
    },
    description: {
      es: "Tu personalidad es un agente de cambio súbito. No tienes miedo de derribar estructuras falsas para revelar la verdad. Eres catalizador de transformaciones necesarias, aunque a veces dolorosas. Tu honestidad es absoluta.",
      en: "Your personality is an agent of sudden change. You are not afraid to tear down false structures to reveal the truth. You are a catalyst for necessary transformations, though sometimes painful. Your honesty is absolute."
    }
  },
  "la-estrella": {
    name: "The Star",
    nameEs: "La Estrella",
    imagePath: "la-estrella",
    numerology: 17,
    color: "Blue/Silver",
    colorEs: "Azul/Plateado",
    personality: {
      es: "Esperanzador, inspirador y renovador",
      en: "Hopeful, inspiring and renewing"
    },
    traits: {
      es: ["Esperanzador", "Inspirador", "Renovador", "Soñador", "Luminoso"],
      en: ["Hopeful", "Inspiring", "Renewing", "Dreamer", "Luminous"]
    },
    description: {
      es: "Tu personalidad es un faro de esperanza y renovación. Después de la tormenta, tú eres la luz que guía. Tienes la habilidad de inspirar a otros y mantener viva la fe en un futuro mejor. Eres un soñador que hace realidad sus visiones.",
      en: "Your personality is a beacon of hope and renewal. After the storm, you are the guiding light. You have the ability to inspire others and keep faith alive in a better future. You are a dreamer who makes your visions reality."
    }
  },
  "la-luna": {
    name: "The Moon",
    nameEs: "La Luna",
    imagePath: "la-luna",
    numerology: 18,
    color: "Silver/Purple",
    colorEs: "Plateado/Morado",
    personality: {
      es: "Intuitivo, misterioso y profundo",
      en: "Intuitive, mysterious and profound"
    },
    traits: {
      es: ["Intuitivo", "Misterioso", "Soñador", "Psíquico", "Emocional"],
      en: ["Intuitive", "Mysterious", "Dreamer", "Psychic", "Emotional"]
    },
    description: {
      es: "Tu personalidad navega las aguas profundas del inconsciente. Posees una conexión especial con el mundo de los sueños y la intuición. Eres misterioso y tienes acceso a verdades ocultas que otros no pueden ver.",
      en: "Your personality navigates the deep waters of the unconscious. You possess a special connection with the world of dreams and intuition. You are mysterious and have access to hidden truths that others cannot see."
    }
  },
  "el-sol": {
    name: "The Sun",
    nameEs: "El Sol",
    imagePath: "el-sol",
    numerology: 19,
    color: "Yellow/Gold",
    colorEs: "Amarillo/Dorado",
    personality: {
      es: "Radiante, exitoso y vital",
      en: "Radiant, successful and vital"
    },
    traits: {
      es: ["Radiante", "Exitoso", "Vital", "Optimista", "Alegre"],
      en: ["Radiant", "Successful", "Vital", "Optimistic", "Joyful"]
    },
    description: {
      es: "Tu personalidad brilla con luz propia. Eres fuente de energía, alegría y vitalidad para quienes te rodean. El éxito te sigue naturalmente y tienes una actitud positiva que ilumina incluso los días más oscuros.",
      en: "Your personality shines with its own light. You are a source of energy, joy and vitality for those around you. Success follows you naturally and you have a positive attitude that illuminates even the darkest days."
    }
  },
  "el-juicio": {
    name: "Judgement",
    nameEs: "El Juicio",
    imagePath: "el-juicio",
    numerology: 20,
    color: "Purple/White",
    colorEs: "Morado/Blanco",
    personality: {
      es: "Renacido, llamado y transformado",
      en: "Reborn, called and transformed"
    },
    traits: {
      es: ["Renacido", "Llamado", "Transformado", "Perdonador", "Ascendente"],
      en: ["Reborn", "Called", "Transformed", "Forgiving", "Ascending"]
    },
    description: {
      es: "Tu personalidad ha atravesado un despertar profundo. Escuchas tu llamado superior y tienes la capacidad de renacer de tus cenizas. Posees el don del perdón y ayudas a otros en su proceso de transformación espiritual.",
      en: "Your personality has gone through a deep awakening. You hear your higher calling and have the ability to rise from your ashes. You possess the gift of forgiveness and help others in their spiritual transformation process."
    }
  },
  "el-mundo": {
    name: "The World",
    nameEs: "El Mundo",
    imagePath: "el-mundo",
    numerology: 21,
    color: "Purple/Green",
    colorEs: "Morado/Verde",
    personality: {
      es: "Completo, logrado y armonioso",
      en: "Complete, accomplished and harmonious"
    },
    traits: {
      es: ["Completo", "Logrado", "Armonioso", "Integrado", "Universal"],
      en: ["Complete", "Accomplished", "Harmonious", "Integrated", "Universal"]
    },
    description: {
      es: "Tu personalidad ha alcanzado un estado de completitud y maestría. Has integrado todas las lecciones de la vida y ahora danzas en armonía con el universo. Eres ciudadano del mundo y entiendes la unidad de todas las cosas.",
      en: "Your personality has reached a state of completeness and mastery. You have integrated all of life's lessons and now dance in harmony with the universe. You are a citizen of the world and understand the unity of all things."
    }
  }
};

export interface Question {
  id: number;
  question: {
    es: string;
    en: string;
  };
  options: Array<{
    text: {
      es: string;
      en: string;
    };
    scores: Record<string, number>;
  }>;
}

export const personalityQuestions: Question[] = [
  {
    id: 1,
    question: {
      es: "¿Cómo enfrentas los nuevos comienzos?",
      en: "How do you face new beginnings?"
    },
    options: [
      {
        text: { es: "Con entusiasmo y sin miedo", en: "With enthusiasm and no fear" },
        scores: { "el-loco": 3, "el-mago": 2, "el-sol": 1 }
      },
      {
        text: { es: "Con planificación cuidadosa", en: "With careful planning" },
        scores: { "el-emperador": 3, "el-hierofante": 2, "la-justicia": 1 }
      },
      {
        text: { es: "Escuchando mi intuición", en: "Listening to my intuition" },
        scores: { "la-sacerdotisa": 3, "la-luna": 2, "el-ermitano": 1 }
      },
      {
        text: { es: "Con creatividad y optimismo", en: "With creativity and optimism" },
        scores: { "la-emperatriz": 3, "la-estrella": 2, "el-mago": 1 }
      }
    ]
  },
  {
    id: 2,
    question: {
      es: "¿Qué te motiva más en la vida?",
      en: "What motivates you most in life?"
    },
    options: [
      {
        text: { es: "El éxito y el reconocimiento", en: "Success and recognition" },
        scores: { "el-sol": 3, "el-carro": 2, "el-mundo": 1 }
      },
      {
        text: { es: "El conocimiento y la sabiduría", en: "Knowledge and wisdom" },
        scores: { "el-hierofante": 3, "el-ermitano": 2, "la-sacerdotisa": 1 }
      },
      {
        text: { es: "Las relaciones y el amor", en: "Relationships and love" },
        scores: { "los-enamorados": 3, "la-emperatriz": 2, "la-estrella": 1 }
      },
      {
        text: { es: "La transformación personal", en: "Personal transformation" },
        scores: { "la-muerte": 3, "el-juicio": 2, "la-torre": 1 }
      }
    ]
  },
  {
    id: 3,
    question: {
      es: "Ante un obstáculo difícil, tú:",
      en: "Facing a difficult obstacle, you:"
    },
    options: [
      {
        text: { es: "Lo enfrentas con determinación", en: "Face it with determination" },
        scores: { "el-carro": 3, "la-fuerza": 2, "el-emperador": 1 }
      },
      {
        text: { es: "Buscas una perspectiva diferente", en: "Look for a different perspective" },
        scores: { "el-colgado": 3, "la-luna": 2, "el-loco": 1 }
      },
      {
        text: { es: "Lo aceptas como parte del cambio", en: "Accept it as part of change" },
        scores: { "la-rueda-de-la-fortuna": 3, "la-muerte": 2, "la-templanza": 1 }
      },
      {
        text: { es: "Lo destruyes para reconstruir", en: "Destroy it to rebuild" },
        scores: { "la-torre": 3, "la-muerte": 2, "el-juicio": 1 }
      }
    ]
  },
  {
    id: 4,
    question: {
      es: "¿Cómo describirías tu energía?",
      en: "How would you describe your energy?"
    },
    options: [
      {
        text: { es: "Radiante y vital", en: "Radiant and vital" },
        scores: { "el-sol": 3, "la-estrella": 2, "la-emperatriz": 1 }
      },
      {
        text: { es: "Intensa y magnética", en: "Intense and magnetic" },
        scores: { "el-diablo": 3, "la-fuerza": 2, "el-mago": 1 }
      },
      {
        text: { es: "Tranquila y profunda", en: "Calm and deep" },
        scores: { "la-sacerdotisa": 3, "el-ermitano": 2, "la-luna": 1 }
      },
      {
        text: { es: "Equilibrada y armoniosa", en: "Balanced and harmonious" },
        scores: { "la-templanza": 3, "la-justicia": 2, "el-mundo": 1 }
      }
    ]
  },
  {
    id: 5,
    question: {
      es: "Tu mayor don es:",
      en: "Your greatest gift is:"
    },
    options: [
      {
        text: { es: "Crear y manifestar", en: "Creating and manifesting" },
        scores: { "el-mago": 3, "la-emperatriz": 2, "el-sol": 1 }
      },
      {
        text: { es: "Liderar y organizar", en: "Leading and organizing" },
        scores: { "el-emperador": 3, "el-carro": 2, "la-justicia": 1 }
      },
      {
        text: { es: "Comprender lo oculto", en: "Understanding the hidden" },
        scores: { "la-sacerdotisa": 3, "la-luna": 2, "el-ermitano": 1 }
      },
      {
        text: { es: "Transformar y renovar", en: "Transforming and renewing" },
        scores: { "la-muerte": 3, "la-torre": 2, "el-juicio": 1 }
      }
    ]
  },
  {
    id: 6,
    question: {
      es: "¿Qué prefieres en tu tiempo libre?",
      en: "What do you prefer in your free time?"
    },
    options: [
      {
        text: { es: "Aventuras y nuevas experiencias", en: "Adventures and new experiences" },
        scores: { "el-loco": 3, "el-carro": 2, "la-rueda-de-la-fortuna": 1 }
      },
      {
        text: { es: "Reflexión y soledad", en: "Reflection and solitude" },
        scores: { "el-ermitano": 3, "el-colgado": 2, "la-sacerdotisa": 1 }
      },
      {
        text: { es: "Estar con seres queridos", en: "Being with loved ones" },
        scores: { "los-enamorados": 3, "la-emperatriz": 2, "el-sol": 1 }
      },
      {
        text: { es: "Crear o construir algo", en: "Creating or building something" },
        scores: { "el-mago": 3, "la-emperatriz": 2, "el-emperador": 1 }
      }
    ]
  },
  {
    id: 7,
    question: {
      es: "Tu mayor desafío es:",
      en: "Your greatest challenge is:"
    },
    options: [
      {
        text: { es: "Mantener el control", en: "Maintaining control" },
        scores: { "el-emperador": 3, "el-carro": 2, "la-fuerza": 1 }
      },
      {
        text: { es: "Equilibrar opuestos", en: "Balancing opposites" },
        scores: { "la-templanza": 3, "la-justicia": 2, "los-enamorados": 1 }
      },
      {
        text: { es: "Dejar ir el pasado", en: "Letting go of the past" },
        scores: { "la-muerte": 3, "el-colgado": 2, "la-torre": 1 }
      },
      {
        text: { es: "Confiar en lo desconocido", en: "Trusting the unknown" },
        scores: { "el-loco": 3, "la-luna": 2, "la-rueda-de-la-fortuna": 1 }
      }
    ]
  },
  {
    id: 8,
    question: {
      es: "Las personas te ven como:",
      en: "People see you as:"
    },
    options: [
      {
        text: { es: "Una fuente de luz y alegría", en: "A source of light and joy" },
        scores: { "el-sol": 3, "la-estrella": 2, "la-emperatriz": 1 }
      },
      {
        text: { es: "Un misterio fascinante", en: "A fascinating mystery" },
        scores: { "la-sacerdotisa": 3, "la-luna": 2, "el-ermitano": 1 }
      },
      {
        text: { es: "Un líder confiable", en: "A reliable leader" },
        scores: { "el-emperador": 3, "el-hierofante": 2, "la-justicia": 1 }
      },
      {
        text: { es: "Un agente de cambio", en: "An agent of change" },
        scores: { "la-torre": 3, "la-muerte": 2, "el-juicio": 1 }
      }
    ]
  },
  {
    id: 9,
    question: {
      es: "Tu forma de amar es:",
      en: "Your way of loving is:"
    },
    options: [
      {
        text: { es: "Apasionada e intensa", en: "Passionate and intense" },
        scores: { "el-diablo": 3, "los-enamorados": 2, "la-fuerza": 1 }
      },
      {
        text: { es: "Nutriente y protectora", en: "Nurturing and protective" },
        scores: { "la-emperatriz": 3, "el-emperador": 2, "la-fuerza": 1 }
      },
      {
        text: { es: "Espiritual y profunda", en: "Spiritual and deep" },
        scores: { "los-enamorados": 3, "la-sacerdotisa": 2, "el-hierofante": 1 }
      },
      {
        text: { es: "Libre y sin ataduras", en: "Free and without ties" },
        scores: { "el-loco": 3, "la-estrella": 2, "el-mundo": 1 }
      }
    ]
  },
  {
    id: 10,
    question: {
      es: "Tu visión del futuro es:",
      en: "Your vision of the future is:"
    },
    options: [
      {
        text: { es: "Llena de esperanza y renovación", en: "Full of hope and renewal" },
        scores: { "la-estrella": 3, "el-sol": 2, "el-juicio": 1 }
      },
      {
        text: { es: "Un ciclo de cambio constante", en: "A cycle of constant change" },
        scores: { "la-rueda-de-la-fortuna": 3, "la-muerte": 2, "el-mundo": 1 }
      },
      {
        text: { es: "Algo que puedo controlar", en: "Something I can control" },
        scores: { "el-mago": 3, "el-emperador": 2, "el-carro": 1 }
      },
      {
        text: { es: "Un misterio por descubrir", en: "A mystery to discover" },
        scores: { "la-luna": 3, "el-colgado": 2, "el-ermitano": 1 }
      }
    ]
  }
];
