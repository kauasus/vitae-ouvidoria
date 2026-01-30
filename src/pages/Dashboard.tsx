import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { ouvidoriaService } from "../services/OuvidoriaService";

const Dashboard: React.FC = () => {
  const [m, setM] = useState(ouvidoriaService.getMetricas());

  const chartData = {
    labels: ['Elogios', 'Reclamações'],
    datasets: [{
      data: [m.elogios, m.reclamacoes],
      backgroundColor: ['#22c55e', '#a83b3b']
    }]
  };

  return (
    <div className="grid">
      <div className="col-12">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Vitae Center</h1>
      </div>
      <div className="col-12 md:col-3">
        <Card title="Total" className="card-stats"><h2>{m.total}</h2></Card>
      </div>
      <div className="col-12 md:col-3">
        <Card title="Elogios" className="card-stats"><h2>{m.elogios}</h2></Card>
      </div>
      <div className="col-12 md:col-3">
        <Card title="Reclamações" className="card-stats"><h2>{m.reclamacoes}</h2></Card>
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
