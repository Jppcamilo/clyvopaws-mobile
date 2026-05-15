import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // <-- Import novo para a navegação
import { colors } from '../theme/colors';
import CardLembrete from '../components/CardLembrete';
import PopPerfil from '../components/PopPerfil';
import PopPets from '../components/PopPets';
import { Pet } from '../types';

export default function HomeScreen() {
  const navigation = useNavigation<any>(); // Hook para conseguirmos mudar de tela

  const [modalPerfilVisivel, setModalPerfilVisivel] = useState(false);
  const [modalPetsVisivel, setModalPetsVisivel] = useState(false);
  const [nomeTutor, setNomeTutor] = useState('João Pedro');

  const [listaPets, setListaPets] = useState<Pet[]>([
    {
      id: '1',
      nome: 'DESTRUIDOR DE PLANETAS',
      idade: '5 MESES',
      raca: 'GATO LARANJA',
      lembretes: [
        { id: '101', tarefa: 'TOMAR VACINA V10', horario: 'EM 3 DIAS' },
        { id: '102', tarefa: 'REMEDIO DE PULGA', horario: 'AS 19 HORAS' },
      ]
    },
    {
      id: '2',
      nome: 'PRINCESA',
      idade: '2 ANOS',
      raca: 'PITBULL',
      lembretes: [
        { id: '201', tarefa: 'CIRURGIA', horario: 'AMANHÃ' },
        { id: '202', tarefa: 'REMEDIO DE PULGA', horario: 'AS 19 HORAS' },
      ]
    }
  ]);

  // Lógica: Verifica se existe pelo menos UM pet que tenha algum lembrete pendente
  const temLembretes = listaPets.some(pet => pet.lembretes && pet.lembretes.length > 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setModalPerfilVisivel(true)}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/50' }} 
            style={styles.fotoPerfil} 
          />
        </TouchableOpacity>
        <View style={styles.containerSaudacao}>
          <Text style={styles.labelMenu}>Menu Principal</Text>
          <Text style={styles.tituloNome}>Olá, {nomeTutor}</Text>
        </View>
      </View>

      {/* SEÇÃO: Lembretes do Dia (RENDERIZAÇÃO CONDICIONAL) */}
      {/* Só vai aparecer na tela se a variável "temLembretes" for verdadeira */}
      {temLembretes && (
        <View style={styles.secaoLembretes}>
          <Text style={styles.tituloSecao}>LEMBRETE DO DIA</Text>
          {listaPets.map(pet => {
            // Se esse pet específico não tiver lembrete, a gente pula ele
            if (!pet.lembretes || pet.lembretes.length === 0) return null;
            return <CardLembrete key={pet.id} pet={pet} />;
          })}
        </View>
      )}

      {/* SEÇÃO: Mais Acessados (COM SCROLL HORIZONTAL) */}
      <Text style={styles.tituloSecao}>MAIS ACESSADOS</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.scrollIcones}
      >
        <TouchableOpacity style={styles.itemIconeScroll}>
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

        <TouchableOpacity style={styles.itemIconeScroll}>
          <View style={styles.circuloIcone}>
            <MaterialCommunityIcons name="file-document-outline" size={30} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.legendaIcone}>MEUS{"\n"}MEDICAMENTOS</Text>
        </TouchableOpacity>

        {/* + 1 Adicional que você pediu */}
        <TouchableOpacity style={styles.itemIconeScroll}>
          <View style={styles.circuloIcone}>
            <MaterialCommunityIcons name="calendar-clock" size={30} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.legendaIcone}>AGENDAR{"\n"}CONSULTA</Text>
        </TouchableOpacity>

        {/* Botão que leva para a tela de Serviços */}
        <TouchableOpacity 
          style={styles.itemIconeScroll} 
          onPress={() => navigation.navigate('Servicos')}
        >
          <View style={styles.circuloIcone}>
            <MaterialCommunityIcons name="dots-horizontal" size={30} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.legendaIcone}>VER{"\n"}SERVIÇOS</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* BANNER: Pets Cadastro */}
      <TouchableOpacity style={styles.bannerPets} onPress={() => setModalPetsVisivel(true)}>
        <View style={styles.textoBanner}>
          <Text style={styles.tituloBanner}>PETS</Text>
          <Text style={styles.subtituloBanner}>VEJA SEUS PETS E{"\n"}CADASTRE ELES AQUI</Text>
        </View>
        <View style={styles.circuloSeta}>
          <MaterialCommunityIcons name="arrow-right" size={24} color={colors.roxoMuitoEscuro} />
        </View>
      </TouchableOpacity>

      {/* BOXES: Clinicas e Medicamentos */}
      <View style={styles.containerDuplo}>
        <TouchableOpacity style={styles.boxPequeno}>
          <MaterialCommunityIcons name="home-city-outline" size={24} color={colors.roxoMuitoEscuro} />
          <Text style={styles.tituloBox}>CLINICAS{"\n"}PERTO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boxPequeno}>
          <MaterialCommunityIcons name="pill" size={24} color={colors.roxoMuitoEscuro} />
          <Text style={styles.tituloBox}>MEDICAMENTOS</Text>
        </TouchableOpacity>
      </View>

      <PopPerfil 
        visivel={modalPerfilVisivel} 
        fecharModal={() => setModalPerfilVisivel(false)} 
        nomeTutor={nomeTutor}
      />

      <PopPets 
        visivel={modalPetsVisivel} 
        fecharModal={() => setModalPetsVisivel(false)} 
        listaPets={listaPets}
      />

      <View style={{ height: 100 }} />
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.branco,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
  },
  fotoPerfil: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  containerSaudacao: {
    justifyContent: 'center',
  },
  labelMenu: {
    color: colors.verdeMedio,
    fontWeight: 'bold',
    fontSize: 12,
  },
  tituloNome: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
  },
  secaoLembretes: {
    marginBottom: 55,
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
    marginBottom: 20,
  },

  scrollIcones: {
    flexDirection: 'row',
    marginBottom: 60,
    marginHorizontal: -20, 
    paddingHorizontal: 20, 
  },
  itemIconeScroll: {
    alignItems: 'center',
    width: 85, 
    marginRight: 10, 
  },
  circuloIcone: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.verdeEscuro,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendaIcone: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
  },
  bannerPets: {
    backgroundColor: colors.verdeEscuro,
    borderRadius: 20,
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  textoBanner: {
    flex: 1,
  },
  tituloBanner: {
    backgroundColor: colors.verdeClaro,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 15,
    fontSize: 16,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
    marginBottom: 10,
  },
  subtituloBanner: {
    color: colors.verdeClaro,
    fontSize: 10,
    fontWeight: '900',
  },
  circuloSeta: {
    backgroundColor: colors.verdeMedio,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerDuplo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boxPequeno: {
    backgroundColor: colors.verdeEscuro,
    width: '47%',
    borderRadius: 15,
    padding: 15,
    height: 100,
    justifyContent: 'space-between',
  },
  tituloBox: {
    color: colors.verdeClaro,
    fontSize: 12,
    fontWeight: '900',
  }
});