import { Ship } from "./ship";
import "./battleship.css";

export const Battleship = ({ destroyed }: Pick<Ship, "destroyed">) => {
  const classNames = ["battleship-wrapper"];

  if (destroyed) {
    classNames.push("battleship-destroyed");
  }

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
