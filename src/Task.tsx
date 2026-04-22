import { PropsWithChildren, useEffect, useState } from "react";
import { TaskBanner } from "./TaskBanner";

import "./task.css";
export type TaskProps = PropsWithChildren<{ checked: boolean; name: string }>;

export const Task = ({ checked, name, children }: TaskProps) => {
  const [_checked, setChecked] = useState(checked);
  const [showDoneIcon, setShowDoneIcon] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    let timeoutId: undefined | ReturnType<typeof setTimeout>;

    if (showDoneIcon) {
      timeoutId = setTimeout(() => {
        setShowDoneIcon(false);
        setShowBanner(true);
      }, 500);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showDoneIcon]);

  return (
    <li>
      <label
        className={_checked ? "strike" : ""}
        onAnimationEnd={() => {
          setShowDoneIcon(true);
        }}
      >
        <input
          type="checkbox"
          checked={_checked}
          name={name}
          onChange={() => {
            setChecked(!_checked);
            setShowBanner(false);
          }}
        />
        {children}
      </label>
      {showDoneIcon && <span className="icon-done">Хорошая работа!</span>}
      {showBanner && <TaskBanner />}
    </li>
  );
};
