import { PlayerState } from "../context/game-context";
import { ShipOrientation } from "../enums/ShipOrientation";
import { getShipOrientation } from "./get-ship-orientation";

export const isLastShipCell = (
  coordinate: string,
  shipLocation: PlayerState["shipLocations"][0]
) => {
  const orientation = getShipOrientation(shipLocation);

  let orderedCells: PlayerState["shipLocations"][0]["coordinates"];

  if (orientation === ShipOrientation.BOTTOM_TO_TOP) {
    orderedCells = shipLocation.coordinates.sort(
      (a, b) => a.charCodeAt(0) - b.charCodeAt(0)
    );
  } else {
    orderedCells = shipLocation.coordinates.sort(
      (a, b) => parseInt(a[1]) - parseInt(b[1])
    );
  }

  return (
    orderedCells.length > 0 &&
    orderedCells[orderedCells.length - 1] === coordinate
  );
};
