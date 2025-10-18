import { cn } from "@/lib/utils";
import { getCardImageFilename } from "@/lib/tarot-utils";

interface TarotCardProps {
  name: string;
  meaning?: string;
  position?: "past" | "present" | "future";
  isRevealed?: boolean;
  isShuffling?: boolean;
  animationDelay?: number;
  className?: string;
}

const TarotCard = ({ 
  name, 
  meaning, 
  position,
  isRevealed = false, 
  isShuffling = false,
  animationDelay = 0,
  className 
}: TarotCardProps) => {
  const positionLabels = {
    past: "PASADO",
    present: "PRESENTE",
    future: "FUTURO"
  };

  return (
    <div 
      className={cn(
        "relative w-full aspect-[2/3] transition-all duration-500",
        isShuffling && "animate-shuffle",
        className
      )}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div className={cn(
        "w-full h-full relative preserve-3d transition-all duration-700",
        isRevealed && "rotate-y-180"
      )}>
        {/* Card Back */}
        <div className={cn(
          "absolute inset-0 backface-hidden rounded-xl overflow-hidden",
          "bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900",
          "border-2 border-secondary/30 shadow-2xl",
          "flex items-center justify-center"
        )}>
          <div className="absolute inset-4 border-2 border-secondary/20 rounded-lg" />
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-golden animate-glow flex items-center justify-center">
              <span className="text-4xl">✨</span>
            </div>
            <div className="absolute inset-0 bg-gradient-candle animate-pulse" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]" />
        </div>

        {/* Card Front */}
        <div className={cn(
          "absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden",
          "bg-gradient-to-br from-amber-50 via-amber-100 to-yellow-50",
          "border-2 border-secondary shadow-2xl p-4",
          "flex flex-col items-center justify-between"
        )}>
          {/* Decorative border */}
          <div className="absolute inset-3 border border-secondary/40 rounded-lg pointer-events-none" />
          
          {/* Position label */}
          {position && (
            <div className="w-full text-center">
              <span className="text-xs font-cinzel font-bold text-secondary tracking-wider">
                {positionLabels[position]}
              </span>
            </div>
          )}

          {/* Card image */}
          <div className="flex-1 flex items-center justify-center p-2">
            {name ? (
              <img 
                src={`/tarot-cards/${getCardImageFilename(name)}.png`}
                alt={name}
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  const imagePath = `/tarot-cards/${getCardImageFilename(name)}.png`;
                  console.error(`Failed to load image for: ${name}`);
                  console.error(`Attempted path: ${imagePath}`);
                  e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><rect width="200" height="300" fill="%23ccc"/><text x="50%" y="50%" text-anchor="middle" fill="%23666">🔮</text></svg>';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">✨</div>
            )}
          </div>

          {/* Card name */}
          <div className="w-full space-y-2 text-center">
            <h3 className="text-lg font-cinzel font-bold text-purple-900">
              {name}
            </h3>
            {meaning && (
              <p className="text-xs font-crimson text-purple-700 italic line-clamp-2">
                {meaning}
              </p>
            )}
          </div>

          {/* Decorative corners */}
          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-secondary/60" />
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-secondary/60" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-secondary/60" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-secondary/60" />
        </div>
      </div>
    </div>
  );
};

export default TarotCard;
