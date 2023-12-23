import { createContext, useEffect, useState } from "react";
import { Score } from "../types";
import { saveData } from "../utils";

interface ScoreContextValues {
  scores: Score[];
  addScore: (score: Omit<Score, "createdAt">) => unknown;
  importScores: (data: string) => unknown;
  exportScores: () => unknown;
  resetScores: () => unknown;
}

export const ScoreContext = createContext<ScoreContextValues>({
  scores: [],
  addScore() {},
  importScores() {},
  exportScores() {},
  resetScores() {},
});

export function ScoreManager({ children }: { children: React.ReactNode }) {
  const [scores, setScores] = useState<Score[]>([]);

  function addScore(score: Omit<Score, "createdAt">) {
    const newScore = {
      ...score,
      createdAt: new Date(),
    };

    const newScores = [...scores, newScore];
    setScores(newScores);
    localStorage.setItem("scores", JSON.stringify(newScores));
  }

  function loadFromString(data: string) {
    const scores: Score[] = JSON.parse(data);
    setScores(
      scores.map((score) => ({
        ...score,
        createdAt: new Date(score.createdAt),
      }))
    );
    localStorage.setItem("scores", data);
  }

  function resetScores() {
    setScores([]);
    localStorage.setItem("scores", "[]");
  }

  useEffect(() => {
    loadFromString(localStorage.getItem("scores") ?? "[]");
  }, []);

  function export_() {
    saveData(scores, "scores.json");
  }

  return (
    <ScoreContext.Provider
      value={{
        scores,
        addScore,
        importScores: loadFromString,
        exportScores: export_,
        resetScores,
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
}
