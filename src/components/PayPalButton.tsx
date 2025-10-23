import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Crown, Loader2, AlertCircle } from 'lucide-react';
import { logger } from '@/lib/logger';

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
        console.log('🔍 PayPal Client ID:', PAYPAL_CLIENT_ID ? 'Configured' : 'NOT CONFIGURED');
        
        // Check if Client ID is configured
        if (!PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID.trim() === '') {
          console.error('❌ PayPal Client ID is missing or empty');
          reject(new Error('PayPal Client ID not configured'));
          return;
        }

        // Check if PayPal is already loaded
        if (window.paypal) {
          console.log('✅ PayPal SDK already loaded');
          resolve(window.paypal);
          return;
        }

        // Check if script already exists
        const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
        if (existingScript) {
          console.log('⏳ PayPal script already exists, waiting for load...');
          existingScript.addEventListener('load', () => {
            if (window.paypal) {
              console.log('✅ PayPal SDK loaded from existing script');
              resolve(window.paypal);
            } else {
              console.error('❌ PayPal script loaded but window.paypal not available');
              reject(new Error('PayPal failed to load'));
            }
          });
          return;
        }

        // Create new script
        console.log('📦 Creating new PayPal script tag...');
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
        script.async = true;
        
        script.onload = () => {
          if (window.paypal) {
            console.log('✅ PayPal SDK loaded successfully');
            resolve(window.paypal);
          } else {
            console.error('❌ PayPal SDK loaded but window.paypal not available');
            reject(new Error('PayPal SDK loaded but window.paypal not available'));
          }
        };

        script.onerror = () => {
          console.error('❌ Failed to load PayPal SDK script');
          reject(new Error('Failed to load PayPal SDK script'));
        };

        document.head.appendChild(script);
        console.log('📤 PayPal script added to document head');
      });
    };

    const renderPayPalButton = async () => {
      if (!paypalRef.current) {
        console.log('⚠️ PayPal ref not available yet');
        return;
      }

      try {
        console.log('🚀 Starting PayPal button render...');
        setIsLoading(true);
        setError(null);

        // Check if Client ID is configured
        if (!PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID.trim() === '') {
          console.error('❌ PayPal Client ID not configured in renderPayPalButton');
          setError(t.configError);
          setIsLoading(false);
          return;
        }

        // Wait for PayPal to load
        console.log('⏳ Loading PayPal SDK...');
        await loadPayPalScript();

        // Clear container
        console.log('🧹 Clearing PayPal container...');
        paypalRef.current.innerHTML = '';

        // Render PayPal Buttons
        console.log('🎨 Rendering PayPal button...');
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
          
          // Handle successful payment
          onApprove: async (data: any, actions: any) => {
            try {
              console.log('✅ Payment approved, capturing order...');
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
            console.error('❌ PayPal button error:', err);
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
        console.error('❌ Error in renderPayPalButton:', err);
        setError(t.error);
        setIsLoading(false);
        if (onError) onError(err);
      }
    };

    renderPayPalButton();
  }, [amount, language, onSuccess, onError, t.error, t.configError]);

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
