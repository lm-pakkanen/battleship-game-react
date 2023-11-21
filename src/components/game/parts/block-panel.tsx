import { useEffect, useMemo, useState } from "react";
import { useGameContext } from "../../../hooks/useGameContex";
import { initialGameContext } from "../../../context/game-context";
import "./block-panel.css";

export interface BlockPanel {
  isVisible: boolean;
  timer: null | number;
  textContent: string;
  onTimerEnd: () => void;
}

export const BlockPanel = ({
  isVisible,
  timer,
  textContent,
  onTimerEnd,
}: BlockPanel) => {
  const { components } = useGameContext();

  const [countdownValue, setCountdownValue] = useState<null | number>(null);

  const classNames: string[] = useMemo(() => {
    const nextClassNames: string[] = ["block-panel"];

    if (isVisible) {
      nextClassNames.push("block-panel-visible");
    }

    return nextClassNames;
  }, [isVisible]);

  useEffect(() => {
    if (!timer) {
      return;
    }

    let loopCount = 0;

    let countdownInterval: undefined | number = undefined;

    const updateCountdown = () => {
      const timeLeft = Math.floor((timer - loopCount * 1000) / 1000);

      if (timeLeft < 2) {
        onTimerEnd();
      }

      if (timeLeft >= 0) {
        setCountdownValue(timeLeft);
        loopCount++;
      } else if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);

    const hideTimeout = setTimeout(() => {
      components.blockPanel.setProps(
        initialGameContext.components.blockPanel.props
      );
    }, timer);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(hideTimeout);
    };
  }, [timer]);

  return (
    <div className={classNames.join(" ")}>
      <div className="block-panel-timer"></div>
      <div className="block-panel-content">
        {countdownValue && (
          <span className="text-header1 text-bold color-white">{`${countdownValue}s`}</span>
        )}
        {textContent}
      </div>
    </div>
  );
};
