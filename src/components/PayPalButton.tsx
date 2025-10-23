import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Crown, Loader2, AlertCircle } from 'lucide-react';

interface PayPalButtonProps {
  amount: string; // "2.99"
  onSuccess: (details: any) => void;
  onError?: (error: any) => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

const PayPalButton = ({ amount, onSuccess, onError }: PayPalButtonProps) => {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  
  // PayPal Client ID from environment variable
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "";
  
  const text = {
    es: {
      title: '🔮 Desbloquea la Lectura del Futuro',
      description: 'Obtén la interpretación completa del oráculo con IA',
      loading: 'Cargando método de pago seguro...',
      secure: '🔒 Pago 100% seguro con PayPal',
      error: 'Error al cargar PayPal',
      configError: '⚠️ PayPal no está configurado. Contacta al administrador.'
    },
    en: {
      title: '🔮 Unlock the Future Reading',
      description: 'Get the complete AI oracle interpretation',
      loading: 'Loading secure payment method...',
      secure: '🔒 100% secure payment with PayPal',
      error: 'Error loading PayPal',
      configError: '⚠️ PayPal is not configured. Contact administrator.'
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
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
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

        // Render PayPal Buttons
        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 45
          },
          
          // Create the order
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: language === 'es' 
                  ? 'Lectura del Tarot - Futuro Desbloqueado'
                  : 'Tarot Reading - Future Unlocked',
                amount: {
                  currency_code: 'USD',
                  value: amount
                }
              }]
            });
          },
          
          // Handle successful payment
          onApprove: async (data: any, actions: any) => {
            try {
              const details = await actions.order.capture();
              console.log('✅ Payment successful:', details);
              
              // Call success callback
              onSuccess(details);
            } catch (err) {
              console.error('❌ Error capturing order:', err);
              setError(t.error);
              if (onError) onError(err);
            }
          },
          
          // Handle errors
          onError: (err: any) => {
            console.error('❌ PayPal error:', err);
            setError(t.error);
            if (onError) onError(err);
          },
          
          // Handle cancellation
          onCancel: () => {
            console.log('ℹ️ Payment cancelled by user');
          }
        }).render(paypalRef.current);

        console.log('✅ PayPal button rendered successfully');
        setIsLoading(false);

      } catch (err) {
        console.error('❌ Error loading PayPal:', err);
        setError(t.error);
        setIsLoading(false);
        if (onError) onError(err);
      }
    };

    renderPayPalButton();
  }, [amount, language, onSuccess, onError, t.error]);

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
              ${amount} USD
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
            <div className="flex flex-col items-center gap-2 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <p className="text-sm font-crimson text-center">
                {error}
              </p>
            </div>
          )}
          
          <div ref={paypalRef} className={isLoading || error ? 'hidden' : 'w-full'} />
        </div>

        {/* Security notice */}
        <div className="text-center pt-4 border-t border-yellow-500/20">
          <p className="text-xs text-yellow-400/80 font-crimson">
            {t.secure}
          </p>
          <p className="text-xs text-yellow-400/60 font-crimson mt-1">
            {language === 'es' ? '🧪 Modo Sandbox (Pruebas)' : '🧪 Sandbox Mode (Testing)'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayPalButton;
