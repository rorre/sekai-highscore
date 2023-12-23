import meta from "./meta.json";

export type SongType = typeof meta extends (infer T)[] ? T : never;
export type SongDifficulty = keyof SongType["difficulty"];

export interface Stats {
  perfect: number;
  great: number;
  good: number;
  bad: number;
  miss: number;
}

export interface Score {
  songId: number;
  stats: Stats;
  difficulty: SongDifficulty;
  score: number;
  rating: number;
  createdAt: Date;
}
