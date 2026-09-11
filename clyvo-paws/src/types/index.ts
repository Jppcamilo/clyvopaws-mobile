export type Usuario = {
  nomeCompleto: string; 
  email: string;
  cpf: string;
  telefone: string;
  senha?: string;  
  fotoUrl?: string;   
  endereco?: any;       
};

export type Lembrete = {
  data: string;
  tarefa: string;
  horario: string;
};

export type Pet = {
  id: string;
  nome: string;
  dataNascimento: string;
  raca: string;
  peso?: string;
  sexo?: 'MACHO' | 'FÊMEA';
  descricao: string;
  foto?: string | null;
  fotoUrl?: string | null; 
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