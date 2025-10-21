import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Shuffle } from "lucide-react";
import CaveBackground from "@/components/CaveBackground";
import LanguageToggle from "@/components/LanguageToggle";
import TarotCard from "@/components/TarotCard";
import AdSense from "@/components/AdSense";
import { useLanguage, translations } from "@/hooks/use-language";
import { supabase } from "@/integrations/supabase/client";

const TAROT_CARDS = [
  { 
    id: 1, 
    name: "el-mago", 
    meaning: "Poder de manifestación y nuevos comienzos",
    fullReading: "El Mago emerge de las sombras ancestrales como el maestro de los elementos y arquitecto de realidades. En tu vida, esta carta anuncia un periodo de poder creativo sin precedentes. Los espíritus te revelan que posees todas las herramientas necesarias para manifestar tus deseos más profundos. La energía mágica fluye a través de ti como ríos de luz dorada, conectando el plano físico con el etéreo. Los antiguos susurran que este es el momento de tomar acción decidida, de canalizar tu voluntad con precisión de alquimista. Las estrellas se alinean para que transformes pensamientos en materia, sueños en realidad tangible."
  },
  { 
    id: 2, 
    name: "la-sacerdotisa", 
    meaning: "Intuición y sabiduría interior",
    fullReading: "La Sacerdotisa guarda los misterios del velo entre mundos, custodia de secretos milenarios y guardiana del conocimiento oculto. Las voces ancestrales revelan que tu intuición está alcanzando niveles de clarividencia que incluso los antiguos oráculos envidiarian. Más allá de las apariencias superficiales, tus dones psíquicos se despiertan como flores nocturnas bajo la luna llena. Los espíritus te instan a confiar en esos susurros internos, en esas corazonadas que llegan en el silencio de la noche. Tu subconsciente es un pozo profundo de sabiduría ancestral, y las aguas místicas están listas para ser exploradas. Medita, escucha, y los secretos del universo se revelarán ante ti."
  },
  { 
    id: 3, 
    name: "la-emperatriz", 
    meaning: "Abundancia y creatividad",
    fullReading: "La Emperatriz, madre de toda creación, diosa de la fertilidad cósmica, extiende su manto de bendiciones sobre tu existencia. Los espíritus antiguos proclaman la llegada de una era de abundancia que fluirá como ríos de miel dorada. Tu energía creativa está en su apogeo, lista para dar nacimiento a proyectos, relaciones y oportunidades que florecerán como jardines celestiales. La naturaleza misma conspira a tu favor, tejiendo hilos de prosperidad en el tapiz de tu destino. Las fuerzas primordiales te llaman a nutrir tus sueños con amor maternal, a cultivar la belleza y el placer en cada aspecto de tu vida. La cosecha será abundante para aquellos que siembren con fe y rieguen con dedicación."
  },
  { 
    id: 4, 
    name: "el-emperador", 
    meaning: "Autoridad y estructura",
    fullReading: "El Emperador se alza como montaña eterna, pilar de orden en el caos del cosmos. Los guardianes ancestrales te confieren el cetro del poder estructural y la corona de la autoridad legítima. Ha llegado el momento de establecer límites sagrados, de construir imperios sobre cimientos de disciplina y estrategia. Tu capacidad de liderazgo brilla con la intensidad de mil soles, y las esferas celestiales reconocen tu derecho a gobernar tu propio destino. Los espíritus te revelan que la verdadera fortaleza no reside en la rigidez, sino en la capacidad de crear sistemas que perduren a través de las eras. Asume tu trono con sabiduría, lidera con justicia, y tu legado resonará por generaciones."
  },
  { 
    id: 5, 
    name: "el-hierofante", 
    meaning: "Tradición y educación espiritual",
    fullReading: "El Hierofante, puente entre lo divino y lo mortal, porta las llaves de los misterios sagrados transmitidos desde tiempos inmemoriales. Los maestros ancestrales te llaman a explorar las enseñanzas tradicionales, a beber de los pozos de sabiduría que han nutrido a civilizaciones enteras. Este es un periodo de aprendizaje profundo, donde las lecciones del pasado iluminarán el camino hacia el futuro. Los espíritus revelan que un mentor espiritual o una institución sagrada jugará un papel crucial en tu evolución. Acepta las ceremonias, honra los rituales, pues en las prácticas antiguas yace el poder de transformación que buscas. La tradición y la innovación danzan juntas en tu sendero místico."
  },
  { 
    id: 6, 
    name: "los-enamorados", 
    meaning: "Elecciones y relaciones armónicas",
    fullReading: "Los Enamorados emergen envueltos en luz celestial, representando la danza eterna de las almas gemelas y las decisiones que moldean destinos. Los cupidos ancestrales te susurran que enfrentas una encrucijada de importancia cósmica, donde cada camino lleva a realidades completamente diferentes. Las relaciones en tu vida están siendo orquestadas por fuerzas divinas, ya sea para unirte con alguien que refleja tu esencia más pura, o para enseñarte lecciones sobre el amor verdadero. Los espíritus revelan que tus elecciones deben emanar del corazón alineado con los valores más sagrados. La armonía solo se alcanza cuando honras tanto tu individualidad como tu conexión con el otro. Las estrellas conspiran para que encuentres el balance perfecto entre dar y recibir amor."
  },
  { 
    id: 7, 
    name: "el-carro", 
    meaning: "Victoria y determinación",
    fullReading: "El Carro avanza triunfante a través de las dimensiones, guiado por la fuerza de voluntad inquebrantable y el dominio absoluto de las fuerzas opuestas. Los guerreros místicos te bendicen con su determinación férrea y te coronan con laureles de victoria anticipada. Has superado pruebas que hubieran destruido a espíritus menores, y ahora las ruedas del destino giran a tu favor con momentum imparable. Los antiguos proclaman que tu capacidad de mantener el rumbo mientras controlas energías contradictorias es tu mayor fortaleza. Avanza con confianza, conquistador de mundos internos y externos, pues el universo mismo despeja el camino ante ti. La victoria no solo es posible, es inevitable para quien mantiene la visión clara y el corazón valiente."
  },
  { 
    id: 8, 
    name: "la-fuerza", 
    meaning: "Coraje y control interno",
    fullReading: "La Fuerza se manifiesta no en rugidos de león, sino en el susurro que calma a las bestias más salvajes. Los guardianes ancestrales te revelan que posees un poder suave pero invencible, la capacidad de domar las pasiones más feroces con compasión y paciencia infinitas. Tu verdadero coraje se muestra en los momentos de vulnerabilidad transformada en fortaleza, en la capacidad de enfrentar tus propios demonios internos con amor en lugar de violencia. Los espíritus te enseñan que la mayor batalla no se libra con espadas sino con el corazón abierto. Las energías primordiales fluyen a través de ti cuando actúas desde un lugar de confianza inquebrantable en tu propia naturaleza divina. Tu gracia bajo presión inspira a los reinos visibles e invisibles."
  },
  { 
    id: 9, 
    name: "el-ermitano", 
    meaning: "Introspección y búsqueda de verdad",
    fullReading: "El Ermitaño asciende a la montaña solitaria donde la sabiduría eterna aguarda a quienes tienen el coraje de buscarla en silencio. Los sabios ancestrales te llaman a un retiro sagrado, a un viaje interno que iluminará verdades que el mundo exterior nunca podría revelar. Tu lámpara interior brilla con intensidad creciente, lista para guiarte a través de las cuevas más oscuras de tu psique hacia tesoros de autoconocimiento invaluables. Los espíritus susurran que la soledad consciente no es aislamiento, sino comunión profunda con tu esencia más pura. En el silencio encontrarás respuestas que el ruido del mundo ha ocultado. Esta es una fase de contemplación sagrada que preparará tu alma para niveles superiores de existencia."
  },
  { 
    id: 10, 
    name: "la-rueda-de-la-fortuna", 
    meaning: "Cambios y ciclos del destino",
    fullReading: "La Rueda de la Fortuna gira incesante, tejida por las Moiras con hilos de destino y libre albedrío entrelazados. Los arquitectos del karma te revelan que los ciclos cósmicos están alcanzando un punto de inflexión crucial en tu existencia. Lo que sube eventualmente baja, y lo que cae está destinado a elevarse nuevamente en la danza eterna de la vida. Los espíritus ancestrales proclaman que los cambios que se aproximan no son aleatorios sino orquestados por leyes universales que trascienden la comprensión humana. Acepta las vueltas de la rueda con gracia, sabiendo que cada rotación te acerca a tu destino último. La fortuna favorece a quienes fluyen con los ciclos naturales en lugar de resistirse a ellos. Prepárate para giros inesperados que revelarán el plan divino mayor."
  },
  { 
    id: 11, 
    name: "la-justicia", 
    meaning: "Equilibrio y consecuencias",
    fullReading: "La Justicia sostiene la balanza cósmica donde cada acción es pesada con precisión divina, donde cada intención es medida contra las leyes eternas del universo. Los jueces ancestrales te revelan que el equilibrio kármico está siendo restaurado en tu vida con exactitud matemática. Cada semilla que has plantado está germinando, cada deuda está siendo saldada, cada cuenta ajustándose según los libros celestiales. Los espíritus proclaman que la verdad objetiva brillará con claridad cristalina, disipando las nieblas de la ilusión y el autoengaño. Este es un tiempo para decisiones basadas en la equidad absoluta, para acciones que honren tanto la ley universal como la justicia personal. La balanza no miente, y lo que mereces verdaderamente está llegando a ti."
  },
  { 
    id: 12, 
    name: "el-colgado", 
    meaning: "Nueva perspectiva y sacrificio",
    fullReading: "El Colgado pende serenamente del Árbol del Mundo, viendo realidades que solo se revelan desde posiciones invertidas. Los místicos ancestrales te invitan a suspender tus asunciones, a soltar el control y permitir que la rendición sagrada te transforme. Lo que parece sacrificio en la superficie es en realidad liberación de ataduras que han limitado tu visión espiritual. Los espíritus te revelan que solo al detenerte completamente puedes avanzar verdaderamente, solo al rendirte puedes conquistar. Esta pausa forzada es un portal hacia dimensiones de entendimiento que la acción constante nunca alcanzaría. Acepta la suspensión temporal como iniciación divina, pues al cambiar tu perspectiva, cambias tu mundo entero. La iluminación llega a quienes se atreven a ver desde ángulos imposibles."
  },
  { 
    id: 13, 
    name: "la-muerte", 
    meaning: "Transformación y finales necesarios",
    fullReading: "La Muerte cabalga majestuosa, no como fin sino como umbral sagrado entre lo que fue y lo que será. Los guardianes de las transformaciones cósmicas te anuncian que ciertos capítulos deben cerrarse para que nuevos libros de tu vida puedan abrirse. Esta carta no augura pérdida sino alquimia suprema, donde lo viejo se transmuta en oro espiritual. Los espíritus te revelan que aferrarte a formas que ya cumplieron su propósito solo retrasa tu evolución inevitable. Las phoenixes ancestrales te llaman a las llamas purificadoras donde tu ego limitado será consumido para que tu ser verdadero pueda renacer gloriosamente. Acepta los finales con gracia, pues son promesas de comienzos magníficos. La metamorfosis que experimentas es divina, necesaria y profundamente sagrada."
  },
  { 
    id: 14, 
    name: "la-templanza", 
    meaning: "Balance y moderación",
    fullReading: "La Templanza vierte aguas celestiales entre vasijas de oro y plata, mezclando los opuestos en elixir de armonía perfecta. Los alquimistas divinos te enseñan el arte sagrado de la moderación, donde los extremos se funden en el punto medio dorado. Tu capacidad para integrar fuerzas contradictorias está alcanzando niveles maestros, permitiéndote crear síntesis que trascienden dualidades limitantes. Los espíritus te revelan que la verdadera sanación ocurre en el balance entre pasión y paciencia, entre acción y contemplación, entre dar y recibir. Esta es una fase de ajustes delicados donde pequeños movimientos crean grandes cambios. Los ángeles de la armonía te guían hacia el centro sagrado donde todas las polaridades se reconcilian en paz radiante."
  },
  { 
    id: 15, 
    name: "el-diablo", 
    meaning: "Liberación de ataduras",
    fullReading: "El Diablo ríe mientras señala las cadenas que tú mismo has forjado, ilusiones de prisión que solo existen porque eliges no ver su naturaleza fantasmal. Los liberadores ancestrales te confrontan con tus sombras más profundas, con los apegos que drenan tu poder vital, con las adicciones sutiles que disfrazas de necesidades. Los espíritus te revelan verdades incómodas: las ataduras que te limitan son autoimpuestas, y su llave siempre ha estado en tu mano. Este es un llamado a la honestidad brutal contigo mismo, a reconocer dónde has vendido tu libertad por placeres momentáneos o seguridades falsas. El verdadero diablo no es externo sino los miedos internos que te mantienen pequeño. Corta las cadenas, reclama tu soberanía, y descubre el poder que siempre fue tuyo."
  },
  { 
    id: 16, 
    name: "la-torre", 
    meaning: "Cambio súbito y revelaciones",
    fullReading: "La Torre es fulminada por el rayo divino que destruye estructuras construidas sobre fundamentos falsos. Los destructores sagrados te anuncian que ciertas creencias, relaciones o situaciones que parecían sólidas están siendo demolidas por fuerzas mayores. Aunque esto puede parecer catastrófico, los espíritus antiguos revelan que solo puede construirse lo genuino sobre escombros de lo artificial. Las revelaciones súbitas iluminan verdades que habías evitado ver, y aunque dolorosas, son liberadoras. Esta demolición cósmica es acto de gracia suprema, pues libera energía aprisionada en formas rígidas y obsoletas. De las ruinas de la torre emerge el fénix de tu autenticidad. Acepta el caos creativo, pues donde cae la torre falsa, se erige el templo verdadero."
  },
  { 
    id: 17, 
    name: "la-estrella", 
    meaning: "Esperanza y renovación",
    fullReading: "La Estrella brilla radiante en el cielo nocturno del alma, faro de esperanza después de las tormentas más oscuras. Las diosas celestiales vierten aguas de sanación sobre tu espíritu cansado, renovando tu fe en la bondad fundamental del universo. Los espíritus te revelan que después del caos viene la claridad, después de la noche la aurora radiante. Tu conexión con lo divino se fortalece, tus dones espirituales florecen, y tu visión del futuro se aclara como aguas de manantial cristalino. Este es tiempo de inspiración profunda, de sueños que no son meras fantasías sino visiones proféticas de lo que está gestándose. Las estrellas mismas conspiran para guiarte hacia tu destino luminoso. Respira profundo y permite que la gracia cósmica te llene."
  },
  { 
    id: 18, 
    name: "la-luna", 
    meaning: "Ilusiones y subconsciente",
    fullReading: "La Luna lanza su luz plateada sobre territorios del subconsciente donde habitan tanto tesoros como terrores. Las guardianas de los misterios nocturnos te advierten que no todo es lo que parece bajo su resplandor engañoso. Tu psique está emergiendo con mensajes cifrados en sueños, intuiciones y sincronicidades que requieren interpretación cuidadosa. Los espíritus revelan que atraviesas un periodo donde las fronteras entre realidad y ilusión se difuminan, donde tus miedos proyectan sombras más grandes que su sustancia real. Pero también es tiempo de despertar psíquico profundo, donde capacidades dormidas emergen desde las profundidades. Navega estas aguas con consciencia, honra tus emociones sin dejarte arrastrar por ellas, y los secretos lunares iluminarán tu camino."
  },
  { 
    id: 19, 
    name: "el-sol", 
    meaning: "Éxito y claridad",
    fullReading: "El Sol emerge glorioso disipando todas las sombras, irradiando vitalidad, éxito y alegría pura en cada rayo dorado. Los dioses solares te bendicen con claridad mental absoluta, energía vital desbordante y la confianza radiante de quien conoce su verdadero valor. Los espíritus proclaman que has superado las pruebas nocturnas y ahora cosechas las recompensas del día victorioso. Tus talentos brillan a plena luz, tus logros son reconocidos, y tu felicidad auténtica contagia a todos en tu órbita. Este es tiempo de celebración merecida, de juego inocente, de expresión sin inhibiciones de tu esencia más luminosa. Las fuerzas celestiales sonríen ante tu camino y garantizan que el éxito que buscas no solo es posible sino inevitable. Brilla sin disculpas, pues eres hijo del cosmos."
  },
  { 
    id: 20, 
    name: "el-juicio", 
    meaning: "Renacimiento y llamado superior",
    fullReading: "El Juicio suena su trompeta cósmica despertando a los dormidos, llamando a las almas hacia su propósito superior y destino último. Los ángeles del renacimiento te convocan a responder al llamado que has estado evitando o quizás no habías escuchado claramente hasta ahora. Los espíritus ancestrales revelan que has completado ciclos kármicos importantes y ahora eres llamado a un nivel superior de existencia y servicio. Este es un tiempo de evaluación sincera de tu vida pasada, de perdón profundo hacia ti y otros, y de aceptación del llamado divino que resuena en tu alma. Las vidas pasadas y futuras convergen en este momento crucial. Levántate renovado, acepta tu misión sagrada, y camina con propósito claro hacia la realización de tu potencial más elevado."
  },
  { 
    id: 21, 
    name: "el-mundo", 
    meaning: "Completitud y logro",
    fullReading: "El Mundo danza en el centro del mandala cósmico, simbolizando la culminación gloriosa de largos viajes y la integración perfecta de todas las lecciones aprendidas. Los maestros ascendidos te felicitan pues has alcanzado un nivel de completitud que pocos logran. Los espíritus revelan que los ciclos se cierran armoniosamente, que los objetivos se cristalizan en realidad, y que tu lugar en el tapiz cósmico está asegurado con honores. Has integrado los opuestos, sanado las fragmentaciones, y emergido como ser completo que honra todos los aspectos de su naturaleza. Este es tiempo de celebración máxima, de reconocimiento de cuán lejos has llegado. Pero incluso mientras un mundo se completa, las semillas del siguiente ya germinan. Descansa en tu logro sabiendo que eres eterno viajero en espirales siempre ascendentes de evolución."
  },
  { 
    id: 0, 
    name: "el-loco", 
    meaning: "Nuevos viajes y espontaneidad",
    fullReading: "El Loco danza al borde del abismo con fe absoluta en la red invisible que sostiene a los aventureros divinos. Los guardianes de nuevos comienzos te bendicen con el coraje de la inocencia sagrada y la libertad de quien no conoce limitaciones autoimpuestas. Los espíritus te revelan que estás al inicio de un viaje extraordinario que requerirá que sueltes mapas familiares y confíes en la guía del universo. Este es llamado a la espontaneidad consciente, a la aventura que transforma, al riesgo sagrado que solo los valientes abrazan. Llevas contigo todo lo necesario aunque tu mochila parezca ligera, pues viajas con el apoyo invisible de fuerzas cósmicas. Salta con fe, pues el abismo es en realidad portal hacia dimensiones que tu mente lógica nunca imaginó posibles."
  },
];

