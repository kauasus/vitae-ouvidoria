/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ouvidoriaService } from "../services/OuvidoriaService";
import type { Manifestation } from "../types/manifestation";
import { FileText, Smartphone, User, Calendar, Eye, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Activity } from "lucide-react";

const ROWS_PER_PAGE_DEFAULT = 10;

const getValueByPath = (obj: any, path: string) => {
  return path.split(".").reduce((o, key) => (o ? o[key] : undefined), obj);
};

const formatDateTime = (iso?: string | null) => {
  if (!iso) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
};

const ListManifestations: React.FC = () => {
  const [list, setList] = useState<Manifestation[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // pagination / sorting
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(ROWS_PER_PAGE_DEFAULT);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await Promise.resolve(ouvidoriaService.listManifestations(page, rowsPerPage));
        if (!mounted) return;
        
        // Handle both paginated object { data: [], total: 0 } and flat array responses
        const items = Array.isArray(data) ? data : (data?.data || data?.items || []);
        const total = Array.isArray(data) ? data.length : (data?.meta?.totalItems || data?.total || items.length);
        
        setList(items);
        setTotalItems(total);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || "Erro ao carregar manifestações");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [page, rowsPerPage]);

  const sorted = useMemo(() => {
    const arr = [...list];
    if (!sortField) return arr;
    arr.sort((a, b) => {
      const av = getValueByPath(a, sortField);
      const bv = getValueByPath(b, sortField);

      // Datas
      if (sortField === "dataRegistro") {
        const da = new Date(String(av || "")).getTime();
        const db = new Date(String(bv || "")).getTime();
        return sortOrder === "asc" ? da - db : db - da;
      }

      const sa = String(av ?? "").toLowerCase();
      const sb = String(bv ?? "").toLowerCase();
      if (sa < sb) return sortOrder === "asc" ? -1 : 1;
      if (sa > sb) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [list, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const pageItems = sorted; // Backend pagination assumed

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return sortOrder === "asc" 
      ? <ChevronUp className="w-4 h-4 text-brand-600" />
      : <ChevronDown className="w-4 h-4 text-brand-600" />;
  };

  if (loading && list.length === 0) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-12">
        <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin shadow-lg"></div>
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Buscando manifestações...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-red-50 border border-red-100 p-6 flex items-start gap-4">
          <div className="bg-red-100 text-red-600 p-2 rounded-full">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-red-800 font-bold text-lg">Falha na Comunicação</h3>
            <p className="text-red-600 mt-1 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Registro de Manifestações</h2>
          <p className="text-sm text-gray-500 mt-1">Acompanhamento e gestão dos chamados</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
          <span className="text-sm font-semibold text-gray-700">Total: {totalItems}</span>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th
                  className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer group hover:bg-gray-100/80 transition-colors"
                  onClick={() => toggleSort("tipo")}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    Tipo
                    {renderSortIcon("tipo")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer group hover:bg-gray-100/80 transition-colors"
                  onClick={() => toggleSort("canalOrigem")}
                >
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gray-400" />
                    Canal
                    {renderSortIcon("canalOrigem")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer group hover:bg-gray-100/80 transition-colors"
                  onClick={() => toggleSort("solicitante.nome")}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    Solicitante
                    {renderSortIcon("solicitante.nome")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer group hover:bg-gray-100/80 transition-colors"
                  onClick={() => toggleSort("paciente.nome")}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    Paciente
                    {renderSortIcon("paciente.nome")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer group hover:bg-gray-100/80 transition-colors"
                  onClick={() => toggleSort("dataRegistro")}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Data
                    {renderSortIcon("dataRegistro")}
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <FileText className="w-10 h-10 text-gray-300 mb-3" />
                      <p className="font-medium text-gray-600">Nenhuma manifestação encontrada.</p>
                      <p className="text-sm">A lista está vazia no momento.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pageItems.map((row) => (
                  <tr key={row.id} className="hover:bg-brand-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        {row.tipo?.dsc_tipo ?? "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {row.canal?.dsc_canal || row.canalOrigem || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-[200px] font-medium">
                      {row.solicitante?.nome ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-[200px]">
                      {row.paciente?.nome ?? "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(row.dataRegistro)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => navigate(`/manifestations/${row.id}`)}
                        className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm group-hover:shadow-md"
                        aria-label={`Ver manifestação ${row.id}`}
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

        {/* Footer / Pagination */}
        {totalItems > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between sm:flex-row flex-col gap-4">
            <span className="text-sm text-gray-600 font-medium">
              Mostrando <span className="text-gray-900 font-semibold">{(page - 1) * rowsPerPage + 1}</span> a{" "}
              <span className="text-gray-900 font-semibold">{Math.min(page * rowsPerPage, totalItems)}</span> de{" "}
              <span className="text-gray-900 font-semibold">{totalItems}</span> registros
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex items-center gap-1 px-2">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                  // Simplified pagination logic for display purposes
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
                aria-label="Próxima página"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListManifestations;
