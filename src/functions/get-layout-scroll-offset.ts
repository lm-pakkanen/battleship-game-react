export const getLayoutScrollOffset = (): {
  scrollOffsetTop: number;
  scrollOffsetLeft: number;
} => {
  if (typeof window === "undefined") {
    throw new Error("Not browser context");
  }

  const layoutContentElement = document.getElementById("layout-content");

  if (!layoutContentElement) {
    throw new Error("Layout content element not found");
  }

  const scrollOffsetTop = layoutContentElement.scrollTop;
  const scrollOffsetLeft = layoutContentElement.scrollLeft;

  return {
    scrollOffsetTop,
    scrollOffsetLeft,
  };
};
