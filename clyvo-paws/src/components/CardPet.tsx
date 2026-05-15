import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Pet } from '../types';
import { colors } from '../theme/colors';

type Props = {
  pet: Pet;
};

export default function CardPet({ pet }: Props) {
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://via.placeholder.com/80' }} 
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
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
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