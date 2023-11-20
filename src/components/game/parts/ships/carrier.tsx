import { useEffect, useState } from "react";
import { Ship } from "./ship";
import "./carrier.css";

export const Carrier = ({ destroyed }: Pick<Ship, "destroyed">) => {
  const [classNames, setClassNames] = useState<string[]>([]);

  useEffect(() => {
    const nextClassNames = ["carrier-wrapper"];

    if (destroyed) {
      nextClassNames.push("carrier-destroyed");
    }

    setClassNames(nextClassNames);
  }, []);

  return (
    <div className={classNames.join(" ")}>
      <img src="./img/carrier.png" height={370} width={180} draggable={false} />
    </div>
  );
};
