import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, Crown } from "lucide-react";
import CaveBackground from "@/components/CaveBackground";
import LanguageToggle from "@/components/LanguageToggle";
import AdSense from "@/components/AdSense";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getCardImagePath } from "@/lib/tarot-utils";
import { useLanguage, translations } from "@/hooks/use-language";

interface TarotCard {
  id: number;
  name: string;
  meaning: string;
  fullReading?: string;
}

const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];
  const [cards, setCards] = useState<any[]>([]);
  const [userName, setUserName] = useState("");
  const [userFocus, setUserFocus] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [userLanguage, setUserLanguage] = useState("es");
  const [aiReading, setAiReading] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [readingId, setReadingId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadReading = async () => {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (!currentUser) {
        navigate("/auth");
        return;
      }

      // Check if we have a reading ID in session storage
      const storedReadingId = sessionStorage.getItem("currentReadingId");
      
      if (storedReadingId) {
        // Load from database
        const { data: reading, error } = await supabase
          .from('tarot_readings')
          .select('*')
          .eq('id', storedReadingId)
          .single();

        if (!error && reading) {
          setReadingId(reading.id);
          setCards(reading.selected_cards as any[]);
          setUserName(reading.user_name);
          setUserFocus(reading.focus);
          setUserQuestion(reading.question);
          setUserLanguage(reading.language);
          setIsPaid(reading.is_premium_unlocked);
          
          if (reading.ai_reading) {
            setAiReading(reading.ai_reading);
          } else if (reading.question && reading.question.trim()) {
            // Auto-request AI reading if not already done
            requestAIReading(
              reading.user_name,
              reading.focus,
              reading.question,
              reading.selected_cards as any[],
              reading.language,
              reading.id
            );
          }
          return;
        }
      }

      // Fallback to session storage (for backwards compatibility)
      const selectedCards = sessionStorage.getItem("selectedCards");
      const name = sessionStorage.getItem("userName");
      const focus = sessionStorage.getItem("userFocus");
      const question = sessionStorage.getItem("userQuestion") || "";
      const lang = sessionStorage.getItem("userLanguage") || "es";

      if (!selectedCards || !name) {
        navigate("/");
        return;
      }

      setCards(JSON.parse(selectedCards));
      setUserName(name);
      setUserFocus(focus || "");
      setUserQuestion(question);
      setUserLanguage(lang);

      // Auto-request AI reading if user has a question
      if (question && question.trim()) {
        requestAIReading(name, focus || "", question, JSON.parse(selectedCards), lang);
      }
    };

    loadReading();
  }, [navigate]);

  const requestAIReading = async (
    name: string,
    focus: string,
    question: string,
    cardsData: any[],
    lang: string = "es",
    existingReadingId?: string
  ) => {
    if (!question || !question.trim()) {
      toast({
        title: language === 'es' ? "Pregunta requerida" : "Question required",
        description: language === 'es' ? "Necesitas ingresar una pregunta para obtener la lectura premium con IA" : "You need to enter a question to get the premium AI reading",
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
          language: lang,
        }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setAiReading(data.response);

      // Update database with AI reading
      const readingIdToUpdate = existingReadingId || readingId;
      if (readingIdToUpdate) {
        await supabase
          .from('tarot_readings')
          .update({ ai_reading: data.response })
          .eq('id', readingIdToUpdate);
      }
      
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

  const parseReadingSections = (reading: string) => {
    const sections = {
      pasado: "",
      presente: "",
      futuro: ""
    };

    // Try to split by section headers
    const pasadoMatch = reading.match(/(?:pasado|el pasado)[:\s]+([\s\S]*?)(?=(?:presente|el presente)[:\s]+|$)/i);
    const presenteMatch = reading.match(/(?:presente|el presente)[:\s]+([\s\S]*?)(?=(?:futuro|el futuro)[:\s]+|$)/i);
    const futuroMatch = reading.match(/(?:futuro|el futuro)[:\s]+([\s\S]*?)$/i);

    if (pasadoMatch) sections.pasado = pasadoMatch[1].trim();
    if (presenteMatch) sections.presente = presenteMatch[1].trim();
    if (futuroMatch) sections.futuro = futuroMatch[1].trim();

    // If no sections found, split into thirds
    if (!pasadoMatch && !presenteMatch && !futuroMatch) {
      const lines = reading.split('\n').filter(l => l.trim());
      const third = Math.ceil(lines.length / 3);
      sections.pasado = lines.slice(0, third).join('\n');
      sections.presente = lines.slice(third, third * 2).join('\n');
      sections.futuro = lines.slice(third * 2).join('\n');
    }

    return sections;
  };

  const handleUnlockPremium = async () => {
    setIsPaid(true);
    
    // Update database
    if (readingId) {
      await supabase
        .from('tarot_readings')
        .update({ is_premium_unlocked: true })
        .eq('id', readingId);
    }
    
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
            <div className="flex justify-center items-center gap-4 mb-4">
              <LanguageToggle />
            </div>
            <div className="flex justify-center">
              <div
                className="w-20 h-20 rounded-full bg-gradient-mystic flex items-center justify-center animate-glow"
                style={{ boxShadow: 'var(--glow-purple)' }}
              >
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-cinzel font-bold bg-gradient-golden bg-clip-text text-transparent">
              {t.yourReading}
            </h1>
            <p className="text-muted-foreground text-lg font-crimson">
              {getFocusEmoji(userFocus)} {language === 'es' ? 'Para' : 'For'} {userName}, {language === 'es' ? 'sobre' : 'about'} {userFocus}
            </p>
          </div>

          {/* AdSense Banner - Top */}
          <AdSense className="my-6" />

          {/* User Question */}
          {userQuestion && (
            <Card className="bg-card/80 backdrop-blur-sm border-border p-6">
                <div className="flex items-start gap-3">
                  <Crown className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
                  <div className="space-y-2 flex-1">
                    <h3 className="font-cinzel text-lg text-foreground">{t.yourQuestion}</h3>
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
                  <h3 className="font-cinzel text-xl text-foreground">{t.oracleReading}</h3>
                </div>
                
                {isLoadingAI ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-muted-foreground font-crimson italic">
                      {t.consulting}
                    </p>
                  </div>
                ) : aiReading ? (
                  <div className="space-y-4">
                    <div className="space-y-6">
                      {(() => {
                        const sections = parseReadingSections(aiReading);
                        return (
                          <>
                            {/* Pasado Section - Always visible */}
                            {sections.pasado && (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
                                  <h4 className="font-cinzel text-lg text-yellow-500 uppercase tracking-wider">
                                    🕰️ {t.past}
                                  </h4>
                                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
                                </div>
                                <p className="text-foreground font-crimson leading-relaxed whitespace-pre-line pl-4">
                                  {sections.pasado}
                                </p>
                              </div>
                            )}

                            {/* Presente Section - Always visible */}
                            {sections.presente && (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                                  <h4 className="font-cinzel text-lg text-purple-400 uppercase tracking-wider">
                                    ⚡ {t.present}
                                  </h4>
                                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                                </div>
                                <p className="text-foreground font-crimson leading-relaxed whitespace-pre-line pl-4">
                                  {sections.presente}
                                </p>
                              </div>
                            )}

                            {/* Futuro Section - Locked until payment */}
                              <div className="space-y-3 relative">
                                <div className="flex items-center gap-2">
                                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                                  <h4 className="font-cinzel text-lg text-blue-400 uppercase tracking-wider flex items-center gap-2">
                                    🔮 {t.future}
                                    {!isPaid && <Crown className="w-5 h-5 text-yellow-500" />}
                                  </h4>
                                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                                </div>
                                
                                {isPaid ? (
                                  <p className="text-foreground font-crimson leading-relaxed whitespace-pre-line pl-4">
                                    {sections.futuro}
                                  </p>
                                ) : (
                                  <div className="relative min-h-[120px] flex items-center justify-center">
                                    <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-br from-purple-900/70 to-blue-900/70 rounded-lg border-2 border-yellow-500/30" />
                                    <div className="relative z-10 text-center space-y-3 p-6">
                                      <Crown className="w-12 h-12 text-yellow-500 mx-auto animate-pulse" />
                                      <p className="text-yellow-500 font-cinzel font-bold text-lg">
                                        🔒 {t.premiumContent}
                                      </p>
                                      <p className="text-muted-foreground font-crimson text-sm">
                                        {t.unlockFuture}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                          </>
                        );
                      })()}
                    </div>
                    
                    {!isPaid && (
                      <div className="text-center pt-4 border-t border-yellow-500/30">
                        <p className="text-muted-foreground font-crimson mb-4 italic">
                          {language === 'es' ? 'Desbloquea la sección de Futuro con el servicio premium' : 'Unlock the Future section with the premium service'}
                        </p>
                        <div id="paypal-container-7NGDMYJA95JNY"></div>
                        <script>
                          {`
                            paypal.HostedButtons({
                              hostedButtonId: "7NGDMYJA95JNY",
                            }).render("#paypal-container-7NGDMYJA95JNY")
                          `}
                        </script>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Button
                      onClick={() => requestAIReading(userName, userFocus, userQuestion, cards, userLanguage)}
                      className="bg-gradient-mystic hover:opacity-90 text-primary-foreground font-cinzel"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      {language === 'es' ? 'Obtener Lectura del Oráculo' : 'Get Oracle Reading'}
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
                      {index === 0 ? t.past : index === 1 ? t.present : t.future}
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
                    {t.cardNames?.[card.name] || card.name}
                  </h3>
                  <p className="text-sm text-primary font-crimson italic">
                    {t.cardMeanings?.[card.name] || card.meaning}
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

          {/* AdSense Banner - Bottom */}
          <AdSense className="my-6" />

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                // Clear current reading ID to create a new one
                sessionStorage.removeItem("currentReadingId");
                navigate("/");
              }}
              className="font-cinzel"
            >
              {t.newReading}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground font-crimson italic">
            {t.wisdom}
          </p>
        </div>
      </div>
    </CaveBackground>
  );
};

export default Results;
