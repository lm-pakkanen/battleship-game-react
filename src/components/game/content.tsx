import { useEffect, useState } from "react";
import { useMemory } from "../../hooks/useMemory";
import { Board } from "./parts/board";
import { useGameContext } from "../../hooks/useGameContex";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Header } from "../header";
import { ShipTray } from "./parts/ship-tray";
import { Layout } from "../layout";
import { ResetGameButton } from "../controls/reset-game-button";
import { Draggable } from "./parts/draggable";
import { ShipType } from "../../enums/ShipType";

export const GameContent = () => {
  const { getSettings } = useMemory();
  const { components, functions } = useGameContext();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const settings = getSettings();

    if (!settings) {
      window.location.href = "/";
      return;
    }

    functions.setSettings(settings);
    functions.setStage("placingShips");
    functions.setTurn("player1");

    setIsReady(true);

    components.header.setContent(
      <>
        <span className="text-header1 text-bold color-primary">
          Place your ships!
        </span>
        <span className="text-header2 text-bold color-primary">Player1</span>
      </>
    );
  }, []);

  if (!isReady) {
    return "loading...";
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout menuBarContent={<ResetGameButton />}>
        <div className="game-content">
          <Header>{components.header.content}</Header>
          <Draggable shipType={ShipType.BATTLESHIP} />
          <Board />
          <ShipTray />
        </div>
      </Layout>
    </DndProvider>
  );
};
