import api from "../api/api";
import type { CreateManifestationDTO } from "../types/createManifestation.dto";

export const ouvidoriaService = {
  async getMetricas() {
    const resp = await api.get("/manifestations/metrics");
    return resp.data;
  },

  async listManifestations(page = 1, limit = 10): Promise<any> {
    const resp = await api.get("/manifestations", {
      params: { page, limit },
    });
    return resp.data;
  },

  async createManifestation(payload: CreateManifestationDTO) {
    const resp = await api.post("/manifestations", payload);
    return resp.data;
  },

  // Novos: buscar tipos / canais / status do backend
  async getTipos(): Promise<{ id: number; dsc_tipo: string }[]> {
    const resp = await api.get("/tipos");
    return resp.data;
  },

  async getCanais(): Promise<{ id: number; dsc_canal: string }[]> {
    const resp = await api.get("/canais");
    return resp.data;
  },

  async getStatus(): Promise<{ id: number; dsc_status: string }[]> {
    const resp = await api.get("/status");
    return resp.data;
  },
};