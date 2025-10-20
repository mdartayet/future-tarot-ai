import { ReactNode } from "react";

interface CaveBackgroundProps {
  children: ReactNode;
  showCandles?: boolean;
}

const CaveBackground = ({ children, showCandles = true }: CaveBackgroundProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/cave-background.mp4" type="video/mp4" />
      </video>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default CaveBackground;
