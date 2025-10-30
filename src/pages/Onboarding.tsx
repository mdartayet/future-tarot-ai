import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { LogOut } from "lucide-react";
import CaveBackground from "@/components/CaveBackground";
import LanguageToggle from "@/components/LanguageToggle";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { userInputSchema } from "@/lib/validation";
import type { User } from "@supabase/supabase-js";
import logo from "@/assets/logo.png";
import { useLanguage, translations } from "@/hooks/use-language";
import { logger } from "@/lib/logger";


const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [focus, setFocus] = useState<"love" | "career" | "money">("love");
  const [question, setQuestion] = useState("");
  const [showOracleForm, setShowOracleForm] = useState(false);

  useEffect(() => {
    // Check auth state but don't redirect
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session) {
        setName(session.user.user_metadata?.display_name || "");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session) {
        setName(session.user.user_metadata?.display_name || "");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleStart = () => {
    const validation = userInputSchema.safeParse({ name, question, focus });
    
    if (!validation.success) {
      logger.debug("Validation failed", validation.error.errors);
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
    sessionStorage.setItem("userLanguage", language);
    
    navigate("/reading");
  };

  return (
    <CaveBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-8 animate-float">
          {/* Logo/Header */}
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
              {t.tagline}
            </p>
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground font-crimson"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t.signOut}
              </Button>
            )}
          </div>

          {/* Two Main Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Option 1: Personality Test */}
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-4 shadow-2xl hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all">
              <div className="text-center space-y-3">
                <div className="text-6xl">🔮</div>
                <h2 className="text-2xl font-cinzel font-bold text-foreground">
                  {language === 'es' ? 'Descubre tu Carta' : 'Discover Your Card'}
                </h2>
                <p className="text-muted-foreground font-crimson">
                  {language === 'es' 
                    ? 'Responde 10 preguntas y descubre qué carta del tarot representa tu personalidad' 
                    : 'Answer 10 questions and discover which tarot card represents your personality'}
                </p>
              </div>
              <Button
                onClick={() => navigate("/personality-test")}
                className="w-full bg-gradient-mystic hover:opacity-90 text-primary-foreground text-lg h-14 font-cinzel shadow-lg"
                style={{ boxShadow: 'var(--glow-purple)' }}
              >
                ✨ {language === 'es' ? 'Comenzar Test' : 'Start Test'}
              </Button>
            </div>

            {/* Option 2: Oracle Reading */}
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-4 shadow-2xl hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all">
              <div className="text-center space-y-3">
                <div className="text-6xl">🌙</div>
                <h2 className="text-2xl font-cinzel font-bold text-foreground">
                  {language === 'es' ? 'Consulta el Oráculo' : 'Consult the Oracle'}
                </h2>
                <p className="text-muted-foreground font-crimson">
                  {language === 'es' 
                    ? 'Haz tu pregunta y recibe una lectura personalizada del tarot' 
                    : 'Ask your question and receive a personalized tarot reading'}
                </p>
              </div>
              <Button
                onClick={() => user ? setShowOracleForm(true) : navigate("/auth")}
                className="w-full bg-gradient-golden hover:opacity-90 text-primary-foreground text-lg h-14 font-cinzel shadow-lg"
                style={{ boxShadow: 'var(--glow-purple)' }}
              >
                💫 {user 
                  ? (language === 'es' ? 'Iniciar Lectura' : 'Start Reading')
                  : (language === 'es' ? 'Iniciar Sesión' : 'Sign In')}
              </Button>
            </div>
          </div>

          {/* Oracle Form (shown when user clicks and is logged in) */}
          {user && showOracleForm && (
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-6 shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-cinzel font-bold text-foreground">
                  {language === 'es' ? 'Prepara tu consulta' : 'Prepare your consultation'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOracleForm(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-cinzel">
                  {t.greeting}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  className="bg-background/50 border-border font-crimson"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-foreground font-cinzel text-lg">
                  {t.step1}
                </Label>
                <RadioGroup value={focus} onValueChange={(value: any) => setFocus(value)}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/30">
                    <RadioGroupItem value="love" id="love" />
                    <Label htmlFor="love" className="cursor-pointer flex-1 text-foreground font-crimson">
                      💜 {t.love}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/30">
                    <RadioGroupItem value="career" id="career" />
                    <Label htmlFor="career" className="cursor-pointer flex-1 text-foreground font-crimson">
                      ⭐ {t.career}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/30">
                    <RadioGroupItem value="money" id="money" />
                    <Label htmlFor="money" className="cursor-pointer flex-1 text-foreground font-crimson">
                      ✨ {t.money}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question" className="text-foreground font-cinzel text-lg">
                  {t.step2}
                </Label>
                <Textarea
                  id="question"
                  placeholder={t.questionPlaceholder}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  maxLength={500}
                  className="bg-background/50 border-border font-crimson min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground font-crimson">
                  {question.length}/500 {language === 'es' ? 'caracteres' : 'characters'}
                </p>
              </div>

              <Button
                onClick={handleStart}
                disabled={!name.trim() || !question.trim() || question.length < 10}
                className="w-full bg-gradient-mystic hover:opacity-90 text-primary-foreground text-lg h-14 font-cinzel shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: 'var(--glow-purple)' }}
                title={!name.trim() ? t.warningName : !question.trim() ? t.warningQuestion : question.length < 10 ? t.warningLength : ""}
              >
                {t.revealDestiny}
              </Button>

              {(!name.trim() || !question.trim() || question.length < 10) && (
                <p className="text-xs text-amber-400 text-center font-crimson mt-2">
                  {!name.trim() ? t.warningName : 
                   !question.trim() ? t.warningQuestion : 
                   t.warningLength}
                </p>
              )}
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground font-crimson italic">
            {t.footer}
          </p>
        </div>
      </div>
    </CaveBackground>
  );
};

export default Onboarding;
