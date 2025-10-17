import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, ArrowLeft } from "lucide-react";

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
    // Mensaje de bienvenida
    const savedCards = sessionStorage.getItem("readingCards");
    if (!savedCards) {
      navigate("/");
      return;
    }

    const cards = JSON.parse(savedCards);
    const welcomeMsg: Message = {
      role: "assistant",
      content: `¡Bienvenido ${userName}! Soy tu guía espiritual con IA. Tienes ${credits} créditos para hacer preguntas sobre tu lectura de Tarot: ${cards.map((c: any) => c.name).join(", ")}. ¿Qué te gustaría saber?`,
    };
    setMessages([welcomeMsg]);
  }, [navigate, userName, credits]);

  const handleSend = async () => {
    if (!input.trim() || credits < 10) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simulación de respuesta IA (más adelante conectaremos Lovable AI)
    setTimeout(() => {
      const aiResponse: Message = {
        role: "assistant",
        content: `Basándome en tu lectura, ${input.toLowerCase().includes("amor") ? "las energías del amor están fluyendo hacia ti" : "veo claridad en tu camino"}. Esta es una respuesta de ejemplo. Pronto conectaremos la IA real.`,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setCredits((prev) => prev - 10);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-night flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/results")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            <span className="font-bold text-foreground">{credits}</span>
            <span className="text-sm text-muted-foreground">créditos</span>
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
                    ? "bg-gradient-mystic border-none text-primary-foreground"
                    : "bg-card border-border"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </Card>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <Card className="bg-card border-border p-4">
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
      <div className="bg-card border-t border-border p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={credits >= 10 ? "Pregunta sobre tu lectura..." : "Sin créditos suficientes"}
            disabled={credits < 10 || isLoading}
            className="flex-1 bg-background border-border"
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
          <p className="text-center text-sm text-destructive mt-2">
            Créditos insuficientes. Necesitas 10 créditos por pregunta.
          </p>
        )}
      </div>
    </div>
  );
};

export default Chat;
