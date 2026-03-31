import React from "react";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <main
      className="flex-1 overflow-y-auto p-8"
      style={{ backgroundColor: "var(--color-vitae-bg)" }}
    >
      <Outlet /> {/* ← As páginas aparecem aqui */}
    </main>
  );
};

export default Layout;