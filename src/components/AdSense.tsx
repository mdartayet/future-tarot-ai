import { useEffect, useRef } from "react";

interface AdSenseProps {
  slot?: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

const AdSense = ({ 
  slot = "auto", 
  format = "auto", 
  responsive = true,
  className = "" 
}: AdSenseProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const clientId = "ca-pub-XXXXXXXXXXXXXXXXX"; // Replace with your AdSense client ID
  const isPlaceholder = clientId.includes("XXXX");

  useEffect(() => {
    if (isPlaceholder) return;
    
    try {
      // @ts-ignore
      if (window.adsbygoogle && adRef.current) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [isPlaceholder]);

  // Show placeholder when AdSense is not configured
  if (isPlaceholder) {
    return (
      <div className={`${className} w-full`}>
        <div className="bg-muted/30 border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
          <div className="space-y-2">
            <p className="text-sm font-cinzel text-muted-foreground uppercase tracking-wider">
              📢 Google AdSense Banner
            </p>
            <p className="text-xs text-muted-foreground/60 font-crimson italic">
              Configure tu ID de cliente de AdSense para ver anuncios
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`adsense-container ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
};

export default AdSense;
