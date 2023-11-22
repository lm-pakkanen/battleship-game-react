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
import { useNavigate } from "react-router-dom";

export const GameContent = () => {
  const navigate = useNavigate();

  const { getSettings } = useMemory();
  const { stage, turn, allShipsSunk, player1, player2, components, functions } =
    useGameContext();

  const [isReady, setIsReady] = useState(false);

  const playerState = turn === "player1" ? player1 : player2;

  const headerTextContent =
    stage === "placingShips" ? "Place your ships!" : "Sink the enemy!";

  const settings = getSettings();

  useEffect(() => {
    if (!settings) {
      navigate("/");
      return;
    }

    if (stage === "settings") {
      functions.setSettings(settings);
      functions.setStage("placingShips");
      functions.setTurn("player1");
    }

    setIsReady(true);
  }, [stage, settings]);

  useEffect(() => {
    if (stage === "settings" || !turn) {
      return;
    }

    components.header.setContent(
      <>
        <span className="text-header1 text-bold color-primary">
          {headerTextContent}
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
      <BlockPanel {...components.blockPanel.props} />

      {!allShipsSunk && stage !== "gameOver" && (
        <Layout
          helpText={"test"}
          menuBarContent={
            <>
              <ResetGameButton isEndGameScreen={false} />
              {stage === "placingShips" &&
                playerState.shipLocations.length > 0 && (
                  <ResetPlacementsButton />
                )}
            </>
          }
        >
          <div className="game-content">
            <Header>{components.header.content}</Header>
            <Board key={turn} />
            <ShipTray />
          </div>
        </Layout>
      )}
    </>
  );
};
