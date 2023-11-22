import { Ship } from "./ship";
import "./cruiser.css";

export const Cruiser = ({ destroyed }: Pick<Ship, "destroyed">) => {
  const classNames = ["cruiser-wrapper"];

  if (destroyed) {
    classNames.push("cruiser-destroyed");
  }
  return (
    <div className={classNames.join(" ")}>
      <img src="./img/cruiser.png" height={210} width={200} draggable={false} />
    </div>
  );
};
