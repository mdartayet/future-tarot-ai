import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { zodiacSigns } from "@/data/zodiac-signs";
import CaveBackground from "@/components/CaveBackground";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/hooks/use-language";

const Horoscope = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSignSelect = async (signName: string) => {
    setSelectedSign(signName);
    setLoading(true);
    setPrediction("");

    try {
      const { data, error } = await supabase.functions.invoke('generate-horoscope', {
        body: { sign: signName, language }
      });

      if (error) throw error;

      setPrediction(data.prediction);
    } catch (error: any) {
      console.error('Error loading horoscope:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo cargar el horóscopo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <CaveBackground>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-6">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === 'es' ? 'Volver' : 'Back'}
          </Button>
          
          <LanguageToggle />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
            {language === 'es' ? 'Horóscopo Diario' : 'Daily Horoscope'}
          </h1>
          <p className="text-white/80 text-lg capitalize">
            {today}
          </p>
          <p className="text-white/60 mt-2">
            {language === 'es' 
              ? 'Predicciones basadas en las posiciones planetarias y constelaciones'
              : 'Predictions based on planetary positions and constellations'}
          </p>
        </div>

        {!selectedSign ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {zodiacSigns.map((sign) => (
              <Card
                key={sign.name}
                className="bg-white/10 backdrop-blur-md border-white/20 p-6 cursor-pointer hover:bg-white/20 transition-all hover:scale-105"
                onClick={() => handleSignSelect(sign.name)}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">{sign.symbol}</div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {sign.name}
                  </h3>
                  <p className="text-white/60 text-sm mb-1">{sign.dateRange}</p>
                  <p className="text-white/40 text-xs">{sign.element}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">
                  {zodiacSigns.find(s => s.name === selectedSign)?.symbol}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedSign}
                </h2>
                <p className="text-white/60">
                  {zodiacSigns.find(s => s.name === selectedSign)?.dateRange}
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : prediction ? (
                <div className="text-white/90 space-y-4 leading-relaxed">
                  {prediction.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="text-justify">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              ) : null}

              <div className="mt-8 text-center">
                <Button
                  onClick={() => {
                    setSelectedSign(null);
                    setPrediction("");
                  }}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  {language === 'es' ? 'Ver otros signos' : 'View other signs'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </CaveBackground>
  );
};

export default Horoscope;