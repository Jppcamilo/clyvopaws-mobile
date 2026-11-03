import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCarrinho } from '../hooks/useCarrinho';
import { useEstilosTema } from '../hooks/useEstilosTema';
import type { CoresTema } from '../theme/colors';

export default function BotaoCarrinho() {
  const navigation = useNavigation<any>();
  const { quantidadeTotal } = useCarrinho();
  const { colors, styles } = useEstilosTema(criarEstilos);
  return (
    <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Carrinho')}
      accessibilityRole="button" accessibilityLabel={`Abrir carrinho, ${quantidadeTotal} itens`}>
      <MaterialCommunityIcons name="cart-outline" size={24} color={colors.destaque} />
      <Text style={styles.texto}>Carrinho</Text>
      {quantidadeTotal > 0 && <View style={styles.contador}><Text style={styles.numero}>{quantidadeTotal > 99 ? '99+' : quantidadeTotal}</Text></View>}
    </TouchableOpacity>
  );
}
const criarEstilos = (colors: CoresTema) => StyleSheet.create({
  botao: { minHeight: 46, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12,
    borderRadius: 24, borderWidth: 1, borderColor: colors.borda, backgroundColor: colors.superficie },
  texto: { color: colors.destaque, fontWeight: '800', fontSize: 13 },
  contador: { minWidth: 23, padding: 4, borderRadius: 14, backgroundColor: colors.verdeEscuro, alignItems: 'center' },
  numero: { color: colors.textoSobreVerde, fontSize: 11, fontWeight: '900' },
});
