/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authServices";
import logo from "../assets/vitae.png";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.login({ username, password });
      navigate("/dashboard");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Erro ao autenticar";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center gap-4 px-6 py-5 border-b">
            <img src={logo} alt="Vitae Center Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Acesso ao Sistema</h1>
              <p className="text-sm text-gray-500">Clínica Médica e Odontológica</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="px-6 py-6 space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Usuário
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Usuário"
                required
                autoFocus
                className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  required
                  className="block w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5 0-9-4-9-4s1.818-2.5 4.5-4.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 3l18 18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-3 px-4 py-2 rounded-md text-white font-semibold focus:outline-none focus:ring-2 ${
                  loading ? "bg-red-500 cursor-wait" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading && (
                  <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                {loading ? "Autenticando..." : "ENTRAR"}
              </button>
            </div>

            <div className="text-center text-xs text-gray-500 mt-2">
              &copy; {new Date().getFullYear()} Vitae Center. Todos os direitos reservados.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;