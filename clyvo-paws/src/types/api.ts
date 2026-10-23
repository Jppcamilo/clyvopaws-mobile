export type Id = number | string;

export type SessaoTutor = {
  id: number;
  nomeCompleto: string;
  fotoUrl: string | null;
};

export type LoginResposta = {
  token: string;
  id: number | null;
  nomeCompleto: string;
  fotoUrl: string | null;
};

export type Tutor = {
  id: number;
  nomeCompleto: string;
  cpf: string;
  email: string;
  telefone: string | null;
  fotoUrl: string | null;
};

export type CadastroTutor = {
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  email: string;
  senha: string;
  fotoUrl: string | null;
};

export type AtualizacaoTutor = {
  nomeCompleto: string;
  email: string;
  cpf: string;
  telefone: string;
  foto: string | null;
};

export type PetPayload = {
  nome: string;
  dataNascimento: string;
  peso: number;
  sexo: 'MACHO' | 'FEMEA';
  raca: string;
  especie: 'CACHORRO' | 'GATO';
  descricao: string;
  fotoUrl: string | null;
  tutorId: number;
};

export type ConsultaResumo = {
  id: number;
  nomePet: string | null;
  nomeVeterinario: string | null;
  nomeClinica: string | null;
  dataHora: string;
  resumo: string | null;
  diagnostico: string | null;
};

export type Agendamento = {
  id: number;
  dataHora: string;
  titulo: string;
  descricao: string | null;
  petId: number | null;
  consulta: ConsultaResumo | null;
};

export type AgendamentoPayload = {
  dataHora: string;
  titulo: string;
  descricao: string;
  status: string;
  consultaId: number | null;
  petId: number;
  clinicaId: number;
  veterinarioId: number;
};

export type AgendaDisponivel = {
  id: number;
  veterinarioId: number;
  nomeVeterinario: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  disponivel: boolean;
};

export type Medicamento = {
  id: number;
  nome: string;
  dosagem: string;
  frequencia: string;
  dataInicio: string;
  duracaoDias: number | null;
  status: 'EM_DIA' | 'ATRASADO' | 'CONCLUIDO';
  consulta: ConsultaResumo | null;
};

export type Pagina<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
};