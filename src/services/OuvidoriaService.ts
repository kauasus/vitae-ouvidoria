import { type Manifestation } from "../types/manifestation";

const STORAGE_KEY = "vitae_ouvidoria_db";

export const ouvidoriaService = {
  listar: (): Manifestation[] => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"),
  
  salvar: (m: Manifestation) => {
    const lista = ouvidoriaService.listar();
    const index = lista.findIndex(item => item.id === m.id);
    index >= 0 ? (lista[index] = m) : lista.unshift({ ...m, id: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  },

  getMetricas: () => {
    const lista = ouvidoriaService.listar();
    return {
      total: lista.length,
      elogios: lista.filter(m => m.tipo === "ELOGIO").length,
      reclamacoes: lista.filter(m => m.tipo === "RECLAMACAO").length,
      resolvidos: lista.filter(m => m.status === "RESOLVIDO").length
    };
  }
};
