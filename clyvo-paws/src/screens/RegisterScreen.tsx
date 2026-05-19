import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Alert 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; 
import { colors } from '../theme/colors';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [senha, setSenha] = useState('');
  const [foto, setFoto] = useState<string | null>(null); 

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

  const handleCadastrar = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Nome, Email e Senha são obrigatórios!');
      return;
    }

    const novoTutor = { nome, cpf, telefone, email, endereco, senha, foto };

    try {
      await AsyncStorage.setItem('@tutor_clyvo', JSON.stringify(novoTutor));
      Alert.alert('Sucesso!', 'Cadastro realizado. Faça o login para entrar.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar seu cadastro.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
        <Text style={styles.titulo}>CADASTRO</Text>
      </View>

      <Text style={styles.labelSecao}>FOTO</Text>
      <View style={styles.boxFoto}>
        <TouchableOpacity style={styles.botaoUpload} onPress={escolherFoto}>
          <MaterialCommunityIcons name="upload" size={20} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
        
        {/* 👇 AQUI: Trocamos o link do freepik pelo placeholder profissional */}
        {foto ? (
          <Image source={{ uri: foto }} style={styles.imagemPerfil} />
        ) : (
          <View style={styles.placeholderImagem}>
            <MaterialCommunityIcons name="account-circle-outline" size={40} color={colors.cinza} />
            <Text style={styles.textoPlaceholder}>Adicionar Foto</Text>
          </View>
        )}
      </View>

      <Text style={styles.labelSecao}>NOME</Text>
      <TextInput style={styles.input} placeholder="NOME COMPLETO" placeholderTextColor={colors.roxoMuitoEscuro} value={nome} onChangeText={setNome} textAlign="center" />

      <Text style={styles.labelSecao}>CPF</Text>
      <TextInput style={styles.input} placeholder="000.000.000-00" placeholderTextColor={colors.roxoMuitoEscuro} value={cpf} onChangeText={setCpf} keyboardType="numeric" textAlign="center" />

      <Text style={styles.labelSecao}>TELEFONE</Text>
      <TextInput style={styles.input} placeholder="+55 11 90000-0000" placeholderTextColor={colors.roxoMuitoEscuro} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" textAlign="center" />

      <Text style={styles.labelSecao}>EMAIL</Text>
      <TextInput style={styles.input} placeholder="SEU@EMAIL.COM" placeholderTextColor={colors.roxoMuitoEscuro} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" textAlign="center" />

      <Text style={styles.labelSecao}>ENDEREÇO</Text>
      <TextInput style={styles.input} placeholder="RUA TAL, 1002" placeholderTextColor={colors.roxoMuitoEscuro} value={endereco} onChangeText={setEndereco} textAlign="center" />

      <Text style={styles.labelSecao}>SENHA</Text>
      <TextInput style={styles.input} placeholder="CRIE SUA SENHA" placeholderTextColor={colors.roxoMuitoEscuro} value={senha} onChangeText={setSenha} secureTextEntry textAlign="center" />

      <TouchableOpacity style={styles.botaoCadastrar} onPress={handleCadastrar}>
        <Text style={styles.textoBotaoCadastrar}>CADASTRAR</Text>
      </TouchableOpacity>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.branco, paddingHorizontal: 20, paddingTop: 50 },
  header: { marginBottom: 30, alignItems: 'flex-start' },
  botaoVoltar: { backgroundColor: colors.verdeMedio, width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  titulo: { fontSize: 20, fontWeight: '900', color: colors.roxoMuitoEscuro, textTransform: 'uppercase' },
  labelSecao: { fontSize: 14, fontWeight: '900', color: colors.verdeMedio, marginBottom: 5 },
  boxFoto: { borderColor: colors.roxoMuitoEscuro, borderWidth: 1, borderRadius: 20, padding: 15, alignItems: 'center', marginBottom: 20 },
  botaoUpload: { backgroundColor: colors.verdeClaro, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 10 },
  imagemPerfil: { width: 180, height: 120, borderRadius: 10, backgroundColor: '#E0E0E0' },
  
  
  placeholderImagem: { width: 180, height: 120, borderRadius: 10, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: colors.cinza },
  textoPlaceholder: { color: colors.cinza, fontSize: 12, fontWeight: 'bold', marginTop: 5 },
  
  input: { borderColor: colors.roxoMuitoEscuro, borderWidth: 1, borderRadius: 25, height: 55, marginBottom: 20, color: colors.roxoMuitoEscuro, fontWeight: '900', fontSize: 14, textTransform: 'uppercase' },
  botaoCadastrar: { backgroundColor: colors.verdeClaro, borderRadius: 25, paddingVertical: 18, alignItems: 'center', marginTop: 10 },
  textoBotaoCadastrar: { color: colors.roxoMuitoEscuro, fontWeight: '900', fontSize: 18, textTransform: 'uppercase' }
});