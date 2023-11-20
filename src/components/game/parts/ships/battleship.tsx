import { useMemo } from "react";
import { Ship } from "./ship";
import "./battleship.css";

export const Battleship = ({ destroyed }: Pick<Ship, "destroyed">) => {
  const classNames: string[] = useMemo(() => {
    const nextClassNames = ["battleship-wrapper"];

    if (destroyed) {
      nextClassNames.push("battleship-destroyed");
    }

    return nextClassNames;
  }, [destroyed]);

  return (
    <div className={classNames.join(" ")}>
      <img
        src="./img/battleship.png"
        height={290}
        width={175}
        draggable={false}
      />
    </div>
  );
};
