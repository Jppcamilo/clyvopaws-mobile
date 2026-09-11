import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Linking,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors } from '../theme/colors';
import api from '../services/api';

const clinicasDB: { [key: string]: { clinicaId: number, veterinarioId: number } } = {
  'Clínica Paws Care Matriz': { clinicaId: 1, veterinarioId: 1 },
  'Hospital Veterinário Vida Animal': { clinicaId: 2, veterinarioId: 2 },
  'Pet Care Morumbi': { clinicaId: 3, veterinarioId: 3 }
};

export default function ConsultasScreen() {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const [modalVisivel, setModalVisivel] = useState(false);
  const [clinicaSelecionada, setClinicaSelecionada] = useState('');
  const [veterinarioAtual, setVeterinarioAtual] = useState<number | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [motivo, setMotivo] = useState('');
  const [petSelecionado, setPetSelecionado] = useState<number | null>(null);

  const abrirWhatsApp = (numero: string, nomeClinica: string) => {
    const numeroLimpo = numero.replace(/\D/g, ''); 
    const mensagem = `Olá ${nomeClinica}! Sou do app Clyvo VET e gostaria de marcar uma consulta para o meu pet.`; 
    
    const url = `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;

    Linking.openURL(url).catch((err) => {
      console.error('Erro ao abrir o WhatsApp', err);
      Alert.alert('Erro', 'Não foi possível redirecionar para o WhatsApp.');
    });
  };

  const agendarMutation = useMutation({
    mutationFn: async (dadosAgendamento: any) => {
      const response = await api.post('/agendamentos', dadosAgendamento);
      return response.data;
    },
    onSuccess: () => {
      Alert.alert('Sucesso!', `Sua consulta na ${clinicaSelecionada} foi registrada no sistema!`);
      setModalVisivel(false);
      setHorarioSelecionado('');
      setMotivo('');
      queryClient.invalidateQueries({ queryKey: ['agendamentos-pet'] });
    },
    onError: (error) => {
      console.error('Erro ao agendar:', error);
      Alert.alert('Erro', 'Não foi possível registrar o agendamento no sistema.');
    }
  });

  const { data: listaPets = [] } = useQuery({
    queryKey: ['meus-pets'],
    queryFn: async () => {
      const response = await api.get('/pets');
      return response.data;
    }
  });

  const { data: listaAgendas = [], isFetching: carregandoAgendas } = useQuery({
    queryKey: ['agendas', veterinarioAtual],
    queryFn: async () => {
      if (!veterinarioAtual) return [];
      const response = await api.get(`/agendas/veterinario/${veterinarioAtual}`);
      return response.data;
    },
    enabled: !!veterinarioAtual,
  });

  const formatarDataHora = (dataString: string) => {
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes} às ${horas}:${minutos}`;
  };

  const abrirModalAgendamento = (nomeClinica: string) => {
    setClinicaSelecionada(nomeClinica);
    setVeterinarioAtual(clinicasDB[nomeClinica]?.veterinarioId || null);
    
    setHorarioSelecionado('');
    setMotivo('');
    setPetSelecionado(null);
    setModalVisivel(true);
  };

  const handleAgendarApp = () => {
    if (!horarioSelecionado) {
      Alert.alert('Atenção', 'Por favor, selecione um horário disponível.');
      return;
    }
    if (!petSelecionado) {
      Alert.alert('Atenção', 'Por favor, selecione qual pet será consultado.');
      return;
    }
    if (!motivo.trim()) {
      Alert.alert('Atenção', 'Preencha o motivo da consulta.');
      return;
    }

    const dadosClinica = clinicasDB[clinicaSelecionada];

    agendarMutation.mutate({
      dataHora: horarioSelecionado,
      titulo: `Consulta na ${clinicaSelecionada}`,
      descricao: motivo,
      status: 'AGENDADA',
      consultaId: null,
      petId: petSelecionado,
      clinicaId: dadosClinica.clinicaId,  
      veterinarioId: dadosClinica.veterinarioId 
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.branco }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
          </TouchableOpacity>
        </View>

        <Text style={styles.titulo}>CONSULTAS</Text>
        <Text style={styles.subtitulo}>CLINICAS PARA MARCAR CONSULTAS</Text>

        <View style={styles.listaClinicas}>
          
         <View style={styles.cardClinica}>
            <View style={styles.tagNome}>
              <Text style={styles.textoTag}>Clínica Paws Care Matriz</Text>
            </View>
            <Text style={styles.textoDescricao}>
              Atendimento com Dr. Carlos Silva. Infraestrutura completa para o seu pet.
            </Text>
            <View style={styles.boxBotoesAcao}>
              <TouchableOpacity style={styles.botaoAcaoApp} onPress={() => abrirModalAgendamento('Clínica Paws Care Matriz')}>
                <MaterialCommunityIcons name="calendar-check" size={18} color={colors.roxoMuitoEscuro} />
                <Text style={styles.textoBotaoAcaoApp}>PELO APP</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoAcaoWhats} onPress={() => abrirWhatsApp('5511999724459', 'Clínica Paws Care Matriz')}>
                <MaterialCommunityIcons name="whatsapp" size={18} color={colors.branco} />
                <Text style={styles.textoBotaoAcaoWhats}>WHATSAPP</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.cardClinica}>
            <View style={styles.tagNome}>
              <Text style={styles.textoTag}>Hospital Veterinário Vida Animal</Text>
            </View>
            <Text style={styles.textoDescricao}>
              Emergências 24h e consultas especializadas com a Dra. Patricia Lima.
            </Text>
            <View style={styles.boxBotoesAcao}>
              <TouchableOpacity style={styles.botaoAcaoApp} onPress={() => abrirModalAgendamento('Hospital Veterinário Vida Animal')}>
                <MaterialCommunityIcons name="calendar-check" size={18} color={colors.roxoMuitoEscuro} />
                <Text style={styles.textoBotaoAcaoApp}>PELO APP</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoAcaoWhats} onPress={() => abrirWhatsApp('5511999724459', 'Hospital Veterinário Vida Animal')}>
                <MaterialCommunityIcons name="whatsapp" size={18} color={colors.branco} />
                <Text style={styles.textoBotaoAcaoWhats}>WHATSAPP</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.cardClinica}>
            <View style={styles.tagNome}>
              <Text style={styles.textoTag}>Pet Care Morumbi</Text>
            </View>
            <Text style={styles.textoDescricao}>
              Check-ups e vacinação com o Dr. Marcos Santos. Conforto e qualidade.
            </Text>
            <View style={styles.boxBotoesAcao}>
              <TouchableOpacity style={styles.botaoAcaoApp} onPress={() => abrirModalAgendamento('Pet Care Morumbi')}>
                <MaterialCommunityIcons name="calendar-check" size={18} color={colors.roxoMuitoEscuro} />
                <Text style={styles.textoBotaoAcaoApp}>PELO APP</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoAcaoWhats} onPress={() => abrirWhatsApp('5511999724459', 'Pet Care Morumbi')}>
                <MaterialCommunityIcons name="whatsapp" size={18} color={colors.branco} />
                <Text style={styles.textoBotaoAcaoWhats}>WHATSAPP</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>AGENDAR CONSULTA</Text>
            <Text style={styles.modalSubtitulo}>{clinicaSelecionada}</Text>

            {/* 👇 Nova Seleção de Horários (Veio do Banco) */}
            <Text style={styles.modalLabel}>SELECIONE O HORÁRIO:</Text>
            {carregandoAgendas ? (
              <ActivityIndicator color={colors.verdeMedio} style={{ marginBottom: 15 }} />
            ) : listaAgendas.length === 0 ? (
              <Text style={{ color: colors.cinza, marginBottom: 15, fontSize: 12 }}>
                Nenhum horário disponível no momento.
              </Text>
            ) : (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.scrollPets}
              >
                {listaAgendas.map((agenda: any) => (
                  <TouchableOpacity
                    key={agenda.id}
                    style={[
                      styles.petChip,
                      horarioSelecionado === agenda.dataHoraInicio && styles.petChipAtivo
                    ]}
                    onPress={() => setHorarioSelecionado(agenda.dataHoraInicio)}
                  >
                    <Text style={[
                      styles.textoPetChip,
                      horarioSelecionado === agenda.dataHoraInicio && styles.textoPetChipAtivo
                    ]}>
                      {formatarDataHora(agenda.dataHoraInicio)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input} 
                placeholder="Motivo (Ex: Vacina, Check-up...)"
                placeholderTextColor={colors.cinza}
                value={motivo}
                onChangeText={setMotivo}
              />
            </View>

            <Text style={styles.modalLabel}>SELECIONE O PET:</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.scrollPets}
            >
              {listaPets.map((pet: any) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[
                    styles.petChip,
                    petSelecionado === pet.id && styles.petChipAtivo
                  ]}
                  onPress={() => setPetSelecionado(pet.id)}
                >
                  <Text style={[
                    styles.textoPetChip,
                    petSelecionado === pet.id && styles.textoPetChipAtivo
                  ]}>
                    {pet.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.botaoConfirmarModal} 
              onPress={handleAgendarApp}
              disabled={agendarMutation.isPending}
            >
              {agendarMutation.isPending ? (
                <ActivityIndicator color={colors.roxoMuitoEscuro} />
              ) : (
                <Text style={styles.textoBotaoConfirmar}>CONFIRMAR AGENDAMENTO</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.botaoCancelarModal} 
              onPress={() => setModalVisivel(false)}
              disabled={agendarMutation.isPending}
            >
              <Text style={styles.textoBotaoCancelar}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    marginBottom: 30,
    alignItems: 'flex-start',
  },
  botaoVoltar: {
    backgroundColor: colors.verdeMedio,
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
    marginBottom: 30,
    textTransform: 'uppercase',
  },
  subtitulo: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  listaClinicas: {
    marginTop: 10,
  },
  cardClinica: {
    backgroundColor: colors.verdeEscuro,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tagNome: {
    backgroundColor: colors.verdeClaro,
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
  },
  textoTag: {
    color: colors.roxoMuitoEscuro,
    fontWeight: '900',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  textoDescricao: {
    color: colors.branco,
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  boxBotoesAcao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  botaoAcaoApp: {
    flex: 1,
    backgroundColor: colors.verdeClaro,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
  },
  textoBotaoAcaoApp: {
    color: colors.roxoMuitoEscuro,
    fontWeight: '900',
    fontSize: 12,
    marginLeft: 5,
  },
  botaoAcaoWhats: {
    flex: 1,
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
  },
  textoBotaoAcaoWhats: {
    color: colors.branco,
    fontWeight: '900',
    fontSize: 12,
    marginLeft: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.branco,
    width: '100%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
    marginBottom: 5,
  },
  modalSubtitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.verdeMedio,
    marginBottom: 25,
  },
  inputContainer: {
    width: '100%',
    borderColor: colors.roxoMuitoEscuro,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 50,
    justifyContent: 'center',
    marginBottom: 15,
  },
  input: {
    color: colors.roxoMuitoEscuro,
    fontWeight: 'bold',
    fontSize: 14,
  },
  botaoConfirmarModal: {
    backgroundColor: colors.verdeClaro,
    width: '100%',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  textoBotaoConfirmar: {
    color: colors.roxoMuitoEscuro,
    fontWeight: '900',
    fontSize: 14,
  },
  botaoCancelarModal: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  textoBotaoCancelar: {
    color: '#FF3B30',
    fontWeight: 'bold',
    fontSize: 14,
  },

  modalLabel: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '900',
    color: colors.verdeMedio,
    marginBottom: 10,
    marginTop: 5,
  },

  scrollPets: {
    flexDirection: 'row',
    marginBottom: 20,
    maxHeight: 50,
    width: '100%',
  },

  petChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  petChipAtivo: {
    backgroundColor: colors.verdeClaro,
    borderColor: colors.roxoMuitoEscuro,
    borderWidth: 1,
  },

  textoPetChip: {
    color: colors.cinza,
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
  },

  textoPetChipAtivo: {
    color: colors.roxoMuitoEscuro,
    fontWeight: '900',
  },
});