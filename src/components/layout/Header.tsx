import React from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authServices";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        background: "#2c2c2c",
        color: "#fff",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Vitae Center</h2>
        {user && (
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.7 }}>
            Olá, {user.nome} ({user.role === "admin" ? "Administrador" : "Usuário"})
          </p>
        )}
      </div>
      <Button
        label="Sair"
        icon="pi pi-sign-out"
        className="p-button-sm p-button-danger"
        onClick={handleLogout}
      />
    </header>
  );
};

export default Header;