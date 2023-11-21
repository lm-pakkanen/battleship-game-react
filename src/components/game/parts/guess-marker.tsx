import "./guess-marker.css";

export interface GuessMarker {
  variant: "hit" | "miss";
}

export const GuessMarker = ({ variant }: GuessMarker) => {
  return <span className={`guess-marker ${variant}`}>X</span>;
};
