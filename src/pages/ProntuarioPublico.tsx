import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { prontuarioService } from "../services/prontuarioServices";
import FormularioProntuario from "../components/prontuario/FormularioProntuario";

const ProntuarioPublico: React.FC = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const [autenticado, setAutenticado] = useState(false);
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const autenticar = () => {
    const link = prontuarioService.validarCredenciais(login, senha);
    if (link && link.id === linkId) {
      setAutenticado(true);
      setErro("");
    } else {
      setErro("Login ou senha inválidos, ou link expirado/usado.");
    }
  };

  const handleSucesso = () => {
    setSucesso(true);
  };

  if (sucesso) {
    return (
      <div className="flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <Card title="Solicitação Enviada com Sucesso!" className="shadow-4" style={{ maxWidth: "500px" }}>
          <p className="text-center mb-4">
            Sua solicitação de retirada de prontuário foi registrada com sucesso. Em breve entraremos em contato.
          </p>
          <div className="flex justify-content-center">
            <Button label="Fechar" icon="pi pi-check" className="p-button-registrar" onClick={() => window.close()} />
          </div>
        </Card>
      </div>
    );
  }

  if (!autenticado) {
    return (
      <div className="flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <Card title="Acesso ao Sistema de Prontuários" className="shadow-4" style={{ width: "400px" }}>
          <div className="p-fluid">
            <div className="field mb-3">
              <label className="font-bold block mb-2">Login</label>
              <InputText value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Digite seu login" />
            </div>
            <div className="field mb-3">
              <label className="font-bold block mb-2">Senha</label>
              <InputText
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
              />
            </div>
            {erro && <p className="text-vitae-red text-sm mb-3">{erro}</p>}
            <Button label="Entrar" icon="pi pi-sign-in" className="p-button-registrar" onClick={autenticar} />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex align-items-center justify-content-center p-4" style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ maxWidth: "800px", width: "100%" }}>
        <FormularioProntuario linkId={linkId!} onSucesso={handleSucesso} />
      </div>
    </div>
  );
};

export default ProntuarioPublico;