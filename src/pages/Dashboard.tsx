/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { ouvidoriaService, type Metricas } from "../services/OuvidoriaService";

const Dashboard: React.FC = () => {
  const [m, setM] = useState<Metricas | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const metrics = await ouvidoriaService.getMetricas();
        setM(metrics);
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Erro ao buscar métricas");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>Carregando métricas...</div>;
  if (error) return <div className="p-error">{error}</div>;

  const metrics = m ?? { total: 0, elogios: 0, reclamacoes: 0 };

  const chartData = {
    labels: ["Elogios", "Reclamações"],
    datasets: [
      {
        data: [metrics.elogios, metrics.reclamacoes],
        backgroundColor: ["#22c55e", "#a83b3b"],
      },
    ],
  };

  return (
    <div className="grid">
      <div className="col-12">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Vitae Center</h1>
      </div>

      <div className="col-12 md:col-3">
        <Card title="Total" className="card-stats">
          <h2>{metrics.total}</h2>
        </Card>
      </div>

      <div className="col-12 md:col-3">
        <Card title="Elogios" className="card-stats">
          <h2>{metrics.elogios}</h2>
        </Card>
      </div>

      <div className="col-12 md:col-3">
        <Card title="Reclamações" className="card-stats">
          <h2>{metrics.reclamacoes}</h2>
        </Card>
      </div>

      <div className="col-12 md:col-6 mt-4">
        <Card title="Distribuição por Tipo">
          <Chart type="doughnut" data={chartData} />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;