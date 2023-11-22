import { Ship } from "./ship";
import "./submarine.css";

export const Submarine = ({ destroyed }: Pick<Ship, "destroyed">) => {
  const classNames = ["submarine-wrapper"];

  if (destroyed) {
    classNames.push("submarine-destroyed");
  }

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
