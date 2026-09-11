import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Pet } from '../types';
import { colors } from '../theme/colors';
import { calcularIdade } from '../utils/dateUtils';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';

type Props = {
  pet: Pet;
};

export default function CardPet({ pet }: Props) {

  const fotoUri: string =
    pet.foto ||
    pet.fotoUrl ||
    'https://img.freepik.com/vetores-gratis/desenho-de-gato-e-cachorro-desenhado-a-mao_23-2150379255.jpg?w=150';

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: fotoUri }} 
        style={styles.imagemPet} 
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.nomePet}>{pet.nome}</Text>
        <Text style={styles.textoInfo}>Idade: {calcularIdade(pet.dataNascimento)}</Text>
        <Text style={styles.textoInfo}>Raça: {pet.raca}</Text>
        <View style={styles.containerSexo}>
          <MaterialCommunityIcons 
            name={pet.sexo === 'MACHO' ? 'gender-male' : 'gender-female'} 
            size={14} 
            color={colors.roxoMuitoEscuro} 
          />
          <Text style={styles.textoSexo}>{pet.sexo || 'N/A'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    backgroundColor: colors.branco,
    borderColor: colors.roxoMuitoEscuro,
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center', 
  },
  imagemPet: {
    width: 60,
    height: 60,
    borderRadius: 30, 
    marginRight: 15, 
    backgroundColor: '#E0E0E0',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nomePet: {
    color: colors.verdeEscuro,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  textoInfo: {
    color: colors.roxoMuitoEscuro,
    fontSize: 12,
    fontWeight: 'bold',
  },
  containerSexo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 4,
    backgroundColor: colors.verdeClaro, 
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start'
  },
  textoSexo: { 
    fontSize: 10, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro, 
    marginLeft: 4,
    textTransform: 'uppercase'
  }
});