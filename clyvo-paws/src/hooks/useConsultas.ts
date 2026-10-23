import { useRef, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { agendamentoService } from '../services/agendamentoService';
import { useMeusPets } from './useMeusPets';
import type { AgendamentoPayload } from '../types/api';

const clinicasDB: Record<
  string,
  { clinicaId: number; veterinarioId: number }
> = {
  'Clínica Paws Care Matriz': {
    clinicaId: 1,
    veterinarioId: 1,
  },
  'Hospital Veterinário Vida Animal': {
    clinicaId: 2,
    veterinarioId: 2,
  },
  'Pet Care Morumbi': {
    clinicaId: 3,
    veterinarioId: 3,
  },
};

export function useConsultas() {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const [modalVisivel, setModalVisivel] = useState(false);
  const [clinicaSelecionada, setClinicaSelecionada] = useState('');
  const [veterinarioAtual, setVeterinarioAtual] =
    useState<number | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [motivo, setMotivo] = useState('');
  const [petSelecionado, setPetSelecionado] =
    useState<number | null>(null);

  const enviando = useRef(false);
  const petsQuery = useMeusPets();

  const listaPets = petsQuery.data ?? [];

  const agendasQuery = useQuery({
    queryKey: ['agendas', veterinarioAtual],
    queryFn: () => {
      if (!veterinarioAtual) return [];

      return agendamentoService.listarHorarios(veterinarioAtual);
    },
    enabled: !!veterinarioAtual && modalVisivel,
  });

  const listaAgendas = (agendasQuery.data ?? []).filter(
    (agenda) =>
      agenda.disponivel &&
      new Date(agenda.dataHoraInicio).getTime() > Date.now(),
  );

  const agendarMutation = useMutation({
    mutationFn: (dados: AgendamentoPayload) =>
      agendamentoService.cadastrar(dados),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['agendamentos-pet'],
      });

      void queryClient.invalidateQueries({
        queryKey: ['agendamentos-tutor'],
      });

      void queryClient.invalidateQueries({
        queryKey: ['agendas'],
      });
    },
  });

  const abrirWhatsApp = async (
    numero: string,
    nomeClinica: string,
  ) => {
    const numeroLimpo = numero.replace(/\D/g, '');

    const mensagem =
      `Olá ${nomeClinica}! Gostaria de marcar uma consulta para meu pet.`;

    try {
      await Linking.openURL(
        `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`,
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
    }
  };

  const formatarDataHora = (valor: string) => {
    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) return 'Data indisponível';

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');

    return `${dia}/${mes} às ${hora}:${minuto}`;
  };

  const abrirModalAgendamento = (nomeClinica: string) => {
    if (enviando.current) return;

    const clinica = clinicasDB[nomeClinica];

    if (!clinica) {
      Alert.alert('Erro', 'Clínica não configurada.');
      return;
    }

    setClinicaSelecionada(nomeClinica);
    setVeterinarioAtual(clinica.veterinarioId);
    setHorarioSelecionado('');
    setMotivo('');
    setPetSelecionado(null);
    setModalVisivel(true);
  };

  const handleAgendarApp = async () => {
    if (enviando.current) return;

    const clinica = clinicasDB[clinicaSelecionada];

    if (!clinica) {
      Alert.alert('Atenção', 'Selecione uma clínica.');
      return;
    }

    if (petsQuery.isError || agendasQuery.isError) {
      Alert.alert(
        'Erro',
        'Não foi possível carregar os dados. Tente novamente.',
      );
      return;
    }

    if (
      petsQuery.isLoading ||
      agendasQuery.isFetching
    ) {
      Alert.alert('Aguarde', 'Os dados ainda estão sendo carregados.');
      return;
    }

    if (
      !horarioSelecionado ||
      !listaAgendas.some(
        (agenda) => agenda.dataHoraInicio === horarioSelecionado,
      )
    ) {
      Alert.alert('Atenção', 'Selecione um horário disponível.');
      return;
    }

    if (
      !petSelecionado ||
      !listaPets.some((pet) => pet.id === petSelecionado)
    ) {
      Alert.alert('Atenção', 'Selecione um dos seus pets.');
      return;
    }

    if (!motivo.trim() || motivo.trim().length > 255) {
      Alert.alert(
        'Atenção',
        'Informe o motivo da consulta com até 255 caracteres.',
      );
      return;
    }

    enviando.current = true;

    try {
      await agendarMutation.mutateAsync({
        dataHora: horarioSelecionado,
        titulo: `Consulta na ${clinicaSelecionada}`,
        descricao: motivo.trim(),
        status: 'AGENDADA',
        consultaId: null,
        petId: petSelecionado,
        clinicaId: clinica.clinicaId,
        veterinarioId: clinica.veterinarioId,
      });

      Alert.alert('Sucesso', 'Sua consulta foi agendada.');

      setModalVisivel(false);
      setHorarioSelecionado('');
      setMotivo('');
      setPetSelecionado(null);
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível agendar. Atualize os horários e tente novamente.',
      );

      void queryClient.invalidateQueries({
        queryKey: ['agendas', veterinarioAtual],
      });
    } finally {
      enviando.current = false;
    }
  };

  const tentarNovamente = async () => {
    await petsQuery.refetch();

    if (veterinarioAtual) {
      await agendasQuery.refetch();
    }
  };

  return {
    navigation,
    modalVisivel,
    setModalVisivel,
    clinicaSelecionada,
    horarioSelecionado,
    setHorarioSelecionado,
    motivo,
    setMotivo,
    petSelecionado,
    setPetSelecionado,
    listaPets,
    listaAgendas,
    carregandoPets: petsQuery.isLoading,
    carregandoAgendas: agendasQuery.isFetching,
    isError: petsQuery.isError || agendasQuery.isError,
    tentarNovamente,
    agendarMutation,
    abrirWhatsApp,
    formatarDataHora,
    abrirModalAgendamento,
    handleAgendarApp,
  };
}