import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import CaveBackground from "@/components/CaveBackground";
import TarotCard from "@/components/TarotCard";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/hooks/use-language";
import { personalityQuestions, tarotPersonalities } from "@/data/tarot-personality";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const PersonalityTest = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Check auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    // Save answer
    const newAnswers = { ...answers, [currentQuestion]: selectedAnswer };
    setAnswers(newAnswers);

    // Update scores
    const question = personalityQuestions[currentQuestion];
    const option = question.options[selectedAnswer];
    const newScores = { ...scores };

    Object.entries(option.scores).forEach(([card, points]) => {
      newScores[card] = (newScores[card] || 0) + points;
    });

    setScores(newScores);

    // Move to next question or show result
    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1] ?? null);
    } else {
      // Calculate result
      const maxScore = Math.max(...Object.values(newScores));
      const winningCard = Object.entries(newScores).find(
        ([_, score]) => score === maxScore
      )?.[0];

      if (winningCard) {
        setResult(winningCard);
        setTimeout(() => setIsRevealed(true), 500);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] ?? null);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setScores({});
    setResult(null);
    setSelectedAnswer(null);
    setIsRevealed(false);
  };

  const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100;
  const question = personalityQuestions[currentQuestion];

  if (result) {
    const cardData = tarotPersonalities[result];
    
    return (
      <CaveBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-4xl space-y-8 animate-float">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center items-center gap-4 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Home className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Inicio' : 'Home'}
                </Button>
                <LanguageToggle />
              </div>
              <h1 className="text-4xl md:text-5xl font-cinzel font-bold bg-gradient-golden bg-clip-text text-transparent">
                {language === 'es' ? '🔮 Tu Carta del Tarot' : '🔮 Your Tarot Card'}
              </h1>
              <p className="text-muted-foreground text-lg font-crimson italic">
                {language === 'es' 
                  ? 'Descubre la carta que representa tu personalidad' 
                  : 'Discover the card that represents your personality'}
              </p>
            </div>

            {/* Result Card */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Card Display */}
              <div className="flex justify-center items-center">
                <div className="w-full max-w-sm">
                  <TarotCard
                    name={cardData.imagePath}
                    isRevealed={isRevealed}
                    className="shadow-2xl"
                  />
                </div>
              </div>

              {/* Card Information */}
              <Card className="bg-card/80 backdrop-blur-sm border border-border p-8 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-3xl font-cinzel font-bold text-primary">
                    {language === 'es' ? cardData.nameEs : cardData.name}
                  </h2>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-cinzel">
                      {language === 'es' ? 'Numerología:' : 'Numerology:'} 
                      <span className="ml-2 text-lg text-foreground">{cardData.numerology}</span>
                    </p>
                    <p className="text-sm text-muted-foreground font-cinzel">
                      {language === 'es' ? 'Color:' : 'Color:'} 
                      <span className="ml-2 text-lg text-foreground">
                        {language === 'es' ? cardData.colorEs : cardData.color}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-cinzel font-semibold text-secondary">
                      {language === 'es' ? 'Tu Personalidad' : 'Your Personality'}
                    </h3>
                    <p className="text-foreground font-crimson italic">
                      {language === 'es' ? cardData.personality.es : cardData.personality.en}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-cinzel font-semibold text-secondary">
                      {language === 'es' ? 'Rasgos Principales' : 'Main Traits'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(language === 'es' ? cardData.traits.es : cardData.traits.en).map((trait, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-crimson"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-cinzel font-semibold text-secondary">
                      {language === 'es' ? '¿Por qué esta carta?' : 'Why this card?'}
                    </h3>
                    <p className="text-foreground font-crimson leading-relaxed">
                      {language === 'es' ? cardData.description.es : cardData.description.en}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleRestart}
                    className="flex-1 bg-gradient-mystic hover:opacity-90 text-primary-foreground font-cinzel"
                  >
                    {language === 'es' ? 'Reintentar' : 'Try Again'}
                  </Button>
                  <Button
                    onClick={() => navigate("/")}
                    variant="outline"
                    className="flex-1 font-cinzel"
                  >
                    {language === 'es' ? 'Inicio' : 'Home'}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </CaveBackground>
    );
  }

  return (
    <CaveBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-8 animate-float">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground"
              >
                <Home className="w-4 h-4 mr-2" />
                {language === 'es' ? 'Inicio' : 'Home'}
              </Button>
              <LanguageToggle />
            </div>
            <div className="flex justify-center">
              <img 
                src={logo} 
                alt="Tarot Logo" 
                className="w-24 h-24 animate-float drop-shadow-2xl object-contain"
                style={{ filter: 'drop-shadow(0 0 20px rgba(124, 58, 237, 0.5))' }}
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold bg-gradient-golden bg-clip-text text-transparent">
              {language === 'es' ? 'Descubre Tu Carta' : 'Discover Your Card'}
            </h1>
            <p className="text-muted-foreground font-crimson italic">
              {language === 'es' 
                ? 'Responde 10 preguntas para conocer tu esencia' 
                : 'Answer 10 questions to know your essence'}
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-crimson text-muted-foreground">
              <span>{language === 'es' ? 'Pregunta' : 'Question'} {currentQuestion + 1} / {personalityQuestions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="bg-card/80 backdrop-blur-sm border border-border p-8 space-y-6">
            <h2 className="text-2xl font-cinzel font-bold text-foreground text-center">
              {language === 'es' ? question.question.es : question.question.en}
            </h2>

            <RadioGroup 
              value={selectedAnswer?.toString()} 
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            >
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted/50 transition-colors border border-border/30 cursor-pointer"
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="cursor-pointer flex-1 text-foreground font-crimson"
                    >
                      {language === 'es' ? option.text.es : option.text.en}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {/* Navigation */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
                className="flex-1 font-cinzel"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'es' ? 'Anterior' : 'Previous'}
              </Button>
              <Button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="flex-1 bg-gradient-mystic hover:opacity-90 text-primary-foreground font-cinzel"
              >
                {currentQuestion === personalityQuestions.length - 1
                  ? (language === 'es' ? 'Ver Resultado' : 'See Result')
                  : (language === 'es' ? 'Siguiente' : 'Next')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </CaveBackground>
  );
};

export default PersonalityTest;
