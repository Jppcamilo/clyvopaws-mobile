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

export default function PetFormScreen() {
  const navigation = useNavigation<any>();

  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [raca, setRaca] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState<string | null>(null);

  const voltarSeguro = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs'); 
    }
  };

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
    if (!nome.trim() || !idade.trim() || !raca.trim()) {
      Alert.alert('Atenção', 'Preencha o nome, idade e raça do seu pet!');
      return;
    }

    // 🛠️ LÓGICA NOVA: Criando lembretes automáticos na hora do cadastro!
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    
    const dataHoje = `${ano}-${mes}-${dia}`;
    const dataFutura = `${ano}-${mes}-28`; // Um dia genérico no futuro para o calendário

    const lembretesIniciais = [
      { data: dataHoje, tarefa: 'Primeira Consulta Clínica', horario: '14:00' },
      { data: dataFutura, tarefa: 'Vacina V10', horario: '09:30' }
    ];

    const novoPet = {
      id: Date.now().toString(),
      nome,
      idade,
      raca,
      descricao,
      foto, 
      lembretes: lembretesIniciais, // <-- Agora o pet já nasce com compromissos!
    };

    try {
      const dadosTutor = await AsyncStorage.getItem('@tutor_clyvo');
      
      if (!dadosTutor) {
        Alert.alert('Erro', 'Nenhum usuário logado encontrado.');
        return;
      }

      const tutor = JSON.parse(dadosTutor);
      const chavePets = `@pets_${tutor.email}`;

      const petsSalvos = await AsyncStorage.getItem(chavePets);
      const listaAtual = petsSalvos ? JSON.parse(petsSalvos) : [];

      listaAtual.push(novoPet);
      await AsyncStorage.setItem(chavePets, JSON.stringify(listaAtual));

      Alert.alert('Sucesso!', 'Pet cadastrado na família Clyvo!');
      voltarSeguro();

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados do pet.');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={voltarSeguro}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
        <Text style={styles.titulo}>CADASTRAR PETS</Text>
      </View>

      <Text style={styles.labelSecao}>FOTO DO PET</Text>
      <View style={styles.boxFoto}>
        <TouchableOpacity style={styles.botaoUpload} onPress={escolherFoto}>
          <MaterialCommunityIcons name="upload" size={20} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
        <Image 
          source={{ uri: foto ? foto : 'https://img.freepik.com/vetores-gratis/desenho-de-gato-e-cachorro-desenhado-a-mao_23-2150379255.jpg?w=150' }} 
          style={styles.imagemPet} 
        />
      </View>

      <Text style={styles.labelSecao}>NOME DO PET</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="square-edit-outline" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeInput} />
        <TextInput style={styles.input} placeholder="Ex: DESTRUIDOR DE PLANETAS" placeholderTextColor={colors.cinza} value={nome} onChangeText={setNome} />
      </View>

      <Text style={styles.labelSecao}>IDADE DO PET</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="square-edit-outline" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeInput} />
        <TextInput style={styles.input} placeholder="Ex: 5 MESES" placeholderTextColor={colors.cinza} value={idade} onChangeText={setIdade} />
      </View>

      <Text style={styles.labelSecao}>RAÇA</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="square-edit-outline" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeInput} />
        <TextInput style={styles.input} placeholder="Ex: GATO LARANJA" placeholderTextColor={colors.cinza} value={raca} onChangeText={setRaca} />
      </View>

      <Text style={styles.labelSecao}>DESCRIÇÃO</Text>
      <View style={[styles.inputContainer, styles.inputDescricaoContainer]}>
        <MaterialCommunityIcons name="square-edit-outline" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeInput} />
        <TextInput style={[styles.input, styles.inputArea]} placeholder="Descreva a personalidade do seu pet..." placeholderTextColor={colors.cinza} value={descricao} onChangeText={setDescricao} multiline={true} numberOfLines={4} />
      </View>

      <TouchableOpacity style={styles.botaoCadastrar} onPress={handleCadastrar}>
        <Text style={styles.textoBotaoCadastrar}>CADASTRAR</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.branco, paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  botaoVoltar: { backgroundColor: colors.verdeMedio, width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  titulo: { fontSize: 20, fontWeight: '900', color: colors.roxoMuitoEscuro, textTransform: 'uppercase' },
  labelSecao: { fontSize: 14, fontWeight: '900', color: colors.verdeMedio, marginBottom: 5 },
  boxFoto: { borderColor: colors.roxoMuitoEscuro, borderWidth: 1, borderRadius: 20, padding: 15, alignItems: 'center', marginBottom: 20 },
  botaoUpload: { backgroundColor: colors.verdeClaro, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 10 },
  imagemPet: { width: 150, height: 100, borderRadius: 10, backgroundColor: '#E0E0E0' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderColor: colors.roxoMuitoEscuro, borderWidth: 1, borderRadius: 20, paddingHorizontal: 15, marginBottom: 20, height: 50 },
  iconeInput: { marginRight: 10 },
  input: { flex: 1, color: colors.roxoMuitoEscuro, fontWeight: 'bold', fontSize: 14 },
  inputDescricaoContainer: { height: 120, alignItems: 'flex-start', paddingTop: 15 },
  inputArea: { textAlignVertical: 'top' },
  botaoCadastrar: { backgroundColor: colors.verdeClaro, borderRadius: 25, paddingVertical: 15, alignItems: 'center', marginTop: 10, marginBottom: 40 },
  textoBotaoCadastrar: { color: colors.roxoMuitoEscuro, fontWeight: '900', fontSize: 18 }
});