import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authServices";
import { LogOut, Bell, User } from "lucide-react";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex justify-between items-center z-10 sticky top-0 shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        {user && (
          <div>
            <h2 className="text-gray-900 font-semibold text-sm m-0 leading-tight">Olá, {user.nome}</h2>
            <p className="text-xs text-gray-500 font-medium m-0">
              Perfil: {user.role === "admin" ? "Administrador" : "Usuário Base"}
            </p>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-gray-400 hover:text-red-500 transition-colors relative focus:outline-none">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="w-px h-6 bg-gray-200"></div>

        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-red-50 text-red-600 rounded-full flex items-center justify-center font-bold text-sm shadow-inner">
            {user?.nome ? user.nome.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors focus:outline-none"
            aria-label="Sair do sistema"
          >
            Sair
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;