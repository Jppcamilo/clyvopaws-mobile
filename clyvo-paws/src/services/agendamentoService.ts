import api from './api';
import type {
  Id,
  Agendamento,
  AgendamentoPayload,
  AgendaDisponivel,
} from '../types/api';

export const agendamentoService = {
  async listarPorTutor(tutorId: Id) {
    const { data } = await api.get<Agendamento[]>(
      `/agendamentos/tutor/${tutorId}`,
    );

    return data;
  },

  async listarPorPet(petId: Id) {
    const { data } = await api.get<Agendamento[]>(
      `/agendamentos/pet/${petId}`,
    );

    return data;
  },

  async listarHorarios(veterinarioId: Id) {
    const { data } = await api.get<AgendaDisponivel[]>(
      `/agendas/veterinario/${veterinarioId}`,
    );

    return data;
  },

  async cadastrar(dados: AgendamentoPayload) {
    const { data } = await api.post<Agendamento>(
      '/agendamentos',
      dados,
    );

    return data;
  },
};