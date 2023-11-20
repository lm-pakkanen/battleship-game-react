import { useEffect, useState } from "react";
import { Ship } from "./ship";
import "./destroyer.css";

export const Destroyer = ({ destroyed }: Pick<Ship, "destroyed">) => {
  const [classNames, setClassNames] = useState<string[]>([]);

  useEffect(() => {
    const nextClassNames = ["destroyer-wrapper"];

    if (destroyed) {
      nextClassNames.push("destroyer-destroyed");
    }

    setClassNames(nextClassNames);
  }, []);

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
