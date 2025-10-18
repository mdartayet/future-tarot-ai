import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, Crown } from "lucide-react";
import CaveBackground from "@/components/CaveBackground";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getCardImagePath } from "@/lib/tarot-utils";

interface TarotCard {
  id: number;
  name: string;
  meaning: string;
  fullReading?: string;
}

const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cards, setCards] = useState<any[]>([]);
  const [userName, setUserName] = useState("");
  const [userFocus, setUserFocus] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [aiReading, setAiReading] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    const selectedCards = sessionStorage.getItem("selectedCards");
    const name = sessionStorage.getItem("userName");
    const focus = sessionStorage.getItem("userFocus");
    const question = sessionStorage.getItem("userQuestion") || "";

    if (!selectedCards || !name) {
      navigate("/");
      return;
    }

    setCards(JSON.parse(selectedCards));
    setUserName(name);
    setUserFocus(focus || "");
    setUserQuestion(question);

    // Auto-request AI reading if user has a question
    if (question && question.trim()) {
      requestAIReading(name, focus || "", question, JSON.parse(selectedCards));
    }
  }, [navigate]);

  const requestAIReading = async (name: string, focus: string, question: string, cardsData: any[]) => {
    if (!question || !question.trim()) {
      toast({
        title: "Pregunta requerida",
        description: "Necesitas ingresar una pregunta para obtener la lectura premium con IA",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingAI(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('tarot-reading', {
        body: {
          userName: name,
          focus,
          question,
          cards: cardsData,
        }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setAiReading(data.response);
      
      toast({
        title: "✨ Lectura del Oráculo Revelada",
        description: "El oráculo ha respondido tu pregunta",
      });
    } catch (error: any) {
      console.error('Error requesting AI reading:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo obtener la lectura con IA",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const getFocusEmoji = (focus: string) => {
    switch (focus) {
      case "love":
        return "💜";
      case "career":
        return "⭐";
      case "money":
        return "✨";
      default:
        return "🔮";
    }
  };

  const getPreviewText = (text: string) => {
    const halfLength = Math.floor(text.length / 2);
    return text.substring(0, halfLength);
  };

  const handleUnlockPremium = () => {
    setIsPaid(true);
    toast({
      title: "✨ Lectura Completa Desbloqueada",
      description: "Ahora puedes leer la lectura completa del oráculo",
    });
  };

  return (
    <CaveBackground>
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto space-y-8 animate-float">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div
                className="w-20 h-20 rounded-full bg-gradient-mystic flex items-center justify-center animate-glow"
                style={{ boxShadow: 'var(--glow-purple)' }}
              >
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-cinzel font-bold bg-gradient-golden bg-clip-text text-transparent">
              Tu Lectura del Tarot
            </h1>
            <p className="text-muted-foreground text-lg font-crimson">
              {getFocusEmoji(userFocus)} Para {userName}, sobre {userFocus}
            </p>
          </div>

          {/* User Question */}
          {userQuestion && (
            <Card className="bg-card/80 backdrop-blur-sm border-border p-6">
              <div className="flex items-start gap-3">
                <Crown className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
                <div className="space-y-2 flex-1">
                  <h3 className="font-cinzel text-lg text-foreground">Tu Pregunta:</h3>
                  <p className="font-crimson text-muted-foreground italic">"{userQuestion}"</p>
                </div>
              </div>
            </Card>
          )}

          {/* AI Reading - Premium Feature */}
          {userQuestion && (
            <Card className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-sm border-yellow-500/30 p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-cinzel text-xl text-foreground">Lectura del Oráculo</h3>
                </div>
                
                {isLoadingAI ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-muted-foreground font-crimson italic">
                      El oráculo está consultando las estrellas...
                    </p>
                  </div>
                ) : aiReading ? (
                  <div className="space-y-4">
                    <div className="prose prose-invert max-w-none relative">
                      <p className="text-foreground font-crimson leading-relaxed whitespace-pre-line">
                        {isPaid ? aiReading : getPreviewText(aiReading)}
                        {!isPaid && "..."}
                      </p>
                      {!isPaid && (
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-purple-900/90 to-transparent" />
                      )}
                    </div>
                    
                    {!isPaid && (
                      <div className="text-center pt-4 border-t border-yellow-500/30">
                        <p className="text-muted-foreground font-crimson mb-4 italic">
                          Desbloquea la lectura completa con el servicio premium
                        </p>
                        <Button
                          onClick={handleUnlockPremium}
                          className="bg-gradient-mystic hover:opacity-90 text-primary-foreground font-cinzel"
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Desbloquear Lectura Completa
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Button
                      onClick={() => requestAIReading(userName, userFocus, userQuestion, cards)}
                      className="bg-gradient-mystic hover:opacity-90 text-primary-foreground font-cinzel"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Obtener Lectura del Oráculo
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <Card
                key={index}
                className="bg-card/80 backdrop-blur-sm border-border p-6 space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-cinzel text-muted-foreground uppercase tracking-wider">
                      {index === 0 ? "Pasado" : index === 1 ? "Presente" : "Futuro"}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gradient-candle flex items-center justify-center">
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                  </div>

                  <div className="aspect-[2/3] relative">
                    <img
                      src={getCardImagePath(card.name)}
                      alt={card.name}
                      className="w-full h-full object-contain rounded-lg"
                      onError={(e) => {
                        console.error(`Failed to load image for: ${card.name}`);
                        console.error(`Attempted path: ${getCardImagePath(card.name)}`);
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><rect width="200" height="300" fill="%23ccc"/><text x="50%" y="50%" text-anchor="middle" fill="%23666">🔮</text></svg>';
                      }}
                    />
                  </div>

                  <h3 className="text-xl font-cinzel font-bold text-foreground">
                    {card.name}
                  </h3>
                  <p className="text-sm text-primary font-crimson italic">
                    {card.meaning}
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground font-crimson leading-relaxed">
                    {card.reading}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="font-cinzel"
            >
              Nueva Lectura
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground font-crimson italic">
            Que la sabiduría ancestral ilumine tu camino...
          </p>
        </div>
      </div>
    </CaveBackground>
  );
};

export default Results;
