import "./flex-label.css";

export interface FlexLabel {
  children: React.ReactNode;
}

export const FlexLabel = ({ children }: FlexLabel) => {
  return (
    <label
      className="flex-label"
      onClick={(event) => {
        // Prevents bug where clicking within label focuses first input
        event.preventDefault();
      }}
    >
      {children}
    </label>
  );
};
