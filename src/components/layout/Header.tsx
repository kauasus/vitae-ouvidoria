import React from "react";
import logo from "../../assets/vitae.png";

const Header: React.FC = () => {
  return (
    <header style={{ height: 64, background: "var(--header-bg)", display: "flex", alignItems: "center", padding: "0 20px", color: "var(--header-fore)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src={logo} alt="Vitae Center" style={{ height: 40 }} />
        <div>
          <div style={{ fontWeight: 700 }}>Ouvidoria</div>
          <small style={{ opacity: 0.8 }}>Sistema de Gestão</small>
        </div>
      </div>

      <div style={{ marginLeft: "auto" }}>
        <button className="p-button p-button-text" style={{ color: "var(--muted)" }}>
          Olá, Admin
        </button>
      </div>
    </header>
  );
};

export default Header;