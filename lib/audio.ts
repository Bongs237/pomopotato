// force browser to load audio, otherwise it won't play
export const primeAudio = (
  audioRef: React.RefObject<HTMLAudioElement>,
): void => {
  if (audioRef.current) {
    audioRef.current.play().then(() => {
      audioRef.current?.pause();
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    });
  }
};
