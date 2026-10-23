import { useCallback, useState } from 'react';
import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { agendamentoService } from '../services/agendamentoService';
import { useSessaoLocal } from './useSessaolocal';
import { useMeusPets } from './useMeusPets';

export function useHome() {
  const navigation = useNavigation<any>();

  const [modalPerfilVisivel, setModalPerfilVisivel] = useState(false);
  const [modalPetsVisivel, setModalPetsVisivel] = useState(false);

  const sessao = useSessaoLocal();
  const petsQuery = useMeusPets();

  const tutorId = sessao.data?.id;
  const nomeTutor =
    sessao.data?.nomeCompleto.trim().split(/\s+/)[0] ?? '';
  const fotoTutor = sessao.data?.fotoUrl ?? null;

  const listaPets = petsQuery.data ?? [];

  const agendamentosQuery = useQuery({
    queryKey: ['agendamentos-tutor', tutorId],
    queryFn: () => {
      if (!tutorId) {
        throw new Error('Faça login para consultar seus agendamentos.');
      }

      return agendamentoService.listarPorTutor(tutorId);
    },
    enabled: !!tutorId,
  });

  const { refetch: refetchAgendamentos } = agendamentosQuery;

  useFocusEffect(
    useCallback(() => {
      if (tutorId) {
        void refetchAgendamentos();
      }
    }, [tutorId, refetchAgendamentos]),
  );

  const formatarData = (valor: string) => {
    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
      return 'Data indisponível';
    }

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');

    return `${dia}/${mes} às ${hora}:${minuto}`;
  };

  const imagemExibicao = {
    uri:
      fotoTutor ??
      'https://img.freepik.com/vetores-gratis/homem-jovem-com-telefone-inteligente_23-2148506899.jpg',
  };

  const tentarNovamente = async () => {
    if (sessao.isError) {
      await sessao.refetch();
      return;
    }

    await Promise.all([
      petsQuery.refetch(),
      agendamentosQuery.refetch(),
    ]);
  };

  return {
    navigation,
    modalPerfilVisivel,
    setModalPerfilVisivel,
    modalPetsVisivel,
    setModalPetsVisivel,
    nomeTutor,
    fotoTutor,
    listaPets,
    agendamentosGerais: agendamentosQuery.data ?? [],
    carregandoAgendamentos:
      sessao.isPending || agendamentosQuery.isLoading,
    carregandoPets: petsQuery.isLoading,
    isError:
      sessao.isError ||
      petsQuery.isError ||
      agendamentosQuery.isError,
    tentarNovamente,
    formatarData,
    imagemExibicao,
  };
}