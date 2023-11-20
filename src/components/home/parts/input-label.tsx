import "./input-label.css";

export interface InputLabel {
  label: string;
}

export const InputLabel = ({ label }: InputLabel) => {
  return <h3 className="input-label">{label}</h3>;
};
