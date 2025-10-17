import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Shuffle } from "lucide-react";

// Dataset simplificado de cartas del Tarot
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
  const userName = sessionStorage.getItem("userName") || "Buscador";

  const shuffleCards = () => {
    setIsShuffling(true);
    
    setTimeout(() => {
      // Seleccionar 3 cartas aleatorias
      const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, 3);
      setSelectedCards(picked);
      
      // Guardar en sessionStorage para la página de resultados
      sessionStorage.setItem("readingCards", JSON.stringify(picked));
      
      setIsShuffling(false);
    }, 2000);
  };

  const handleContinue = () => {
    navigate("/results");
  };

  return (
    <div className="min-h-screen bg-gradient-night p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 pt-8">
          <h1 className="text-3xl font-bold text-foreground">
            Bienvenido, {userName}
          </h1>
          <p className="text-muted-foreground">
            Las cartas te revelarán tu Pasado, Presente y Futuro
          </p>
        </div>

        {/* Shuffle Button */}
        {selectedCards.length === 0 && (
          <div className="flex justify-center">
            <Button
              onClick={shuffleCards}
              disabled={isShuffling}
              size="lg"
              className="bg-gradient-mystic hover:opacity-90 text-primary-foreground h-14 px-8"
            >
              {isShuffling ? (
                <>
                  <Shuffle className="w-5 h-5 mr-2 animate-spin" />
                  Barajando las cartas...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Barajar el Tarot
                </>
              )}
            </Button>
          </div>
        )}

        {/* Cards Display */}
        {selectedCards.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedCards.map((card, index) => (
                <Card
                  key={card.id}
                  className="bg-card border-border p-6 space-y-4 animate-card-flip hover:border-primary transition-all"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-mystic flex items-center justify-center">
                      <span className="text-2xl">🔮</span>
                    </div>
                    <h3 className="font-bold text-secondary text-sm">
                      {index === 0 ? "PASADO" : index === 1 ? "PRESENTE" : "FUTURO"}
                    </h3>
                    <h2 className="text-xl font-bold text-foreground">
                      {card.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {card.meaning}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleContinue}
                size="lg"
                className="bg-gradient-golden hover:opacity-90 text-accent-foreground h-14 px-8"
              >
                Ver mi Lectura Completa
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reading;
