import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { authService } from '../services/authService';
import { sessaoService } from '../services/sessaoService';

export function useLogin() {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const enviando = useRef(false);

  const loginMutation = useMutation({
    mutationFn: async (dados: {
      email: string;
      senha: string;
    }) => {
      const emailNormalizado = dados.email.trim().toLowerCase();

      if (!emailNormalizado || !dados.senha.trim()) {
        throw new Error('Preencha o e-mail e a senha.');
      }

      const resposta = await authService.login(
        emailNormalizado,
        dados.senha,
      );

      const tutorId = resposta.id;

      if (
        !resposta.token ||
        resposta.role !== 'TUTOR' ||
        tutorId === null ||
        !Number.isInteger(tutorId) ||
        tutorId <= 0
      ) {
        throw new Error(
          'Não foi possível iniciar uma sessão de tutor.',
        );
      }

      await queryClient.cancelQueries();
      queryClient.clear();

      await sessaoService.salvar(resposta.token, {
        id: tutorId,
        nomeCompleto: resposta.nomeCompleto,
        fotoUrl: resposta.fotoUrl,
      }, resposta.refreshToken, resposta.refreshExpiresAt);
    },
  });

  const handleLogin = async () => {
    if (enviando.current) return;

    enviando.current = true;

    try {
      await loginMutation.mutateAsync({ email, senha });

      setSenha('');

    } catch (erro) {
      let mensagem = 'Não foi possível entrar. Tente novamente.';

      if (axios.isAxiosError(erro)) {
        if (!erro.response) {
          mensagem = 'Não foi possível conectar ao servidor.';
        } else if (erro.response.status === 401) {
          mensagem = 'E-mail ou senha inválidos.';
        }
      } else if (erro instanceof Error) {
        mensagem = erro.message;
      }

      Alert.alert('Atenção', mensagem);
    } finally {
      enviando.current = false;
    }
  };

  return {
    navigation,
    email,
    setEmail,
    senha,
    setSenha,
    loginMutation,
    handleLogin,
  };
}
