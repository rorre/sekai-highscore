import React, { FormEvent, HTMLProps, useState } from "react";
import clsx from "clsx";
import { SongView, Song } from "./SongView";
import { Stats, SongType } from "../types";
import { useScoreManager } from "./context";
import { calculateScore, scoreToRating } from "../rating";
import DetectScore from "./DetectScore";
import { useAtom } from "jotai";
import { showRatingAtom } from "./atom";

interface InputProps extends HTMLProps<HTMLInputElement> {
  label: string;
}

function Input(props: InputProps) {
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text">{props.label}</span>
      </div>
      <input
        {...props}
        className={clsx("input input-bordered w-full", props.className)}
      />
    </label>
  );
}

function NewScore() {
  const [showRating] = useAtom(showRatingAtom);

  const [search, setSearch] = useState("");
  const [stats, setStats] = useState<Stats>({
    perfect: 0,
    great: 0,
    good: 0,
    bad: 0,
    miss: 0,
  });
  const [selectedSong, setSelectedSong] = useState<
    [SongType, keyof SongType["difficulty"]] | null
  >(null);
  const ref = React.useRef<HTMLDialogElement>(null);
  const { addScore } = useScoreManager();

  const selectedDifficulty = selectedSong
    ? selectedSong[0].difficulty[selectedSong[1]]
    : null;
  const score = selectedSong
    ? calculateScore(stats, selectedDifficulty?.notes)
    : 0;
  const rating = selectedSong
    ? scoreToRating(score, selectedDifficulty?.level ?? 0)
    : 0;

  const isValid =
    selectedSong &&
    stats.perfect + stats.great + stats.good + stats.bad + stats.miss ==
      selectedDifficulty?.notes;

  const resetInputs = () => {
    setSearch("");
    setStats({
      perfect: 0,
      great: 0,
      good: 0,
      bad: 0,
      miss: 0,
    });
    setSelectedSong(null);
  };

  const onStatChange =
    (key: keyof Stats) => (e: FormEvent<HTMLInputElement>) => {
      const newStats = {
        ...stats,
      };
      newStats[key] = e.currentTarget.valueAsNumber;
      setStats(newStats);
    };

  const onScoreSave = () => {
    if (!selectedSong) return;

    addScore({
      songId: selectedSong[0].id,
      difficulty: selectedSong[1],
      stats,
      score,
      rating,
    });
    ref.current?.close();
    resetInputs();
  };

  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() => ref.current?.showModal()}
      >
        New Score
      </button>
      <dialog ref={ref} className="modal">
        <div className="modal-box max-w-4xl">
          <div className="flex flex-col gap-4">
            <DetectScore
              onDetected={(song, diff, stats) => {
                if (song && diff) setSelectedSong([song, diff]);
                setStats(stats);
              }}
            />

            <div className="divider m-0" />

            <Input
              label="Search song"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />

            {selectedSong ? (
              <>
                <button
                  className="btn btn-error w-full"
                  onClick={() => resetInputs()}
                >
                  Reset
                </button>
                <Song
                  song={selectedSong[0]}
                  onDifficultyClick={(song, diff) =>
                    setSelectedSong([song, diff])
                  }
                  selectedDifficulty={selectedSong[1]}
                />
              </>
            ) : (
              <SongView
                query={search.toLowerCase()}
                onDifficultyClick={(song, diff) =>
                  setSelectedSong([song, diff])
                }
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="PERFECT"
                type="number"
                onChange={onStatChange("perfect")}
                value={stats["perfect"]}
              />
              <Input
                label="GREAT"
                type="number"
                onChange={onStatChange("great")}
                value={stats["great"]}
              />
              <Input
                label="GOOD"
                type="number"
                onChange={onStatChange("good")}
                value={stats["good"]}
              />
              <Input
                label="BAD"
                type="number"
                onChange={onStatChange("bad")}
                value={stats["bad"]}
              />
              <Input
                label="MISS"
                type="number"
                onChange={onStatChange("miss")}
                value={stats["miss"]}
              />
            </div>

            {selectedSong && (
              <>
                <p>
                  <strong>Score:</strong> {score}
                </p>
                {showRating && (
                  <p>
                    <strong>Rating:</strong> {rating}
                  </p>
                )}
              </>
            )}

            {!isValid && (
              <div role="alert" className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {selectedSong ? "Invalid total count" : "No song selected"}
                </span>
              </div>
            )}
          </div>

          <div className="modal-action">
            <form method="dialog">
              <div className="join">
                <button
                  className="btn join-item btn-error"
                  onClick={() => resetInputs()}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary join-item"
                  onClick={onScoreSave}
                  disabled={!isValid}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default NewScore;
