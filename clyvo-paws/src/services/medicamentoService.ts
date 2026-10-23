import api from './api';
import type { Medicamento, Pagina } from '../types/api';

export const medicamentoService = {
  async listar(pagina = 0): Promise<Pagina<Medicamento>> {
    const { data } = await api.get<Pagina<Medicamento>>(
      '/medicamentos',
      {
        params: {
          page: pagina,
          size: 10,
        },
      },
    );

    return data;
  },
};