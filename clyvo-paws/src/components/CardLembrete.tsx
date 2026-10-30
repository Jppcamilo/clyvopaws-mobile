import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Pet } from '../types';
import type { CoresTema } from '../theme/colors';
import { useEstilosTema } from '../hooks/useEstilosTema';

type Props = {
  pet: Pet;
};

export default function CardLembrete({ pet }: Props) {
  const { colors, styles, modo } = useEstilosTema(criarEstilos);
  const lembretes = pet.lembretes ?? [];

  return (
    <View style={styles.cardContainer}>
      <View style={styles.tagNome}>
        <Text style={styles.textoNome}>{pet.nome}</Text>
      </View>

      {lembretes.length === 0 && (
        <Text style={styles.textoLembrete}>Nenhum lembrete informado.</Text>
      )}

      {lembretes.map((lembrete, index) => (
        <View key={index} style={styles.lembrete}>
          <View style={styles.bolinha} />
          <Text style={styles.textoLembrete}>
            {lembrete.tarefa} • {lembrete.horario}
          </Text>
        </View>
      ))}
    </View>
  );
}

const criarEstilos = (colors: CoresTema) => StyleSheet.create({
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
  lembrete: {
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

