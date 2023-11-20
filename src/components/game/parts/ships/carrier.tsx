import type { Ship } from "./ship";
import { useMemo } from "react";
import "./carrier.css";

export const Carrier = ({ destroyed }: Pick<Ship, "destroyed">) => {
  const classNames: string[] = useMemo(() => {
    const nextClassNames = ["carrier-wrapper"];

    if (destroyed) {
      nextClassNames.push("carrier-destroyed");
    }

    return nextClassNames;
  }, [destroyed]);

  return (
    <div className={classNames.join(" ")}>
      <img src="./img/carrier.png" height={370} width={180} draggable={false} />
    </div>
  );
};
