import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useEstilosTema } from '../hooks/useEstilosTema';
import type { CoresTema, ModoTema } from '../theme/colors';

const opcoes: { modo: ModoTema; titulo: string }[] = [
  { modo: 'light', titulo: 'CLARO' },
  { modo: 'dark', titulo: 'ESCURO' },
];

export default function SeletorTema() {
  const { modo, alterarTema, erroTema, styles } = useEstilosTema(criarEstilos);
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>APARÊNCIA</Text>
      <View style={styles.opcoes}>
        {opcoes.map((opcao) => (
          <TouchableOpacity
            key={opcao.modo}
            accessibilityRole="radio"
            accessibilityState={{ checked: modo === opcao.modo }}
            accessibilityLabel={`Tema ${opcao.titulo.toLowerCase()}`}
            onPress={() => { void alterarTema(opcao.modo); }}
            style={[styles.opcao, modo === opcao.modo && styles.selecionada]}
          >
            <Text style={[styles.texto, modo === opcao.modo && styles.textoSelecionado]}>
              {opcao.titulo}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {erroTema && <Text accessibilityRole="alert" style={styles.erro}>{erroTema}</Text>}
    </View>
  );
}

const criarEstilos = (colors: CoresTema) => StyleSheet.create({
  container: { marginVertical: 16 },
  titulo: { color: colors.roxoMuitoEscuro, fontWeight: 'bold', marginBottom: 8 },
  opcoes: { flexDirection: 'row', gap: 12 },
  opcao: {
    flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.borda, borderRadius: 16,
    backgroundColor: colors.superficieSecundaria,
  },
  selecionada: { backgroundColor: colors.verdeEscuro, borderColor: colors.destaque },
  texto: { color: colors.roxoMuitoEscuro, fontWeight: 'bold' },
  textoSelecionado: { color: colors.textoSobreVerde },
  erro: { color: colors.erro, marginTop: 8 },
});
