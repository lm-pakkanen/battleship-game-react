import { useCallback, useEffect, useRef, useState } from "react";
import { useGameContext } from "../../../hooks/useGameContex";
import { initialGameContext } from "../../../context/game-context";
import { useNavigate } from "react-router-dom";
import "./block-panel.css";

export interface BlockPanel {
  isVisible: boolean;
  timer: null | number;
  children: React.ReactNode;
  routeTo?: string;
  onShow?: () => void;
  onPanelVisible?: () => void;
  onTimerEnd?: () => void;
}

const TIME_TO_PANEL_VISIBLE_MS = 1000;

export const BlockPanel = ({
  isVisible,
  timer,
  children,
  routeTo,
  onShow,
  onPanelVisible,
  onTimerEnd,
}: BlockPanel) => {
  const navigate = useNavigate();
  const { components } = useGameContext();

  const [countdownValue, setCountdownValue] = useState<null | number>(null);

  const onShowTriggered = useRef(false);

  let loopCount = 0;
  let countdownInterval: undefined | number = undefined;

  const classNames = ["block-panel"];

  if (isVisible) {
    classNames.push("block-panel-visible");
  }

  const loopCountdown = useCallback(() => {
    if (!timer) {
      return;
    }

    const timeLeft = Math.floor((timer! - loopCount * 1000) / 1000);

    if (timeLeft >= 0) {
      setCountdownValue(timeLeft);
      loopCount++;
    } else if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  }, [timer, loopCount, countdownInterval]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    if (timer) {
      loopCountdown();
      countdownInterval = setInterval(loopCountdown, 1000);
    }

    let onVisibleTimeout: undefined | number = undefined;
    let hideTimeout: undefined | number = undefined;

    if (onPanelVisible) {
      onVisibleTimeout = setTimeout(() => {
        onPanelVisible();
      }, TIME_TO_PANEL_VISIBLE_MS);
    }

    if (timer) {
      hideTimeout = setTimeout(() => {
        clearTimeout(onVisibleTimeout);
        clearInterval(countdownInterval);

        if (onTimerEnd) {
          onTimerEnd();
        }

        if (routeTo) {
          navigate(routeTo);
          return;
        }

        setCountdownValue(null);
        components.blockPanel.setProps(
          initialGameContext.components.blockPanel.props
        );
      }, timer);
    }

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(onVisibleTimeout);
      clearTimeout(hideTimeout);
    };
  }, [isVisible, timer]);

  useEffect(() => {
    if (onShow && !onShowTriggered.current && isVisible) {
      onShowTriggered.current = true;
      onShow();
    }
  }, [isVisible, onShow]);

  return (
    <div className={classNames.join(" ")}>
      <div className="block-panel-timer"></div>
      <div className="block-panel-content">
        {countdownValue && (
          <span className="text-header1 text-bold color-white">{`${countdownValue}s`}</span>
        )}
        {children}
      </div>
    </div>
  );
};
