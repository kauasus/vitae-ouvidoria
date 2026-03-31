import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, PlusCircle, List, FileStack } from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shadow-2xl relative z-20">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800 mb-6 shrink-0">
        <div className="bg-red-600 rounded-lg p-1.5 shadow-sm shadow-red-600/20">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h1 className="text-white font-bold text-lg tracking-wide">Vitae Center</h1>
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