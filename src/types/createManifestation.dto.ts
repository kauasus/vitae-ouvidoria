// src/types/createManifestation.dto.ts
export interface CreateManifestationDTO {
  tipoId: number;
  canalId: number;
  descricao: string;
  solicitante: { nome: string; cpf?: string };
  paciente?: { nome: string; cpf?: string } | null;
  usuarioId: string;
  statusId?: number;
  solicitanteEhPaciente?: boolean;
}