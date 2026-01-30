import React from "react";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import "./styles/variables.css";

const App: React.FC = () => (
  <div className="flex flex-column h-screen">
    <Header />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <AppRoutes />
      </main>
    </div>
  </div>
);

export default App;