const Reading = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedCards, setSelectedCards] = useState<typeof TAROT_CARDS>([]);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([false, false, false]);
  const userName = sessionStorage.getItem("userName") || (language === 'es' ? "Buscador" : "Seeker");

  const shuffleCards = () => {
    setIsShuffling(true);
    setSelectedCards([]);
    setRevealedCards([false, false, false]);
    
    setTimeout(() => {
      const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, 3);
      setSelectedCards(picked);
      sessionStorage.setItem("selectedCards", JSON.stringify(picked));
      setIsShuffling(false);

      // Reveal cards one by one
      setTimeout(() => setRevealedCards([true, false, false]), 500);
      setTimeout(() => setRevealedCards([true, true, false]), 1300);
      setTimeout(() => setRevealedCards([true, true, true]), 2100);
    }, 2000);
  };

  const handleContinue = async () => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      navigate("/auth");
      return;
    }

    // Store cards with their full reading info translated
    const cardsForResults = selectedCards.map(card => ({
      name: card.name,
      meaning: t.cardMeanings[card.name] || card.meaning,
      reading: t.cardFullReadings[card.name] || card.fullReading || card.meaning
    }));

    // Get user data from session storage
    const userName = sessionStorage.getItem("userName") || '';
    const userFocus = sessionStorage.getItem("userFocus") || '';
    const userQuestion = sessionStorage.getItem("userQuestion") || '';
    const userLanguage = sessionStorage.getItem("userLanguage") || language;

    // Save reading to database
    const { data, error } = await supabase
      .from('tarot_readings')
      .insert({
        user_id: user.id,
        user_name: userName,
        focus: userFocus,
        question: userQuestion,
        language: userLanguage,
        selected_cards: cardsForResults,
      })
      .select()
      .single();

    if (!error && data) {
      // Store reading ID in session storage
      sessionStorage.setItem("currentReadingId", data.id);
    }

    sessionStorage.setItem("selectedCards", JSON.stringify(cardsForResults));
    navigate("/results");
  };

  return (
    <CaveBackground>
      <div className="min-h-screen p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 pt-8">
            <div className="flex justify-center items-center gap-4 mb-4">
              <LanguageToggle />
            </div>
            <h1 className="text-4xl font-cinzel font-bold text-foreground">
              {t.welcome}, {userName}
            </h1>
            <p className="text-muted-foreground font-crimson text-lg italic">
              {t.revealCards} {t.past}, {t.present} {t.and} {t.future}
            </p>
          </div>

          {/* Shuffle Button */}
          {selectedCards.length === 0 && !isShuffling && (
            <div className="flex justify-center">
              <Button
                onClick={shuffleCards}
                size="lg"
                className="bg-gradient-mystic hover:opacity-90 text-primary-foreground h-16 px-10 font-cinzel text-lg shadow-2xl"
                style={{ boxShadow: 'var(--glow-purple)' }}
              >
                <Sparkles className="w-6 h-6 mr-3 animate-glow" />
                {language === 'es' ? 'Invocar las Cartas' : 'Invoke the Cards'}
              </Button>
            </div>
          )}

          {/* Shuffling Animation */}
          {isShuffling && (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="relative">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 left-0 w-40 h-60 animate-shuffle"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      zIndex: 5 - i,
                    }}
                  >
                    <TarotCard name="" isShuffling={true} />
                  </div>
                ))}
                <div className="w-40 h-60 opacity-0">
                  <TarotCard name="" />
                </div>
              </div>
            </div>
          )}

          {/* Cards Display */}
          {selectedCards.length > 0 && !isShuffling && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {selectedCards.map((card, index) => (
                  <div key={card.id} className="flex flex-col items-center gap-4">
                    <TarotCard
                      name={card.name}
                      meaning={card.meaning}
                      position={index === 0 ? 'past' : index === 1 ? 'present' : 'future'}
                      isRevealed={revealedCards[index]}
                      animationDelay={index * 0.3}
                      cardNames={t.cardNames}
                      cardMeanings={t.cardMeanings}
                      positionLabels={{
                        past: t.past.toUpperCase(),
                        present: t.present.toUpperCase(),
                        future: t.future.toUpperCase()
                      }}
                    />
                  </div>
                ))}
              </div>

              {revealedCards.every(r => r) && (
                <>
                  {/* AdSense Banner */}
                  <AdSense className="my-6" />
                  
                  <div className="flex justify-center animate-float">
                    <Button
                      onClick={handleContinue}
                      size="lg"
                      className="bg-gradient-golden hover:opacity-90 text-accent-foreground h-16 px-10 font-cinzel text-lg shadow-2xl"
                      style={{ boxShadow: 'var(--glow-gold)' }}
                    >
                      <Shuffle className="w-6 h-6 mr-3" />
                      {language === 'es' ? 'Descifrar el Mensaje' : 'Decipher the Message'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </CaveBackground>
  );
};

export default Reading;
