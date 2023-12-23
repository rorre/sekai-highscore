import { Stats } from "./types";

export function calculateScore(stats: Stats, totalNotes?: number) {
  const acc =
    stats.perfect * 1.01 +
    stats.great * 1 +
    stats.good * 0.5 +
    stats.bad * 0.25;
  const total =
    totalNotes ??
    stats.perfect + stats.great + stats.good + stats.bad + stats.miss;
  return Math.round((acc / total) * 1_000_000);
}

export function scoreToRating(score: number, level: number): number {
  if (score > 1007500) {
    return level + 2;
  } else if (score > 1005000) {
    return level + 1.5 + ((score - 1005000) / (1007500 - 1005000)) * 0.5;
  } else if (score > 1000000) {
    return level + 1 + ((score - 1000000) / (1005000 - 1000000)) * 0.5;
  } else if (score > 975000) {
    return level + 0 + ((score - 975000) / (1000000 - 975000)) * 1;
  } else if (score > 925000) {
    return level + -3 + ((score - 925000) / (975000 - 925000)) * 3;
  } else if (score > 900000) {
    return level + -5 + ((score - 900000) / (925000 - 900000)) * 2;
  } else if (score > 800000) {
    return (
      (level - 5) / 2 +
      ((score - 800000) / (900000 - 800000)) * (level + -5 - (level - 5) / 2)
    );
  } else if (score > 500000) {
    return 0 + (((score - 500000) / (800000 - 500000)) * (level - 5)) / 2;
  } else {
    return 0;
  }
}
