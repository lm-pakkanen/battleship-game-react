import { useDrop } from "react-dnd";
import "./tile.css";
import { useGameContext } from "../../../hooks/useGameContex";
import { useEffect, useState } from "react";
import { Ship } from "./ships/ship";
import { ShipOrientation } from "../../../enums/ShipOrientation";

export interface Tile {
  coordinate: string;
  handleClick: (coordinate: string) => void;
}

export const Tile = ({ coordinate, handleClick: _handleClick }: Tile) => {
  const { turn, stage, player1, player2 } = useGameContext();

  const [children, setChildren] = useState<React.ReactNode>(null);

  const [, drop] = useDrop(() => ({
    accept: "ship",
    drop: () => ({ coordinate }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    _handleClick(coordinate);
  };

  useEffect(() => {
    if (stage === "settings" || !turn) {
      return;
    }

    const playerState = turn === "player1" ? player1 : player2;

    if (stage === "placingShips") {
      const shipLocation = playerState.shipLocations.find(
        (n) => n.coordinates[n.coordinates.length - 1] === coordinate
      );

      if (!shipLocation) {
        setChildren(null);
        return;
      }

      const firstCoordinate = shipLocation.coordinates[0];

      const orientation = shipLocation.coordinates.every(
        (n) => n[1] === firstCoordinate[1]
      )
        ? ShipOrientation.BOTTOM_TO_TOP
        : ShipOrientation.RIGHT_TO_LEFT;

      setChildren(
        <Ship type={shipLocation.shipType} orientation={orientation} />
      );
    } else if (stage === "playing") {
      const isHit = playerState.hitCells.includes(coordinate);

      const hasHitShip = playerState.shipLocations.some((n) =>
        n.coordinates.includes(coordinate)
      );

      if (isHit && hasHitShip) {
        setChildren("X");
      } else if (isHit) {
        setChildren("O");
      } else {
        setChildren(null);
      }
    }
  }, [
    turn,
    stage,
    player1.shipLocations,
    player1.hitCells,
    player2.shipLocations,
    player2.hitCells,
  ]);

  if (stage === "settings" || !turn) {
    return null;
  }

  return (
    <div className="tile" onClick={handleClick} ref={drop}>
      {children || coordinate}
    </div>
  );
};
