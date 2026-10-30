import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Linking } from 'react-native';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { atualizarLembretesPet, cancelarLembretesPet, solicitarPermissaoLembretes, PermissaoLembreteError } from '../services/notificacaoService';

import { petService } from '../services/petService';
import { agendamentoService } from '../services/agendamentoService';
import { DADOS_RACAS } from '../data/racas';
import { useTema } from '../theme/TemaProvider';
import { sessaoService } from '../services/sessaoService';

type RacaInfo = {
  nome: string;
  doenca?: string;
  idadeAlerta?: string;
  prevencao?: string;
  cuidados?: string;
};

type Marcacao = {
  marked?: boolean;
  dotColor?: string;
  selected?: boolean;
  selectedColor?: string;
};

function dataLocal(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

export function usePetDetails() {
  const { colors } = useTema();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const queryClient = useQueryClient();

  const petId = Number(route.params?.petId);
  const idValido = Number.isInteger(petId) && petId > 0;

  const [ativandoAlertas, setAtivandoAlertas] = useState(false);
  const ativacaoEmCurso = useRef(false);
  const exclusaoEmCurso = useRef(false);

  const petQuery = useQuery({
    queryKey: ['pet-details', petId],
    queryFn: () => petService.buscar(petId),
    enabled: idValido,
  });

  const agendamentosQuery = useQuery({
    queryKey: ['agendamentos-pet', petId],
    queryFn: () => agendamentoService.listarPorPet(petId),
    enabled: idValido,
  });

  const pet = petQuery.data;
  const agendamentoId = Number(route.params?.agendamentoId);
  const veioDaNotificacao = route.params?.origemNotificacao === true;
  const consultaNotificada = veioDaNotificacao
    ? agendamentosQuery.data?.find(item => item.id === agendamentoId)
    : undefined;

  const { refetch: atualizarAgendamentos } = agendamentosQuery;
  const { refetch: atualizarPet } = petQuery;
  useEffect(() => {
    if (idValido && veioDaNotificacao) {
      void atualizarAgendamentos();
      void atualizarPet();
    }
  }, [petId, agendamentoId, idValido, veioDaNotificacao, atualizarAgendamentos, atualizarPet]);


  const deleteMutation = useMutation({
    mutationFn: () => petService.excluir(petId),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ['pet-details', petId],
      });

      queryClient.removeQueries({
        queryKey: ['agendamentos-pet', petId],
      });

      void queryClient.invalidateQueries({
        queryKey: ['meus-pets'],
      });

      void queryClient.invalidateQueries({
        queryKey: ['agendamentos-tutor'],
      });
    },
  });

  const racaInfo = useMemo(() => {
    if (!pet) return null;

    const racas: RacaInfo[] = DADOS_RACAS[pet.especie] ?? [];

    return (
      racas.find(
        (raca) =>
          raca.nome.trim().toLowerCase() ===
          pet.raca.trim().toLowerCase(),
      ) ?? null
    );
  }, [pet]);

  const lembretes = useMemo(() => {
    return (agendamentosQuery.data ?? []).flatMap((agendamento) => {
      const data = new Date(agendamento.dataHora);

      if (Number.isNaN(data.getTime())) return [];

      return [{
        id: agendamento.id,
        data: dataLocal(data),
        tarefa: agendamento.titulo,
        horario: [
          String(data.getHours()).padStart(2, '0'),
          String(data.getMinutes()).padStart(2, '0'),
        ].join(':'),
      }];
    });
  }, [agendamentosQuery.data]);

  const datasMarcadas = useMemo(() => {
    const marcacoes: Record<string, Marcacao> = {};

    for (const lembrete of lembretes) {
      marcacoes[lembrete.data] = {
        marked: true,
        dotColor: colors.destaque,
      };
    }

    const hoje = dataLocal(new Date());

    marcacoes[hoje] = {
      ...marcacoes[hoje],
      selected: true,
      selectedColor: colors.verdeEscuro,
      dotColor: colors.branco,
    };

    return marcacoes;
  }, [lembretes, colors]);

  const ativarAlertas = async () => {
    if (!pet || ativacaoEmCurso.current || exclusaoEmCurso.current) return;
    ativacaoEmCurso.current = true;
    setAtivandoAlertas(true);
    let geracao: number | null = null;
    try {
      const token = await sessaoService.obterToken();
      geracao = sessaoService.obterEstado().geracao;
      const tutor = sessaoService.obterEstado().tutor;
      if (!token || !tutor) return;
      if (pet.tutor.id !== tutor.id) {
        throw new Error('Abra um pet da conta em que você está conectado.');
      }
      await solicitarPermissaoLembretes();
      // Só substitui os lembretes depois que a API devolver a lista atual com sucesso.
      const resposta = await agendamentosQuery.refetch();
      if (resposta.isError || !resposta.data) {
        throw new Error('Não foi possível atualizar as consultas. Os lembretes anteriores foram mantidos. Tente novamente.');
      }
      const { quantidade, falhas } = await atualizarLembretesPet({
        petId, nomePet: pet.nome, tutorId: tutor.id, agendamentos: resposta.data,
        sessaoContinuaValida: () => sessaoService.obterEstado().geracao === geracao &&
          sessaoService.obterEstado().tutor?.id === tutor.id,
      });
      if (sessaoService.obterEstado().geracao !== geracao) return;
      Alert.alert(
        falhas ? 'Alertas parcialmente ativados' : quantidade ? 'Alertas ativados' : 'Nenhum alerta agendado',
        falhas
          ? `${quantidade} lembrete(s) agendado(s) e ${falhas} falha(s). Toque em Alertas para tentar novamente.`
          : quantidade
            ? `${quantidade} lembrete(s) neste aparelho, para 2 horas antes das consultas. Toque no aviso para abrir os detalhes. Ao cadastrar novas consultas, toque em Alertas novamente.`
            : 'Não há consultas com mais de 2 horas de antecedência. Os lembretes antigos deste pet foram atualizados.',
      );
    } catch (erro) {
      if (geracao !== null && sessaoService.obterEstado().geracao !== geracao) return;
      const mensagem = erro instanceof Error ? erro.message : 'Não foi possível ativar os lembretes.';
      if (erro instanceof PermissaoLembreteError) {
        Alert.alert('Permissão necessária', mensagem, [
          { text: 'Agora não', style: 'cancel' },
          { text: 'Configurações', onPress: () => {
            void Linking.openSettings().catch(() => Alert.alert('Atenção', 'Abra as configurações do aparelho manualmente.'));
          } },
        ]);
      } else {
        Alert.alert('Lembretes', mensagem);
      }
    } finally {
      ativacaoEmCurso.current = false;
      setAtivandoAlertas(false);
    }
  };

  const excluirPet = async () => {
    if (
      !idValido ||
      exclusaoEmCurso.current ||
      ativacaoEmCurso.current
    ) {
      return;
    }

    exclusaoEmCurso.current = true;

    try {
      await deleteMutation.mutateAsync();

      let falhaAoLimparAlertas = false;

      try {
        await cancelarLembretesPet(petId);
      } catch {
        falhaAoLimparAlertas = true;
      }

      Alert.alert(
        'Pet removido',
        falhaAoLimparAlertas
          ? 'O pet foi removido, mas não foi possível limpar todos os lembretes locais.'
          : 'Pet removido com sucesso.',
      );

      navigation.goBack();
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível excluir o pet. Confira se existem registros vinculados.',
      );
    } finally {
      exclusaoEmCurso.current = false;
    }
  };

  const handleExcluirPet = () => {
    if (!pet || exclusaoEmCurso.current || ativacaoEmCurso.current) {
      return;
    }

    Alert.alert(
      'Excluir pet',
      `Deseja excluir ${pet.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => void excluirPet(),
        },
      ],
    );
  };

  const tentarNovamente = async () => {
    if (!idValido) return;

    await Promise.all([
      petQuery.refetch(),
      agendamentosQuery.refetch(),
    ]);
  };

  return {
    navigation,
    pet,
    carregandoPet: petQuery.isLoading,
    carregandoAgendamentos: agendamentosQuery.isLoading,
    isError:
      !idValido ||
      petQuery.isError ||
      agendamentosQuery.isError,
    tentarNovamente,
    lembretes,
    veioDaNotificacao,
    consultaNotificada,
    atualizandoConsultaNotificada: veioDaNotificacao && agendamentosQuery.isFetching,
    datasMarcadas,
    racaInfo,
    deleteMutation,
    ativandoAlertas,
    ativarAlertas,
    handleExcluirPet,
  };
}
