import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [foto, setFoto] = useState<string | null>(null);

  useEffect(() => {
    const carregarDadosPerfil = async () => {
      try {
        const dadosSalvos = await AsyncStorage.getItem('@tutor_clyvo');
        if (dadosSalvos) {
          const tutor = JSON.parse(dadosSalvos);
          setNome(tutor.nome || '');
          setEmail(tutor.email || '');
          setCpf(tutor.cpf || '');
          setTelefone(tutor.telefone || '');
          setEndereco(tutor.endereco || '');
          setFoto(tutor.foto || null);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil', error);
      }
    };
    carregarDadosPerfil();
  }, []);

  const escolherFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissao.status !== 'granted') {
      Alert.alert('Atenção', 'Precisamos de permissão para acessar sua galeria!');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };

  const handleSalvar = async () => {
    if (!nome.trim() || !email.trim()) {
      Alert.alert('Atenção', 'Nome e E-mail são obrigatórios!');
      return;
    }

    try {
      // Pega a senha antiga para não apagar
      const dadosAntigos = await AsyncStorage.getItem('@tutor_clyvo');
      const senhaAntiga = dadosAntigos ? JSON.parse(dadosAntigos).senha : '';

      const dadosTutor = { nome, email, cpf, telefone, endereco, foto, senha: senhaAntiga };
      await AsyncStorage.setItem('@tutor_clyvo', JSON.stringify(dadosTutor));
      Alert.alert('Sucesso!', 'Seus dados foram atualizados com sucesso.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
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
        <TouchableOpacity style={styles.botaoAlterarFoto} onPress={escolherFoto}>
          <MaterialCommunityIcons name="camera-outline" size={20} color={colors.branco} />
          <Text style={styles.textoBotaoFoto}>Alterar Foto</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.labelSecao}>NOME COMPLETO</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="account-outline" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeInput} />
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholderTextColor={colors.cinza} />
      </View>

      <Text style={styles.labelSecao}>E-MAIL</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="email-outline" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeInput} />
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.cinza} />
      </View>

      <Text style={styles.labelSecao}>CPF</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="card-account-details-outline" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeInput} />
        <TextInput style={styles.input} value={cpf} onChangeText={setCpf} keyboardType="numeric" placeholderTextColor={colors.cinza} />
      </View>

      <Text style={styles.labelSecao}>TELEFONE</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="phone-outline" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeInput} />
        <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" placeholderTextColor={colors.cinza} />
      </View>

      <Text style={styles.labelSecao}>ENDEREÇO</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="map-marker-outline" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeInput} />
        <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholderTextColor={colors.cinza} />
      </View>

      <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
        <Text style={styles.textoBotaoSalvar}>SALVAR ALTERAÇÕES</Text>
      </TouchableOpacity>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.branco, paddingHorizontal: 20, paddingTop: 50 },
  header: { marginBottom: 20 },
  botaoVoltar: { backgroundColor: colors.verdeMedio, width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  titulo: { fontSize: 22, fontWeight: '900', color: colors.roxoMuitoEscuro },
  descricao: { fontSize: 14, color: colors.cinza, marginBottom: 20, fontWeight: 'bold' },
  boxFotoCentral: { alignItems: 'center', marginBottom: 30 },
  imagemPerfil: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E0E0E0', marginBottom: 10 },
  botaoAlterarFoto: { flexDirection: 'row', backgroundColor: colors.verdeEscuro, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, alignItems: 'center' },
  textoBotaoFoto: { color: colors.branco, fontWeight: 'bold', marginLeft: 5 },
  labelSecao: { fontSize: 14, fontWeight: '900', color: colors.verdeMedio, marginBottom: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderColor: colors.roxoMuitoEscuro, borderWidth: 1, borderRadius: 20, paddingHorizontal: 15, marginBottom: 20, height: 50 },
  iconeInput: { marginRight: 10 },
  input: { flex: 1, color: colors.roxoMuitoEscuro, fontWeight: 'bold', fontSize: 14 },
  botaoSalvar: { backgroundColor: colors.verdeEscuro, borderRadius: 25, paddingVertical: 15, alignItems: 'center', marginTop: 10, marginBottom: 40 },
  textoBotaoSalvar: { color: colors.branco, fontWeight: '900', fontSize: 16 }
});