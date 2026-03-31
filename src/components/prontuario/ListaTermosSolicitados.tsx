import React, { useEffect, useMemo, useState } from "react";
import { prontuarioService } from "../../services/prontuarioServices";
import type { SolicitacaoProntuario } from "../../types/prontuarios";
import { FileText, User, Calendar, Eye, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";

const ROWS_PER_PAGE = 10;

const formatDateTime = (iso?: string) => {
  if (!iso) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  }).format(new Date(iso));
};

const ListaTermosSolicitados: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoProntuario[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSolicitacao, setSelectedSolicitacao] = useState<SolicitacaoProntuario | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // pagination + sorting states
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(ROWS_PER_PAGE);
  const [sortField, setSortField] = useState<keyof SolicitacaoProntuario | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const fetchSolicitacoes = async () => {
    try {
      setLoading(true);
      const data = await prontuarioService.getSolicitacoes();
      setSolicitacoes(data);
    } catch (err) {
      console.error("Erro ao carregar solicitações", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  const verDetalhes = (solicitacao: SolicitacaoProntuario) => {
    setSelectedSolicitacao(solicitacao);
    setShowDialog(true);
  };

  const sortBy = (field: keyof SolicitacaoProntuario) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const renderSortIcon = (field: keyof SolicitacaoProntuario) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return sortOrder === "asc" 
      ? <ChevronUp className="w-4 h-4 text-brand-600" />
      : <ChevronDown className="w-4 h-4 text-brand-600" />;
  };

  const sorted = useMemo(() => {
    const arr = [...solicitacoes];
    if (!sortField) return arr;
    return arr.sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      // handle date strings specially
      if (sortField === "dataHoraSolicitacao" || sortField === "dataNascimento") {
        const da = new Date(String(av)).getTime();
        const db = new Date(String(bv)).getTime();
        return sortOrder === "asc" ? da - db : db - da;
      }
      const sa = String(av ?? "").toLowerCase();
      const sb = String(bv ?? "").toLowerCase();
      if (sa < sb) return sortOrder === "asc" ? -1 : 1;
      if (sa > sb) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [solicitacoes, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const pageItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, page, rowsPerPage]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Termos de Responsabilidade</h2>
          <p className="text-sm text-gray-500 mt-1">Acompanhamento das solicitações de acesso a prontuários</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
          <span className="text-sm font-semibold text-gray-700">Total: {solicitacoes.length}</span>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">Buscando solicitações...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th
                    className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer group hover:bg-gray-100/80 transition-colors"
                    onClick={() => sortBy("nomeCompleto")}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      Paciente
                      {renderSortIcon("nomeCompleto")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer group hover:bg-gray-100/80 transition-colors"
                  >
                    CPF
                  </th>
                  <th
                    className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer group hover:bg-gray-100/80 transition-colors"
                  >
                    E-mail
                  </th>
                  <th
                    className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer group hover:bg-gray-100/80 transition-colors"
                    onClick={() => sortBy("dataHoraSolicitacao")}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Solicitado em
                      {renderSortIcon("dataHoraSolicitacao")}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Termo Aceito</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FileText className="w-10 h-10 text-gray-300 mb-3" />
                        <p className="font-medium text-gray-600">Nenhuma solicitação encontrada.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pageItems.map((row) => (
                    <tr key={row.id} className="hover:bg-brand-50/30 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {row.nomeCompleto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.cpf}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-[200px]">
                        {row.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(row.dataHoraSolicitacao)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {row.aceitouTermo ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Sim
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                            <XCircle className="w-3.5 h-3.5" /> Não
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => verDetalhes(row)}
                          className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm group-hover:shadow-md"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="font-medium">Detalhes</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginator */}
        {solicitacoes.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between sm:flex-row flex-col gap-4">
            <span className="text-sm text-gray-600 font-medium">
              Mostrando <span className="text-gray-900 font-semibold">{(page - 1) * rowsPerPage + 1}</span> a{" "}
              <span className="text-gray-900 font-semibold">{Math.min(page * rowsPerPage, sorted.length)}</span> de{" "}
              <span className="text-gray-900 font-semibold">{sorted.length}</span> registros
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex items-center gap-1 px-2">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                  let p = idx + 1;
                  if (totalPages > 5 && page > 3) {
                    p = page - 2 + idx;
                    if (p > totalPages) p = totalPages - (4 - idx);
                  }
                  
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                        p === page 
                          ? "bg-brand-600 text-white shadow-sm" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showDialog && selectedSolicitacao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-brand-50 p-2 rounded-lg text-brand-600">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Detalhes Administrativos</h3>
              </div>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 h-8 w-8 rounded-full flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-800">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="font-bold text-gray-500 uppercase text-[10px] tracking-wider mb-1">Paciente</div>
                  <div className="font-medium text-gray-900">{selectedSolicitacao.nomeCompleto}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="font-bold text-gray-500 uppercase text-[10px] tracking-wider mb-1">CPF</div>
                  <div className="font-medium text-gray-900">{selectedSolicitacao.cpf}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="font-bold text-gray-500 uppercase text-[10px] tracking-wider mb-1">Nascimento</div>
                  <div className="font-medium text-gray-900">{new Date(selectedSolicitacao.dataNascimento).toLocaleDateString("pt-BR")}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="font-bold text-gray-500 uppercase text-[10px] tracking-wider mb-1">Telefone</div>
                  <div className="font-medium text-gray-900">{selectedSolicitacao.telefone}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="font-bold text-gray-500 uppercase text-[10px] tracking-wider mb-1">Aceite Legal</div>
                  <div className="font-medium text-gray-900">{selectedSolicitacao.aceitouTermo ? "Sim" : "Não"}</div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="font-bold text-gray-500 uppercase text-[10px] tracking-wider mb-1">Motivo do Pedido</div>
                <div className="font-medium text-gray-900 whitespace-pre-line">{selectedSolicitacao.motivo}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs flex justify-between">
                <div>
                  <span className="font-bold text-gray-500 mr-2">Identificador:</span>
                  <span className="text-gray-400 font-mono">{selectedSolicitacao.id}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-500 mr-2">Link Referência:</span>
                  <span className="text-gray-400 font-mono">{selectedSolicitacao.linkId}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDialog(false)}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ListaTermosSolicitados };