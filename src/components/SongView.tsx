import { useMemo } from "react";
import meta from "../meta.json";
import clsx from "clsx";
import { SongType } from "../types";

interface SongViewProps {
  query: string;
  onDifficultyClick: (
    song: SongType,
    difficulty: keyof SongType["difficulty"]
  ) => unknown;
}

interface SongProps {
  song: SongType;
  onDifficultyClick: (
    song: SongType,
    difficulty: keyof SongType["difficulty"]
  ) => unknown;
  selectedDifficulty?: keyof SongType["difficulty"];
}

function Song({ song, onDifficultyClick, selectedDifficulty }: SongProps) {
  return (
    <div className="flex flex-row gap-2 border p-4 rounded-md" key={song.id}>
      <div className="flex flex-col gap-1 text-center">
        <img
          className="aspect-square w-80"
          loading="lazy"
          src={`/jackets/${song.assetbundleName}.png`}
        ></img>
        <strong>{song.title}</strong>
        <p>{song.composer}</p>
      </div>

      <div className="flex flex-col gap-1 w-full">
        {(
          ["easy", "normal", "hard", "expert", "master", "append"] as const
        ).map((diff) => {
          if (song.difficulty[diff] === undefined) return <></>;
          return (
            <button
              className={clsx(
                "btn w-full inline-flex justify-between",
                selectedDifficulty === diff && "btn-primary"
              )}
              onClick={() => onDifficultyClick(song, diff)}
            >
              <span>{diff.toUpperCase()}</span>
              <span>{song.difficulty[diff]?.level}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SongView({ query, onDifficultyClick }: SongViewProps) {
  const songs = useMemo(
    () =>
      meta.filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.enTitle.toLowerCase().includes(query)
      ),
    [query]
  );

  if (query.length < 2) {
    return (
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
        <span>Type at least 2 characters</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {songs.map((song) => (
        <Song song={song} onDifficultyClick={onDifficultyClick} key={song.id} />
      ))}
    </div>
  );
}

export { SongView, Song };
