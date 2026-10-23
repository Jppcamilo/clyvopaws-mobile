import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useSessaoLocal } from './useSessaolocal';

type Mensagem = {
  id: string;
  texto: string;
  remetente: 'bot' | 'user';
  hora: string;
};

const opcoesRapidas = [
  'AGENDAR CONSULTA',
  'DÚVIDA SOBRE SINTOMAS',
  'REDE CLÍNICA PARCEIRA',
  'CARTEIRINHA DE VACINAÇÃO',
  'FALAR COM ESPECIALISTA VETERINÁRIO',
];

function horarioAtual(): string {
  return new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function obterResposta(texto: string): string {
  const mensagem = normalizar(texto);

  if (mensagem.includes('agendar') || mensagem.includes('consulta')) {
    return 'Para marcar uma consulta, acesse Serviços > Consultas, selecione a clínica, o horário e o pet.';
  }

  if (mensagem.includes('sintoma')) {
    return 'Este assistente não realiza avaliação clínica. Para orientação sobre sintomas, entre em contato com um veterinário.';
  }

  if (mensagem.includes('rede') || mensagem.includes('clinica')) {
    return 'Consulte a seção Rede Clínica para visualizar as informações cadastradas das clínicas.';
  }

  if (mensagem.includes('vacina')) {
    return 'Confira os agendamentos do seu pet em Meus Pets. Este chat não emite comprovantes nem registra vacinas aplicadas.';
  }

  if (
    mensagem.includes('especialista') ||
    mensagem.includes('veterinario')
  ) {
    return 'Este chat não transfere mensagens para um veterinário. Utilize os contatos da clínica ou agende uma consulta.';
  }

  return 'Posso orientar sobre navegação, consultas e informações do aplicativo. Escolha uma das opções disponíveis.';
}

export function useChat() {
  const navigation = useNavigation<any>();
  const sessao = useSessaoLocal();

  const [textoInput, setTextoInput] = useState('');
  const sequencia = useRef(0);

  const nomeTutor =
    sessao.data?.nomeCompleto
      .trim()
      .split(/\s+/)[0]
      .toUpperCase() ?? 'TUTOR';

  const [mensagens, setMensagens] = useState<Mensagem[]>(() => [
    {
      id: 'boas-vindas',
      texto: 'Olá! Sou o assistente de navegação da Clyvo VET.',
      remetente: 'bot',
      hora: horarioAtual(),
    },
    {
      id: 'orientacao',
      texto: 'Escolha uma opção ou digite sua dúvida sobre o aplicativo.',
      remetente: 'bot',
      hora: horarioAtual(),
    },
  ]);

  useEffect(() => {
    setMensagens((anteriores) =>
      anteriores.map((mensagem) =>
        mensagem.id === 'boas-vindas'
          ? {
              ...mensagem,
              texto: `Olá, ${nomeTutor}! Sou o assistente de navegação da Clyvo VET.`,
            }
          : mensagem,
      ),
    );
  }, [nomeTutor]);

  const enviarMensagem = (texto: string) => {
    const conteudo = texto.trim();

    if (!conteudo) return;

    const identificador = `${Date.now()}-${++sequencia.current}`;
    const hora = horarioAtual();

    const novasMensagens: Mensagem[] = [
      {
        id: `${identificador}-user`,
        texto: conteudo,
        remetente: 'user',
        hora,
      },
      {
        id: `${identificador}-bot`,
        texto: obterResposta(conteudo),
        remetente: 'bot',
        hora,
      },
    ];

    setMensagens((anteriores) => [
      ...anteriores,
      ...novasMensagens,
    ]);

    setTextoInput('');
  };

  return {
    navigation,
    textoInput,
    setTextoInput,
    nomeTutor,
    mensagens,
    opcoesRapidas,
    enviarMensagem,
  };
}