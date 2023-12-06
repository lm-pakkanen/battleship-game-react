import { useMemo } from "react";
import { useGameContext } from "../../../hooks/useGameContex";
import { ShipType } from "../../../enums/ShipType";
import { Ship } from "./ships/ship";
import { ShipOrientation } from "../../../enums/ShipOrientation";
import { useBoardTileIndex } from "../../../hooks/useBoardTileIndex";
import "./ship-tray.css";

const getRandomKey = () => {
  return Math.random().toString(36).substring(0, 10);
};

export const ShipTray = () => {
  const { settings, turn, stage, player1, player2 } = useGameContext();
  const lastTileTabIndex = useBoardTileIndex();

  const boardWidth = useMemo(() => {
    return settings.boardSize * 70;
  }, [settings.boardSize]);

  const ships: {
    type: ShipType;
    randomKey: string;
    count?: number;
  }[] = useMemo(() => {
    const playerState = turn === "player1" ? player1 : player2;
    const oppositePlayerState = turn === "player1" ? player2 : player1;

    const shipCountsSetting = settings.shipCounts;

    const _ships: typeof ships = [];

    if (stage === "placingShips") {
      const nextShipCounts = {
        ...shipCountsSetting,
      };

      const placedShips = playerState.shipLocations.map((n) => n.shipType);

      for (const ship of placedShips) {
        nextShipCounts[ship as ShipType]--;
      }

      for (const [shipType, shipCount] of Object.entries(nextShipCounts).sort(
        ([shipType1], [shipType2]) =>
          shipType1 < shipType2 ? -1 : shipType1 > shipType2 ? 1 : 0
      )) {
        for (let i = 0; i < shipCount; i++) {
          const randomKey = getRandomKey();

          _ships.push({
            type: shipType as ShipType,
            randomKey,
          });
        }
      }

      return _ships;
    } else if (stage === "playing") {
      return Object.entries(shipCountsSetting)
        .map(([type, count]) => ({
          type: type as ShipType,
          randomKey: getRandomKey(),
          count,
        }))
        .filter((n) => n.count > 0)
        .map((n) => {
          const locationsForType = oppositePlayerState.shipLocations.filter(
            (location) => location.shipType === n.type
          );

          const sunkCount = locationsForType.filter((location) =>
            location.coordinates.every((n) =>
              oppositePlayerState.hitCells.includes(n)
            )
          ).length;

          return {
            ...n,
            count: n.count - sunkCount,
          };
        });
    }

    return [];
  }, [turn, stage, player1, player2]);

  return (
    <article className="ship-tray" style={{ width: boardWidth }}>
      {ships.map(({ type, randomKey, count }, index) => {
        const shipSectionClassNames = [`ship-tray-section tray-${type}`];

        if (count !== undefined) {
          shipSectionClassNames.push("non-draggable");
        }

        const tabIndex = lastTileTabIndex + index + 1;

        return (
          <section
            key={`${type}-tray-ship-${randomKey}`}
            className={shipSectionClassNames.join(" ")}
            id={`tray-${type}-ship-${index}`}
          >
            <Ship
              type={type}
              destroyed={false}
              isTray={true}
              initialOrientation={ShipOrientation.BOTTOM_TO_TOP}
              count={count}
              tabIndex={tabIndex}
            />
          </section>
        );
      })}
    </article>
  );
};
