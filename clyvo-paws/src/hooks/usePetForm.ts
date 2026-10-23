import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

import { DADOS_RACAS } from '../data/racas';
import { petService } from '../services/petService';
import { sessaoService } from '../services/sessaoService';
import {
  analisarFotoPet,
  mensagemErroIA,
} from '../services/ia';
import type { EspeciePet } from '../services/ia';
import type { Pet } from '../types';
import type { PetPayload } from '../types/api';

type Raca = {
  nome: string;
  doenca?: string;
  idadeAlerta?: string;
  prevencao?: string;
  cuidados?: string;
};

function normalizarRaca(valor: string): string {
  const normalizado = valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  const nomesSRD = [
    'srd',
    'semracadefinida',
    'semracadefinidasrd',
    'racaindefinida',
    'gatoderacaindefinidasrd',
    'gatosemracadefinida',
    'gatosemracadefinidasrd',
    'cachorrosemracadefinida',
    'cachorrosemracadefinidasrd',
    'viralata',
  ];

  return nomesSRD.includes(normalizado) ? 'srd' : normalizado;
}

function listarRacas(especie: EspeciePet): Raca[] {
  return DADOS_RACAS[especie] ?? [];
}

function encontrarRaca(
  especie: EspeciePet,
  nome: string,
): Raca | undefined {
  return listarRacas(especie).find(
    (item) => normalizarRaca(item.nome) === normalizarRaca(nome),
  );
}

function obterEspecieInicial(pet?: Pet): EspeciePet | null {
  if (!pet) return null;

  if (pet.especie === 'CACHORRO' || pet.especie === 'GATO') {
    return pet.especie;
  }

  if (encontrarRaca('CACHORRO', pet.raca ?? '')) {
    return 'CACHORRO';
  }

  if (encontrarRaca('GATO', pet.raca ?? '')) {
    return 'GATO';
  }

  return null;
}

function obterDataInicial(valor?: string): Date {
  if (!valor) return new Date();

  const data = new Date(`${valor.slice(0, 10)}T00:00:00`);

  return Number.isNaN(data.getTime()) ? new Date() : data;
}

