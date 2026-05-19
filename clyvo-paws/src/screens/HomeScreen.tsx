import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { colors } from '../theme/colors';
import CardLembrete from '../components/CardLembrete';
import PopPerfil from '../components/PopPerfil';
import PopPets from '../components/PopPets';
import { Pet } from '../types';

export default function HomeScreen() {
  const navigation = useNavigation<any>(); 

  const [modalPerfilVisivel, setModalPerfilVisivel] = useState(false);
  const [modalPetsVisivel, setModalPetsVisivel] = useState(false);
  
  const [nomeTutor, setNomeTutor] = useState('');
  const [fotoTutor, setFotoTutor] = useState<string | null>(null);
  const [listaPets, setListaPets] = useState<Pet[]>([]);

  const carregarDados = async () => {
    try {
      const dadosTutor = await AsyncStorage.getItem('@tutor_clyvo');
      if (dadosTutor) {
        const tutor = JSON.parse(dadosTutor);
        setNomeTutor(tutor.nome ? tutor.nome.split(' ')[0] : 'Tutor'); 
        setFotoTutor(tutor.foto);

        const chavePets = `@pets_${tutor.email}`;
        const petsSalvos = await AsyncStorage.getItem(chavePets);
        
        if (petsSalvos) {
          setListaPets(JSON.parse(petsSalvos));
        } else {
          setListaPets([]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados na Home:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const temLembretes = listaPets.some(pet => pet.lembretes && pet.lembretes.length > 0);
  const imagemExibicao = fotoTutor ? { uri: fotoTutor } : { uri: 'https://img.freepik.com/vetores-gratis/homem-jovem-com-telefone-inteligente_23-2148506899.jpg' };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setModalPerfilVisivel(true)}>
          <Image source={imagemExibicao} style={styles.fotoPerfil} />
        </TouchableOpacity>
        <View style={styles.containerSaudacao}>
          <Text style={styles.labelMenu}>Menu Principal</Text>
          <Text style={styles.tituloNome}>Olá, {nomeTutor}</Text>
        </View>
      </View>

      {temLembretes ? (
        <View style={styles.secaoLembretes}>
          <Text style={styles.tituloSecao}>LEMBRETE DO DIA</Text>
          {listaPets.map(pet => {
            if (!pet.lembretes || pet.lembretes.length === 0) return null;
            return <CardLembrete key={pet.id} pet={pet} />;
          })}
        </View>
      ) : (
        <View style={styles.secaoVazia}>
          <Text style={styles.textoVazio}>Nenhum lembrete para hoje! 🎉</Text>
        </View>
      )}

      <Text style={styles.tituloSecao}>MAIS ACESSADOS</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollIcones}>
        <TouchableOpacity style={styles.itemIconeScroll} onPress={() => navigation.navigate('RedeClinica')}>
          <View style={styles.circuloIcone}>
              <MaterialCommunityIcons name="home-outline" size={30} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.legendaIcone}>REDE{"\n"}CLINICA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemIconeScroll} onPress={() => setModalPetsVisivel(true)}>
          <View style={styles.circuloIcone}>
            <MaterialCommunityIcons name="paw" size={30} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.legendaIcone}>MEUS PETS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemIconeScroll} onPress={() => navigation.navigate('MeusMedicamentos')}>
          <View style={styles.circuloIcone}>
            <MaterialCommunityIcons name="file-document-outline" size={30} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.legendaIcone}>MEUS{"\n"}MEDICAMENTOS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemIconeScroll} onPress={() => navigation.navigate('Consultas')}>
          <View style={styles.circuloIcone}>
            <MaterialCommunityIcons name="calendar-clock" size={30} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.legendaIcone}>AGENDAR{"\n"}CONSULTA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemIconeScroll} onPress={() => navigation.navigate('Servicos')}>
          <View style={styles.circuloIcone}>
            <MaterialCommunityIcons name="dots-horizontal" size={30} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.legendaIcone}>VER{"\n"}SERVIÇOS</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.bannerPets} onPress={() => setModalPetsVisivel(true)}>
        <View style={styles.textoBanner}>
          <Text style={styles.tituloBanner}>PETS</Text>
          <Text style={styles.subtituloBanner}>VEJA SEUS PETS E{"\n"}CADASTRE ELES AQUI</Text>
        </View>
        <View style={styles.circuloSeta}>
          <MaterialCommunityIcons name="arrow-right" size={24} color={colors.roxoMuitoEscuro} />
        </View>
      </TouchableOpacity>

      <View style={styles.containerDuplo}>
        <TouchableOpacity style={styles.boxPequeno} onPress={() => navigation.navigate('RedeClinica')}>
          <MaterialCommunityIcons name="home-city-outline" size={24} color={colors.roxoMuitoEscuro} />
          <Text style={styles.tituloBox}>CLINICAS{"\n"}PERTO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boxPequeno} onPress={() => navigation.navigate('MeusMedicamentos')}>
          <MaterialCommunityIcons name="pill" size={24} color={colors.roxoMuitoEscuro} />
          <Text style={styles.tituloBox}>MEDICAMENTOS</Text>
        </TouchableOpacity>
      </View>

      <PopPerfil visivel={modalPerfilVisivel} fecharModal={() => setModalPerfilVisivel(false)} nomeTutor={nomeTutor} fotoTutor={fotoTutor} />
      <PopPets visivel={modalPetsVisivel} fecharModal={() => setModalPetsVisivel(false)} listaPets={listaPets} />
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.branco, paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 50 },

  fotoPerfil: { width: 90, height: 90, borderRadius: 45, marginRight: 20, backgroundColor: '#E0E0E0' },
  containerSaudacao: { justifyContent: 'center' },
  labelMenu: { color: colors.verdeMedio, fontWeight: 'bold', fontSize: 17 },
  tituloNome: { fontSize: 25, fontWeight: '900', color: colors.roxoMuitoEscuro },
  
  secaoLembretes: { marginBottom: 45 },
  secaoVazia: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 15, marginBottom: 45, alignItems: 'center' },
  textoVazio: { color: colors.cinza, fontWeight: 'bold' },
  tituloSecao: { fontSize: 18, fontWeight: '900', color: colors.roxoMuitoEscuro, marginBottom: 20 },
  
  scrollIcones: { flexDirection: 'row', marginBottom: 50, marginHorizontal: -20, paddingHorizontal: 20 },
  itemIconeScroll: { alignItems: 'center', width: 85, marginRight: 10 },
  circuloIcone: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.verdeEscuro, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  legendaIcone: { textAlign: 'center', fontSize: 10, fontWeight: '900', color: colors.roxoMuitoEscuro },
  
  bannerPets: { backgroundColor: colors.verdeEscuro, borderRadius: 20, padding: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 },
  textoBanner: { flex: 1 },
  tituloBanner: { backgroundColor: colors.verdeClaro, alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 4, borderRadius: 15, fontSize: 16, fontWeight: '900', color: colors.roxoMuitoEscuro, marginBottom: 10 },
  subtituloBanner: { color: colors.verdeClaro, fontSize: 10, fontWeight: '900' },
  circuloSeta: { backgroundColor: colors.verdeMedio, width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  
  containerDuplo: { flexDirection: 'row', justifyContent: 'space-between' },
  boxPequeno: { backgroundColor: colors.verdeEscuro, width: '47%', borderRadius: 15, padding: 15, height: 100, justifyContent: 'space-between' },
  tituloBox: { color: colors.verdeClaro, fontSize: 12, fontWeight: '900' }
});