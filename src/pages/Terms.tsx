import CaveBackground from "@/components/CaveBackground";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const Terms = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const content = language === 'es' ? {
    title: "Avisos Legales y Términos de Uso",
    lastUpdated: "Fecha de última actualización: 20 de Octubre de 2025",
    sections: [
      {
        title: "Aviso Importante: Solo con Fines de Entretenimiento y Exención de Responsabilidad",
        content: `"Tarot Futura" (en adelante, "la Aplicación"), propiedad y operada por Heyhay.ai, ha sido diseñada y desarrollada exclusivamente con fines de entretenimiento y auto-reflexión. Las lecturas de tarot y las interpretaciones proporcionadas tienen como objetivo ofrecer una perspectiva introspectiva, estimular el pensamiento personal y servir como una guía lúdica para la exploración de posibilidades.`
      },
      {
        title: "No sustituye el consejo profesional",
        content: `Bajo ninguna circunstancia, el contenido, las lecturas o las interpretaciones ofrecidas en esta Aplicación deben considerarse como un sustituto del consejo profesional, diagnóstico, tratamiento o terapia de expertos cualificados en campos como la medicina, la psicología, la psiquiatría, la salud mental, las finanzas, el derecho, los negocios o cualquier otra área especializada. Siempre se recomienda encarecidamente consultar a profesionales cualificados para cualquier decisión importante o problema personal en su vida.`
      },
      {
        title: "Exención de responsabilidad",
        content: `Los creadores y operadores de "Tarot Futura" no asumen ninguna responsabilidad por las acciones o decisiones que el usuario tome basándose en las lecturas o interpretaciones proporcionadas por esta Aplicación. El usuario reconoce y acepta que es el único responsable de sus propias elecciones y sus consecuencias. El uso de esta Aplicación implica la aceptación expresa de esta exención de responsabilidad. Le animamos a utilizar su propio juicio crítico, discernimiento y sentido común en todo momento.`
      },
      {
        title: "Publicidad y Pagos",
        content: "Esta Aplicación utiliza servicios de terceros (Google AdSense y Stripe) para publicidad y procesamiento de pagos. La información que compartimos para estos fines está detallada en nuestra Política de Privacidad."
      },
      {
        title: "Recordatorio Importante",
        content: "Esta lectura es solo para fines de entretenimiento y reflexión personal. No sustituye el consejo profesional. Utilice su propio juicio."
      }
    ],
    backButton: "Volver"
  } : {
    title: "Legal Disclaimers and Terms of Use",
    lastUpdated: "Last updated: October 20, 2025",
    sections: [
      {
        title: "Important Notice: For Entertainment Purposes Only and Disclaimer of Liability",
        content: `"Tarot Futura" (hereinafter, "the Application"), owned and operated by Heyhay.ai, has been designed and developed exclusively for entertainment and self-reflection purposes. The tarot readings and interpretations provided are intended to offer an introspective perspective, stimulate personal thinking and serve as a playful guide for exploring possibilities.`
      },
      {
        title: "Not a substitute for professional advice",
        content: `Under no circumstances should the content, readings or interpretations offered in this Application be considered as a substitute for professional advice, diagnosis, treatment or therapy from qualified experts in fields such as medicine, psychology, psychiatry, mental health, finance, law, business or any other specialized area. It is always strongly recommended to consult qualified professionals for any important decision or personal problem in your life.`
      },
      {
        title: "Disclaimer of liability",
        content: `The creators and operators of "Tarot Futura" assume no responsibility for actions or decisions that the user makes based on the readings or interpretations provided by this Application. The user acknowledges and agrees that they are solely responsible for their own choices and their consequences. Use of this Application implies express acceptance of this disclaimer. We encourage you to use your own critical judgment, discernment and common sense at all times.`
      },
      {
        title: "Advertising and Payments",
        content: "This Application uses third-party services (Google AdSense and Stripe) for advertising and payment processing. The information we share for these purposes is detailed in our Privacy Policy."
      },
      {
        title: "Important Reminder",
        content: "This reading is for entertainment and personal reflection purposes only. It does not substitute professional advice. Use your own judgment."
      }
    ],
    backButton: "Back"
  };

  return (
    <CaveBackground>
      <div className="min-h-screen p-6 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 font-cinzel"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {content.backButton}
          </Button>

          <Card className="bg-card/90 backdrop-blur-sm border border-border p-8">
            <h1 className="text-4xl font-cinzel font-bold bg-gradient-golden bg-clip-text text-transparent mb-4">
              {content.title}
            </h1>
            <p className="text-sm text-muted-foreground font-crimson mb-8">
              {content.lastUpdated}
            </p>

            <div className="space-y-6 font-crimson">
              {content.sections.map((section, index) => (
                <div key={index} className="space-y-3">
                  <h2 className="text-xl font-cinzel font-semibold text-foreground">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </CaveBackground>
  );
};

export default Terms;
