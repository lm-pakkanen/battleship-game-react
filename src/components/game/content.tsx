import { useEffect, useState } from "react";
import { useMemory } from "../../hooks/useMemory";
import { Board } from "./parts/board";
import { useGameContext } from "../../hooks/useGameContex";
import { Header } from "../header";
import { ShipTray } from "./parts/ship-tray";
import { Layout } from "../layout";
import { ResetGameButton } from "../controls/reset-game-button";
import { ResetPlacementsButton } from "../controls/reset-placements-button";
import { BlockPanel } from "./parts/block-panel";
import { transformName } from "../../functions/transform-name";

export const GameContent = () => {
  const { getSettings } = useMemory();
  const { stage, turn, components, functions } = useGameContext();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const settings = getSettings();

    if (!settings) {
      window.location.href = "/";
      return;
    }

    if (stage === "settings") {
      functions.setSettings(settings);
      functions.setStage("placingShips");
      functions.setTurn("player1");
    }

    setIsReady(true);
  }, [stage]);

  useEffect(() => {
    if (stage === "settings" || !turn) {
      return;
    }

    const textContent =
      stage === "placingShips" ? "Place your ships!" : "Sink the enemy!";

    components.header.setContent(
      <>
        <span className="text-header1 text-bold color-primary">
          {textContent}
        </span>
        <span className="text-header2 text-bold color-primary">
          {transformName(turn)}
        </span>
      </>
    );
  }, [stage, turn]);

  if (!isReady) {
    return "loading...";
  }

  return (
    <>
      {components.blockPanel.isVisible &&
        components.blockPanel.props.children && (
          <BlockPanel {...components.blockPanel.props} />
        )}

      <Layout
        menuBarContent={
          <>
            <ResetGameButton />
            {stage === "placingShips" && <ResetPlacementsButton />}
          </>
        }
      >
        <div className="game-content">
          <Header>{components.header.content}</Header>
          <Board />
          <ShipTray />
        </div>
      </Layout>
    </>
  );
};
