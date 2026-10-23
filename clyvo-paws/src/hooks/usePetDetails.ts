import { useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';

import { petService } from '../services/petService';
import { agendamentoService } from '../services/agendamentoService';
import { DADOS_RACAS } from '../data/racas';
import { colors } from '../theme/colors';
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
        dotColor: colors.verdeMedio,
      };
    }

    const hoje = dataLocal(new Date());

    marcacoes[hoje] = {
      ...marcacoes[hoje],
      selected: true,
      selectedColor: colors.verdeMedio,
      dotColor: colors.branco,
    };

    return marcacoes;
  }, [lembretes]);

const ativarAlertas = async () => {
  if (!pet || ativacaoEmCurso.current || exclusaoEmCurso.current) {
    return;
  }

  ativacaoEmCurso.current = true;
  setAtivandoAlertas(true);

  let quantidade = 0;

  try {
    const token = await sessaoService.obterToken();

    if (!token) return;

    const permissao = await Notifications.requestPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert(
        'Permissão necessária',
        'Permita as notificações para receber os lembretes.',
      );
      return;
    }

    for (const agendamento of agendamentosQuery.data ?? []) {
      if (sessaoService.obterEstado().token !== token) return;

      const dataConsulta = new Date(agendamento.dataHora);

      if (Number.isNaN(dataConsulta.getTime())) continue;

      const dataAlarme = new Date(
        dataConsulta.getTime() - 2 * 60 * 60 * 1000,
      );

      if (dataAlarme <= new Date()) continue;

      const identificador = `consulta-${petId}-${agendamento.id}`;

      await Notifications.cancelScheduledNotificationAsync(
        identificador,
      );

      if (sessaoService.obterEstado().token !== token) return;

      const idNotificacao = await Notifications.scheduleNotificationAsync({
        identifier: identificador,

        content: {
          title: 'Lembrete de consulta',
          body: `A consulta de ${pet.nome} acontece em 2 horas.`,
          sound: true,
          data: {
            petId,
            agendamentoId: agendamento.id,
          },
        },

        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: dataAlarme,
          channelId: 'consultas',
        },
      });

      if (sessaoService.obterEstado().token !== token) {
        await Notifications.cancelScheduledNotificationAsync(
          idNotificacao,
        );
        return;
      }

      quantidade += 1;
    }

    Alert.alert(
      quantidade > 0 ? 'Alertas ativados' : 'Nenhum alerta agendado',
      quantidade > 0
        ? `${quantidade} lembrete(s) agendado(s) para 2 horas antes das consultas.`
        : 'Não há consultas com mais de 2 horas de antecedência.',
    );
  } catch {
    Alert.alert(
      'Erro',
      quantidade > 0
        ? `${quantidade} lembrete(s) foram agendados, mas houve uma falha ao concluir.`
        : 'Não foi possível ativar os lembretes.',
    );
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
        const notificacoes =
          await Notifications.getAllScheduledNotificationsAsync();

        await Promise.all(
          notificacoes
            .filter(
              (item) => Number(item.content.data?.petId) === petId,
            )
            .map((item) =>
              Notifications.cancelScheduledNotificationAsync(
                item.identifier,
              ),
            ),
        );
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
    datasMarcadas,
    racaInfo,
    deleteMutation,
    ativandoAlertas,
    ativarAlertas,
    handleExcluirPet,
  };
}