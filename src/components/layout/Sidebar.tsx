import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <aside
      style={{
        width: 260,
        background: "#2c2c2c", // Cinza grafite forte (Vitae Dark Gray)
        color: "#ffffff",      // Texto branco para máximo contraste
        padding: "20px 12px",
        height: "100%",        // Ocupa a altura disponível
        boxSizing: "border-box",
        borderRight: "1px solid rgba(255,255,255,0.05)"
      }}
    >
      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
        >
          <i className="pi pi-chart-bar mr-2"></i> Dashboard
        </NavLink>
        
        <NavLink
          to="/manifestations/new"
          className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
        >
          <i className="pi pi-plus-circle mr-2"></i> Nova Manifestação
        </NavLink>
        
        <NavLink
          to="/manifestations"
          className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
        >
          <i className="pi pi-list mr-2"></i> Manifestações
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;