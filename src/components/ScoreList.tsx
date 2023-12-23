import { useMemo } from "react";
import { useScoreManager } from "./context";
import { Score } from "../types";
import meta from "../meta.json";
import { showRatingAtom } from "./atom";
import { useAtom } from "jotai";

const formatter = new Intl.DateTimeFormat();

function ScoreList() {
  const [showRating] = useAtom(showRatingAtom);

  const { scores } = useScoreManager();
  const best = useMemo(() => {
    const bestRatingByChart = new Map<string, Score>();
    for (let i = 0; i < scores.length; i++) {
      const element = scores[i];
      const key = element.songId.toString() + element.difficulty;

      const existing = bestRatingByChart.get(key);
      let best = element;
      if (existing && best.rating < existing.rating) best = existing;

      bestRatingByChart.set(key, best);
    }

    return Array.from(bestRatingByChart.values()).toSorted(
      (a, b) => a.rating - b.rating
    );
  }, [scores]);

  const averageRating = (
    best.slice(0, 30).reduce((p, c) => p + c.rating, 0) / 30
  ).toFixed(2);

  return (
    <div className="pt-4">
      {showRating && <strong>Average Rating: {averageRating}</strong>}

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Song</th>
              <th>Difficulty</th>
              <th>Score</th>
              {showRating && <th>Rating</th>}
              <th>Achieved at</th>
            </tr>
          </thead>

          <tbody>
            {best.map((score) => {
              const song = meta.filter((s) => s.id == score.songId)[0];
              return (
                <tr key={score.songId}>
                  <td>
                    <div className="flex flex-col">
                      <strong className="text-md">{song.title}</strong>{" "}
                      <p className="text-xs">{song.composer}</p>
                      <p>
                        {score.stats.perfect} / {score.stats.great} /{" "}
                        {score.stats.good} / {score.stats.bad} /{" "}
                        {score.stats.miss}
                      </p>
                    </div>
                  </td>

                  <td>
                    {score.difficulty.toUpperCase()} [
                    {song.difficulty[score.difficulty]?.level}]
                  </td>
                  <td>{score.score}</td>
                  {showRating && <td>{score.rating}</td>}
                  <td>{formatter.format(score.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScoreList;
