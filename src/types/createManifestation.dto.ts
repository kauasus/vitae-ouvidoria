export interface CreateManifestationDTO {
  tipoId: number;
  canalId: number;
  descricao: string;
  solicitante: { nome: string; cpf?: string | null };
  paciente?: { nome: string; cpf?: string | null } | null;
  usuarioId: string; // uuid do usuário logado
  statusId?: number;
  solicitanteEhPaciente?: boolean;
}