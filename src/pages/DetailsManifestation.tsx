/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ouvidoriaService } from "../services/OuvidoriaService";
import type { Manifestation } from "../types/manifestation";

const DetailsManifestation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [m, setM] = useState<Manifestation | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!id) {
        if (mounted) {
          setError("ID da manifestação não informado");
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Tente rota dedicada primeiro (melhor prática). Se não existir, caia para getMetricas().
        // se seu ouvidoriaService tiver um método getById / getManifestacao, ele será usado.
        const hasGetById = typeof (ouvidoriaService as any).getById === "function" ||
                           typeof (ouvidoriaService as any).getManifestacao === "function";

        let manifestation: any | undefined;

        if (hasGetById) {
          const fn = (ouvidoriaService as any).getById ?? (ouvidoriaService as any).getManifestacao;
          manifestation = await fn(id);
        } else {
          const metricas: any[] = await ouvidoriaService.getMetricas();
          manifestation = metricas.find((x) => String(x.id) === id);
        }

        if (mounted) {
          if (manifestation) setM(manifestation as Manifestation);
          else setError("Manifestação não encontrada");
        }
      } catch (err: any) {
        if (mounted) setError(err?.response?.data?.message || err?.message || "Erro ao buscar a manifestação");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-600 border-t-transparent" />
        <span className="ml-3 text-gray-600">Carregando manifestação...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="rounded-md bg-red-50 border border-red-200 p-4">
          <h3 className="text-red-800 font-semibold">Erro</h3>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!m) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4 text-yellow-800">
          Manifestação não encontrada
        </div>
      </div>
    );
  }

  const dataRegistro = m.dataRegistro ? new Date(m.dataRegistro) : null;
  const headerTitle = `${m.tipo ?? "—"}${dataRegistro ? " — " + dataRegistro.toLocaleString() : ""}`;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{headerTitle}</h2>
        {m.descricao && <p className="text-gray-600 mt-2">{m.descricao}</p>}
      </header>

      <section className="grid grid-cols-1 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Solicitante</h4>
          <div className="mt-1 text-gray-800">{m.solicitante?.nome ?? "Não informado"}</div>
          {m.solicitante?.email && <div className="text-sm text-gray-500">{m.solicitante.email}</div>}
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700">Paciente</h4>
          <div className="mt-1 text-gray-800">{m.paciente?.nome ?? "Não informado"}</div>
          {m.paciente?.cpf && <div className="text-sm text-gray-500">CPF: {m.paciente.cpf}</div>}
        </div>

        {Array.isArray(m.anexos) && m.anexos.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700">Anexos</h4>
            <ul className="mt-2 list-disc list-inside text-gray-800">
              {m.anexos.map((a: any) => (
                <li key={a.id ?? a.url}>
                  <a href={a.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    {a.nome ?? a.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default DetailsManifestation;