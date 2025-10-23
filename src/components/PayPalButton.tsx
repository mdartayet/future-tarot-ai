import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Crown, Loader2 } from 'lucide-react';

interface PayPalButtonProps {
  onSuccess: () => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

const PayPalButton = ({ onSuccess }: PayPalButtonProps) => {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  
  const text = {
    es: {
      title: '🔮 Desbloquea la Lectura del Futuro',
      description: 'Obtén la interpretación completa del oráculo con IA',
      price: '$2.99 USD',
      loading: 'Cargando método de pago seguro...',
      secure: '🔒 Pago 100% seguro con PayPal',
      error: 'Error al cargar PayPal. Intenta recargar la página.'
    },
    en: {
      title: '🔮 Unlock the Future Reading',
      description: 'Get the complete AI oracle interpretation',
      price: '$2.99 USD',
      loading: 'Loading secure payment method...',
      secure: '🔒 100% secure payment with PayPal',
      error: 'Error loading PayPal. Try reloading the page.'
    }
  };

  const t = text[language];

  useEffect(() => {
    const loadPayPalScript = () => {
      return new Promise((resolve, reject) => {
        // Check if PayPal is already loaded
        if (window.paypal) {
          resolve(window.paypal);
          return;
        }

        // Check if script already exists
        const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
        if (existingScript) {
          existingScript.addEventListener('load', () => {
            if (window.paypal) {
              resolve(window.paypal);
            } else {
              reject(new Error('PayPal failed to load'));
            }
          });
          return;
        }

        // Create new script
        const script = document.createElement('script');
        script.src = 'https://www.paypal.com/sdk/js?client-id=BAAykfaG1Puvzhp8isz8hV9XwKiAMltjJ6JI06JzPc3fV572cQdpoGCMc36VYoIBqguX3wulxXspjYa8g8&components=hosted-buttons&disable-funding=venmo&currency=USD';
        script.async = true;
        
        script.onload = () => {
          if (window.paypal) {
            console.log('✅ PayPal SDK loaded successfully');
            resolve(window.paypal);
          } else {
            reject(new Error('PayPal SDK loaded but window.paypal not available'));
          }
        };

        script.onerror = () => {
          reject(new Error('Failed to load PayPal SDK script'));
        };

        document.head.appendChild(script);
      });
    };

    const renderPayPalButton = async () => {
      if (!paypalRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // Wait for PayPal to load
        await loadPayPalScript();

        // Clear container
        paypalRef.current.innerHTML = '';

        // Render button
        if (window.paypal) {
          window.paypal.HostedButtons({
            hostedButtonId: "7NGDMYJA95JNY"
          }).render(paypalRef.current);

          console.log('✅ PayPal button rendered successfully');
          setIsLoading(false);

          // Note: PayPal Hosted Buttons handle the transaction automatically
          // The onSuccess callback would need to be triggered via IPN or webhooks
          // For now, we'll show a message that the user needs to refresh after payment
        }
      } catch (err) {
        console.error('❌ Error loading PayPal:', err);
        setError(t.error);
        setIsLoading(false);
      }
    };

    renderPayPalButton();
  }, [t.error]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-purple-900/60 via-indigo-900/60 to-blue-900/60 backdrop-blur-sm rounded-xl border-2 border-yellow-500/40 p-6 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6 space-y-3">
          <div className="flex justify-center">
            <Crown className="w-12 h-12 text-yellow-500 animate-pulse" />
          </div>
          
          <h3 className="text-2xl font-cinzel font-bold text-yellow-400">
            {t.title}
          </h3>
          
          <p className="text-foreground/90 font-crimson italic">
            {t.description}
          </p>
          
          <div className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 px-8 py-3 rounded-full shadow-lg">
            <span className="text-2xl font-cinzel font-bold text-purple-900">
              {t.price}
            </span>
          </div>
        </div>

        {/* PayPal Button Container */}
        <div className="min-h-[80px] flex items-center justify-center mb-4">
          {isLoading && !error && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-yellow-500 animate-spin" />
              <p className="text-sm text-muted-foreground font-crimson">
                {t.loading}
              </p>
            </div>
          )}
          
          {error && (
            <p className="text-sm text-red-400 font-crimson text-center">
              {error}
            </p>
          )}
          
          <div ref={paypalRef} className={isLoading || error ? 'hidden' : 'w-full'} />
        </div>

        {/* Important Notice */}
        <div className="space-y-2 mb-4">
          <div className="text-center text-xs text-yellow-400/90 font-crimson bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
            <p className="mb-1">
              ⚠️ {language === 'es' 
                ? 'Después de completar el pago, recarga la página para ver tu lectura del futuro.' 
                : 'After completing payment, reload the page to view your future reading.'}
            </p>
          </div>
        </div>

        {/* Security notice */}
        <div className="text-center pt-4 border-t border-yellow-500/20">
          <p className="text-xs text-yellow-400/80 font-crimson">
            {t.secure}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayPalButton;
