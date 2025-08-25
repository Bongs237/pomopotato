// force browser to load audio, otherwise it won't play
export const primeAudio = (audioRef) => {
  audioRef.current.play().then(() => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  });
};
