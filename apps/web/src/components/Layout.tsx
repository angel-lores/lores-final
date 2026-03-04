import { NavLink } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="nav" aria-label="Primary">
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/items" className={({ isActive }) => (isActive ? "active" : "")}>
          My Items
        </NavLink>
        <NavLink to="/summary" className={({ isActive }) => (isActive ? "active" : "")}>
          Summary
        </NavLink>
      </nav>
      <main className="container">{children}</main>
    </>
  );
}