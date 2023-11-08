import "./header.css";

export interface Header {
  children: React.ReactNode;
}

export const Header = ({ children }: Header) => {
  return <div className="header">{children}</div>;
};
