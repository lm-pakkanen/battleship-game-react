import { ShipOrientation } from "../../../../enums/ShipOrientation";
import "./battleship.css";
import { Ship } from "./ship";

export type Battleship = Pick<Ship, "orientation">;

export const Battleship = ({ orientation }: Battleship) => {
  const classNames: string[] = ["battleship"];

  if (orientation === ShipOrientation.BOTTOM_TO_TOP) {
    classNames.push("battleship-vertical");
  } else if (orientation === ShipOrientation.RIGHT_TO_LEFT) {
    classNames.push("battleship-horizontal");
  }

  return <div className={classNames.join(" ")} />;
};
