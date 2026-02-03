import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { authService } from "../services/authServices";
import logo from "../assets/vitae.png"; // Ajuste o caminho se necessário
import "./Login.css"; // Importa o CSS específico

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const user = authService.login({ username, password });
      if (user) {
        navigate("/dashboard");
      } else {
        setError("Usuário ou senha inválidos");
      }
      setLoading(false);
    }, 800);
  };

  const header = (
    <div className="vitae-login-header">
      <img src={logo} alt="Vitae Center Logo" className="vitae-login-logo" />
      <div className="vitae-login-divider"></div>
    </div>
  );

  return (
    <div className="vitae-login-container">
      <Card header={header} className="vitae-login-card">
        <div className="vitae-login-title">
          <h2>Acesso ao Sistema</h2>
          <small>Clínica Médica e Odontológica</small>
        </div>

        <form onSubmit={handleLogin} className="p-fluid">
          {error && <Message severity="error" text={error} className="mb-4 w-full" />}

          <div className="field mb-4">
            <span className="p-input-icon-left">
              
              <InputText
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Usuário"
                className="vitae-login-input p-inputtext-lg"
                required
                autoFocus
              />
            </span>
          </div>

          <div className="field mb-5">
            <span className="p-input-icon-left vitae-login-password">
              <i className="pi pi-lock vitae-login-icon" />
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                feedback={false}
                toggleMask
                className="w-full"
                inputClassName="vitae-login-input"
                required
              />
            </span>
          </div>

          <Button
            type="submit"
            label={loading ? "Autenticando..." : "ENTRAR"}
            className="vitae-login-button p-button-lg"
            loading={loading}
          />

          <div className="vitae-login-footer">
            <p>&copy; {new Date().getFullYear()} Vitae Center. Todos os direitos reservados.</p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;