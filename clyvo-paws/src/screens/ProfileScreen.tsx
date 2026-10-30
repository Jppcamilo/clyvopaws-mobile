import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { CoresTema } from '../theme/colors';
import { useEstilosTema } from '../hooks/useEstilosTema';
import { usePerfil } from '../hooks/usePerfil';

export default function ProfileScreen() {
  const { colors, styles, modo } = useEstilosTema(criarEstilos);
  const {
    navigation, carregando, isError, tentarNovamente, nome, setNome, email, setEmail,
    cpf, setCpf, telefone, setTelefone, foto, escolherFoto, escolhendoFoto,
    updateMutation, deleteMutation, confirmarExclusao, handleSalvar
  } = usePerfil();
  const ocupado = updateMutation.isPending || deleteMutation.isPending || escolhendoFoto;

  if (carregando) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.destaque} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: colors.roxoMuitoEscuro, textAlign: 'center' }}>Não foi possível carregar os dados.</Text>
          <TouchableOpacity accessibilityRole="button" onPress={() => { void tentarNovamente(); }} style={{ padding: 16 }}>
            <Text style={{ color: colors.destaque, fontWeight: 'bold' }}>TENTAR NOVAMENTE</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={ocupado} style={{ padding: 16 }}>
          <Text style={{ color: colors.roxoMuitoEscuro }}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()} disabled={ocupado}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
        <Text style={styles.titulo}>DADOS PESSOAIS</Text>
      </View>

      <Text style={styles.descricao}>Mantenha seus dados atualizados para garantir a continuidade do cuidado do seu pet.</Text>

      <View style={styles.boxFotoCentral}>
        <Image 
          source={{ uri: foto ? foto : 'https://img.freepik.com/vetores-gratis/homem-jovem-com-telefone-inteligente_23-2148506899.jpg' }} 
          style={styles.imagemPerfil} 
        />
        <TouchableOpacity style={styles.botaoAlterarFoto} onPress={escolherFoto} disabled={ocupado}>
          <MaterialCommunityIcons name="camera-outline" size={20} color={colors.branco} />
          <Text style={styles.textoBotaoFoto}>Alterar Foto</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.labelSecao}>NOME COMPLETO</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="account-outline" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeInput} />
        <TextInput keyboardAppearance={modo} editable={!ocupado} style={styles.input} value={nome} onChangeText={setNome} placeholderTextColor={colors.cinza} />
      </View>

      <Text style={styles.labelSecao}>E-MAIL</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="email-outline" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeInput} />
        <TextInput keyboardAppearance={modo} editable={!ocupado} style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.cinza} />
      </View>

      <Text style={styles.labelSecao}>CPF</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="card-account-details-outline" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeInput} />
        <TextInput keyboardAppearance={modo} editable={!ocupado} style={styles.input} value={cpf} onChangeText={setCpf} keyboardType="numeric" placeholderTextColor={colors.cinza} />
      </View>

      <Text style={styles.labelSecao}>TELEFONE</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="phone-outline" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeInput} />
        <TextInput keyboardAppearance={modo} editable={!ocupado} style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" placeholderTextColor={colors.cinza} />
      </View>

      <TouchableOpacity 
        style={styles.botaoSalvar} 
        onPress={handleSalvar}
        disabled={ocupado}
      >
        {updateMutation.isPending ? (
          <ActivityIndicator color={colors.branco} />
        ) : (
          <Text style={styles.textoBotaoSalvar}>SALVAR ALTERAÇÕES</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.botaoDeletar} 
        onPress={confirmarExclusao}
        disabled={ocupado}
      >
        {deleteMutation.isPending ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.textoBotaoDeletar}>EXCLUIR CONTA</Text>
        )}
      </TouchableOpacity>
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const criarEstilos = (colors: CoresTema) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.superficie, 
    paddingHorizontal: 20, 
    paddingTop: 50 },
  header: { 
    marginBottom: 20 },
  botaoVoltar: { 
    backgroundColor: colors.verdeMedio, 
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20 },
  titulo: { 
    fontSize: 22, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro },
  descricao: { 
    fontSize: 14, 
    color: colors.cinza, 
    marginBottom: 20, 
    fontWeight: 'bold' },
  boxFotoCentral: { 
    alignItems: 'center', 
    marginBottom: 30 },
  imagemPerfil: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: colors.superficieSecundaria, 
    marginBottom: 10 },
  botaoAlterarFoto: { 
    flexDirection: 'row', 
    backgroundColor: colors.verdeEscuro, 
    paddingHorizontal: 15, 
    paddingVertical: 8, 
    borderRadius: 20, 
    alignItems: 'center' },
  textoBotaoFoto: { 
    color: colors.branco, 
    fontWeight: 'bold', 
    marginLeft: 5 },
  labelSecao: { 
    fontSize: 14, 
    fontWeight: '900', 
    color: colors.destaque, 
    marginBottom: 5 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderColor: colors.borda, 
    borderWidth: 1, 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    marginBottom: 20, 
    height: 50 },
  iconeInput: { 
    marginRight: 10 },
  input: { 
    flex: 1, 
    color: colors.roxoMuitoEscuro, 
    fontWeight: 'bold', 
    fontSize: 14 },
  botaoSalvar: { 
    backgroundColor: colors.verdeEscuro, 
    borderRadius: 25, 
    paddingVertical: 15, 
    alignItems: 'center', 
    marginTop: 10 },
  textoBotaoSalvar: { 
    color: colors.branco, 
    fontWeight: '900', 
    fontSize: 16 },
  botaoDeletar: { 
    backgroundColor: colors.perigoFundo, 
    borderRadius: 25, 
    paddingVertical: 15, 
    alignItems: 'center', 
    marginTop: 15, 
    marginBottom: 40 
  },
  textoBotaoDeletar: { 
    color: '#FFF', 
    fontWeight: '900', 
    fontSize: 16 
  }
});
