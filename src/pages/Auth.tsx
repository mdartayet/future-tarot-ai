import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CaveBackground from "@/components/CaveBackground";
import LanguageToggle from "@/components/LanguageToggle";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import logo from "@/assets/logo.png";
import { useLanguage, translations } from "@/hooks/use-language";

const authSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  displayName: z.string().min(1, "Nombre requerido").max(50, "Nombre muy largo").optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = authSchema.safeParse({ email, password, displayName });
    if (!validation.success) {
      toast({
        title: "Error de validación",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: displayName,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "✨ Cuenta creada",
        description: "Bienvenido al Tarot Futura",
      });
    } catch (error: any) {
      toast({
        title: "Error al registrarse",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = authSchema.omit({ displayName: true }).safeParse({ email, password });
    if (!validation.success) {
      toast({
        title: "Error de validación",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "✨ Bienvenido de vuelta",
        description: "Has iniciado sesión exitosamente",
      });
    } catch (error: any) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message === "Invalid login credentials" 
          ? "Credenciales inválidas" 
          : error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailSchema = z.string().email("Email inválido");
    const validation = emailSchema.safeParse(resetEmail);
    
    if (!validation.success) {
      toast({
        title: "Error de validación",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: "✨ Email enviado",
        description: "Revisa tu correo para restablecer tu contraseña",
      });
      setIsResetDialogOpen(false);
      setResetEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-4 mb-4">
              <LanguageToggle />
            </div>
            <div className="flex justify-center">
              <img 
                src={logo} 
                alt="Tarot Futura Logo" 
                className="w-32 h-32 animate-float drop-shadow-2xl object-contain"
                style={{ filter: 'drop-shadow(0 0 20px rgba(124, 58, 237, 0.5))' }}
              />
            </div>
            <h1 className="text-5xl font-cinzel font-bold bg-gradient-golden bg-clip-text text-transparent">
              {t.appName}
            </h1>
            <p className="text-muted-foreground text-lg font-crimson italic">
              {t.authTagline}
            </p>
          </div>

          <Card className="bg-card/80 backdrop-blur-sm border border-border p-8">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin" className="font-cinzel">{t.signIn}</TabsTrigger>
                <TabsTrigger value="signup" className="font-cinzel">{t.signUp}</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="font-cinzel">{t.email}</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={language === 'es' ? 'tu@email.com' : 'your@email.com'}
                      required
                      className="font-crimson"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="font-cinzel">{t.password}</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      required
                      className="font-crimson"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-mystic hover:opacity-90 text-primary-foreground font-cinzel"
                  >
                    {isLoading ? (language === 'es' ? 'Ingresando...' : 'Signing in...') : t.enterSanctuary}
                  </Button>

                  <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        type="button" 
                        variant="link" 
                        className="w-full text-muted-foreground font-crimson hover:text-foreground"
                      >
                        {t.forgotPassword}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card/95 backdrop-blur-sm border-border">
                      <DialogHeader>
                        <DialogTitle className="font-cinzel text-2xl">
                          {language === 'es' ? 'Recuperar Contraseña' : 'Reset Password'}
                        </DialogTitle>
                        <DialogDescription className="font-crimson">
                          {language === 'es' 
                            ? 'Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña'
                            : 'Enter your email and we will send you a link to reset your password'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handlePasswordReset} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email" className="font-cinzel">{t.email}</Label>
                          <Input
                            id="reset-email"
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder={language === 'es' ? 'tu@email.com' : 'your@email.com'}
                            required
                            className="font-crimson"
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-gradient-mystic hover:opacity-90 text-primary-foreground font-cinzel"
                        >
                          {isLoading 
                            ? (language === 'es' ? 'Enviando...' : 'Sending...') 
                            : (language === 'es' ? 'Enviar Enlace' : 'Send Link')}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="font-cinzel">{t.name}</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder={language === 'es' ? 'Tu nombre' : 'Your name'}
                      required
                      maxLength={50}
                      className="font-crimson"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="font-cinzel">{t.email}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={language === 'es' ? 'tu@email.com' : 'your@email.com'}
                      required
                      className="font-crimson"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="font-cinzel">{t.password}</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      required
                      minLength={6}
                      className="font-crimson"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-mystic hover:opacity-90 text-primary-foreground font-cinzel"
                  >
                    {isLoading ? (language === 'es' ? 'Creando...' : 'Creating...') : t.createAccount}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </CaveBackground>
  );
};

export default Auth;
