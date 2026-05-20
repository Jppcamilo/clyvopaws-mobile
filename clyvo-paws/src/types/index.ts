export type Usuario = {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  foto?: string;
};

export type Lembrete = {
  data: string;
  tarefa: string;
  horario: string;
};

export type Pet = {
  id: string;
  nome: string;
  idade: string;
  raca: string;
  peso?: string;
  sexo?: 'MACHO' | 'FÊMEA';
  descricao: string;
  foto: string | null;
  lembretes: Lembrete[]; 
};

export type Produto = {
  id: string;
  nome: string;
  precoAntigo?: string;
  precoNovo: string;
  imagem: any;
  categoria: string;
};