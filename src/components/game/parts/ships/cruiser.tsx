import { useId, useMemo } from "react";
import { Ship } from "./ship";
import "./cruiser.css";

export const Cruiser = ({ destroyed }: Pick<Ship, "destroyed">) => {
  const id = useId();

  const classNames: string[] = useMemo(() => {
    const nextClassNames = ["cruiser-wrapper"];

    if (destroyed) {
      nextClassNames.push("cruiser-destroyed");
    }

    return nextClassNames;
  }, [destroyed]);

  return (
    <div className={classNames.join(" ")} id={`cruiser-${id}`}>
      <img src="./img/cruiser.png" height={210} width={200} draggable={false} />
    </div>
  );
};
