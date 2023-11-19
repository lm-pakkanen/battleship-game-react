import { useEffect, useState } from "react";
import "./battleship.css";
import { Ship } from "./ship";

export const Battleship = ({ destroyed }: Pick<Ship, "destroyed">) => {
  const [classNames, setClassNames] = useState<string[]>([]);

  useEffect(() => {
    const nextClassNames = ["battleship"];

    if (destroyed) {
      nextClassNames.push("battleship-destroyed");
    }

    setClassNames(nextClassNames);
  }, []);

  return <div className={classNames.join(" ")} />;
};
