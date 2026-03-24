// src/services/ouvidoriaService.ts
import api from "../api/api";
import type { CreateManifestationDTO } from "../types/createManifestation.dto";
import type { Manifestation } from "../types/manifestation";

export type Metricas = { total: number; elogios: number; reclamacoes: number; };

export const ouvidoriaService = {
  async getMetricas(): Promise<Metricas> {
    const resp = await api.get("/manifestation/metrics");
    return resp.data as Metricas;
  },

  async listManifestations(): Promise<Manifestation[]> {
    const resp = await api.get("/manifestation");
    return resp.data as Manifestation[];
  },

  // RECEBE O DTO explicitamente (tipagem correta)
  async createManifestation(payload: CreateManifestationDTO) {
    const resp = await api.post("/manifestation", payload);
    return resp.data;
  },

  // Se já tem "salvar", você pode manter um alias:
  async salvar(payload: CreateManifestationDTO) {
    return this.createManifestation(payload);
  },
};