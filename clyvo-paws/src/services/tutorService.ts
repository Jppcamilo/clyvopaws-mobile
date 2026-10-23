import api from './api';
import type {
  Id,
  Tutor,
  CadastroTutor,
  AtualizacaoTutor,
} from '../types/api';

function pareceEmail(valor: unknown): valor is string {
  return (
    typeof valor === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())
  );
}

function normalizarTutor(tutor: Tutor): Tutor {
  const camposInvertidos =
    !pareceEmail(tutor.email) &&
    pareceEmail(tutor.telefone);

  if (camposInvertidos && typeof tutor.telefone === 'string') {
    return {
      ...tutor,
      email: tutor.telefone,
      telefone: tutor.email,
    };
  }

  return tutor;
}

export const tutorService = {
  async cadastrar(dados: CadastroTutor): Promise<Tutor> {
    const { data } = await api.post<Tutor>('/tutores', dados);

    return normalizarTutor(data);
  },

  async buscar(id: Id): Promise<Tutor> {
    const { data } = await api.get<Tutor>(`/tutores/${id}`);

    return normalizarTutor(data);
  },

  async atualizar(
    id: Id,
    dados: AtualizacaoTutor,
  ): Promise<Tutor> {
    const { data } = await api.put<Tutor>(
      `/tutores/${id}`,
      dados,
    );

    return normalizarTutor(data);
  },

  async excluir(id: Id): Promise<void> {
    await api.delete(`/tutores/${id}`);
  },
};