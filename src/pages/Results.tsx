import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, Sparkles } from "lucide-react";

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
    // Por ahora solo navegamos a chat, más adelante integraremos Stripe
    navigate("/chat");
  };

  if (cards.length === 0) return null;

  return (
    <div className="min-h-screen bg-gradient-night p-6">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        {/* Header */}
        <div className="text-center space-y-2 pt-8">
          <h1 className="text-3xl font-bold text-foreground">
            Tu Vistazo Mágico
          </h1>
          <p className="text-muted-foreground">
            {userName}, aquí está un adelanto de tu lectura
          </p>
        </div>

        {/* Preview Cards - Free Version */}
        <div className="space-y-4">
          {cards.map((card, index) => (
            <Card key={card.id} className="bg-card border-border p-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-mystic flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🔮</span>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-secondary text-sm">
                      {index === 0 ? "PASADO" : index === 1 ? "PRESENTE" : "FUTURO"}
                    </h3>
                    <span className="text-foreground font-bold">• {card.name}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {card.meaning}. Esta carta sugiere...
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    Vista previa limitada. Desbloquea el análisis completo para ver el significado profundo.
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* AdSense Placeholder */}
        <div className="bg-muted/20 border border-border rounded-lg p-8 text-center">
          <p className="text-xs text-muted-foreground mb-2">PUBLICIDAD</p>
          <div className="bg-muted/30 h-24 rounded flex items-center justify-center">
            <span className="text-muted-foreground text-sm">
              [Espacio para AdSense Banner - 728x90]
            </span>
          </div>
        </div>

        {/* Unlock Section */}
        <Card className="bg-gradient-mystic border-none p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-secondary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-primary-foreground">
            Desbloquea tu Informe Completo del Destino
          </h2>
          <p className="text-primary-foreground/80">
            Obtén el análisis profundo de cada carta, guía personalizada y acceso al chat IA con 100 créditos incluidos.
          </p>
          <div className="flex items-center justify-center gap-2 text-3xl font-bold text-secondary">
            <span>$5</span>
            <span className="text-lg text-primary-foreground/60">USD</span>
          </div>
          <Button
            onClick={handleUnlock}
            size="lg"
            className="bg-gradient-golden hover:opacity-90 text-accent-foreground h-14 px-8"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Desbloquear Ahora
          </Button>
          <p className="text-xs text-primary-foreground/60">
            Pago único • Acceso inmediato • 100 créditos IA incluidos
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Results;
