import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { medicamentoService } from '../services/medicamentoService';
import { useSessaoLocal } from './useSessaolocal';

export function useMedicamentos() {
  const sessao = useSessaoLocal();
  const tutorId = sessao.data?.id;

  const [pagina, setPagina] = useState(0);

  const consulta = useQuery({
    queryKey: ['meus-medicamentos', tutorId, pagina],
    queryFn: () => medicamentoService.listar(pagina),
    enabled: !!tutorId,
  });

  const anterior = () => {
    if (consulta.isFetching) return;

    setPagina((atual) => Math.max(0, atual - 1));
  };

  const proxima = () => {
    if (
      consulta.isFetching ||
      !consulta.data ||
      consulta.data.last
    ) {
      return;
    }

    setPagina((atual) => atual + 1);
  };

  const refetch = async () => {
    if (sessao.isError) {
      await sessao.refetch();
      return;
    }

    if (tutorId) {
      await consulta.refetch();
    }
  };

  return {
    medicamentos: consulta.data,
    isLoading: sessao.isPending || consulta.isLoading,
    isFetching: consulta.isFetching,
    isError: sessao.isError || consulta.isError,
    refetch,
    pagina,
    anterior,
    proxima,
  };
}