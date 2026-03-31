import React, { useEffect, useState } from "react";
import type { CreateManifestationDTO } from "../../types/createManifestation.dto";
import type { Person } from "../../types/manifestation";
import { ouvidoriaService } from "../../services/OuvidoriaService";
import { X, MessageSquarePlus, User, AlertCircle, FileText, Smartphone } from "lucide-react";
import Select from "../common/Select";

type Props = {
  visible: boolean;
  onHide: () => void;
  onSave: (dto: Omit<CreateManifestationDTO, "usuarioId">) => void;
  initial?: Partial<CreateManifestationDTO>;
  loading?: boolean;
};

const ManifestationForm: React.FC<Props> = ({ visible, onHide, onSave, initial, loading = false }) => {
  const [tipos, setTipos] = useState<{ label: string; value: number }[]>([]);
  const [canais, setCanais] = useState<{ label: string; value: number }[]>([]);
  const [statusOptions, setStatusOptions] = useState<{ label: string; value: number }[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);

  const emptyPerson = (): Person => ({ nome: "", cpf: "", telefone: "", email: "" });

  const [dto, setDto] = useState<Omit<CreateManifestationDTO, "usuarioId">>({
    tipoId: 0,
    canalId: 0,
    descricao: "",
    solicitante: { nome: "", cpf: "" },
    paciente: null,
    statusId: undefined,
    solicitanteEhPaciente: false,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setOptionsLoading(true);
      try {
        const [t, c, s] = await Promise.all([
          ouvidoriaService.getTipos(),
          ouvidoriaService.getCanais(),
          ouvidoriaService.getStatus(),
        ]);
        if (!mounted) return;

        setTipos(t.map((x) => ({ label: x.dsc_tipo, value: x.id })));
        setCanais(c.map((x) => ({ label: x.dsc_canal, value: x.id })));
        setStatusOptions(s.map((x) => ({ label: x.dsc_status, value: x.id })));

        setDto((prev) => {
          const base = { ...prev, ...initial };
          if (!base.tipoId && t[0]) base.tipoId = t[0].id;
          if (!base.canalId && c[0]) base.canalId = c[0].id;
          if (!base.statusId && s[0]) base.statusId = s[0].id;
          base.solicitante = base.solicitante ?? { nome: "", cpf: "" };
          base.paciente = base.paciente ?? null;
          base.solicitanteEhPaciente = !!base.solicitanteEhPaciente;
          return base;
        });
      } catch (err) {
        console.error("Erro ao carregar opções:", err);
      } finally {
        if (mounted) setOptionsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [initial]);

  const onChangeSolicitante = (field: keyof Person, value: string) => {
    setDto((prev) => {
      const solicitante = { ...(prev.solicitante ?? emptyPerson()), [field]: value };
      return {
        ...prev,
        solicitante,
        paciente: prev.solicitanteEhPaciente ? { ...solicitante } : prev.paciente,
      };
    });
  };

  const onChangePaciente = (field: keyof Person, value: string) => {
    setDto((prev) => ({ ...prev, paciente: { ...(prev.paciente ?? emptyPerson()), [field]: value } }));
  };

  const onToggleSolicitanteEhPaciente = (checked: boolean) => {
    setDto((prev) => ({
      ...prev,
      solicitanteEhPaciente: checked,
      paciente: checked ? { ...(prev.solicitante ?? emptyPerson()) } : prev.paciente ?? null,
    }));
  };

  const handleSave = () => {
    if (!dto.descricao?.trim()) {
      alert("Descrição é obrigatória.");
      return;
    }
    if (!dto.solicitante?.nome?.trim()) {
      alert("Nome do solicitante é obrigatório.");
      return;
    }
    if (!dto.tipoId || !dto.canalId) {
      alert("Tipo e Canal são obrigatórios.");
      return;
    }
    onSave(dto);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 sm:p-6 opacity-100 transition-opacity duration-300">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog" 
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-600">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Nova Manifestação</h2>
              <p className="text-sm text-gray-500 font-medium mt-0.5">Preencha os dados para registrar o atendimento</p>
            </div>
          </div>
          <button
            onClick={onHide}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="manifestation-form" className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            
            {/* Seção Principal: Tipo e Canal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
              <div className="space-y-2">
                <label htmlFor="tipo" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Tipo de Manifestação
                </label>
                <Select
                  id="tipo"
                  value={dto.tipoId}
                  onChange={(val) => setDto({ ...dto, tipoId: Number(val) })}
                  options={tipos}
                  placeholder={optionsLoading ? "Carregando tipos..." : "Selecione um tipo..."}
                  disabled={optionsLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="canal" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-gray-400" />
                  Canal de Origem
                </label>
                <Select
                  id="canal"
                  value={dto.canalId}
                  onChange={(val) => setDto({ ...dto, canalId: Number(val) })}
                  options={canais}
                  placeholder={optionsLoading ? "Carregando canais..." : "Selecione o canal..."}
                  disabled={optionsLoading}
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2 pb-6 border-b border-gray-100">
              <label htmlFor="descricao" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                Descrição Detalhada
              </label>
              <textarea
                id="descricao"
                rows={5}
                value={dto.descricao}
                onChange={(e) => setDto({ ...dto, descricao: e.target.value })}
                placeholder="Relate o ocorrido com o máximo de detalhes possível para facilitar a análise..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 hover:bg-white transition-colors resize-y leading-relaxed"
              />
            </div>

            {/* Seção Identificação */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-bold text-gray-900">Identificação</h3>
              </div>
              
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Dados do Solicitante</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="solicitante-nome" className="text-sm font-medium text-gray-600">Nome Completo</label>
                      <input
                        id="solicitante-nome"
                        type="text"
                        placeholder="Ex: João da Silva"
                        value={dto.solicitante?.nome ?? ""}
                        onChange={(e) => onChangeSolicitante("nome", e.target.value)}
                        className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="solicitante-cpf" className="text-sm font-medium text-gray-600">CPF</label>
                      <input
                        id="solicitante-cpf"
                        type="text"
                        placeholder="000.000.000-00"
                        value={dto.solicitante?.cpf ?? ""}
                        onChange={(e) => onChangeSolicitante("cpf", e.target.value)}
                        className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id="isPatient"
                        type="checkbox"
                        checked={!!dto.solicitanteEhPaciente}
                        onChange={(e) => onToggleSolicitanteEhPaciente(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-600 transition duration-150 ease-in-out cursor-pointer"
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label htmlFor="isPatient" className="font-medium text-gray-700 cursor-pointer select-none">
                        O solicitante é o próprio paciente
                      </label>
                      <p className="text-gray-500">Marque se os dados acima pertencem ao paciente atendido.</p>
                    </div>
                  </div>
                </div>

                {/* Dados do Paciente (condicional) */}
                {!dto.solicitanteEhPaciente && (
                  <div className="pt-5 border-t border-slate-200 animate-in slide-in-from-top-2 fade-in duration-300">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Dados do Paciente</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="paciente-nome" className="text-sm font-medium text-gray-600">Nome do Paciente</label>
                        <input
                          id="paciente-nome"
                          type="text"
                          placeholder="Ex: Maria da Silva"
                          value={dto.paciente?.nome ?? ""}
                          onChange={(e) => onChangePaciente("nome", e.target.value)}
                          className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="paciente-cpf" className="text-sm font-medium text-gray-600">CPF do Paciente</label>
                        <input
                          id="paciente-cpf"
                          type="text"
                          placeholder="000.000.000-00"
                          value={dto.paciente?.cpf ?? ""}
                          onChange={(e) => onChangePaciente("cpf", e.target.value)}
                          className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Inicial */}
            <div className="md:w-1/3 pt-4">
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-bold text-gray-700">Status Inicial</label>
              <Select
                id="status"
                value={dto.statusId ?? 0}
                onChange={(val) => setDto({ ...dto, statusId: Number(val) })}
                options={statusOptions}
                placeholder={optionsLoading ? "Carregando status..." : "Selecione o status..."}
                disabled={optionsLoading}
              />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={onHide}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="manifestation-form"
            disabled={loading || optionsLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-sm shadow-red-600/20 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Registrando...
              </>
            ) : (
              "Registrar Manifestação"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManifestationForm;