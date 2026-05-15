import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pet } from '../types';
import { colors } from '../theme/colors'; // <-- Importando nossas cores!

type Props = {
  pet: Pet;
};

export default function CardLembrete({ pet }: Props) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.tagNome}>
        <Text style={styles.textoNome}>{pet.nome}</Text>
      </View>

      {pet.lembretes.map((lembrete) => (
        <View key={lembrete.id} style={styles.linhaLembrete}>
          <View style={styles.bolinha} />
          <Text style={styles.textoLembrete}>
            {lembrete.tarefa} • {lembrete.horario}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.verdeEscuro,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  tagNome: {
    backgroundColor: colors.verdeClaro, 
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  textoNome: {
    color: colors.roxoMuitoEscuro, 
    fontWeight: '900',
    fontSize: 14,
  },
  linhaLembrete: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bolinha: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.verdeClaro,
    marginRight: 10,
  },
  textoLembrete: {
    color: colors.branco,
    fontWeight: 'bold',
    fontSize: 14,
  }
});