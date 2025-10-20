import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
      className="text-muted-foreground hover:text-foreground font-crimson gap-2"
      title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      {language === 'es' ? (
        <span className="text-2xl">🇬🇧</span>
      ) : (
        <span className="text-2xl">🇪🇸</span>
      )}
    </Button>
  );
};

export default LanguageToggle;
