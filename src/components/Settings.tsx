import { useRef } from "react";
import { useScoreManager } from "./context";
import ConfirmModal from "./base/ConfirmModal";
import { showRatingAtom } from "./atom";
import { useAtom } from "jotai";

function Settings() {
  const { importScores, exportScores, resetScores } = useScoreManager();
  const [showRating, setShowRating] = useAtom(showRatingAtom);

  const ref = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  async function onImportClick() {
    if (ref.current?.files?.length != 1) {
      return;
    }

    const content = await ref.current.files[0].text();
    importScores(content);
  }

  return (
    <>
      <button className="btn" onClick={() => dialogRef.current?.showModal()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      </button>

      <dialog className="modal" ref={dialogRef}>
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Settings</h1>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Show Rating</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={showRating}
                  onChange={() => setShowRating(!showRating)}
                />
              </label>
            </div>

            <strong className="text-lg">Export Scores</strong>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => exportScores()}
            >
              Export
            </button>

            <div className="divider"></div>

            <strong className="text-lg">Import Scores</strong>
            <input
              type="file"
              className="file-input file-input-bordered w-full input-sm !pl-0"
              ref={ref}
            />
            <ConfirmModal
              trigger={
                <button className="btn btn-secondary btn-sm w-full">
                  Import
                </button>
              }
              title={"Reset Scores"}
              onConfirm={() => onImportClick()}
            >
              Are you sure you want to import scores? This will reset your
              existing scores.
            </ConfirmModal>

            <div className="divider"></div>

            <strong className="text-lg">Reset Scores</strong>
            <ConfirmModal
              trigger={
                <button className="btn btn-error btn-sm w-full">Reset</button>
              }
              title={"Reset Scores"}
              onConfirm={() => resetScores()}
            >
              Are you sure you want to reset all your scores?
            </ConfirmModal>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default Settings;
