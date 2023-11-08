import "./menu-bar.css";

export interface MenuBar {
  children: React.ReactNode;
}

export const MenuBar = ({ children }: MenuBar) => {
  return <div className="menu-bar">{children}</div>;
};
