import { ShipOrientation } from "../../../../enums/ShipOrientation";
import { ShipType } from "../../../../enums/ShipType";
import { Battleship } from "./battleship";

export interface Ship {
  type: ShipType;
  orientation: ShipOrientation;
}

export const Ship = ({ type, orientation }: Ship) => {
  switch (type) {
    case ShipType.BATTLESHIP: {
      return <Battleship orientation={orientation} />;
    }

    default: {
      return null;
    }
  }
};
