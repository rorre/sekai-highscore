import React, { useRef } from "react";

interface ConfirmModalProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title: string;
  onConfirm: () => unknown;
}

function ConfirmModal({
  trigger,
  children,
  onConfirm,
  title,
}: ConfirmModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <a onClick={() => dialogRef.current?.showModal()}>{trigger}</a>
      <dialog className="modal" ref={dialogRef}>
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg pb-4">{title}</h3>
          {children}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-error">Cancel</button>
              <button
                onClick={() => onConfirm()}
                className="btn btn-primary ml-2"
              >
                OK
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default ConfirmModal;
