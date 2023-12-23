import clsx from "clsx";
import React from "react";

interface ActionAreaProps {
  title: string;
  label: string;
  button: React.ReactNode;
  className?: string;
}

function ActionArea({ title, label, button, className }: ActionAreaProps) {
  return (
    <div
      className={clsx(
        "flex flex-row gap-4 justify-between items-center p-4 rounded-md border",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <strong className="text-xl">{title}</strong>
        <p>{label}</p>
      </div>
      {button}
    </div>
  );
}

export default ActionArea;
