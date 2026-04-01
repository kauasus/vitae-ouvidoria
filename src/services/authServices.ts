/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/authServices.ts
import api from "../api/api";

type LoginPayload = { username: string; password: string };
type AuthResponse = { user: any; token: string };

// Tipo seguro — apenas os campos necessários para o funcionamento do app
type SafeUser = {
  nome: ReactNode;
  nome: ReactNode; id: string | number; name?: string; username?: string; role?: string 
};

const STORAGE_TOKEN_KEY = "@Ouvidoria:token";
const STORAGE_USER_KEY = "@Ouvidoria:user";

export const authService = {
  // Inicializa o header do axios com o token salvo (chame no startup do app)
  init: () => {
    const token = authService.getToken();
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  },

  // Faz login na API, salva token/user e configura header do axios
  login: async ({ username, password }: LoginPayload): Promise<AuthResponse> => {
    const resp = await api.post("/auth/login", { username, password });
    const { user, token } = resp.data as AuthResponse;

    if (!token) throw new Error("Resposta do servidor sem token");

    // SECURITY FIX #5: Salva APENAS os campos mínimos necessários do usuário.
    // Nunca salve o objeto completo — pode conter hash de senha, dados internos, etc.
    const safeUser: SafeUser = {
      id: user.id,
      name: user.name ?? user.username ?? user.nome ?? "",
      username: user.username ?? "",
      role: user.role ?? "",
    };

    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(safeUser));
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    return { user: safeUser, token };
  },

  // Logout: remove token/user e limpa header
  logout: () => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    delete api.defaults.headers.common.Authorization;
  },

  // Retorna o usuário atual (ou null)
  getCurrentUser: (): SafeUser | null => {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  // Retorna o token (ou null)
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_TOKEN_KEY);
  },

  // Verifica se existe token e se ainda não expirou (checa exp do JWT)
  // SECURITY NOTE: Esta decodificação é APENAS para UX (evitar chamar a API com token expirado).
  // Ela NÃO verifica a assinatura criptográfica do JWT — isso é responsabilidade EXCLUSIVA
  // do authMiddleware no backend com jsonwebtoken.verify(token, SECRET).
  isAuthenticated: (): boolean => {
    const token = authService.getToken();
    if (!token) return false;

    try {
      const parts = token.split(".");
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1]));
      if (payload && payload.exp && typeof payload.exp === "number") {
        return payload.exp * 1000 > Date.now();
      }
      return true;
    } catch {
      return false;
    }
  },

  // Verifica se o usuário atual tem role 'admin'.
  // SECURITY NOTE: Esta verificação é apenas para fins de UX (mostrar/esconder elementos).
  // A autorização real DEVE ser validada pelo backend em cada requisição protegida.
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    if (user && user.role) {
      return String(user.role).toLowerCase() === "admin";
    }

    const token = authService.getToken();
    if (!token) return false;

    try {
      const parts = token.split(".");
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1]));
      if (payload && payload.role) {
        return String(payload.role).toLowerCase() === "admin";
      }
    } catch {
      // ignore parse errors
    }

    return false;
  },
};