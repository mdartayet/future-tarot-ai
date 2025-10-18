import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, LogOut } from "lucide-react";
import CaveBackground from "@/components/CaveBackground";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const questionSchema = z.object({
  question: z.string()
    .trim()
    .min(10, "La pregunta debe tener al menos 10 caracteres")
    .max(500, "La pregunta no puede exceder 500 caracteres"),
  focus: z.enum(["love", "career", "money"]),
});

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  const [focus, setFocus] = useState<"love" | "career" | "money">("love");
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      
      // Get user profile
      supabase
        .from("profiles")
        .select("display_name")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => {
          if (data?.display_name) {
            setUserName(data.display_name);
          }
          setIsLoading(false);
        });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleStart = () => {
    const validation = questionSchema.safeParse({ question, focus });
    
    if (!validation.success) {
      const errors = validation.error.errors.map(e => e.message).join(", ");
      toast({
        title: "Error de validación",
        description: errors,
        variant: "destructive",
      });
      return;
    }
    
    sessionStorage.setItem("userFocus", focus);
    sessionStorage.setItem("userQuestion", question);
    
    navigate("/reading");
  };

  if (isLoading) {
    return null;
  }

  return (
    <CaveBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 animate-float">
          {/* Logo/Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-mystic flex items-center justify-center animate-glow"
                   style={{ boxShadow: 'var(--glow-purple)' }}>
                <Sparkles className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-5xl font-cinzel font-bold bg-gradient-golden bg-clip-text text-transparent">
              Tarot Futura
            </h1>
            <p className="text-muted-foreground text-lg font-crimson italic">
              Descubre los secretos que las sombras ocultan...
            </p>
          </div>

          {/* Form */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-foreground font-cinzel">
                Bienvenido, <span className="text-primary">{userName}</span>
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
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
                placeholder="Escribe tu pregunta aquí..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="bg-background/50 border-border font-crimson min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleStart}
              disabled={!question.trim()}
              className="w-full bg-gradient-mystic hover:opacity-90 text-primary-foreground text-lg h-14 font-cinzel shadow-lg"
              style={{ boxShadow: 'var(--glow-purple)' }}
            >
              Revelar mi Destino
            </Button>
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
