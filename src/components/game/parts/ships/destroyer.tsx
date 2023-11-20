import { useMemo } from "react";
import { Ship } from "./ship";
import "./destroyer.css";

export const Destroyer = ({ destroyed }: Pick<Ship, "destroyed">) => {
  const classNames: string[] = useMemo(() => {
    const nextClassNames = ["destroyer-wrapper"];

    if (destroyed) {
      nextClassNames.push("destroyer-destroyed");
    }

    return nextClassNames;
  }, [destroyed]);

  return (
    <div className={classNames.join(" ")}>
      <img
        src="./img/destroyer.png"
        height={165}
        width={210}
        draggable={false}
      />
    </div>
  );
};
