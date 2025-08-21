const toMinSec = (secs) => [Math.floor(secs / 60), secs % 60];
const toTotalSecs = (min, sec) => (min * 60) + sec;

const formatTime = (seconds) => {
  const [mins, secs] = toMinSec(seconds);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export { toMinSec, toTotalSecs, formatTime };
