import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; 
import { colors } from '../theme/colors';
import { DADOS_RACAS } from '../data/racas'; // <-- Importando o banco de raças

export default function PetFormScreen() {
  const navigation = useNavigation<any>();

  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  
  // Novos estados para a lógica de espécie e raça
  const [especie, setEspecie] = useState<'CACHORRO' | 'GATO' | null>(null);
  const [racaSelecionada, setRacaSelecionada] = useState<any>(null);

  const escolherFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissao.status !== 'granted') {
      Alert.alert('Atenção', 'Precisamos de permissão!');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [4, 3], quality: 1,
    });
    if (!resultado.canceled) setFoto(resultado.assets[0].uri);
  };

  const handleCadastrar = async () => {
    if (!nome.trim() || !idade.trim() || !especie || !racaSelecionada) {
      Alert.alert('Atenção', 'Preencha todos os campos e selecione uma espécie e raça!');
      return;
    }

    const novoPet = {
      id: Date.now().toString(),
      nome, idade, raca: racaSelecionada.nome, descricao, foto, 
      lembretes: []
    };

    try {
      const dadosTutor = await AsyncStorage.getItem('@tutor_clyvo');
      if (dadosTutor) {
        const tutor = JSON.parse(dadosTutor);
        const chavePets = `@pets_${tutor.email}`;
        const petsSalvos = await AsyncStorage.getItem(chavePets);
        const listaAtual = petsSalvos ? JSON.parse(petsSalvos) : [];
        listaAtual.push(novoPet);
        await AsyncStorage.setItem(chavePets, JSON.stringify(listaAtual));
        
        // Aqui está a mágica: Se a raça tiver dados médicos, vamos para a tela de alerta preventivo!
        navigation.replace('InfoRaca', { racaData: racaSelecionada });
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados do pet.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
        <Text style={styles.titulo}>CADASTRAR PETS</Text>
      </View>

      <Text style={styles.labelSecao}>FOTO DO PET</Text>
      <View style={styles.boxFoto}>
        <TouchableOpacity style={styles.botaoUpload} onPress={escolherFoto}>
          <MaterialCommunityIcons name="upload" size={20} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.imagemPet} />
        ) : (
          <View style={styles.placeholderImagem}>
            <MaterialCommunityIcons name="camera-plus" size={40} color={colors.cinza} />
          </View>
        )}
      </View>

      <Text style={styles.labelSecao}>NOME DO PET</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="NOME" placeholderTextColor={colors.cinza} value={nome} onChangeText={setNome} />
      </View>

      <Text style={styles.labelSecao}>IDADE</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="EX: 5 MESES" placeholderTextColor={colors.cinza} value={idade} onChangeText={setIdade} />
      </View>

      {/* SELEÇÃO DE ESPÉCIE */}
      <Text style={styles.labelSecao}>ESPÉCIE</Text>
      <View style={styles.botoesEspecie}>
        <TouchableOpacity 
          style={[styles.botaoEspecie, especie === 'CACHORRO' && styles.botaoEspecieAtivo]} 
          onPress={() => { setEspecie('CACHORRO'); setRacaSelecionada(null); }}
        >
          <MaterialCommunityIcons name="dog" size={24} color={especie === 'CACHORRO' ? colors.branco : colors.roxoMuitoEscuro} />
          <Text style={[styles.textoEspecie, especie === 'CACHORRO' && { color: colors.branco }]}>CACHORRO</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.botaoEspecie, especie === 'GATO' && styles.botaoEspecieAtivo]} 
          onPress={() => { setEspecie('GATO'); setRacaSelecionada(null); }}
        >
          <MaterialCommunityIcons name="cat" size={24} color={especie === 'GATO' ? colors.branco : colors.roxoMuitoEscuro} />
          <Text style={[styles.textoEspecie, especie === 'GATO' && { color: colors.branco }]}>GATO</Text>
        </TouchableOpacity>
      </View>

      {/* SELEÇÃO DE RAÇA (Só aparece após escolher a espécie) */}
      {especie && (
        <>
          <Text style={styles.labelSecao}>RAÇA</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRacas}>
            {DADOS_RACAS[especie].map((item: any, index: number) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.tagRaca, racaSelecionada?.nome === item.nome && styles.tagRacaAtiva]}
                onPress={() => setRacaSelecionada(item)}
              >
                <Text style={[styles.textoRaca, racaSelecionada?.nome === item.nome && { color: colors.branco }]}>
                  {item.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      <TouchableOpacity style={styles.botaoCadastrar} onPress={handleCadastrar}>
        <Text style={styles.textoBotaoCadastrar}>CADASTRAR E VER PREVENÇÃO</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.branco, paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  botaoVoltar: { backgroundColor: colors.verdeMedio, width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  titulo: { fontSize: 20, fontWeight: '900', color: colors.roxoMuitoEscuro, textTransform: 'uppercase' },
  labelSecao: { fontSize: 14, fontWeight: '900', color: colors.verdeMedio, marginBottom: 5, marginTop: 10 },
  boxFoto: { borderColor: colors.roxoMuitoEscuro, borderWidth: 1, borderRadius: 20, padding: 15, alignItems: 'center', marginBottom: 10 },
  botaoUpload: { backgroundColor: colors.verdeClaro, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 10 },
  imagemPet: { width: 150, height: 100, borderRadius: 10 },
  placeholderImagem: { width: 150, height: 100, borderRadius: 10, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: colors.cinza },
  inputContainer: { borderColor: colors.roxoMuitoEscuro, borderWidth: 1, borderRadius: 20, paddingHorizontal: 15, height: 50, justifyContent: 'center' },
  input: { color: colors.roxoMuitoEscuro, fontWeight: 'bold', fontSize: 14 },
  
  botoesEspecie: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  botaoEspecie: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderColor: colors.roxoMuitoEscuro, borderWidth: 1, height: 50, borderRadius: 25 },
  botaoEspecieAtivo: { backgroundColor: colors.verdeEscuro, borderColor: colors.verdeEscuro },
  textoEspecie: { fontWeight: 'bold', color: colors.roxoMuitoEscuro, marginLeft: 8 },
  
  scrollRacas: { marginBottom: 20 },
  tagRaca: { borderColor: colors.verdeMedio, borderWidth: 1, borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10, justifyContent: 'center' },
  tagRacaAtiva: { backgroundColor: colors.verdeMedio },
  textoRaca: { color: colors.roxoMuitoEscuro, fontWeight: 'bold', fontSize: 12 },

  botaoCadastrar: { backgroundColor: colors.verdeClaro, borderRadius: 25, paddingVertical: 15, alignItems: 'center', marginTop: 10, marginBottom: 40 },
  textoBotaoCadastrar: { color: colors.roxoMuitoEscuro, fontWeight: '900', fontSize: 16 }
});