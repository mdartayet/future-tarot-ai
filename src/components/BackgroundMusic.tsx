import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set volume low (0.15 = 15% volume)
    audio.volume = 0.15;

    // Try to play automatically
    const attemptAutoplay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setHasInteracted(true);
      } catch (error) {
        console.log("Autoplay prevented, user must click to start music");
      }
    };

    attemptAutoplay();

    return () => {
      audio.pause();
    };
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setHasInteracted(true);

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source src="/background-music.mp3" type="audio/mpeg" />
      </audio>
      
      {/* Floating music control button */}
      <Button
        onClick={toggleMusic}
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 shadow-lg bg-background/80 backdrop-blur-sm hover:bg-background/90"
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
      >
        {isPlaying ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </Button>
      
      {/* Initial tooltip */}
      {!hasInteracted && (
        <div className="fixed bottom-20 right-6 z-50 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-sm animate-pulse">
          Haz clic para activar la música 🎵
        </div>
      )}
    </>
  );
};

export default BackgroundMusic;
