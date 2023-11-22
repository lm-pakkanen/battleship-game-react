import { Ship } from "./ship";
import "./destroyer.css";

export const Destroyer = ({ destroyed }: Pick<Ship, "destroyed">) => {
  const classNames = ["destroyer-wrapper"];

  if (destroyed) {
    classNames.push("destroyer-destroyed");
  }

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
