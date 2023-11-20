import { useGameContext } from "../../../hooks/useGameContex";
import { useEffect, useRef, useState } from "react";
import { Ship } from "./ships/ship";
import { isLastShipCell } from "../../../functions/is-first-ship-cell";
import React from "react";
import { getShipOrientation } from "../../../functions/get-ship-orientation";
import { getLayoutScrollOffset } from "../../../functions/get-layout-scroll-offset";
import "./tile.css";

export interface Tile {
  coordinate: string;
  handleClick: (coordinate: string) => void;
}

export const Tile = React.forwardRef<HTMLDivElement, Tile>(
  ({ coordinate, handleClick: _handleClick }: Tile, externalRef) => {
    const { turn, stage, player1, player2, setTileBounds } = useGameContext();

    const [children, setChildren] = useState<React.ReactNode>(null);

    const internalRef = useRef<HTMLDivElement>(null);

    const ref =
      externalRef && typeof externalRef !== "function"
        ? externalRef
        : internalRef;

    const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
      _handleClick(coordinate);
    };

    useEffect(() => {
      if (stage === "settings" || !turn) {
        return;
      }

      const playerState = turn === "player1" ? player1 : player2;
      const oppositePlayerState = turn === "player1" ? player2 : player1;

      if (stage === "placingShips") {
        const shipLocation = playerState.shipLocations.find(
          (n) => n.coordinates[n.coordinates.length - 1] === coordinate
        );

        if (!shipLocation) {
          setChildren(null);
          return;
        }

        setChildren(
          <Ship
            type={shipLocation.shipType}
            destroyed={false}
            isTray={false}
            initialOrientation={getShipOrientation(shipLocation)}
          />
        );
      } else if (stage === "playing") {
        const isHit = oppositePlayerState.hitCells.includes(coordinate);

        const tileShip = oppositePlayerState.shipLocations.find((n) =>
          n.coordinates.includes(coordinate)
        );

        const hasHitShip = !!tileShip;

        const isShipDestroyed =
          hasHitShip &&
          tileShip.coordinates.every((n) =>
            oppositePlayerState.hitCells.includes(n)
          );

        if (
          hasHitShip &&
          isShipDestroyed &&
          isLastShipCell(coordinate, tileShip)
        ) {
          setChildren(
            <Ship
              type={tileShip.shipType}
              destroyed={true}
              isTray={false}
              initialOrientation={getShipOrientation(tileShip)}
            />
          );

          return;
        }

        if (isHit && hasHitShip && !isShipDestroyed) {
          setChildren("X");
        } else if (isHit && !isShipDestroyed) {
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

    useEffect(() => {
      if (!ref.current) {
        return;
      }

      const rect = ref.current.getBoundingClientRect();

      const { scrollOffsetTop, scrollOffsetLeft } = getLayoutScrollOffset();

      setTileBounds((oldBounds) => ({
        ...oldBounds,
        [coordinate]: {
          id: coordinate,
          xBounds: [
            rect.left + scrollOffsetLeft,
            rect.right + scrollOffsetLeft,
          ],
          yBounds: [rect.top + scrollOffsetTop, rect.bottom + scrollOffsetTop],
        },
      }));
    }, [ref.current]);

    if (stage === "settings" || !turn) {
      return null;
    }

    return (
      <div className="tile" onClick={handleClick} ref={ref}>
        {children || coordinate}
      </div>
    );
  }
);