function formatarDataLocal(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

export function usePetForm() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const queryClient = useQueryClient();

  const petParaEditar = route.params?.pet as Pet | undefined;

  const [nome, setNome] = useState(petParaEditar?.nome ?? '');
  const [dataNascimento, setDataNascimento] = useState(() =>
    obterDataInicial(petParaEditar?.dataNascimento),
  );
  const [mostraCalendario, setMostraCalendario] = useState(false);
  const [peso, setPeso] = useState(
    petParaEditar?.peso != null ? String(petParaEditar.peso) : '',
  );
  const [sexo, setSexo] = useState<'MACHO' | 'FEMEA' | null>(
    petParaEditar?.sexo ?? null,
  );
  const [descricao, setDescricao] = useState(
    petParaEditar?.descricao ?? '',
  );
  const [foto, setFoto] = useState<string | null>(
    petParaEditar?.fotoUrl ?? petParaEditar?.foto ?? null,
  );
  const [especie, setEspecie] = useState<EspeciePet | null>(() =>
    obterEspecieInicial(petParaEditar),
  );
  const [racaSelecionada, setRacaSelecionada] = useState<Raca | null>(
    petParaEditar?.raca ? { nome: petParaEditar.raca } : null,
  );
  const [fotoParaIA, setFotoParaIA] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [analisandoFoto, setAnalisandoFoto] = useState(false);
  const [escolhendoFoto, setEscolhendoFoto] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const telaAtiva = useRef(true);
  const versaoFoto = useRef(0);
  const requisicaoIA = useRef<AbortController | null>(null);
  const galeriaAberta = useRef(false);
  const salvamentoEmCurso = useRef(false);

  useEffect(() => {
    telaAtiva.current = true;

    return () => {
      telaAtiva.current = false;
      versaoFoto.current += 1;
      requisicaoIA.current?.abort();
    };
  }, []);

  const savePetMutation = useMutation({
    mutationFn: (dados: PetPayload) => {
      if (petParaEditar) {
        return petService.atualizar(petParaEditar.id, dados);
      }

      return petService.cadastrar(dados);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['meus-pets'],
      });

      if (petParaEditar) {
        void queryClient.invalidateQueries({
          queryKey: ['pet-details', petParaEditar.id],
        });
      }
    },
  });

  const ocupado = analisandoFoto || escolhendoFoto || salvando;

  const operacaoEmCurso = () =>
    galeriaAberta.current ||
    salvamentoEmCurso.current ||
    requisicaoIA.current !== null;

  const escolherFoto = async () => {
    if (operacaoEmCurso()) return;

    galeriaAberta.current = true;
    setEscolhendoFoto(true);

    const versaoAtual = ++versaoFoto.current;

    try {
      const permissao =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!telaAtiva.current || versaoAtual !== versaoFoto.current) {
        return;
      }

      if (!permissao.granted) {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à galeria para escolher uma foto.',
        );
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.9,
      });

      if (!telaAtiva.current || versaoAtual !== versaoFoto.current) {
        return;
      }

      if (!resultado.canceled && resultado.assets[0]) {
        const imagem = resultado.assets[0];

        setFoto(imagem.uri);
        setFotoParaIA(imagem);
      }
    } catch {
      if (telaAtiva.current) {
        Alert.alert('Erro', 'Não foi possível selecionar a foto.');
      }
    } finally {
      galeriaAberta.current = false;

      if (telaAtiva.current) {
        setEscolhendoFoto(false);
      }
    }
  };

  const identificarComIA = async () => {
    if (operacaoEmCurso()) return;

    if (!fotoParaIA) {
      Alert.alert(
        'Selecione uma foto',
        'Escolha uma imagem na galeria antes de usar a IA.',
      );
      return;
    }

    const controle = new AbortController();
    const versaoAtual = ++versaoFoto.current;

    requisicaoIA.current = controle;
    setAnalisandoFoto(true);

    try {
      const resultado = await analisarFotoPet(
        fotoParaIA,
        controle.signal,
      );

      if (
        !telaAtiva.current ||
        controle.signal.aborted ||
        versaoAtual !== versaoFoto.current
      ) {
        return;
      }

      const especieSugerida = resultado.especie;
      const raca = resultado.racaProvavel?.trim() ?? '';

      const confiancaSuficiente =
        resultado.confiancaVisual === 'MEDIA' ||
        resultado.confiancaVisual === 'ALTA';

      if (
        resultado.status !== 'IDENTIFICADO' ||
        (especieSugerida !== 'CACHORRO' && especieSugerida !== 'GATO') ||
        !confiancaSuficiente ||
        !raca ||
        raca.length > 50
      ) {
        Alert.alert(
          'Identificação inconclusiva',
          `${resultado.motivo || 'Não foi possível confirmar a raça.'}\n\nVocê pode preencher os dados manualmente.`,
        );
        return;
      }

      const especieTexto =
        especieSugerida === 'CACHORRO' ? 'Cachorro' : 'Gato';

      Alert.alert(
        'Confira a sugestão da IA',
        [
          `Espécie: ${especieTexto}`,
          `Raça provável: ${raca}`,
          '',
          resultado.motivo,
          '',
          'A identificação por foto pode estar errada. Deseja usar a sugestão?',
        ].join('\n'),
        [
          {
            text: 'Preencher manualmente',
            style: 'cancel',
          },
          {
            text: 'Usar sugestão',
            onPress: () => {
              if (
                !telaAtiva.current ||
                salvamentoEmCurso.current ||
                versaoAtual !== versaoFoto.current
              ) {
                return;
              }

              setEspecie(especieSugerida);
              setRacaSelecionada(
                encontrarRaca(especieSugerida, raca) ?? { nome: raca },
              );
            },
          },
        ],
      );
    } catch (erro) {
      if (
        telaAtiva.current &&
        !controle.signal.aborted &&
        versaoAtual === versaoFoto.current
      ) {
        Alert.alert('Não foi possível analisar', mensagemErroIA(erro));
      }
    } finally {
      if (requisicaoIA.current === controle) {
        requisicaoIA.current = null;

        if (telaAtiva.current) {
          setAnalisandoFoto(false);
        }
      }
    }
  };

  const alterarEspecie = (novaEspecie: EspeciePet) => {
    if (operacaoEmCurso()) return;

    if (novaEspecie !== especie) {
      versaoFoto.current += 1;
      setEspecie(novaEspecie);
      setRacaSelecionada(null);
    }
  };

  const handleSalvar = async () => {
    if (operacaoEmCurso()) return;

    const raca = racaSelecionada?.nome.trim();
    const pesoNumerico = Number(peso.trim().replace(',', '.'));

    if (!nome.trim() || !peso.trim() || !sexo || !especie || !raca) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (!Number.isFinite(pesoNumerico) || pesoNumerico <= 0) {
      Alert.alert('Atenção', 'Informe um peso maior que zero.');
      return;
    }

    if (
      nome.trim().length > 100 ||
      raca.length > 50 ||
      descricao.trim().length > 500
    ) {
      Alert.alert(
        'Atenção',
        'Use até 100 caracteres no nome, 50 na raça e 500 na descrição.',
      );
      return;
    }

    if (
      Number.isNaN(dataNascimento.getTime()) ||
      formatarDataLocal(dataNascimento) > formatarDataLocal(new Date())
    ) {
      Alert.alert('Atenção', 'Informe uma data de nascimento válida.');
      return;
    }

    salvamentoEmCurso.current = true;
    setSalvando(true);
    versaoFoto.current += 1;

    try {
      const tutor = await sessaoService.exigirTutor();

      if (!telaAtiva.current) return;

      const dados: PetPayload = {
        nome: nome.trim(),
        dataNascimento: formatarDataLocal(dataNascimento),
        peso: pesoNumerico,
        sexo,
        especie,
        raca,
        descricao: descricao.trim(),
        fotoUrl: foto,
        tutorId: tutor.id,
      };

      await savePetMutation.mutateAsync(dados);

      if (!telaAtiva.current) return;

      if (petParaEditar) {
        Alert.alert('Sucesso', 'Dados do pet atualizados.');
        navigation.goBack();
        return;
      }

      const racaDoCatalogo = encontrarRaca(especie, raca);

      if (racaDoCatalogo) {
        Alert.alert('Sucesso', 'Pet cadastrado.');

        navigation.replace('InfoRaca', {
          racaData: racaDoCatalogo,
        });
      } else {
        Alert.alert(
          'Pet cadastrado',
          'Ainda não há um plano preventivo cadastrado para essa raça.',
        );

        navigation.goBack();
      }
    } catch (erro) {
      if (!telaAtiva.current) return;

      let mensagem = 'Não foi possível salvar o pet.';

      if (axios.isAxiosError(erro)) {
        if (!erro.response) {
          mensagem = 'Não foi possível conectar ao servidor.';
        } else if (erro.response.status === 401) {
          mensagem = 'Sua sessão expirou. Faça login novamente.';
        } else if (erro.response.status === 403) {
          mensagem = 'Você não tem permissão para salvar esse pet.';
        } else if (erro.response.status === 400) {
          mensagem = 'Confira os dados preenchidos.';
        }
      } else if (erro instanceof Error) {
        mensagem = erro.message;
      }

      Alert.alert('Erro', mensagem);
    } finally {
      salvamentoEmCurso.current = false;

      if (telaAtiva.current) {
        setSalvando(false);
      }
    }
  };

  const racasDoCatalogo = especie ? listarRacas(especie) : [];

  const racasDisponiveis: Raca[] = racaSelecionada?.nome.trim()
    ? [
        racasDoCatalogo.find(
          (item) =>
            normalizarRaca(item.nome) ===
            normalizarRaca(racaSelecionada.nome),
        ) ?? racaSelecionada,
        ...racasDoCatalogo.filter(
          (item) =>
            normalizarRaca(item.nome) !==
            normalizarRaca(racaSelecionada.nome),
        ),
      ]
    : racasDoCatalogo;

  return {
    navigation,
    petParaEditar,
    nome,
    setNome,
    dataNascimento,
    setDataNascimento,
    mostraCalendario,
    setMostraCalendario,
    peso,
    setPeso,
    sexo,
    setSexo,
    descricao,
    setDescricao,
    foto,
    especie,
    racaSelecionada,
    setRacaSelecionada,
    racasDisponiveis,
    fotoParaIA,
    analisandoFoto,
    escolhendoFoto,
    salvando,
    ocupado,
    escolherFoto,
    identificarComIA,
    alterarEspecie,
    handleSalvar,
    savePetMutation,
  };
}