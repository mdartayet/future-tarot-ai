import { useEffect, useRef } from "react";

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set volume low (0.15 = 15% volume)
    audio.volume = 0.15;

    // Try to play (may be blocked by browser autoplay policy)
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Autoplay prevented, waiting for user interaction:", error);
        
        // If autoplay is blocked, play on first user interaction
        const playOnInteraction = () => {
          audio.play().catch(console.error);
          document.removeEventListener("click", playOnInteraction);
          document.removeEventListener("touchstart", playOnInteraction);
        };
        
        document.addEventListener("click", playOnInteraction);
        document.addEventListener("touchstart", playOnInteraction);
      });
    }

    return () => {
      audio.pause();
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      loop
      preload="auto"
    >
      <source src="/background-music.mp3" type="audio/mpeg" />
    </audio>
  );
};

export default BackgroundMusic;
