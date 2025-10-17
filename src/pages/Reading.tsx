import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Shuffle } from "lucide-react";
import CaveBackground from "@/components/CaveBackground";
import TarotCard from "@/components/TarotCard";

const TAROT_CARDS = [
  { id: 1, name: "El Mago", meaning: "Poder de manifestación y nuevos comienzos" },
  { id: 2, name: "La Sacerdotisa", meaning: "Intuición y sabiduría interior" },
  { id: 3, name: "La Emperatriz", meaning: "Abundancia y creatividad" },
  { id: 4, name: "El Emperador", meaning: "Autoridad y estructura" },
  { id: 5, name: "El Hierofante", meaning: "Tradición y educación espiritual" },
  { id: 6, name: "Los Enamorados", meaning: "Elecciones y relaciones armónicas" },
  { id: 7, name: "El Carro", meaning: "Victoria y determinación" },
  { id: 8, name: "La Fuerza", meaning: "Coraje y control interno" },
  { id: 9, name: "El Ermitaño", meaning: "Introspección y búsqueda de verdad" },
  { id: 10, name: "La Rueda de la Fortuna", meaning: "Cambios y ciclos del destino" },
  { id: 11, name: "La Justicia", meaning: "Equilibrio y consecuencias" },
  { id: 12, name: "El Colgado", meaning: "Nueva perspectiva y sacrificio" },
  { id: 13, name: "La Muerte", meaning: "Transformación y finales necesarios" },
  { id: 14, name: "La Templanza", meaning: "Balance y moderación" },
  { id: 15, name: "El Diablo", meaning: "Liberación de ataduras" },
  { id: 16, name: "La Torre", meaning: "Cambio súbito y revelaciones" },
  { id: 17, name: "La Estrella", meaning: "Esperanza y renovación" },
  { id: 18, name: "La Luna", meaning: "Ilusiones y subconsciente" },
  { id: 19, name: "El Sol", meaning: "Éxito y claridad" },
  { id: 20, name: "El Juicio", meaning: "Renacimiento y llamado superior" },
  { id: 21, name: "El Mundo", meaning: "Completitud y logro" },
  { id: 0, name: "El Loco", meaning: "Nuevos viajes y espontaneidad" },
];

const Reading = () => {
  const navigate = useNavigate();
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedCards, setSelectedCards] = useState<typeof TAROT_CARDS>([]);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([false, false, false]);
  const userName = sessionStorage.getItem("userName") || "Buscador";

  const shuffleCards = () => {
    setIsShuffling(true);
    setSelectedCards([]);
    setRevealedCards([false, false, false]);
    
    setTimeout(() => {
      const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, 3);
      setSelectedCards(picked);
      sessionStorage.setItem("readingCards", JSON.stringify(picked));
      setIsShuffling(false);

      // Reveal cards one by one
      setTimeout(() => setRevealedCards([true, false, false]), 500);
      setTimeout(() => setRevealedCards([true, true, false]), 1300);
      setTimeout(() => setRevealedCards([true, true, true]), 2100);
    }, 2000);
  };

  const handleContinue = () => {
    navigate("/results");
  };

  return (
    <CaveBackground>
      <div className="min-h-screen p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 pt-8">
            <h1 className="text-4xl font-cinzel font-bold text-foreground">
              Bienvenido, {userName}
            </h1>
            <p className="text-muted-foreground font-crimson text-lg italic">
              Las cartas ancestrales revelarán tu Pasado, Presente y Futuro
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
                Invocar las Cartas
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
                      position={index === 0 ? "past" : index === 1 ? "present" : "future"}
                      isRevealed={revealedCards[index]}
                      animationDelay={index * 0.3}
                    />
                  </div>
                ))}
              </div>

              {revealedCards.every(r => r) && (
                <div className="flex justify-center animate-float">
                  <Button
                    onClick={handleContinue}
                    size="lg"
                    className="bg-gradient-golden hover:opacity-90 text-accent-foreground h-16 px-10 font-cinzel text-lg shadow-2xl"
                    style={{ boxShadow: 'var(--glow-gold)' }}
                  >
                    <Shuffle className="w-6 h-6 mr-3" />
                    Descifrar el Mensaje
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </CaveBackground>
  );
};

export default Reading;
