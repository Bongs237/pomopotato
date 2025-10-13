export const toMinSec = (secs: number): [number, number] => [
  Math.floor(secs / 60),
  secs % 60,
];

export const toTotalSecs = (min: number, sec: number): number => min * 60 + sec;

export const formatTime = (seconds: number): string => {
  const [mins, secs] = toMinSec(seconds);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
