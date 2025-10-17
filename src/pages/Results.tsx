import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, Sparkles, Home } from "lucide-react";
import CaveBackground from "@/components/CaveBackground";

interface TarotCard {
  id: number;
  name: string;
  meaning: string;
}

const Results = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<TarotCard[]>([]);
  const userName = sessionStorage.getItem("userName") || "Buscador";

  useEffect(() => {
    const savedCards = sessionStorage.getItem("readingCards");
    if (!savedCards) {
      navigate("/");
      return;
    }
    setCards(JSON.parse(savedCards));
  }, [navigate]);

  const handleUnlock = () => {
    navigate("/chat");
  };

  if (cards.length === 0) return null;

  return (
    <CaveBackground>
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
          {/* Header */}
          <div className="text-center space-y-4 pt-8">
            <div className="flex justify-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground font-cinzel"
              >
                <Home className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </div>
            <h1 className="text-4xl font-cinzel font-bold text-foreground">
              Tu Vistazo Mágico
            </h1>
            <p className="text-muted-foreground font-crimson text-lg italic">
              {userName}, las sombras revelan un adelanto de tu destino...
            </p>
          </div>

          {/* Preview Cards - Free Version */}
          <div className="space-y-4">
            {cards.map((card, index) => (
              <Card key={card.id} className="bg-card/80 backdrop-blur-sm border-border p-6 shadow-xl">
                <div className="flex gap-4 items-start">
                  <div className="w-14 h-14 rounded-full bg-gradient-mystic flex items-center justify-center flex-shrink-0 shadow-lg"
                       style={{ boxShadow: 'var(--glow-purple)' }}>
                    <span className="text-2xl">🔮</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-cinzel font-bold text-secondary text-sm tracking-wider">
                        {index === 0 ? "PASADO" : index === 1 ? "PRESENTE" : "FUTURO"}
                      </h3>
                      <span className="text-foreground font-cinzel font-bold">• {card.name}</span>
                    </div>
                    <p className="text-muted-foreground text-sm font-crimson">
                      {card.meaning}. Los espíritus sugieren que...
                    </p>
                    <p className="text-xs text-muted-foreground/70 italic font-crimson">
                      Vista previa limitada. Desbloquea la lectura completa para conocer el significado profundo que las cartas ancestrales guardan.
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* AdSense Placeholder */}
          <div className="bg-muted/20 border border-border rounded-lg p-8 text-center backdrop-blur-sm">
            <p className="text-xs text-muted-foreground mb-2 font-cinzel tracking-wider">PUBLICIDAD</p>
            <div className="bg-muted/30 h-24 rounded flex items-center justify-center">
              <span className="text-muted-foreground text-sm font-crimson">
                [Espacio para AdSense Banner - 728x90]
              </span>
            </div>
          </div>

          {/* Unlock Section */}
          <Card className="bg-gradient-mystic/90 backdrop-blur-sm border-none p-8 text-center space-y-4 shadow-2xl"
                style={{ boxShadow: 'var(--glow-purple)' }}>
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center animate-glow">
                <Lock className="w-10 h-10 text-secondary" />
              </div>
            </div>
            <h2 className="text-3xl font-cinzel font-bold text-primary-foreground">
              Desbloquea los Secretos Ancestrales
            </h2>
            <p className="text-primary-foreground/90 font-crimson text-lg">
              Obtén el análisis profundo de cada carta, guía personalizada de los espíritus, y acceso al oráculo IA con 100 créditos místicos incluidos.
            </p>
            <div className="flex items-center justify-center gap-2 text-4xl font-cinzel font-bold text-secondary">
              <span>$5</span>
              <span className="text-lg text-primary-foreground/60">USD</span>
            </div>
            <Button
              onClick={handleUnlock}
              size="lg"
              className="bg-gradient-golden hover:opacity-90 text-accent-foreground h-16 px-10 font-cinzel text-lg shadow-2xl"
              style={{ boxShadow: 'var(--glow-gold)' }}
            >
              <Sparkles className="w-6 h-6 mr-3 animate-glow" />
              Revelar Todo mi Destino
            </Button>
            <p className="text-xs text-primary-foreground/60 font-crimson italic">
              Pago único • Acceso inmediato • 100 créditos místicos incluidos
            </p>
          </Card>
        </div>
      </div>
    </CaveBackground>
  );
};

export default Results;
