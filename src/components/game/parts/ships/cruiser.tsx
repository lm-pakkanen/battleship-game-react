import { useEffect, useState } from "react";
import { Ship } from "./ship";
import "./cruiser.css";

export const Cruiser = ({ destroyed }: Pick<Ship, "destroyed">) => {
  const [classNames, setClassNames] = useState<string[]>([]);

  useEffect(() => {
    const nextClassNames = ["cruiser-wrapper"];

    if (destroyed) {
      nextClassNames.push("cruiser-destroyed");
    }

    setClassNames(nextClassNames);
  }, []);

  return (
    <div className={classNames.join(" ")}>
      <img src="./img/cruiser.png" height={210} width={200} draggable={false} />
    </div>
  );
};
