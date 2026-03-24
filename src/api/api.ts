// src/services/api.ts
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, AxiosError } from "axios";

// No Vite, usamos import.meta.env
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Handler para 401 (sem importar authService para evitar erro circular)
let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(fn: () => void) {
  onUnauthorized = fn;
}

// Interceptor de Requisição
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("@Ouvidoria:token");
    
    if (token && config.headers) {
      // Forma correta de setar headers no Axios moderno com TS
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Resposta
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default api;