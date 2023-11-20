import { useMemo } from "react";
import { useGameContext } from "../../../hooks/useGameContex";
import { ShipType } from "../../../enums/ShipType";
import { Ship } from "./ships/ship";
import { ShipOrientation } from "../../../enums/ShipOrientation";
import "./ship-tray.css";

export const ShipTray = () => {
  const { settings, turn, stage, player1, player2 } = useGameContext();

  const ships: { type: ShipType; randomKey: string }[] = useMemo(() => {
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
        const randomKey = Math.random().toString(36).substring(0, 10);

        _ships.push({
          type: shipType as ShipType,
          randomKey,
        });
      }
    }

    return _ships;
  }, [turn, stage, player1.shipLocations, player2.shipLocations]);

  return (
    <article className="ship-tray">
      {ships.map(({ type, randomKey }, index) => (
        <section
          key={`${type}-tray-ship-${randomKey}`}
          className={`ship-tray-section tray-${type}`}
          id={`tray-${type}-ship-${index}`}
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
  );
};
