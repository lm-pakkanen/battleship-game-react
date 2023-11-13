import { MenuBar } from "./menu-bar";
import "./layout.css";

export interface Layout {
  children: React.ReactNode;
  menuBarContent?: React.ReactNode;
}

export const Layout = ({ children, menuBarContent }: Layout) => {
  return (
    <div className="layout">
      <MenuBar>{menuBarContent}</MenuBar>
      <div className="layout-content">{children}</div>
    </div>
  );
};
