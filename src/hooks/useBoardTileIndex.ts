import { useLayoutEffect, useState } from "react";

export const useBoardTileIndex = () => {
  const [lastTabIndex, setLastTabIndex] = useState(0);

  useLayoutEffect(() => {
    const tileElements = document.getElementsByClassName("tile");

    const tabIndexNumbers = Array.from(tileElements)
      .map((n) => n.getAttribute("tabindex"))
      .filter((n): n is string => n !== null)
      .map((n) => parseInt(n))
      .filter((n) => !Number.isNaN(n));

    setLastTabIndex(Math.max(...tabIndexNumbers));
  }, []);

  return lastTabIndex;
};
