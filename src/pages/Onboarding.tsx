import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { LogOut } from "lucide-react";
import CaveBackground from "@/components/CaveBackground";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { userInputSchema } from "@/lib/validation";
import type { User } from "@supabase/supabase-js";
import logo from "@/assets/logo.png";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [focus, setFocus] = useState<"love" | "career" | "money">("love");
  const [question, setQuestion] = useState("");

  useEffect(() => {
    // Check auth and redirect if not logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      } else {
        // Set name from profile
        setName(session.user.user_metadata?.display_name || "");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      } else {
        setName(session.user.user_metadata?.display_name || "");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleStart = () => {
    console.log("handleStart llamado", { name, question, focus, nameLength: name.trim().length, questionLength: question.trim().length });
    
    const validation = userInputSchema.safeParse({ name, question, focus });
    
    if (!validation.success) {
      console.error("Validación falló:", validation.error.errors);
      toast({
        title: "Error de validación",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    
    sessionStorage.setItem("userName", name);
    sessionStorage.setItem("userFocus", focus);
    sessionStorage.setItem("userQuestion", question);
    
    navigate("/reading");
  };

  if (!user) {
    return null; // Will redirect to /auth
  }

  return (
    <CaveBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 animate-float">
          {/* Logo/Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img 
                src={logo} 
                alt="Tarot Futura Logo" 
                className="w-32 h-32 rounded-full animate-float drop-shadow-2xl object-cover"
                style={{ filter: 'drop-shadow(0 0 20px rgba(124, 58, 237, 0.5))' }}
              />
            </div>
            <h1 className="text-5xl font-cinzel font-bold bg-gradient-golden bg-clip-text text-transparent">
              Tarot Futura
            </h1>
            <p className="text-muted-foreground text-lg font-crimson italic">
              Descubre los secretos que las sombras ocultan...
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground font-crimson"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>

          {/* Form */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-cinzel">
                ¿Cómo te llamas, viajero?
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                className="bg-background/50 border-border font-crimson"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-foreground font-cinzel text-lg">
                Paso 1: ¿Qué misterio deseas desentrañar?
              </Label>
              <RadioGroup value={focus} onValueChange={(value: any) => setFocus(value)}>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/30">
                  <RadioGroupItem value="love" id="love" />
                  <Label htmlFor="love" className="cursor-pointer flex-1 text-foreground font-crimson">
                    💜 Amor y Relaciones
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/30">
                  <RadioGroupItem value="career" id="career" />
                  <Label htmlFor="career" className="cursor-pointer flex-1 text-foreground font-crimson">
                    ⭐ Carrera y Propósito
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/30">
                  <RadioGroupItem value="money" id="money" />
                  <Label htmlFor="money" className="cursor-pointer flex-1 text-foreground font-crimson">
                    ✨ Dinero y Abundancia
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question" className="text-foreground font-cinzel text-lg">
                Paso 2: ¿Qué pregunta deseas hacerle al tarot?
              </Label>
              <Textarea
                id="question"
                placeholder="Escribe tu pregunta aquí (mínimo 10 caracteres)..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength={500}
                className="bg-background/50 border-border font-crimson min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground font-crimson">
                {question.length}/500 caracteres
              </p>
            </div>

            <Button
              onClick={handleStart}
              disabled={!name.trim() || !question.trim() || question.length < 10}
              className="w-full bg-gradient-mystic hover:opacity-90 text-primary-foreground text-lg h-14 font-cinzel shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ boxShadow: 'var(--glow-purple)' }}
              title={!name.trim() ? "Ingresa tu nombre" : !question.trim() ? "Escribe una pregunta" : question.length < 10 ? "La pregunta debe tener al menos 10 caracteres" : ""}
            >
              Revelar mi Destino
            </Button>
            {(!name.trim() || !question.trim() || question.length < 10) && (
              <p className="text-xs text-amber-400 text-center font-crimson mt-2">
                {!name.trim() ? "⚠️ Debes ingresar tu nombre" : 
                 !question.trim() ? "⚠️ Debes escribir una pregunta" : 
                 "⚠️ La pregunta debe tener al menos 10 caracteres"}
              </p>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground font-crimson italic">
            Las cartas ancestrales te esperan en la penumbra...
          </p>
        </div>
      </div>
    </CaveBackground>
  );
};

export default Onboarding;
