import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { tutorService } from '../services/tutorService';
import { sessaoService } from '../services/sessaoService';
import { useSessaoLocal } from './useSessaolocal';
import { useFotoGaleria } from './useFotoGaleria';
import type { AtualizacaoTutor } from '../types/api';

export function usePerfil() {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const sessao = useSessaoLocal();
  const tutorId = sessao.data?.id;

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  const perfilCarregado = useRef<number | null>(null);
  const operacaoEmCurso = useRef(false);

  const perfilQuery = useQuery({
    queryKey: ['perfil-tutor', tutorId],
    queryFn: () => {
      if (!tutorId) {
        throw new Error('Faça login para consultar seu perfil.');
      }

      return tutorService.buscar(tutorId);
    },
    enabled: !!tutorId,
  });

  const updateMutation = useMutation({
    mutationFn: (dados: AtualizacaoTutor) => {
      if (!tutorId) {
        throw new Error('Faça login para atualizar o perfil.');
      }

      return tutorService.atualizar(tutorId, dados);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!tutorId) {
        throw new Error('Faça login para excluir a conta.');
      }

      return tutorService.excluir(tutorId);
    },
  });

  const {
    foto,
    setFoto,
    escolherFoto,
    escolhendoFoto,
  } = useFotoGaleria(
    null,
    updateMutation.isPending || deleteMutation.isPending,
  );

  useEffect(() => {
    const perfil = perfilQuery.data;

    if (!perfil || perfilCarregado.current === perfil.id) return;

    perfilCarregado.current = perfil.id;

    setNome(perfil.nomeCompleto);
    setEmail(perfil.email);
    setCpf(perfil.cpf);
    setTelefone(perfil.telefone ?? '');
    setFoto(perfil.fotoUrl);
  }, [perfilQuery.data, setFoto]);

  const handleSalvar = async () => {
    if (operacaoEmCurso.current || escolhendoFoto) return;

    if (!tutorId || !perfilQuery.data) {
      Alert.alert('Atenção', 'Aguarde o carregamento do perfil.');
      return;
    }

    const nomeNormalizado = nome.trim();
    const emailNormalizado = email.trim().toLowerCase();

    if (!nomeNormalizado || nomeNormalizado.length > 100) {
      Alert.alert('Atenção', 'Informe um nome com até 100 caracteres.');
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado) ||
      emailNormalizado.length > 100
    ) {
      Alert.alert('Atenção', 'Informe um e-mail válido.');
      return;
    }

    operacaoEmCurso.current = true;

    try {
      const resposta = await updateMutation.mutateAsync({
        nomeCompleto: nomeNormalizado,
        email: emailNormalizado,
        cpf: cpf.trim(),
        telefone: telefone.trim(),
        foto,
      });

      const emailAnterior = perfilQuery.data.email.trim().toLowerCase();

    if (emailNormalizado !== emailAnterior) {
      let mensagem =
        'Seu e-mail foi atualizado. Faça login com o novo e-mail e sua senha atual.';

     try {
       await queryClient.cancelQueries();
       await sessaoService.limpar();
     } catch {
       mensagem +=
          '\nNão foi possível limpar todos os dados locais da sessão anterior.';
     }

  queryClient.clear();

  Alert.alert('E-mail atualizado', mensagem);
  return;
}


      const tutorLocal = {
        id: resposta.id,
        nomeCompleto: resposta.nomeCompleto,
        fotoUrl: resposta.fotoUrl,
      };

      queryClient.setQueryData(
        ['perfil-tutor', tutorId],
        resposta,
      );

      queryClient.setQueryData(['sessao-local'], tutorLocal);

      let aviso = 'Seus dados foram atualizados.';

      try {
        await sessaoService.salvarTutor(tutorLocal);
      } catch {
        aviso =
          'O perfil foi atualizado no servidor, mas houve uma falha ao atualizar os dados locais. Entre novamente na conta.';
      }

      Alert.alert('Perfil atualizado', aviso);
      navigation.goBack();
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível atualizar o perfil. Confira os dados.',
      );
    } finally {
      operacaoEmCurso.current = false;
    }
  };

  const excluirConta = async () => {
    if (operacaoEmCurso.current || escolhendoFoto) return;

    operacaoEmCurso.current = true;

    try {
      await deleteMutation.mutateAsync();
    } catch {
      operacaoEmCurso.current = false;

      Alert.alert(
        'Erro',
        'Não foi possível excluir a conta. Confira os registros vinculados.',
      );
      return;
    }

    let falhaLimpeza = false;

    try {
      await queryClient.cancelQueries();
      await sessaoService.limpar();
    } catch {
      falhaLimpeza = true;
    } finally {
      queryClient.clear();
      operacaoEmCurso.current = false;
    }

    Alert.alert(
      'Conta excluída',
      falhaLimpeza
        ? 'A conta foi excluída, mas houve uma falha ao limpar os dados locais.'
        : 'Sua conta foi excluída com sucesso.',
    );

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const confirmarExclusao = () => {
    if (
      !tutorId ||
      operacaoEmCurso.current ||
      escolhendoFoto
    ) {
      return;
    }

    Alert.alert(
      'Excluir conta',
      'Deseja excluir sua conta? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => void excluirConta(),
        },
      ],
    );
  };

  const tentarNovamente = async () => {
    if (sessao.isError) {
      await sessao.refetch();
      return;
    }

    if (tutorId) {
      await perfilQuery.refetch();
    }
  };

  return {
    navigation,
    carregando: sessao.isPending || perfilQuery.isLoading,
    isError: sessao.isError || perfilQuery.isError,
    tentarNovamente,
    nome,
    setNome,
    email,
    setEmail,
    cpf,
    setCpf,
    telefone,
    setTelefone,
    foto,
    escolherFoto,
    escolhendoFoto,
    updateMutation,
    deleteMutation,
    confirmarExclusao,
    handleSalvar,
  };
}