import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Pet } from '../types';
import { colors } from '../theme/colors';

type Props = {
  pet: Pet;
};

export default function CardPet({ pet }: Props) {

  const fotoUri = pet.foto 
    ? pet.foto 
    : 'https://img.freepik.com/vetores-gratis/desenho-de-gato-e-cachorro-desenhado-a-mao_23-2150379255.jpg?w=150';

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: fotoUri }} 
        style={styles.imagemPet} 
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.nomePet}>{pet.nome}</Text>
        <Text style={styles.textoInfo}>Idade: {pet.idade}</Text>
        <Text style={styles.textoInfo}>Raça: {pet.raca}</Text>
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
  }
});