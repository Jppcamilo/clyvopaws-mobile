import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import { Calendar, LocaleConfig } from 'react-native-calendars';
import * as Notifications from 'expo-notifications';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import { colors } from '../theme/colors';
import { DADOS_RACAS } from '../data/racas';
import { calcularIdade } from '../utils/dateUtils';
import api from '../services/api'; 

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  } as Notifications.NotificationBehavior),
});

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export default function PetDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { petId } = route.params;
  const queryClient = useQueryClient(); 

  const [lembretes, setLembretes] = useState<any[]>([]);
  const [datasMarcadas, setDatasMarcadas] = useState<any>({});
  const [racaInfo, setRacaInfo] = useState<any>(null);
  
  // 1. Busca os Dados do Pet
  const { data: pet, isLoading: carregandoPet } = useQuery({
    queryKey: ['pet-details', petId],
    queryFn: async () => {
      const response = await api.get(`/pets/${petId}`);
      return response.data;
    }
  });

  // 👇 2. NOVA BUSCA: Traz os agendamentos reais do banco!
  const { data: agendamentos, isLoading: carregandoAgendamentos } = useQuery({
    queryKey: ['agendamentos-pet', petId],
    queryFn: async () => {
      const response = await api.get(`/agendamentos/pet/${petId}`);
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/pets/${petId}`);
    },
    onSuccess: () => {
      Alert.alert('Sucesso', 'Pet removido com sucesso.');
      queryClient.invalidateQueries({ queryKey: ['meus-pets'] });
      navigation.goBack(); 
    },
    onError: (error) => {
      console.error('Erro ao excluir pet:', error);
      Alert.alert('Erro', 'Não foi possível excluir o pet. Tente novamente.');
    }
  });

  // Atualiza as Raças
  useEffect(() => {
    if (pet) {
      let dadosMedicos = DADOS_RACAS.CACHORRO.find((r: any) => r.nome === pet.raca);
      if (!dadosMedicos) {
        dadosMedicos = DADOS_RACAS.GATO.find((r: any) => r.nome === pet.raca);
      }
      setRacaInfo(dadosMedicos);
    }
  }, [pet]);


useEffect(() => {
    if (!agendamentos) return;

    let marcacoes: any = {};
    const hoje = new Date();
    const dataHojeString = hoje.toISOString().split('T')[0];

    const lembretesFormatados = agendamentos.map((ag: any) => {
      const dataCompleta = new Date(ag.dataHora);
      const dataStr = dataCompleta.toISOString().split('T')[0];
      const horarioStr = `${String(dataCompleta.getHours()).padStart(2, '0')}:${String(dataCompleta.getMinutes()).padStart(2, '0')}`;
      
      return {
         data: dataStr,
         tarefa: ag.titulo,
         horario: horarioStr
      };
    });

    setLembretes(lembretesFormatados);

    lembretesFormatados.forEach((lembrete: any) => {
      if (lembrete.data) {
        marcacoes[lembrete.data] = { marked: true, dotColor: colors.verdeMedio };
      }
    });

    marcacoes[dataHojeString] = {
      ...marcacoes[dataHojeString],
      selected: true,
      selectedColor: colors.verdeMedio,
      marked: marcacoes[dataHojeString]?.marked || false,
      dotColor: colors.branco
    };

    setDatasMarcadas(marcacoes);
  }, [agendamentos]);

  const ativarAlertas = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Atenção', 'Você precisa permitir as notificações para receber os lembretes do seu pet.');
      return;
    }

    let agendados = 0;

    for (const lembrete of lembretes) {
      if (lembrete.data && lembrete.horario) {
        const [ano, mes, dia] = lembrete.data.split('-').map(Number);
        const [hora, minuto] = lembrete.horario.split(':').map(Number);

        const dataConsulta = new Date(ano, mes - 1, dia, hora, minuto);
        const dataAlarme = new Date(dataConsulta.getTime() - 2 * 60 * 60 * 1000);

        if (dataAlarme > new Date()) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "🐾 Lembrete de Consulta!",
              body: `A consulta do ${pet?.nome} está chegando! Não se esqueça.`,
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: dataAlarme,
            },
          });
          agendados++;
        }
      }
    }

    if (agendados > 0) {
      Alert.alert('Sucesso!', `Foram ativados ${agendados} alertas para os próximos compromissos do(a) ${pet?.nome}. Você será avisado 2h antes.`);
    } else {
      Alert.alert('Aviso', 'Não há compromissos futuros para agendar alertas.');
    }
  };

  const handleExcluirPet = () => {
    Alert.alert(
      'Excluir Pet',
      `Tem certeza de que deseja remover o(a) ${pet?.nome} da família Clyvo?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteMutation.mutate()
        }
      ]
    );
  };

  if (carregandoPet || carregandoAgendamentos) {
    return (
      <View style={styles.containerCentro}>
        <ActivityIndicator size="large" color={colors.verdeEscuro} />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.containerCentro}>
        <Text style={styles.textoVazio}>Pet não encontrado.</Text>
        <TouchableOpacity style={styles.botaoVoltarErro} onPress={() => navigation.goBack()}>
          <Text style={styles.textoBotaoVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

const fotoUri = pet.foto || pet.fotoUrl || 'https://img.freepik.com/vetores-gratis/desenho-de-gato-e-cachorro-desenhado-a-mao_23-2150379255.jpg?w=150';
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
        
        <View style={{ flexDirection: 'row' }}>
          
          <TouchableOpacity 
            style={styles.botaoEditar} 
            onPress={() => navigation.navigate('PetForm', { pet: pet })}
          >
            <MaterialCommunityIcons name="pencil-outline" size={24} color={colors.verdeEscuro} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.botaoDeletar} 
            onPress={handleExcluirPet}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <ActivityIndicator color="#FF3B30" />
            ) : (
              <MaterialCommunityIcons name="trash-can-outline" size={24} color="#FF3B30" />
            )}
          </TouchableOpacity>
          
        </View>
      </View>

      <Text style={styles.nomePet}>{pet.nome}</Text>
      
      <View style={styles.infoContainer}>
        <Image source={{ uri: fotoUri }} style={styles.imagemPet} />
        <View style={styles.dadosContainer}>
          <Text style={styles.dadoTexto}><Text style={styles.dadoLabel}>Idade:</Text> {calcularIdade(pet.dataNascimento)}</Text>
          <Text style={styles.dadoTexto}><Text style={styles.dadoLabel}>Raça:</Text> {pet.raca}</Text>
          <Text style={styles.dadoTexto}><Text style={styles.dadoLabel}>Peso:</Text> {pet.peso ? `${pet.peso} kg` : 'Não informado'}</Text>
          <Text style={styles.dadoTexto}><Text style={styles.dadoLabel}>Sexo:</Text> {pet.sexo || 'Não informado'}</Text>
        </View>
      </View>

      {racaInfo && (
        <TouchableOpacity 
          style={styles.botaoPreventivo}
          onPress={() => navigation.navigate('InfoRaca', { racaData: racaInfo })}
        >
          <MaterialCommunityIcons name="shield-check" size={24} color={colors.branco} style={{ marginRight: 10 }} />
          <Text style={styles.textoBotaoPreventivo}>VER PLANO PREVENTIVO</Text>
        </TouchableOpacity>
      )}

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>DESCRIÇÃO</Text>
        <Text style={styles.textoDescricao}>
          {pet.descricao ? pet.descricao : "Nenhuma descrição cadastrada para este pet."}
        </Text>
      </View>

      <View style={styles.secao}>
        <View style={styles.headerCalendario}>
          <Text style={styles.tituloSecao}>CALENDÁRIO</Text>
          <TouchableOpacity>
            <Text style={styles.textoAbrir}>Abrir {'>'}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.containerCalendarioEscuro}>
          <Calendar
            markedDates={datasMarcadas}
            theme={{
              backgroundColor: '#2C2C2E',
              calendarBackground: '#2C2C2E',
              textSectionTitleColor: '#8E8E93',
              selectedDayBackgroundColor: colors.verdeMedio,
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: colors.verdeMedio,
              dayTextColor: '#FFFFFF',
              textDisabledColor: '#48484A',
              dotColor: colors.verdeMedio,
              selectedDotColor: '#FFFFFF',
              arrowColor: '#FFFFFF',
              monthTextColor: '#FFFFFF',
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12
            }}
          />
        </View>
      </View>

      <View style={styles.secao}>
        <View style={styles.headerTituloIcone}>
          <Text style={styles.tituloSecao}>STATUS DO PET</Text>
          <TouchableOpacity onPress={ativarAlertas} style={styles.botaoSininho}>
            <MaterialCommunityIcons name="bell-ring-outline" size={20} color={colors.roxoMuitoEscuro} />
            <Text style={styles.textoSininho}>Alertas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardStatus}>
          <Text style={styles.tituloCardStatus}>VACINAS / LEMBRETES</Text>
          <Text style={styles.subtituloCardStatus}>Pendente</Text>
          
          {lembretes && lembretes.length > 0 ? (
            lembretes.map((lembrete, index) => {
              const dataQuebrada = lembrete.data ? lembrete.data.split('-') : [];
              const dataFormatada = dataQuebrada.length === 3 ? `${dataQuebrada[2]}/${dataQuebrada[1]}` : '';

              return (
                <View key={index} style={styles.itemLembrete}>
                  <View style={styles.bolinhaVerde} />
                  <Text style={styles.textoLembrete}>
                    {dataFormatada} - {lembrete.tarefa} ({lembrete.horario})
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={styles.itemLembrete}>
              <View style={styles.bolinhaVerde} />
              <Text style={styles.textoLembrete}>Nenhuma pendência</Text>
            </View>
          )}
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerCentro: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: colors.branco 
  },
  textoVazio: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: colors.roxoMuitoEscuro, 
    marginBottom: 20 
  },
  botaoVoltarErro: { 
    backgroundColor: colors.verdeMedio, 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20 
  },
  textoBotaoVoltar: { 
    color: colors.roxoMuitoEscuro, 
    fontWeight: 'bold' 
  },
  container: { 
    flex: 1, 
    backgroundColor: colors.branco, 
    paddingHorizontal: 20, 
    paddingTop: 50 
  },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  botaoVoltar: { 
    backgroundColor: colors.verdeMedio, 
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  botaoEditar: { 
    backgroundColor: '#E8F5E9', 
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 10 
  },
  
  botaoDeletar: { 
    backgroundColor: '#FFECEB', 
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  
  nomePet: { 
    fontSize: 22, 
    fontWeight: '900', 
    color: colors.verdeEscuro, 
    textTransform: 'uppercase', 
    marginBottom: 15 
  },
  infoContainer: { 
    flexDirection: 'row', 
    marginBottom: 20 
  },
  imagemPet: { 
    width: 140, 
    height: 100, 
    borderRadius: 10, 
    marginRight: 15 
  },
  dadosContainer: { 
    justifyContent: 'center', 
    flex: 1 
  },
  dadoTexto: { 
    fontSize: 14, 
    color: colors.roxoMuitoEscuro, 
    marginBottom: 5, 
    fontWeight: 'bold' 
  },
  dadoLabel: { 
    fontWeight: '900' 
  },
  botaoPreventivo: { 
    flexDirection: 'row', 
    backgroundColor: colors.verdeEscuro, 
    paddingVertical: 12, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 25 
  },
  textoBotaoPreventivo: { 
    color: colors.branco, 
    fontWeight: '900', 
    fontSize: 14, 
    textTransform: 'uppercase' 
  },
  secao: { 
    marginBottom: 30 
  },
  headerCalendario: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  headerTituloIcone: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  botaoSininho: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.verdeClaro,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  textoSininho: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.roxoMuitoEscuro,
    marginLeft: 4,
  },
  tituloSecao: { 
    fontSize: 16, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro, 
    textTransform: 'uppercase' 
  },
  textoAbrir: { 
    color: colors.cinza, 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  textoDescricao: { 
    fontSize: 14, 
    color: colors.roxoMuitoEscuro, 
    fontWeight: 'bold', 
    lineHeight: 20 
  },
  containerCalendarioEscuro: { 
    backgroundColor: '#2C2C2E', 
    borderRadius: 15, 
    overflow: 'hidden', 
    paddingBottom: 10, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0, 
      height: 2 
    }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84 
  },
  cardStatus: { 
    borderColor: colors.roxoMuitoEscuro, 
    borderWidth: 1, 
    borderRadius: 15, 
    padding: 15, 
    backgroundColor: 
    colors.branco 
  },
  tituloCardStatus: { 
    fontSize: 14, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro, 
    marginBottom: 5 
  },
  subtituloCardStatus: { 
    fontSize: 14, 
    fontWeight: '900', 
    color: colors.verdeMedio, 
    marginBottom: 10 
  },
  itemLembrete: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 5 
  },
  bolinhaVerde: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: colors.verdeMedio, 
    marginRight: 10 
  },
  textoLembrete: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: colors.verdeMedio 
  }
});