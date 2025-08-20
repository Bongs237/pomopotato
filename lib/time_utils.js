export const toMinSec = (secs) => [Math.floor(secs / 60), secs % 60];
export const toTotalSecs = (min, sec) => (min * 60) + sec;
