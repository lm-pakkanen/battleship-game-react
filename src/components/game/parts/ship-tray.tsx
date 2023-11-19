import { useEffect, useState } from "react";
import { useGameContext } from "../../../hooks/useGameContex";
import { ShipType } from "../../../enums/ShipType";
import { Ship } from "./ships/ship";
import "./ship-tray.css";
import { ShipOrientation } from "../../../enums/ShipOrientation";

export const ShipTray = () => {
  const { settings, turn, stage, player1, player2 } = useGameContext();

  const [ships, setShips] = useState<{ type: ShipType }[]>([]);

  useEffect(() => {
    const playerState = turn === "player1" ? player1 : player2;
    const shipCountsSetting = settings.shipCounts;

    const nextShipCounts = {
      ...shipCountsSetting,
    };

    if (stage === "placingShips") {
      const placedShips = playerState.shipLocations.map((n) => n.shipType);

      for (const ship of placedShips) {
        nextShipCounts[ship as ShipType]--;
      }
    } else if (stage === "playing") {
      //
    }

    const _ships: typeof ships = [];

    for (const [shipType, shipCount] of Object.entries(nextShipCounts).sort(
      ([shipType1], [shipType2]) =>
        shipType1 < shipType2 ? -1 : shipType1 > shipType2 ? 1 : 0
    )) {
      for (let i = 0; i < shipCount; i++) {
        _ships.push({ type: shipType as ShipType });
      }
    }

    setShips(_ships);
  }, [
    turn,
    stage,
    player1.shipLocations,
    player1.hitCells,
    player2.shipLocations,
    player2.hitCells,
  ]);

  if (!ships) {
    return null;
  }

  return (
    <div className="ship-tray-wrapper">
      <article className="ship-tray">
        {ships.map(({ type }, index) => (
          <section
            key={`${type}-tray-ship-${index}`}
            className="ship-tray-section"
          >
            <Ship
              type={type}
              destroyed={false}
              isTray={true}
              initialOrientation={ShipOrientation.BOTTOM_TO_TOP}
            />
          </section>
        ))}
      </article>
    </div>
  );
};
