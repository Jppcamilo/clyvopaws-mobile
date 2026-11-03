import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEstilosTema } from '../hooks/useEstilosTema';
import type { CoresTema } from '../theme/colors';
import { LIMITE_QUANTIDADE } from '../services/carrinhoService';

type Props = { quantidade: number; onChange: (valor: number) => void; desabilitado?: boolean; nome?: string; maximo?: number };

export default function SeletorQuantidade({ quantidade, onChange, desabilitado = false, nome = 'produto', maximo = LIMITE_QUANTIDADE }: Props) {
  const { colors, styles } = useEstilosTema(criarEstilos);
  const menos = desabilitado || quantidade <= 1;
  const mais = desabilitado || quantidade >= maximo;
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.botao, menos && styles.desabilitado]} disabled={menos} onPress={() => onChange(quantidade - 1)}
        accessibilityRole="button" accessibilityLabel={`Diminuir quantidade de ${nome}`} accessibilityState={{ disabled: menos }}>
        <MaterialCommunityIcons name="minus" size={20} color={colors.destaque} />
      </TouchableOpacity>
      <Text style={styles.numero} accessibilityLabel={`${quantidade} unidades de ${nome}`} accessibilityLiveRegion="polite">{quantidade}</Text>
      <TouchableOpacity style={[styles.botao, mais && styles.desabilitado]} disabled={mais} onPress={() => onChange(quantidade + 1)}
        accessibilityRole="button" accessibilityLabel={`Aumentar quantidade de ${nome}`} accessibilityState={{ disabled: mais }}>
        <MaterialCommunityIcons name="plus" size={20} color={colors.destaque} />
      </TouchableOpacity>
    </View>
  );
}
const criarEstilos = (colors: CoresTema) => StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, backgroundColor: colors.superficieSecundaria, alignSelf: 'flex-start' },
  botao: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  numero: { minWidth: 30, textAlign: 'center', fontSize: 16, fontWeight: '800', color: colors.roxoMuitoEscuro },
  desabilitado: { opacity: 0.35 },
});
