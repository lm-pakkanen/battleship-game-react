import { PlayerState } from "../context/game-context";
import { ShipOrientation } from "../enums/ShipOrientation";

export const getShipOrientation = (
  shipLocation: PlayerState["shipLocations"][0]
): ShipOrientation => {
  const firstCoordinate = shipLocation.coordinates[0];

  return shipLocation.coordinates.every((n) => n[1] === firstCoordinate[1])
    ? ShipOrientation.BOTTOM_TO_TOP
    : ShipOrientation.RIGHT_TO_LEFT;
};
