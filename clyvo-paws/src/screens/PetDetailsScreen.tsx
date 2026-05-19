import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { colors } from '../theme/colors';
import { Pet } from '../types';

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export default function PetDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { petId } = route.params;

  const [pet, setPet] = useState<Pet | null>(null);
  const [carregando, setCarregando] = useState(true);
  
  const [lembretes, setLembretes] = useState<any[]>([]);
  const [datasMarcadas, setDatasMarcadas] = useState<any>({});

  useEffect(() => {
    const carregarPet = async () => {
      try {
        const dadosTutor = await AsyncStorage.getItem('@tutor_clyvo');
        
        if (dadosTutor) {
          const tutor = JSON.parse(dadosTutor);
          const chavePets = `@pets_${tutor.email}`; 

          const petsSalvos = await AsyncStorage.getItem(chavePets);
          if (petsSalvos) {
            const listaPets: Pet[] = JSON.parse(petsSalvos);
            const petEncontrado = listaPets.find(p => p.id === petId);
            
            if (petEncontrado) {
              setPet(petEncontrado);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do pet:', error);
      } finally {
        setCarregando(false);
      }
    };

    carregarPet();
  }, [petId]);

  if (carregando) {
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

  const fotoUri = pet.foto || 'https://img.freepik.com/vetores-gratis/desenho-de-gato-e-cachorro-desenhado-a-mao_23-2150379255.jpg?w=150';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
      </View>

      <Text style={styles.nomePet}>{pet.nome}</Text>
      
      <View style={styles.infoContainer}>
        <Image source={{ uri: fotoUri }} style={styles.imagemPet} />
        <View style={styles.dadosContainer}>
          <Text style={styles.dadoTexto}><Text style={styles.dadoLabel}>Idade:</Text> {pet.idade}</Text>
          <Text style={styles.dadoTexto}><Text style={styles.dadoLabel}>Raça:</Text> {pet.raca}</Text>
        </View>
      </View>

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
        <Text style={styles.tituloSecao}>STATUS DO PET</Text>
        <View style={styles.cardStatus}>
          <Text style={styles.tituloCardStatus}>VACINAS / LEMBRETES</Text>
          <Text style={styles.subtituloCardStatus}>Pendente</Text>
          
          {pet.lembretes && pet.lembretes.length > 0 ? (
            pet.lembretes.map((lembrete, index) => (
              <View key={index} style={styles.itemLembrete}>
                <View style={styles.bolinhaVerde} />
                <Text style={styles.textoLembrete}>{lembrete.tarefa} - {lembrete.horario}</Text>
              </View>
            ))
          ) : (
            <View style={styles.itemLembrete}>
              <View style={styles.bolinhaVerde} />
              <Text style={styles.textoLembrete}>Nenhuma pendência</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>LAUDO MÉDICO</Text>
        
        <View style={styles.cardClinica}>
          <Text style={styles.nomeClinica}>Clínica Amigo Fiel</Text>
          
          <View style={styles.cardLaudo}>
            <View style={styles.laudoTextos}>
              <Text style={styles.tituloLaudo}>LAUDO MEDICO</Text>
              <View style={styles.linhaFalsa} />
              <View style={styles.linhaFalsaCurta} />
            </View>
            <TouchableOpacity style={styles.botaoDownload}>
              <MaterialCommunityIcons name="download" size={20} color={colors.roxoMuitoEscuro} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerCentro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.branco },
  textoVazio: { fontSize: 18, fontWeight: 'bold', color: colors.roxoMuitoEscuro, marginBottom: 20 },
  botaoVoltarErro: { backgroundColor: colors.verdeMedio, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  textoBotaoVoltar: { color: colors.roxoMuitoEscuro, fontWeight: 'bold' },
  container: { flex: 1, backgroundColor: colors.branco, paddingHorizontal: 20, paddingTop: 50 },
  header: { marginBottom: 20 },
  botaoVoltar: { backgroundColor: colors.verdeMedio, width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  nomePet: { fontSize: 22, fontWeight: '900', color: colors.verdeEscuro, textTransform: 'uppercase', marginBottom: 15 },
  infoContainer: { flexDirection: 'row', marginBottom: 25 },
  imagemPet: { width: 140, height: 100, borderRadius: 10, marginRight: 15 },
  dadosContainer: { justifyContent: 'center', flex: 1 },
  dadoTexto: { fontSize: 14, color: colors.roxoMuitoEscuro, marginBottom: 5, fontWeight: 'bold' },
  dadoLabel: { fontWeight: '900' },
  secao: { marginBottom: 30 },
  headerCalendario: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  tituloSecao: { fontSize: 16, fontWeight: '900', color: colors.roxoMuitoEscuro, textTransform: 'uppercase' },
  textoAbrir: { color: colors.cinza, fontWeight: 'bold', fontSize: 14 },
  textoDescricao: { fontSize: 14, color: colors.roxoMuitoEscuro, fontWeight: 'bold', lineHeight: 20 },
  containerCalendarioEscuro: { backgroundColor: '#2C2C2E', borderRadius: 15, overflow: 'hidden', paddingBottom: 10, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  cardStatus: { borderColor: colors.roxoMuitoEscuro, borderWidth: 1, borderRadius: 15, padding: 15, backgroundColor: colors.branco },
  tituloCardStatus: { fontSize: 14, fontWeight: '900', color: colors.roxoMuitoEscuro, marginBottom: 5 },
  subtituloCardStatus: { fontSize: 14, fontWeight: '900', color: colors.verdeMedio, marginBottom: 10 },
  itemLembrete: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  bolinhaVerde: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.verdeMedio, marginRight: 10 },
  textoLembrete: { fontSize: 14, fontWeight: 'bold', color: colors.verdeMedio },
  cardClinica: { backgroundColor: colors.verdeMedio, borderRadius: 20, padding: 20, marginBottom: 15 },
  nomeClinica: { fontSize: 14, fontWeight: '900', color: colors.roxoMuitoEscuro, marginBottom: 15 },
  cardLaudo: { backgroundColor: colors.verdeEscuro, borderRadius: 15, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  laudoTextos: { flex: 1, marginRight: 10 },
  tituloLaudo: { fontSize: 14, fontWeight: '900', color: colors.roxoMuitoEscuro, marginBottom: 5 },
  linhaFalsa: { height: 4, backgroundColor: colors.verdeClaro, borderRadius: 2, marginBottom: 3, width: '100%' },
  linhaFalsaCurta: { height: 4, backgroundColor: colors.verdeClaro, borderRadius: 2, width: '60%' },
  botaoDownload: { backgroundColor: colors.verdeClaro, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }
});