import type { User, LoginCredentials } from "../types/auth";

const STORAGE_KEY = "vitae_auth_user";

// Usuários mockados (em produção, isso viria de uma API)
const MOCK_USERS = [
  { id: "1", username: "admin", password: "admin123", role: "admin" as const, nome: "Administrador" },
  { id: "2", username: "user", password: "user123", role: "user" as const, nome: "Usuário Comum" },
];

class AuthService {
  login(credentials: LoginCredentials): User | null {
    const user = MOCK_USERS.find(
      (u) => u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }

    return null;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === "admin";
  }
}

export const authService = new AuthService();