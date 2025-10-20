import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Languages } from "lucide-react";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
      className="text-muted-foreground hover:text-foreground font-crimson gap-2"
    >
      <Languages className="w-4 h-4" />
      <span className="uppercase">{language === 'es' ? 'EN' : 'ES'}</span>
    </Button>
  );
};

export default LanguageToggle;
