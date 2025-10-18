import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import CaveBackground from "@/components/CaveBackground";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  displayName: z.string().min(1, "Nombre requerido").max(50, "Nombre muy largo").optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleAuth = async () => {
    try {
      const validation = authSchema.safeParse({
        email,
        password,
        displayName: isLogin ? undefined : displayName,
      });

      if (!validation.success) {
        const errors = validation.error.errors.map(e => e.message).join(", ");
        toast({
          title: "Error de validación",
          description: errors,
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Email o contraseña incorrectos");
          }
          throw error;
        }

        toast({
          title: "✨ Bienvenido de vuelta",
          description: "Has iniciado sesión exitosamente",
        });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              display_name: displayName,
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            throw new Error("Este email ya está registrado");
          }
          throw error;
        }

        toast({
          title: "✨ Cuenta creada",
          description: "Tu cuenta ha sido creada exitosamente. Puedes iniciar sesión ahora.",
        });
        setIsLogin(true);
        setPassword("");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CaveBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 animate-float">
          {/* Logo/Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div
                className="w-24 h-24 rounded-full bg-gradient-mystic flex items-center justify-center animate-glow"
                style={{ boxShadow: 'var(--glow-purple)' }}
              >
                <Sparkles className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-5xl font-cinzel font-bold bg-gradient-golden bg-clip-text text-transparent">
              Tarot Futura
            </h1>
            <p className="text-muted-foreground text-lg font-crimson italic">
              {isLogin ? "Regresa al reino místico..." : "Únete al reino místico..."}
            </p>
          </div>

          {/* Auth Form */}
          <Card className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-foreground font-cinzel">
                    Nombre
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Tu nombre"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={isLoading}
                    className="bg-background/50 border-border font-crimson"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-cinzel">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-background/50 border-border font-crimson"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-cinzel">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  onKeyPress={(e) => e.key === "Enter" && handleAuth()}
                  className="bg-background/50 border-border font-crimson"
                />
              </div>
            </div>

            <Button
              onClick={handleAuth}
              disabled={isLoading}
              className="w-full bg-gradient-mystic hover:opacity-90 text-primary-foreground text-lg h-14 font-cinzel shadow-lg"
              style={{ boxShadow: 'var(--glow-purple)' }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isLogin ? (
                "Entrar"
              ) : (
                "Crear Cuenta"
              )}
            </Button>

            <div className="text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setPassword("");
                }}
                disabled={isLoading}
                className="text-sm text-primary hover:underline font-crimson"
              >
                {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
              </button>
            </div>
          </Card>

          <p className="text-center text-xs text-muted-foreground font-crimson italic">
            Las cartas ancestrales te esperan en la penumbra...
          </p>
        </div>
      </div>
    </CaveBackground>
  );
};

export default Auth;
