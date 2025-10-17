import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, ArrowLeft } from "lucide-react";
import CaveBackground from "@/components/CaveBackground";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [credits, setCredits] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const userName = sessionStorage.getItem("userName") || "Buscador";

  useEffect(() => {
    const savedCards = sessionStorage.getItem("readingCards");
    if (!savedCards) {
      navigate("/");
      return;
    }

    const cards = JSON.parse(savedCards);
    const welcomeMsg: Message = {
      role: "assistant",
      content: `Bienvenido ${userName}, soy el Oráculo del Más Allá. Tienes ${credits} créditos místicos para consultar sobre tu lectura de Tarot: ${cards.map((c: any) => c.name).join(", ")}. ¿Qué secretos deseas desentrañar?`,
    };
    setMessages([welcomeMsg]);
  }, [navigate, userName, credits]);

  const handleSend = async () => {
    if (!input.trim() || credits < 10) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse: Message = {
        role: "assistant",
        content: `Las cartas susurran... ${input.toLowerCase().includes("amor") ? "El amor fluye en tu camino como río dorado" : "Veo claridad en las sombras de tu destino"}. Esta es una respuesta mística de ejemplo. Pronto conectaremos el oráculo real con IA.`,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setCredits((prev) => prev - 10);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <CaveBackground showCandles={false}>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-sm border-b border-border p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/results")}
              className="text-muted-foreground hover:text-foreground font-cinzel"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary animate-glow" />
              <span className="font-cinzel font-bold text-foreground">{credits}</span>
              <span className="text-sm text-muted-foreground font-crimson">créditos místicos</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4 pb-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`max-w-[80%] p-4 ${
                    msg.role === "user"
                      ? "bg-gradient-mystic/90 backdrop-blur-sm border-none text-primary-foreground"
                      : "bg-card/80 backdrop-blur-sm border-border"
                  }`}
                >
                  <p className="text-sm font-crimson">{msg.content}</p>
                </Card>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <Card className="bg-card/80 backdrop-blur-sm border-border p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="bg-card/80 backdrop-blur-sm border-t border-border p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder={credits >= 10 ? "Consulta al oráculo..." : "Sin créditos suficientes"}
              disabled={credits < 10 || isLoading}
              className="flex-1 bg-background/50 border-border font-crimson"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || credits < 10 || isLoading}
              className="bg-gradient-mystic hover:opacity-90 text-primary-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {credits < 10 && (
            <p className="text-center text-sm text-destructive mt-2 font-crimson">
              Créditos insuficientes. Necesitas 10 créditos por consulta al oráculo.
            </p>
          )}
        </div>
      </div>
    </CaveBackground>
  );
};

export default Chat;
