import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { petService } from '../services/petService';
import { useSessaoLocal } from './useSessaolocal';

export function useMeusPets() {
  const sessao = useSessaoLocal();
  const tutorId = sessao.data?.id;

  const consulta = useQuery({
    queryKey: ['meus-pets', tutorId],
    queryFn: () => {
      if (!tutorId) {
        throw new Error('Faça login para consultar seus pets.');
      }

      return petService.listarPorTutor(tutorId);
    },
    enabled: !!tutorId,
  });

  const { refetch: atualizarPets } = consulta;

  useFocusEffect(
    useCallback(() => {
      if (tutorId) {
        void atualizarPets();
      }
    }, [tutorId, atualizarPets]),
  );

  const tentarNovamente = async () => {
    if (sessao.isError || !tutorId) {
      await sessao.refetch();

      return;
    }

    await atualizarPets();
  };

  return {
    ...consulta,
    refetch: tentarNovamente,
    isLoading: sessao.isPending || consulta.isLoading,
    isError: sessao.isError || consulta.isError,
    error: sessao.error ?? consulta.error,
  };
}