import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { colors } from '../theme/colors';
import { DADOS_RACAS } from '../data/racas';
import api from '../services/api';
import { analisarFotoPet, mensagemErroIA } from '../services/ia';
import type { EspeciePet } from '../services/ia';

type Raca = {
  nome: string;
  doenca?: string;
  idadeAlerta?: string;
  prevencao?: string;
  cuidados?: string;
};

type PetPayload = {
  nome: string;
  dataNascimento: string;
  peso: number;
  sexo: 'MACHO' | 'FEMEA';
  raca: string;
  especie: EspeciePet;
  descricao: string;
  fotoUrl: string | null;
  tutorId: number;
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

function listarRacasParaSelecao(
  especie: EspeciePet,
  selecionada: Raca | null,
): Raca[] {
  const racas = listarRacas(especie);

  if (!selecionada?.nome.trim()) {
    return racas;
  }

  const nomeNormalizado = normalizarRaca(selecionada.nome);

  const correspondente = racas.find(
    (item) => normalizarRaca(item.nome) === nomeNormalizado,
  );

  return [
    correspondente ?? selecionada,
    ...racas.filter(
      (item) => normalizarRaca(item.nome) !== nomeNormalizado,
    ),
  ];
}

function obterEspecieInicial(pet: any): EspeciePet | null {
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

export default function PetFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const queryClient = useQueryClient();

  const petParaEditar = route.params?.pet;

  const [nome, setNome] = useState<string>(petParaEditar?.nome ?? '');

  const [dataNascimento, setDataNascimento] = useState<Date>(() =>
    obterDataInicial(petParaEditar?.dataNascimento),
  );

  const [mostraCalendario, setMostraCalendario] = useState(false);

  const [peso, setPeso] = useState<string>(
    petParaEditar?.peso != null ? String(petParaEditar.peso) : '',
  );

  const [sexo, setSexo] = useState<'MACHO' | 'FEMEA' | null>(
    petParaEditar?.sexo === 'MACHO'
      ? 'MACHO'
      : petParaEditar?.sexo === 'FEMEA' ||
          petParaEditar?.sexo === 'FÊMEA'
        ? 'FEMEA'
        : null,
  );

  const [descricao, setDescricao] = useState<string>(
    petParaEditar?.descricao ?? '',
  );

  const [foto, setFoto] = useState<string | null>(
    petParaEditar?.fotoUrl || petParaEditar?.foto || null,
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

  const requisicaoIA = useRef<AbortController | null>(null);
  const versaoFoto = useRef(0);
  const telaAtiva = useRef(true);
  const salvamentoEmCurso = useRef(false);
  const galeriaAberta = useRef(false);

  useEffect(() => {
    telaAtiva.current = true;

    return () => {
      telaAtiva.current = false;
      versaoFoto.current += 1;
      requisicaoIA.current?.abort();
    };
  }, []);

  const savePetMutation = useMutation({
    mutationFn: async (petData: PetPayload) => {
      if (petParaEditar) {
        const response = await api.put(
          `/pets/${petParaEditar.id}`,
          petData,
        );

        return response.data;
      }

      const response = await api.post('/pets', petData);
      return response.data;
    },

    onSuccess: (_data, dadosEnviados) => {
      void queryClient.invalidateQueries({
        queryKey: ['meus-pets'],
      });

      if (petParaEditar) {
        void queryClient.invalidateQueries({
          queryKey: ['pet-details', petParaEditar.id],
        });

        if (!telaAtiva.current) return;

        Alert.alert('Sucesso', 'Dados do pet atualizados com sucesso!');
        navigation.goBack();
        return;
      }

      if (!telaAtiva.current) return;

      const racaDoCatalogo = encontrarRaca(
        dadosEnviados.especie,
        dadosEnviados.raca,
      );

      if (racaDoCatalogo) {
        Alert.alert('Sucesso', 'Pet cadastrado com sucesso!');

        navigation.replace('InfoRaca', {
          racaData: racaDoCatalogo,
        });
      } else {
        Alert.alert(
          'Pet cadastrado',
          'Cadastro concluído! Ainda não há um plano preventivo cadastrado para essa raça.',
        );

        navigation.goBack();
      }
    },
  });

  const ocupado = analisandoFoto || escolhendoFoto || salvando;

  const escolherFoto = async () => {
    if (ocupado || galeriaAberta.current) return;

    galeriaAberta.current = true;
    setEscolhendoFoto(true);

    const versaoAtual = ++versaoFoto.current;

    requisicaoIA.current?.abort();
    requisicaoIA.current = null;

    try {
      const permissao =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (versaoAtual !== versaoFoto.current) return;

      if (!permissao.granted) {
        Alert.alert(
          'Atenção',
          'Precisamos de permissão para acessar sua galeria.',
        );
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.9,
      });

      if (versaoAtual !== versaoFoto.current) return;

      if (!resultado.canceled && resultado.assets[0]) {
        const imagem = resultado.assets[0];

        setFoto(imagem.uri);
        setFotoParaIA(imagem);
      }
    } catch {
      if (telaAtiva.current) {
        Alert.alert('Erro', 'Não foi possível abrir essa foto.');
      }
    } finally {
      galeriaAberta.current = false;

      if (telaAtiva.current) {
        setEscolhendoFoto(false);
      }
    }
  };

  const identificarComIA = async () => {
    if (ocupado || requisicaoIA.current) return;

    if (!fotoParaIA) {
      Alert.alert(
        'Selecione uma foto',
        'Escolha uma foto na galeria para identificar seu pet.',
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

      if (versaoAtual !== versaoFoto.current) return;

      const especieSugerida = resultado.especie;

      const confiancaSuficiente =
        resultado.confiancaVisual === 'MEDIA' ||
        resultado.confiancaVisual === 'ALTA';

      const raca =
        typeof resultado.racaProvavel === 'string'
          ? resultado.racaProvavel.trim()
          : '';

      if (
        resultado.status !== 'IDENTIFICADO' ||
        (especieSugerida !== 'CACHORRO' &&
          especieSugerida !== 'GATO') ||
        !confiancaSuficiente ||
        !raca ||
        raca.length > 50
      ) {
        Alert.alert(
          'Não foi possível confirmar a raça',
          [
            resultado.motivo ||
              'A imagem não permitiu uma identificação segura.',
            '',
            'Você pode usar outra foto ou preencher os dados manualmente.',
          ].join('\n'),
        );
        return;
      }

      const especieTexto =
        especieSugerida === 'CACHORRO' ? 'Cachorro' : 'Gato';

      const confiancaTexto =
        resultado.confiancaVisual === 'ALTA' ? 'Alta' : 'Média';

      Alert.alert(
        'Confira a sugestão da IA',
        [
          `Espécie: ${especieTexto}`,
          `Raça provável: ${raca}`,
          `Confiança visual: ${confiancaTexto}`,
          '',
          resultado.motivo,
          '',
          'A identificação por foto é uma sugestão e pode estar errada. Deseja usar esses dados?',
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
                versaoAtual !== versaoFoto.current
              ) {
                return;
              }

              setEspecie(especieSugerida);

              setRacaSelecionada(
                encontrarRaca(especieSugerida, raca) ?? {
                  nome: raca,
                },
              );
            },
          },
        ],
      );
    } catch (erro) {
      if (
        controle.signal.aborted ||
        versaoAtual !== versaoFoto.current
      ) {
        return;
      }

      Alert.alert(
        'Não foi possível analisar',
        mensagemErroIA(erro),
      );
    } finally {
      if (
        telaAtiva.current &&
        versaoAtual === versaoFoto.current
      ) {
        requisicaoIA.current = null;
        setAnalisandoFoto(false);
      }
    }
  };

  const alterarEspecie = (novaEspecie: EspeciePet) => {
    if (novaEspecie !== especie) {
      setEspecie(novaEspecie);
      setRacaSelecionada(null);
    }
  };

  const handleSalvar = async () => {
    if (ocupado || salvamentoEmCurso.current) return;

    const raca = racaSelecionada?.nome.trim();

    if (
      !nome.trim() ||
      !peso.trim() ||
      !sexo ||
      !especie ||
      !raca
    ) {
      Alert.alert(
        'Atenção',
        'Preencha todos os campos obrigatórios!',
      );
      return;
    }

    const pesoNumerico = Number(peso.trim().replace(',', '.'));

    if (!Number.isFinite(pesoNumerico) || pesoNumerico <= 0) {
      Alert.alert('Atenção', 'Informe um peso válido maior que zero.');
      return;
    }

    if (raca.length > 50) {
      Alert.alert(
        'Atenção',
        'A raça deve ter no máximo 50 caracteres.',
      );
      return;
    }

    salvamentoEmCurso.current = true;
    setSalvando(true);

    versaoFoto.current += 1;

    try {
      const dadosTutor = await AsyncStorage.getItem('@tutor_clyvo');
      const tutor = dadosTutor ? JSON.parse(dadosTutor) : null;
      const tutorId = Number(tutor?.id);

      if (!Number.isInteger(tutorId) || tutorId <= 0) {
        Alert.alert(
          'Sessão expirada',
          'Faça login novamente para salvar o pet.',
        );
        return;
      }

      if (!telaAtiva.current) return;

      const ano = dataNascimento.getFullYear();
      const mes = String(dataNascimento.getMonth() + 1).padStart(2, '0');
      const dia = String(dataNascimento.getDate()).padStart(2, '0');

      const petPayload: PetPayload = {
        nome: nome.trim(),
        dataNascimento: `${ano}-${mes}-${dia}`,
        peso: pesoNumerico,
        sexo,
        raca,
        especie,
        descricao: descricao.trim(),
        fotoUrl: foto,
        tutorId,
      };

      await savePetMutation.mutateAsync(petPayload);
    } catch (erro) {
      if (!telaAtiva.current) return;

      let mensagem =
        'Não foi possível salvar o pet. Confira os dados e sua conexão.';

      if (axios.isAxiosError(erro)) {
        if (erro.response?.status === 401) {
          mensagem = 'Sua sessão expirou. Faça login novamente.';
        } else if (erro.response?.status === 403) {
          mensagem = 'Você não tem permissão para salvar esse pet.';
        } else {
          const mensagemServidor = erro.response?.data?.mensagem;

          if (
            erro.response?.status === 400 &&
            typeof mensagemServidor === 'string'
          ) {
            mensagem = mensagemServidor;
          }
        }
      }

      Alert.alert('Erro ao salvar', mensagem);
    } finally {
      salvamentoEmCurso.current = false;

      if (telaAtiva.current) {
        setSalvando(false);
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
          disabled={salvando}
          accessibilityLabel="Voltar"
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.roxoMuitoEscuro}
          />
        </TouchableOpacity>

        <Text style={styles.titulo}>
          {petParaEditar ? 'EDITAR PET' : 'CADASTRAR PET'}
        </Text>
      </View>

      <Text style={styles.labelSecao}>FOTO DO PET</Text>

      <View style={styles.boxFoto}>
        <TouchableOpacity
          style={[
            styles.botaoUpload,
            ocupado && styles.botaoDesabilitado,
          ]}
          onPress={escolherFoto}
          disabled={ocupado}
          accessibilityLabel="Escolher foto do pet"
        >
          {escolhendoFoto ? (
            <ActivityIndicator color={colors.roxoMuitoEscuro} />
          ) : (
            <MaterialCommunityIcons
              name="upload"
              size={20}
              color={colors.roxoMuitoEscuro}
            />
          )}
        </TouchableOpacity>

        {foto ? (
          <Image source={{ uri: foto }} style={styles.imagemPet} />
        ) : (
          <View style={styles.placeholderImagem}>
            <MaterialCommunityIcons
              name="camera-plus"
              size={40}
              color={colors.cinza}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.botaoIA,
          (!fotoParaIA || ocupado) && styles.botaoDesabilitado,
        ]}
        onPress={identificarComIA}
        disabled={!fotoParaIA || ocupado}
        accessibilityRole="button"
      >
        {analisandoFoto ? (
          <ActivityIndicator color={colors.branco} />
        ) : (
          <MaterialCommunityIcons
            name="auto-fix"
            size={22}
            color={colors.branco}
          />
        )}

        <Text style={styles.textoBotaoIA}>
          {analisandoFoto
            ? 'ANALISANDO FOTO...'
            : 'IDENTIFICAR COM IA'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.ajudaIA}>
        {fotoParaIA
          ? 'A IA sugere a espécie e a raça. Você confere antes de aplicar.'
          : 'Selecione uma foto na galeria para usar a identificação.'}
      </Text>

      <Text style={styles.labelSecao}>NOME DO PET</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="EX: REX"
          placeholderTextColor={colors.cinza}
          value={nome}
          onChangeText={setNome}
          editable={!salvando}
        />
      </View>

      <Text style={styles.labelSecao}>DATA DE NASCIMENTO</Text>

      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setMostraCalendario(true)}
        disabled={salvando}
      >
        <Text style={styles.input}>
          {dataNascimento.toLocaleDateString('pt-BR')}
        </Text>
      </TouchableOpacity>

      {mostraCalendario && (
        <DateTimePicker
          value={dataNascimento}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(_event, selectedDate) => {
            setMostraCalendario(false);

            if (selectedDate) {
              setDataNascimento(selectedDate);
            }
          }}
        />
      )}

      <Text style={styles.labelSecao}>PESO (KG)</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="EX: 5.5"
          placeholderTextColor={colors.cinza}
          value={peso}
          onChangeText={setPeso}
          keyboardType="decimal-pad"
          editable={!salvando}
        />
      </View>

      <Text style={styles.labelSecao}>SEXO</Text>

      <View style={styles.botoesEspecie}>
        <TouchableOpacity
          style={[
            styles.botaoEspecie,
            sexo === 'MACHO' && styles.botaoEspecieAtivo,
          ]}
          onPress={() => setSexo('MACHO')}
          disabled={salvando}
        >
          <MaterialCommunityIcons
            name="gender-male"
            size={20}
            color={
              sexo === 'MACHO'
                ? colors.branco
                : colors.roxoMuitoEscuro
            }
          />
          <Text
            style={[
              styles.textoEspecie,
              sexo === 'MACHO' && styles.textoAtivo,
            ]}
          >
            MACHO
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botaoEspecie,
            sexo === 'FEMEA' && styles.botaoEspecieAtivo,
          ]}
          onPress={() => setSexo('FEMEA')}
          disabled={salvando}
        >
          <MaterialCommunityIcons
            name="gender-female"
            size={20}
            color={
              sexo === 'FEMEA'
                ? colors.branco
                : colors.roxoMuitoEscuro
            }
          />
          <Text
            style={[
              styles.textoEspecie,
              sexo === 'FEMEA' && styles.textoAtivo,
            ]}
          >
            FÊMEA
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.labelSecao}>DESCRIÇÃO</Text>

      <View style={[styles.inputContainer, styles.inputDescricaoContainer]}>
        <TextInput
          style={[styles.input, styles.inputArea]}
          placeholder="Descreva a personalidade do pet..."
          placeholderTextColor={colors.cinza}
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={4}
          editable={!salvando}
        />
      </View>

      <Text style={styles.labelSecao}>ESPÉCIE</Text>

      <View style={styles.botoesEspecie}>
        <TouchableOpacity
          style={[
            styles.botaoEspecie,
            especie === 'CACHORRO' && styles.botaoEspecieAtivo,
          ]}
          onPress={() => alterarEspecie('CACHORRO')}
          disabled={ocupado}
        >
          <MaterialCommunityIcons
            name="dog"
            size={24}
            color={
              especie === 'CACHORRO'
                ? colors.branco
                : colors.roxoMuitoEscuro
            }
          />
          <Text
            style={[
              styles.textoEspecie,
              especie === 'CACHORRO' && styles.textoAtivo,
            ]}
          >
            CACHORRO
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botaoEspecie,
            especie === 'GATO' && styles.botaoEspecieAtivo,
          ]}
          onPress={() => alterarEspecie('GATO')}
          disabled={ocupado}
        >
          <MaterialCommunityIcons
            name="cat"
            size={24}
            color={
              especie === 'GATO'
                ? colors.branco
                : colors.roxoMuitoEscuro
            }
          />
          <Text
            style={[
              styles.textoEspecie,
              especie === 'GATO' && styles.textoAtivo,
            ]}
          >
            GATO
          </Text>
        </TouchableOpacity>
      </View>

      {especie && (
        <>
          <Text style={styles.labelSecao}>RAÇA</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRacas}>
             {DADOS_RACAS[especie].map((item: any, index: number) => (
               <TouchableOpacity 
                key={index} 
                style={[styles.tagRaca, racaSelecionada?.nome === item.nome && styles.tagRacaAtiva]}
                onPress={() => setRacaSelecionada(item)}
                >
          <Text style={[styles.textoRaca, racaSelecionada?.nome === item.nome && { color: colors.branco }]}>
              {item.nome}
           </Text>
          </TouchableOpacity>
        ))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Digite ou ajuste a raça"
              placeholderTextColor={colors.cinza}
              value={racaSelecionada?.nome ?? ''}
              maxLength={50}
              editable={!ocupado}
              onChangeText={(texto) => {
                setRacaSelecionada(
                  texto.trim() ? { nome: texto } : null,
                );
              }}
            />
          </View>

          <Text style={styles.ajudaIA}>
            Selecione uma opção acima ou informe a raça manualmente.
          </Text>
        </>
      )}

      <TouchableOpacity
        style={[
          styles.botaoCadastrar,
          ocupado && styles.botaoDesabilitado,
        ]}
        onPress={handleSalvar}
        disabled={ocupado}
      >
        {salvando ? (
          <ActivityIndicator color={colors.roxoMuitoEscuro} />
        ) : (
          <Text style={styles.textoBotaoCadastrar}>
            {petParaEditar ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR PET'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.branco,
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  botaoVoltar: {
    backgroundColor: colors.verdeMedio,
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  titulo: {
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
  },
  labelSecao: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.verdeMedio,
    marginBottom: 5,
    marginTop: 10,
  },
  boxFoto: {
    borderColor: colors.roxoMuitoEscuro,
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  botaoUpload: {
    backgroundColor: colors.verdeClaro,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  imagemPet: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  placeholderImagem: {
    width: 150,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.cinza,
  },
  botaoIA: {
    backgroundColor: colors.verdeEscuro,
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  textoBotaoIA: {
    color: colors.branco,
    fontWeight: 'bold',
    fontSize: 14,
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  ajudaIA: {
    color: colors.cinza,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 14,
  },
  inputContainer: {
    borderColor: colors.roxoMuitoEscuro,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 50,
    justifyContent: 'center',
  },
  input: {
    color: colors.roxoMuitoEscuro,
    fontWeight: 'bold',
    fontSize: 14,
  },
  inputDescricaoContainer: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  inputArea: {
    textAlignVertical: 'top',
    height: '100%',
  },
  botoesEspecie: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  botaoEspecie: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.roxoMuitoEscuro,
    borderWidth: 1,
    height: 50,
    borderRadius: 25,
  },
  botaoEspecieAtivo: {
    backgroundColor: colors.verdeEscuro,
    borderColor: colors.verdeEscuro,
  },
  textoEspecie: {
    fontWeight: 'bold',
    color: colors.roxoMuitoEscuro,
    marginLeft: 8,
  },
  textoAtivo: {
    color: colors.branco,
  },
  scrollRacas: {
    marginBottom: 12,
  },
  tagRaca: {
    borderColor: colors.verdeMedio,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    justifyContent: 'center',
  },
  tagRacaAtiva: {
    backgroundColor: colors.verdeMedio,
  },
  textoRaca: {
    color: colors.roxoMuitoEscuro,
    fontWeight: 'bold',
    fontSize: 12,
  },
  botaoCadastrar: {
    backgroundColor: colors.verdeClaro,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  textoBotaoCadastrar: {
    color: colors.roxoMuitoEscuro,
    fontWeight: '900',
    fontSize: 16,
  },
});