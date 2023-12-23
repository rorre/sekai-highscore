import React, { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import { SongDifficulty, SongType, Stats } from "../types";
import meta from "../meta.json";

type State = "Idle" | "Recognizing" | "Error";

interface DetectScoreProps {
  onDetected: (
    song: SongType | null,
    difficulty: SongDifficulty | null,
    stats: Stats
  ) => unknown;
}

export default function DetectScore({ onDetected }: DetectScoreProps) {
  const [engWorker, setEngWorker] = useState<Tesseract.Worker | null>(null);
  const [jpnWorker, setJpnWorker] = useState<Tesseract.Worker | null>(null);
  const [state, setState] = useState<State>("Idle");

  useEffect(() => {
    async function inner() {
      const newEngWorker = await createWorker("eng");
      setEngWorker(newEngWorker);

      const newJpnWorker = await createWorker("jpn");
      setJpnWorker(newJpnWorker);
    }

    inner();
  }, []);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!engWorker || !jpnWorker) return;
    setState("Recognizing");
    const file = e.target.files![0];
    e.target.value = "";

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      const { data: engData } = await engWorker.recognize(file);

      const enText = engData.text
        .replaceAll("g00d", "good")
        .replaceAll("g0od", "good")
        .replaceAll("go0d", "good");
      const stats: Stats = {
        perfect: 0,
        great: 0,
        good: 0,
        bad: 0,
        miss: 0,
      };

      for (const metric of [
        "perfect",
        "great",
        "good",
        "bad",
        "miss",
      ] as const) {
        const idx = enText.indexOf(metric.toUpperCase());
        if (idx == -1) throw Error("Cannot find metric");

        const startIdx = idx + metric.length + 1; // +1 for space
        const substr = enText.substring(startIdx);

        const metricLength = Math.min(4, substr.indexOf(" "));
        const valueStr = enText
          .substring(startIdx, startIdx + metricLength)
          .replaceAll("o", "0");
        const num = Number(valueStr);
        if (isNaN(num)) throw Error("Failed to parse metric");

        stats[metric] = num;
      }
      const totalNotes = Object.values(stats).reduce((a, b) => a + b, 0);

      const songResult = meta.filter(
        (song) =>
          Object.values(song.difficulty).filter(
            (data) => data.notes == totalNotes
          ).length == 1
      );

      if (songResult.length == 1) {
        setState("Idle");
        return onDetected(
          songResult[0],
          Object.values(songResult[0].difficulty).filter(
            (diff) => diff.notes == totalNotes
          )[0].difficulty,
          stats
        );
      }

      const { data: jpnData } = await jpnWorker.recognize(file);
      const jpnText = jpnData.text.replaceAll(" ", "");
      const songTitleResult = meta.filter((song) =>
        jpnText.toLowerCase().startsWith(song.title.toLowerCase())
      );
      if (songTitleResult.length == 1) {
        setState("Idle");
        return onDetected(
          songTitleResult[0],
          Object.values(songTitleResult[0].difficulty).filter(
            (diff) => diff.notes == totalNotes
          )[0].difficulty,
          stats
        );
      }

      setState("Idle");
      return onDetected(null, null, stats);
    } catch (e) {
      console.log(e);
      setState("Error");
    }
  }

  if (!engWorker || !jpnWorker) {
    return (
      <div className="flex flex-col gap-1 items-center justify-center text-center">
        <span className="loading loading-spinner loading-xs"></span>
        <p>Loading worker...</p>
      </div>
    );
  }

  return (
    <div>
      <p className="pb-2 font-bold">Detect from screenshot</p>
      <span>
        <label htmlFor="openFileInput" className="btn btn-primary w-full">
          Select Screenshot
        </label>
        <input
          type="file"
          id="openFileInput"
          onChange={onFileChange}
          className="hidden"
          disabled={state == "Recognizing"}
        />
      </span>
      <p className="mt-2">State: {state}</p>
    </div>
  );
}
