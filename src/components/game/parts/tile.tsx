import { useGameContext } from "../../../hooks/useGameContex";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Ship } from "./ships/ship";
import { isLastShipCell } from "../../../functions/is-first-ship-cell";
import React from "react";
import { getShipOrientation } from "../../../functions/get-ship-orientation";
import { getLayoutScrollOffset } from "../../../functions/get-layout-scroll-offset";
import { GuessMarker } from "./guess-marker";
import "./tile.css";

export interface Tile {
  coordinate: string;
  tabIndex: number;
  handleClick: (coordinate: string) => void;
}

export const Tile = React.forwardRef<HTMLDivElement, Tile>(
  ({ coordinate, tabIndex, handleClick: _handleClick }: Tile, externalRef) => {
    const { stage, player1, player2, turn, setTileBounds } = useGameContext();

    const internalRef = useRef<HTMLDivElement>(null);

    const ref =
      externalRef && typeof externalRef !== "function"
        ? externalRef
        : internalRef;

    const handleKeydown: React.KeyboardEventHandler = useCallback(
      (event) => {
        if (event.key === "Enter") {
          _handleClick(coordinate);
        }
      },
      [coordinate, _handleClick]
    );

    const handleClick: React.MouseEventHandler<HTMLDivElement> = useCallback(
      () => _handleClick(coordinate),
      [coordinate, _handleClick]
    );

    const children = useMemo(() => {
      if (stage === "settings" || !turn) {
        return null;
      }

      if (stage === "placingShips") {
        const playerState = turn === "player1" ? player1 : player2;

        const shipLocation = playerState.shipLocations.find(
          (n) => n.coordinates[n.coordinates.length - 1] === coordinate
        );

        if (shipLocation) {
          return (
            <Ship
              type={shipLocation.shipType}
              destroyed={false}
              isTray={false}
              initialOrientation={getShipOrientation(shipLocation)}
              tabIndex={-1}
            />
          );
        }

        return null;
      }

      if (stage === "playing") {
        const oppositePlayerState = turn === "player1" ? player2 : player1;
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
          return (
            <>
              <Ship
                type={tileShip.shipType}
                destroyed={true}
                isTray={false}
                initialOrientation={getShipOrientation(tileShip)}
                tabIndex={-1}
              />
              <GuessMarker variant={"hit"} />
            </>
          );
        }

        if (isHit) {
          // Hit marker only
          return <GuessMarker variant={hasHitShip ? "hit" : "miss"} />;
        }
      }

      return null;
    }, [stage, turn, player1, player2]);

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
      <div
        className="tile aim"
        onClick={handleClick}
        onKeyDown={handleKeydown}
        ref={ref}
        tabIndex={tabIndex}
      >
        <div className="tile-coordinate">{coordinate}</div>
        {children}
      </div>
    );
  }
);
