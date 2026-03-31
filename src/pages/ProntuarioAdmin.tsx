import React, { useState } from "react";
import GerarLinkTemporario from "../components/prontuario/GerarLinkTemporario";
import { ListaTermosSolicitados } from "../components/prontuario/ListaTermosSolicitados";
import { Link2, FileText, ClipboardList } from "lucide-react";

const tabs = [
  { id: "gerar", label: "Gerar Links Temporários", icon: <Link2 className="w-4 h-4" /> },
  { id: "termos", label: "Termos Solicitados", icon: <FileText className="w-4 h-4" /> },
];

const ProntuarioAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState("gerar");

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestão de Prontuários</h1>
          </div>
          <p className="text-gray-500 mt-1.5 font-medium ml-1">Administre o acesso externo e visualize os termos de responsabilidade assinados.</p>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 rounded-t-2xl px-2 sm:px-6 pt-2 overflow-x-auto custom-scrollbar">
        <nav className="flex space-x-6 min-w-max" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-1 py-4 border-b-2 font-bold text-sm transition-colors whitespace-nowrap focus:outline-none ${
                activeTab === tab.id
                  ? "border-brand-600 text-brand-600"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
              }`}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              <span className={`${activeTab === tab.id ? "text-brand-600" : "text-gray-400 group-hover:text-gray-500"}`}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "gerar" && <GerarLinkTemporario />}
        {activeTab === "termos" && <ListaTermosSolicitados />}
      </div>
    </div>
  );
};

export default ProntuarioAdmin;