import React, { useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { colors } from '../theme/colors';
import CardPet from '../components/CardPet';
import { Pet } from '../types';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PetsScreen() {
  const navigation = useNavigation<any>();

const { data: listaPets = [], isLoading: carregando, refetch } = useQuery({
    queryKey: ['meus-pets'],
    queryFn: async () => {
      const dadosTutor = await AsyncStorage.getItem('@tutor_clyvo');
      const tutor = dadosTutor ? JSON.parse(dadosTutor) : null;

      if (!tutor || !tutor.id) return [];

      const response = await api.get(`/pets/tutor/${tutor.id}`);
      return response.data;
    }
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
        <Text style={styles.titulo}>MEUS PETS</Text>
      </View>

      <Text style={styles.subtitulo}>ACOMPANHE TODOS OS ANIMAIS CADASTRADOS NA SUA CONTA</Text>

      {carregando ? (
        <View style={styles.containerCentro}>
          <ActivityIndicator size="large" color={colors.verdeEscuro} />
        </View>
      ) : listaPets.length > 0 ? (
        <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
          {listaPets.map((pet: Pet) => (
            <TouchableOpacity 
              key={pet.id} 
              activeOpacity={0.7}
              onPress={() => navigation.navigate('PetDetails', { petId: pet.id })}
            >
              <CardPet pet={pet} />
            </TouchableOpacity>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      ) : (
        <View style={styles.containerCentro}>
          <MaterialCommunityIcons name="paw-off" size={60} color={colors.cinza} />
          <Text style={styles.textoVazio}>Nenhum pet cadastrado ainda.</Text>
          <Text style={styles.subtextoVazio}>Adicione o seu primeiro companheiro clicando no botão abaixo.</Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.botaoFlutuante} 
        onPress={() => navigation.navigate('PetForm')}
      >
        <MaterialCommunityIcons name="plus" size={28} color={colors.branco} />
        <Text style={styles.textoBotaoFlutuante}>CADASTRAR NOVO PET</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.branco, 
    paddingHorizontal: 20, 
    paddingTop: 50 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  botaoVoltar: { 
    backgroundColor: colors.verdeMedio, 
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  titulo: { 
    fontSize: 22, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro 
  },
  subtitulo: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: colors.cinza, 
    marginBottom: 30, 
    textTransform: 'uppercase' 
  },
  scrollList: { 
    flex: 1, 
    marginBottom: 90 
  },
  containerCentro: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 30, 
    marginBottom: 100 
  },
  textoVazio: { 
    fontSize: 16, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro, 
    marginTop: 15, 
    marginBottom: 5 
  },
  subtextoVazio: { 
    fontSize: 12, 
    color: colors.cinza, 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },
  botaoFlutuante: { 
    position: 'absolute', 
    bottom: 30, 
    left: 20, 
    right: 20, 
    backgroundColor: colors.verdeEscuro, 
    borderRadius: 25, 
    paddingVertical: 15, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.23, 
    shadowRadius: 2.62 
  },
  textoBotaoFlutuante: { 
    color: colors.branco, 
    fontWeight: '900', 
    fontSize: 16, 
    marginLeft: 8 
  },
});