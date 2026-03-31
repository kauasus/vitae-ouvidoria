/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Dashboard.tsx
import React, { useEffect, useState, useRef } from "react";
import ChartJS from "chart.js/auto";
import { ouvidoriaService } from "../services/OuvidoriaService";
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, PieChart, LineChart } from "lucide-react";

type Metricas = {
  total: number;
  elogios: number;
  reclamacoes: number;
};

const Dashboard: React.FC = () => {
  const [m, setM] = useState<Metricas | null>(null);
  const [manifestacoesData, setManifestacoesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const pieChartInstance = useRef<any>(null);

  const barChartRef = useRef<HTMLCanvasElement>(null);
  const barChartInstance = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [metrics, manifestacoes] = await Promise.all([
          ouvidoriaService.getMetricas(),
          ouvidoriaService.listManifestations(1, 100).catch(() => []) // fetch up to 100 to build charts
        ]);
        if (!mounted) return;
        setM(metrics);
        const items = Array.isArray(manifestacoes) ? manifestacoes : (manifestacoes?.data || manifestacoes?.items || []);
        setManifestacoesData(items);
      } catch (err: any) {
        if (mounted) setError(err?.response?.data?.message || err?.message || "Erro ao buscar métricas");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const totalItems = m?.total || manifestacoesData.length || 0;
  
  // Calcula baseado nos itens que temos localmente
  const elogios = manifestacoesData.filter(item => 
    item.tipo?.id === 1 || item.tipoId === 1 || item.tipo?.dsc_tipo?.toLowerCase().includes('elogio')
  ).length;
  
  const reclamacoes = manifestacoesData.filter(item => 
    item.tipo?.id === 2 || item.tipoId === 2 || item.tipo?.dsc_tipo?.toLowerCase().includes('reclama')
  ).length;

  const outros = Math.max(0, totalItems - elogios - reclamacoes);

  // PIE CHART: Proporção Elogios / Reclamações / Outros
  useEffect(() => {
    if (pieChartRef.current && !loading && !error) {
      if (pieChartInstance.current) pieChartInstance.current.destroy();
      
      const chartData = {
        labels: ["Elogios", "Reclamações", "Outros"],
        datasets: [{
          data: [elogios, reclamacoes, outros],
          backgroundColor: ["#10b981", "#ef4444", "#94a3b8"],
          hoverBackgroundColor: ["#059669", "#dc2626", "#64748b"],
          borderWidth: 0,
          hoverOffset: 4,
        }],
      };

      const chartOptions = {
        plugins: {
          legend: {
            position: "bottom" as const,
            labels: { boxWidth: 12, padding: 24, font: { family: "Inter", weight: 500, size: 13 } },
          },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            titleFont: { family: "Inter", size: 13 },
            bodyFont: { family: "Inter", size: 13 },
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
          },
        },
        maintainAspectRatio: false,
        cutout: "65%",
      };

      pieChartInstance.current = new (ChartJS as any)(pieChartRef.current, {
        type: "doughnut",
        data: chartData,
        options: chartOptions,
      });
    }
    return () => {
      if (pieChartInstance.current) pieChartInstance.current.destroy();
    };
  }, [totalItems, elogios, reclamacoes, outros, loading, error]);

  // BAR CHART: Distribuição por Canal de Origem
  useEffect(() => {
    if (barChartRef.current && !loading && !error && manifestacoesData.length > 0) {
      if (barChartInstance.current) barChartInstance.current.destroy();
      
      const canalCounts: Record<string, number> = {};
      manifestacoesData.forEach(item => {
        const canalName = item.canal?.dsc_canal || item.canalOrigem || "Desconhecido";
        canalCounts[canalName] = (canalCounts[canalName] || 0) + 1;
      });

      const labels = Object.keys(canalCounts);
      const data = Object.values(canalCounts);

      // Gradient fill for bars
      const ctx = barChartRef.current.getContext("2d");
      let gradient: any = "#ef4444";
      if (ctx) {
        gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, "rgba(239, 68, 68, 0.8)"); // red-500
        gradient.addColorStop(1, "rgba(220, 38, 38, 0.1)"); // red-600
      }

      const barData = {
        labels,
        datasets: [{
          label: "Manifestações por Canal",
          data,
          backgroundColor: gradient,
          borderColor: "#dc2626",
          borderWidth: { top: 2, left: 0, right: 0, bottom: 0 },
          borderRadius: 6,
          barPercentage: 0.6,
        }],
      };

      const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            titleFont: { family: "Inter", size: 13 },
            bodyFont: { family: "Inter", size: 13 },
            padding: 12,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: "Inter", size: 12 }, color: "#64748b" }
          },
          y: {
            beginAtZero: true,
            grid: { color: "#f1f5f9", drawBorder: false },
            ticks: { font: { family: "Inter", size: 12 }, color: "#64748b", precision: 0 }
          }
        }
      };

      barChartInstance.current = new (ChartJS as any)(barChartRef.current, {
        type: "bar",
        data: barData,
        options: barOptions,
      });
    }
    return () => {
      if (barChartInstance.current) barChartInstance.current.destroy();
    };
  }, [manifestacoesData, loading, error]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 animate-in fade-in">
        <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin shadow-lg mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse tracking-wide">Gerando métricas do painel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-top-4">
        <div className="rounded-2xl bg-red-50 border border-red-100 p-6 flex gap-4 items-start shadow-sm">
          <div className="bg-red-100 text-red-600 p-2 rounded-full mt-1">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-red-800 font-bold text-lg tracking-tight">Estatísticas indisponíveis</h3>
            <p className="text-red-600 mt-1 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Visão Geral</h1>
          <p className="text-gray-500 mt-1.5 font-medium">Acompanhamento consolidado das manifestações da ouvidoria</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-lg">
          <BarChart3 className="w-4 h-4 text-brand-500" />
          <span className="text-sm font-semibold text-gray-700">Atualizado agora</span>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-100 text-gray-700 rounded-xl shadow-inner">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">Total</span>
            </div>
            <div>
              <h3 className="text-4xl font-extrabold text-gray-900">{totalItems}</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">Manifestações globais</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-100 text-green-700 rounded-xl shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-600 uppercase tracking-wider bg-green-50 px-2 py-1 rounded border border-green-100">Positivo</span>
            </div>
            <div>
              <h3 className="text-4xl font-extrabold text-gray-900">{elogios}</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">Elogios registrados</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl shadow-inner">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-1 rounded border border-red-100">Atenção</span>
            </div>
            <div>
              <h3 className="text-4xl font-extrabold text-gray-900">{reclamacoes}</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">Reclamações ativas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-5 h-5 text-gray-500" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Proporção</h2>
              <p className="text-xs font-medium text-gray-500">Distribuição por tipologia</p>
            </div>
          </div>

          <div className="w-full h-64 relative flex items-center justify-center">
            {totalItems === 0 ? (
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                <span className="text-sm text-gray-400 font-medium">Sem dados suficientes</span>
              </div>
            ) : (
              <canvas ref={pieChartRef}></canvas>
            )}
            
            {totalItems > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                <span className="text-3xl font-extrabold text-gray-900 leading-none">{totalItems}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <LineChart className="w-5 h-5 text-gray-500" />
              <div>
                <h2 className="text-lg font-bold text-gray-900">Volume por Canal</h2>
                <p className="text-xs font-medium text-gray-500">Estatísticas agrupadas de Origem</p>
              </div>
            </div>
          </div>

          <div className="w-full h-64 relative">
            {manifestacoesData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-xl border border-gray-100 border-dashed">
                <BarChart3 className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                <span className="text-sm text-gray-400 font-medium">Sem dados suficientes para renderizar o gráfico</span>
              </div>
            ) : (
              <canvas ref={barChartRef}></canvas>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;