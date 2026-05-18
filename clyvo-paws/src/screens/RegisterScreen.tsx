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
import * as ImagePicker from 'expo-image-picker'; // <-- Import da biblioteca da Galeria
import { colors } from '../theme/colors';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [senha, setSenha] = useState('');
  const [foto, setFoto] = useState<string | null>(null); // <-- Novo estado para a foto

  // Função para abrir a galeria
  const escolherFoto = async () => {
    // 1. Pede permissão para acessar as fotos
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissao.status !== 'granted') {
      Alert.alert('Atenção', 'Precisamos de permissão para acessar sua galeria!');
      return;
    }

    // 2. Abre a galeria
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Só permite imagens
      allowsEditing: true, // Permite cortar a foto
      aspect: [4, 3], // Formato do corte
      quality: 1, // Qualidade máxima
    });

    // 3. Se o usuário escolheu uma foto, salva o caminho (URI) no estado
    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };

  const handleCadastrar = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Nome, Email e Senha são obrigatórios!');
      return;
    }

    // Adicionamos a foto ao objeto do Tutor
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
        {/* Adicionamos o onPress aqui para chamar a função de abrir galeria */}
        <TouchableOpacity style={styles.botaoUpload} onPress={escolherFoto}>
          <MaterialCommunityIcons name="upload" size={20} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
        
        {/* A imagem agora mostra a foto escolhida. Se não tiver, mostra a padrão */}
        <Image 
          source={{ uri: foto ? foto : 'https://img.freepik.com/vetores-gratis/homem-jovem-com-telefone-inteligente_23-2148506899.jpg' }} 
          style={styles.imagemPerfil} 
        />
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
  input: { borderColor: colors.roxoMuitoEscuro, borderWidth: 1, borderRadius: 25, height: 55, marginBottom: 20, color: colors.roxoMuitoEscuro, fontWeight: '900', fontSize: 14, textTransform: 'uppercase' },
  botaoCadastrar: { backgroundColor: colors.verdeClaro, borderRadius: 25, paddingVertical: 18, alignItems: 'center', marginTop: 10 },
  textoBotaoCadastrar: { color: colors.roxoMuitoEscuro, fontWeight: '900', fontSize: 18, textTransform: 'uppercase' }
});