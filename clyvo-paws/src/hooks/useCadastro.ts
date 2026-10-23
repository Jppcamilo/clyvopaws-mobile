import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { tutorService } from '../services/tutorService';
import { useFotoGaleria } from './useFotoGaleria';
import type { CadastroTutor } from '../types/api';

export function useCadastro() {
  const navigation = useNavigation<any>();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const enviando = useRef(false);

  const registerMutation = useMutation({
    mutationFn: (dados: CadastroTutor) =>
      tutorService.cadastrar(dados),
  });

  const {
    foto,
    escolherFoto,
    escolhendoFoto,
  } = useFotoGaleria(null, registerMutation.isPending);

  const handleCadastrar = async () => {
    if (enviando.current || escolhendoFoto) return;

    const nomeNormalizado = nome.trim();
    const emailNormalizado = email.trim().toLowerCase();
    const cpfNormalizado = cpf.replace(/\D/g, '');

    if (!nomeNormalizado || !emailNormalizado || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha nome, e-mail e senha.');
      return;
    }

    if (nomeNormalizado.length > 100) {
      Alert.alert('Atenção', 'O nome deve ter até 100 caracteres.');
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado) ||
      emailNormalizado.length > 100
    ) {
      Alert.alert('Atenção', 'Informe um e-mail válido.');
      return;
    }

    if (cpfNormalizado.length !== 11) {
      Alert.alert('Atenção', 'Informe um CPF com 11 dígitos.');
      return;
    }

    if (senha.length < 6 || senha.length > 72) {
      Alert.alert(
        'Atenção',
        'A senha deve ter entre 6 e 72 caracteres.',
      );
      return;
    }

    if (telefone.trim().length > 20) {
      Alert.alert('Atenção', 'Confira o telefone informado.');
      return;
    }

    enviando.current = true;

    try {
      await registerMutation.mutateAsync({
        nomeCompleto: nomeNormalizado,
        cpf: cpfNormalizado,
        telefone: telefone.trim(),
        email: emailNormalizado,
        senha,
        fotoUrl: foto,
      });

      setSenha('');

      Alert.alert(
        'Cadastro realizado',
        'Faça login para acessar sua conta.',
      );

      navigation.goBack();
    } catch (erro) {
      let mensagem = 'Não foi possível realizar o cadastro.';

      if (axios.isAxiosError(erro)) {
        if (!erro.response) {
          mensagem = 'Não foi possível conectar ao servidor.';
        } else if (erro.response.status === 409) {
          mensagem = 'Já existe um cadastro com esses dados.';
        } else if (erro.response.status === 400) {
          mensagem = 'Confira os dados preenchidos e tente novamente.';
        }
      }

      Alert.alert('Erro', mensagem);
    } finally {
      enviando.current = false;
    }
  };

  return {
    navigation,
    nome,
    setNome,
    cpf,
    setCpf,
    telefone,
    setTelefone,
    email,
    setEmail,
    senha,
    setSenha,
    foto,
    escolherFoto,
    escolhendoFoto,
    registerMutation,
    handleCadastrar,
  };
}