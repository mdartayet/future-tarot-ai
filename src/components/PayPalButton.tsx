import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Crown, Loader2, AlertCircle } from 'lucide-react';

interface PayPalButtonProps {
  amount: string;
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
  
  const PAYPAL_CLIENT_ID = "AY6Q51CkwCCKcJpEshUzI0HU6wnqUjdKnVeO3k7TJZ6feua4UCUJfSqwGZMYPtGyQ2ouIoGP3y9r5SIQ";
  
  const text = {
    es: {
      title: '🔮 Desbloquea la Lectura del Futuro',
      description: 'Obtén la interpretación completa del oráculo con IA',
      loading: 'Cargando método de pago seguro...',
      secure: '🔒 Pago 100% seguro con PayPal',
      error: 'Error al cargar PayPal',
      sandbox: '🧪 Modo Sandbox (Pruebas)'
    },
    en: {
      title: '🔮 Unlock the Future Reading',
      description: 'Get the complete AI oracle interpretation',
      loading: 'Loading secure payment method...',
      secure: '🔒 100% secure payment with PayPal',
      error: 'Error loading PayPal',
      sandbox: '🧪 Sandbox Mode (Testing)'
    }
  };

  const t = text[language];

  useEffect(() => {
    console.log('🚀 Starting PayPal button render...');
    
    const loadPayPalScript = () => {
      return new Promise((resolve, reject) => {
        console.log('⏳ Loading PayPal SDK...');
        console.log('🔍 PayPal Client ID:', PAYPAL_CLIENT_ID ? 'Configured' : 'Missing');
        
        if (window.paypal) {
          console.log('✅ PayPal SDK already loaded');
          resolve(window.paypal);
          return;
        }

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

        console.log('📦 Creating new PayPal script tag...');
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

        console.log('📤 PayPal script added to document head');
        document.head.appendChild(script);
      });
    };

    const renderPayPalButton = async () => {
      if (!paypalRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        await loadPayPalScript();

        console.log('🧹 Clearing PayPal container...');
        paypalRef.current.innerHTML = '';

        console.log('🎨 Rendering PayPal button...');
        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 45
          },
          
          createOrder: (data: any, actions: any) => {
            console.log('💳 Creating PayPal order...');
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
          
          onApprove: async (data: any, actions: any) => {
            try {
              console.log('✅ Payment approved, capturing order...');
              const details = await actions.order.capture();
              console.log('✅ Payment successful:', details);
              
              // Llamar directamente al callback sin verificación adicional
              onSuccess(details);
              
            } catch (err) {
              console.error('❌ Error capturing order:', err);
              setError(t.error);
              if (onError) onError(err);
            }
          },
          
          onError: (err: any) => {
            console.error('❌ PayPal error:', err);
            setError(t.error);
            if (onError) onError(err);
          },
          
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

        <div className="text-center pt-4 border-t border-yellow-500/20">
          <p className="text-xs text-yellow-400/80 font-crimson">
            {t.secure}
          </p>
          <p className="text-xs text-yellow-400/60 font-crimson mt-1">
            {t.sandbox}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayPalButton;
