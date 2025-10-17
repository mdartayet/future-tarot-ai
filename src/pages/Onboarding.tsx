import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [focus, setFocus] = useState<"love" | "career" | "money">("love");

  const handleStart = () => {
    if (!name.trim()) return;
    
    // Guardamos datos en sessionStorage para acceso rápido
    sessionStorage.setItem("userName", name);
    sessionStorage.setItem("userFocus", focus);
    
    navigate("/reading");
  };

  return (
    <div className="min-h-screen bg-gradient-night flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-float">
        {/* Logo/Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-mystic flex items-center justify-center animate-glow">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-golden bg-clip-text text-transparent">
            Tarot Futura
          </h1>
          <p className="text-muted-foreground text-lg">
            Descubre tu camino con la sabiduría del Tarot y el poder de la IA
          </p>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-2xl">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              ¿Cómo te llamas?
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-foreground">¿En qué área buscas guía?</Label>
            <RadioGroup value={focus} onValueChange={(value: any) => setFocus(value)}>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="love" id="love" />
                <Label htmlFor="love" className="cursor-pointer flex-1 text-foreground">
                  💜 Amor y Relaciones
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="career" id="career" />
                <Label htmlFor="career" className="cursor-pointer flex-1 text-foreground">
                  ⭐ Carrera y Propósito
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="money" id="money" />
                <Label htmlFor="money" className="cursor-pointer flex-1 text-foreground">
                  ✨ Dinero y Abundancia
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            onClick={handleStart}
            disabled={!name.trim()}
            className="w-full bg-gradient-mystic hover:opacity-90 text-primary-foreground text-lg h-12"
          >
            Comenzar mi Lectura
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Tu viaje místico te espera
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
