import { ReactNode } from "react";

interface CaveBackgroundProps {
  children: ReactNode;
  showCandles?: boolean;
}

const CaveBackground = ({ children, showCandles = true }: CaveBackgroundProps) => {
  return (
    <div className="relative min-h-screen bg-gradient-cave overflow-hidden">
      {/* Cave texture overlay */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,transparent_0%,hsl(240_15%_6%)_100%)]" />
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
      
      {/* Shadow vignette effect */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]" />

      {/* Candles */}
      {showCandles && (
        <>
          {/* Left candle glow */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-candle animate-flicker blur-2xl pointer-events-none" />
          <div className="absolute top-20 left-10 w-4 h-12 bg-gradient-to-t from-secondary via-amber-400 to-transparent rounded-full animate-flicker" />
          
          {/* Right candle glow */}
          <div className="absolute top-32 right-16 w-32 h-32 bg-gradient-candle animate-flicker blur-2xl pointer-events-none" 
               style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-32 right-16 w-4 h-12 bg-gradient-to-t from-secondary via-amber-400 to-transparent rounded-full animate-flicker"
               style={{ animationDelay: '0.5s' }} />
          
          {/* Bottom left candle glow */}
          <div className="absolute bottom-40 left-20 w-32 h-32 bg-gradient-candle animate-flicker blur-2xl pointer-events-none"
               style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 left-20 w-4 h-12 bg-gradient-to-t from-secondary via-amber-400 to-transparent rounded-full animate-flicker"
               style={{ animationDelay: '1s' }} />
        </>
      )}

      {/* Purple mystic glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-glow pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default CaveBackground;
