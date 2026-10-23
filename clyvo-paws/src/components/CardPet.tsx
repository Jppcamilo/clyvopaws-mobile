import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import type { Pet } from '../types';
import { colors } from '../theme/colors';
import { calcularIdade } from '../utils/dateUtils';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  pet: Pet;
};

export default function CardPet({ pet }: Props) {

  const fotoUri: string =
    pet.fotoUrl ||
    'https://img.freepik.com/vetores-gratis/desenho-de-gato-e-cachorro-desenhado-a-mao_23-2150379255.jpg?w=150';

  const sexo = pet.sexo?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const sexoInformado = sexo === 'MACHO' || sexo === 'FEMEA';

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: fotoUri }} 
        style={styles.imagemPet} 
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.nomePet} numberOfLines={2}>{pet.nome}</Text>
        <Text style={styles.textoInfo}>Idade: {pet.dataNascimento ? calcularIdade(pet.dataNascimento) : 'Não informada'}</Text>
        <Text style={styles.textoInfo}>Raça: {pet.raca || 'Não informada'}</Text>
        <View style={styles.containerSexo}>
          <MaterialCommunityIcons 
            name={sexo === 'MACHO' ? 'gender-male' : sexo === 'FEMEA' ? 'gender-female' : 'help-circle-outline'}
            size={14} 
            color={colors.roxoMuitoEscuro} 
          />
          <Text style={styles.textoSexo}>{sexoInformado ? (sexo === 'MACHO' ? 'Macho' : 'Fêmea') : 'Não informado'}</Text>
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
