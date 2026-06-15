import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { darkMode, toggleDarkMode, user, logout } = useApp();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: "/dashboard", label: "Início" },
    { to: "/tasks", label: "Tarefas" },
    { to: "/explore", label: "Explorar" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">

        <Link to="/dashboard" className="brand">
          ListTo<span>Do</span>
        </Link>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={pathname === link.to ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {user && (
            <>
              <span className="user-name">
                {user.name}
              </span>

              <button
                className="btn-logout"
                onClick={handleLogout}
              >
                Sair
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}