import CaveBackground from "@/components/CaveBackground";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const content = language === 'es' ? {
    title: "Política de Privacidad",
    lastUpdated: "Fecha de última actualización: 20 de Octubre de 2025",
    sections: [
      {
        title: "Introducción",
        content: `Esta Política de Privacidad describe cómo "Tarot Futura" (propiedad y operada por Heyhay.ai, en adelante "nosotros", "nuestro/a" o "la Aplicación") recopila, usa, mantiene y divulga su información cuando usted utiliza nuestra aplicación móvil (en adelante, "la Aplicación" o "el Servicio").

Al usar el Servicio, usted acepta la recopilación y el uso de información de acuerdo con esta Política de Privacidad. Si no está de acuerdo con esta Política de Privacidad, por favor, no utilice nuestra Aplicación.`
      },
      {
        title: "1. Cumplimiento con Leyes de Privacidad",
        content: "Nos comprometemos a proteger su privacidad y a cumplir con las leyes y regulaciones aplicables en materia de protección de datos, incluyendo, donde sea aplicable, el Reglamento General de Protección de Datos (GDPR) de la Unión Europea y la Ley de Privacidad del Consumidor de California (CCPA)."
      },
      {
        title: "2. Información que Recopilamos",
        content: `Nos esforzamos por recopilar únicamente la información necesaria para proporcionar y mejorar la funcionalidad de la Aplicación, ofrecer un servicio personalizado y mostrar publicidad relevante.

Información Personal Identificable (para Registro de Usuario): Para crear una cuenta en "Tarot Futura" y acceder a ciertas funcionalidades de la Aplicación, recopilamos la siguiente información personal que usted nos proporciona directamente:

• Nombre de Usuario (o Nombre): Para personalizar su experiencia dentro de la Aplicación.

• Dirección de Correo Electrónico: Para la creación de su cuenta, recuperación de contraseña, comunicación sobre su cuenta y, si lo ha consentido, para el envío de comunicaciones de marketing o actualizaciones. No recopilamos datos sensibles relacionados con el contenido de las preguntas del tarot.

Información de Transacción y Pago (procesada por terceros): Cuando usted realiza una compra dentro de la Aplicación para desbloquear funcionalidades, la transacción de pago es procesada por un proveedor de servicios de pago de terceros, como Stripe. Nosotros no almacenamos directamente la información sensible de su tarjeta de crédito o débito en nuestros servidores.

Información No Personal Identificable (Datos de Uso y Dispositivo): Recopilamos información sobre cómo interactúa con nuestra Aplicación, incluyendo datos de uso y datos del dispositivo.

No Recopilamos Información Personal Sensible Adicional: "Tarot Futura" no recopila intencionadamente información personal sensible como datos biométricos, información de salud o creencias religiosas/políticas.`
      },
      {
        title: "3. Cómo Usamos la Información Recopilada",
        content: `Utilizamos la información recopilada para los siguientes propósitos:

• Para Proporcionar y Mantener la Aplicación y su Cuenta
• Para Procesar Transacciones y Pagos
• Para Comunicarnos con Usted
• Para Personalizar su Experiencia
• Para Mejorar y Mantener la Aplicación
• Para Mostrar Publicidad
• Para Cumplir con Obligaciones Legales`
      },
      {
        title: "4. Compartir y Divulgar Información",
        content: `Con Proveedores de Servicios de Terceros: Compartimos información necesaria con proveedores de servicios que realizan funciones en nuestro behalf:

• Procesadores de Pago: Stripe recopila su información de pago directamente para procesar las transacciones. Puede consultar la política de privacidad de Stripe en: https://stripe.com/privacy.

• Servicios de Autenticación/Análisis: Para gestionar su cuenta y comprender el uso de la Aplicación.

Por Requisitos Legales: Podemos divulgar su información (incluida la personal) si es necesario para cumplir con una obligación legal, proteger nuestros derechos o propiedad, o investigar posibles infracciones (incluyendo fraude).`
      },
      {
        title: "5. Retención y Seguridad de Datos",
        content: `Retención: Retendremos su información personal (nombre y correo electrónico) durante el tiempo que su cuenta esté activa o según sea necesario para cumplir con nuestras obligaciones legales.

Seguridad: Implementamos medidas de seguridad técnicas y organizativas razonables. Para la información de pago sensible, no la almacenamos directamente, sino que es manejada de forma segura por Stripe (certificado PCI-DSS). Aun así, ningún método es 100% seguro y no podemos garantizar la seguridad absoluta de los datos.`
      },
      {
        title: "6. Sus Derechos de Protección de Datos y Opciones de Privacidad",
        content: `Usted tiene derechos sobre sus datos personales, incluyendo el derecho de acceso, rectificación, supresión ("Derecho al Olvido") y el derecho a retirar su consentimiento.

Derecho al Olvido/Eliminación de Cuenta: Si desea ejercer su derecho de supresión o eliminar su cuenta, contáctenos a través del correo electrónico de soporte.`
      },
      {
        title: "7. Privacidad de los Niños",
        content: "Nuestra Aplicación no está dirigida a menores de 13 años. No recopilamos conscientemente información personal de niños."
      },
      {
        title: "8. Contacto",
        content: `Si tiene alguna pregunta sobre esta Política de Privacidad, sus prácticas, o desea ejercer sus derechos de privacidad, puede contactarnos:

Por correo electrónico: soporte@heyhay.ai`
      }
    ],
    backButton: "Volver"
  } : {
    title: "Privacy Policy",
    lastUpdated: "Last updated: October 20, 2025",
    sections: [
      {
        title: "Introduction",
        content: `This Privacy Policy describes how "Tarot Futura" (owned and operated by Heyhay.ai, hereinafter "we", "our" or "the Application") collects, uses, maintains and discloses your information when you use our mobile application (hereinafter, "the Application" or "the Service").

By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with this Privacy Policy, please do not use our Application.`
      },
      {
        title: "1. Compliance with Privacy Laws",
        content: "We are committed to protecting your privacy and complying with applicable data protection laws and regulations, including, where applicable, the European Union General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA)."
      },
      {
        title: "2. Information We Collect",
        content: `We strive to collect only the information necessary to provide and improve the functionality of the Application, offer a personalized service and display relevant advertising.

Personally Identifiable Information (for User Registration): To create an account on "Tarot Futura" and access certain Application functionalities, we collect the following personal information that you provide directly:

• User Name (or Name): To personalize your experience within the Application.

• Email Address: For account creation, password recovery, communication about your account and, if you have consented, for sending marketing communications or updates. We do not collect sensitive data related to the content of tarot questions.

Transaction and Payment Information (processed by third parties): When you make a purchase within the Application to unlock functionalities, the payment transaction is processed by a third-party payment service provider, such as Stripe. We do not directly store your sensitive credit or debit card information on our servers.

Non-Personally Identifiable Information (Usage and Device Data): We collect information about how you interact with our Application, including usage data and device data.

We Do Not Collect Additional Sensitive Personal Information: "Tarot Futura" does not intentionally collect sensitive personal information such as biometric data, health information or religious/political beliefs.`
      },
      {
        title: "3. How We Use the Collected Information",
        content: `We use the collected information for the following purposes:

• To Provide and Maintain the Application and your Account
• To Process Transactions and Payments
• To Communicate with You
• To Personalize your Experience
• To Improve and Maintain the Application
• To Display Advertising
• To Comply with Legal Obligations`
      },
      {
        title: "4. Sharing and Disclosing Information",
        content: `With Third-Party Service Providers: We share necessary information with service providers that perform functions on our behalf:

• Payment Processors: Stripe collects your payment information directly to process transactions. You can review Stripe's privacy policy at: https://stripe.com/privacy.

• Authentication/Analytics Services: To manage your account and understand Application usage.

For Legal Requirements: We may disclose your information (including personal) if necessary to comply with a legal obligation, protect our rights or property, or investigate possible violations (including fraud).`
      },
      {
        title: "5. Data Retention and Security",
        content: `Retention: We will retain your personal information (name and email) for as long as your account is active or as necessary to fulfill our legal obligations.

Security: We implement reasonable technical and organizational security measures. For sensitive payment information, we do not store it directly, but it is securely handled by Stripe (PCI-DSS certified). However, no method is 100% secure and we cannot guarantee absolute data security.`
      },
      {
        title: "6. Your Data Protection Rights and Privacy Choices",
        content: `You have rights over your personal data, including the right of access, rectification, deletion ("Right to be Forgotten") and the right to withdraw your consent.

Right to be Forgotten/Account Deletion: If you wish to exercise your right to deletion or delete your account, contact us via the support email.`
      },
      {
        title: "7. Children's Privacy",
        content: "Our Application is not directed to children under 13 years of age. We do not knowingly collect personal information from children."
      },
      {
        title: "8. Contact",
        content: `If you have any questions about this Privacy Policy, its practices, or wish to exercise your privacy rights, you can contact us:

By email: soporte@heyhay.ai`
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
                  <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </CaveBackground>
  );
};

export default PrivacyPolicy;
