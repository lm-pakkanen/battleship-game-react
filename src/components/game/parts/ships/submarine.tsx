import { useEffect, useState } from "react";
import { Ship } from "./ship";
import "./submarine.css";

export const Submarine = ({ destroyed }: Pick<Ship, "destroyed">) => {
  const [classNames, setClassNames] = useState<string[]>([]);

  useEffect(() => {
    const nextClassNames = ["submarine-wrapper"];

    if (destroyed) {
      nextClassNames.push("submarine-destroyed");
    }

    setClassNames(nextClassNames);
  }, []);

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
