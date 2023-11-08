import { useEffect, useState } from "react";
import { useGameContext } from "../../../hooks/useGameContex";
import { ShipCounts } from "../../../constructors/GameSettings";
import { ShipType } from "../../../enums/ShipType";

export const ShipTray = () => {
  const { settings, turn, stage, player1, player2 } = useGameContext();

  const [shipCounts, setShipCounts] = useState<null | ShipCounts>(null);

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

    setShipCounts(nextShipCounts);
  }, [
    turn,
    stage,
    player1.shipLocations,
    player1.hitCells,
    player2.shipLocations,
    player2.hitCells,
  ]);

  if (!shipCounts) {
    return null;
  }

  return <article>{JSON.stringify(shipCounts)}</article>;
};
