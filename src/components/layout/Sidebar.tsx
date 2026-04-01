import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, PlusCircle, List, FileStack } from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shadow-2xl relative z-20">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800 mb-6 shrink-0">
        <div className="rounded-lg p-1.5 shadow-sm">
          <img src="/logobak.webp" alt="" width="80px" className="flex-1"/>
        </div>
        
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group ${
              isActive 
                ? "bg-red-600/10 text-red-500" 
                : "text-slate-400 hover:text-slate-50 hover:bg-slate-800"
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 transition-transform group-hover:scale-110" />
          Dashboard
        </NavLink>

        <NavLink
          to="/manifestations/new"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group ${
              isActive 
                ? "bg-red-600/10 text-red-500" 
                : "text-slate-400 hover:text-slate-50 hover:bg-slate-800"
            }`
          }
        >
          <PlusCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
          Nova Manifestação
        </NavLink>

        <NavLink
          to="/manifestations"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group ${
              isActive 
                ? "bg-red-600/10 text-red-500" 
                : "text-slate-400 hover:text-slate-50 hover:bg-slate-800"
            }`
          }
        >
          <List className="w-5 h-5 transition-transform group-hover:scale-110" />
          Manifestações
        </NavLink>

        <NavLink
          to="/prontuario/admin"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group ${
              isActive 
                ? "bg-red-600/10 text-red-500" 
                : "text-slate-400 hover:text-slate-50 hover:bg-slate-800"
            }`
          }
        >
          <FileStack className="w-5 h-5 transition-transform group-hover:scale-110" />
          Prontuários
        </NavLink>
      </nav>

      <div className="p-4 border-t border-slate-800 mt-auto shrink-0">
        <div className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-xs text-slate-400 font-medium">Ouvidoria Sistema</p>
          <p className="text-[10px] text-slate-500 mt-1">By Kauã</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;