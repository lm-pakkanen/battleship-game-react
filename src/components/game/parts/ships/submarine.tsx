import { useMemo } from "react";
import { Ship } from "./ship";
import "./submarine.css";

export const Submarine = ({ destroyed }: Pick<Ship, "destroyed">) => {
  const classNames: string[] = useMemo(() => {
    const nextClassNames = ["submarine-wrapper"];

    if (destroyed) {
      nextClassNames.push("submarine-destroyed");
    }
    return nextClassNames;
  }, [destroyed]);

  return (
    <div className={classNames.join(" ")}>
      <img
        src="./img/submarine.png"
        height={240}
        width={145}
        draggable={false}
      />
    </div>
  );
};
