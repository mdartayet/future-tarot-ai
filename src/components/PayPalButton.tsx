import { useEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Crown } from 'lucide-react';

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
  const scriptLoadedRef = useRef(false);
  const { language } = useLanguage();
  
  const text = {
    es: {
      title: '🔮 Desbloquea la Lectura del Futuro',
      description: 'Obtén la interpretación completa del oráculo con IA',
      price: '$2.99 USD',
      loading: 'Cargando método de pago seguro...',
      secure: '🔒 Pago 100% seguro con PayPal'
    },
    en: {
      title: '🔮 Unlock the Future Reading',
      description: 'Get the complete AI oracle interpretation',
      price: '$2.99 USD',
      loading: 'Loading secure payment method...',
      secure: '🔒 100% secure payment with PayPal'
    }
  };

  const t = text[language];

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
    
    if (existingScript && window.paypal && paypalRef.current && !scriptLoadedRef.current) {
      // Script already loaded, just render button
      renderButton();
      return;
    }

    if (scriptLoadedRef.current) return;

    // Load PayPal script
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=BAAykfaG1Puvzhp8isz8hV9XwKiAMltjJ6JI06JzPc3fV572cQdpoGCMc36VYoIBqguX3wulxXspjYa8g8&components=hosted-buttons&disable-funding=venmo&currency=USD';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      scriptLoadedRef.current = true;
      renderButton();
    };

    script.onerror = () => {
      console.error('Failed to load PayPal script');
    };

    if (!existingScript) {
      document.head.appendChild(script);
    }

    function renderButton() {
      if (window.paypal && paypalRef.current) {
        // Clear any existing content
        paypalRef.current.innerHTML = '';
        
        try {
          // Render PayPal button
          window.paypal.HostedButtons({
            hostedButtonId: "7NGDMYJA95JNY"
          }).render(paypalRef.current);

          console.log('✅ PayPal button rendered successfully');
        } catch (error) {
          console.error('Error rendering PayPal button:', error);
        }
      }
    }

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.querySelector('script[src*="paypal.com/sdk"]');
      if (scriptToRemove && document.head.contains(scriptToRemove)) {
        // Don't remove script to avoid re-loading, just clean up
        scriptLoadedRef.current = false;
      }
    };
  }, []);

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
        <div 
          ref={paypalRef} 
          className="min-h-[50px] flex items-center justify-center mb-4"
        >
          <p className="text-sm text-muted-foreground animate-pulse font-crimson">
            {t.loading}
          </p>
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
