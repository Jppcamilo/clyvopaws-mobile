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
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../theme/colors';
import { DADOS_RACAS } from '../data/racas';

export default function PetFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // Verifica se a tela foi aberta para EDITAR um pet existente (recebido do PetDetailsScreen)
  const petParaEditar = route.params?.pet;

  // Lógica para auto-selecionar a espécie se estivermos editando
  let especieInicial: 'CACHORRO' | 'GATO' | null = null;
  if (petParaEditar) {
    const isCachorro = DADOS_RACAS.CACHORRO.some((r: any) => r.nome === petParaEditar.raca);
    especieInicial = isCachorro ? 'CACHORRO' : 'GATO';
  }

  // Estados: usam os dados de petParaEditar se existir, senão ficam vazios para cadastro novo
  const [nome, setNome] = useState(petParaEditar?.nome || '');
  const [dataNascimento, setDataNascimento] = useState<Date>(
    petParaEditar && petParaEditar.dataNascimento ? new Date(petParaEditar.dataNascimento) : new Date()
  );
  const [mostraCalendario, setMostraCalendario] = useState(false);
  const [peso, setPeso] = useState(petParaEditar?.peso || '');
  const [sexo, setSexo] = useState<'MACHO' | 'FÊMEA' | null>(petParaEditar?.sexo || null);
  const [descricao, setDescricao] = useState(petParaEditar?.descricao || '');
  const [foto, setFoto] = useState<string | null>(petParaEditar?.foto || null);
  
  const [especie, setEspecie] = useState<'CACHORRO' | 'GATO' | null>(especieInicial);
  const [racaSelecionada, setRacaSelecionada] = useState<any>(
    petParaEditar ? { nome: petParaEditar.raca } : null
  );

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
    if (!resultado.canceled) setFoto(resultado.assets[0].uri);
  };

  const handleSalvar = async () => {
    // Validação de segurança
    if (!nome.trim() || !peso.trim() || !sexo || !especie || !racaSelecionada) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios (Nome, Peso, Sexo, Espécie e Raça)!');
      return;
    }

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    const dataHoje = `${ano}-${mes}-${dia}`;

    // Objeto do pet, se for edição ele mantém o ID e os lembretes originais
    const petAtualizado = {
      id: petParaEditar ? petParaEditar.id : Date.now().toString(),
      nome, 
      dataNascimento: dataNascimento.toISOString(),
      peso,
      sexo,
      raca: racaSelecionada.nome, 
      descricao, 
      foto, 
      lembretes: petParaEditar ? petParaEditar.lembretes : [
        { data: dataHoje, tarefa: 'Avaliação Preventiva Inicial', horario: '14:30' }
      ]
    };

    try {
      const dadosTutor = await AsyncStorage.getItem('@tutor_clyvo');
      if (dadosTutor) {
        const tutor = JSON.parse(dadosTutor);
        const chavePets = `@pets_${tutor.email}`;
        const petsSalvos = await AsyncStorage.getItem(chavePets);
        let listaAtual = petsSalvos ? JSON.parse(petsSalvos) : [];
        
        if (petParaEditar) {
          // MODO EDIÇÃO: Atualiza o pet existente na lista
          listaAtual = listaAtual.map((p: any) => p.id === petParaEditar.id ? petAtualizado : p);
          await AsyncStorage.setItem(chavePets, JSON.stringify(listaAtual));
          Alert.alert('Sucesso', 'Dados do pet atualizados com sucesso!');
          
          // Na edição, não precisamos mostrar o plano preventivo de novo, só voltar pra tela de detalhes
          navigation.goBack(); 
        } else {
          // MODO NOVO CADASTRO: Adiciona na lista
          listaAtual.push(petAtualizado);
          await AsyncStorage.setItem(chavePets, JSON.stringify(listaAtual));
          
          // No cadastro novo, enviamos o tutor para ver a tela do plano preventivo
          navigation.replace('InfoRaca', { racaData: racaSelecionada }); 
        }
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
        <Text style={styles.titulo}>
          {petParaEditar ? 'EDITAR PET' : 'CADASTRAR PETS'}
        </Text>
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
        <TextInput style={styles.input} placeholder="EX: REX" placeholderTextColor={colors.cinza} value={nome} onChangeText={setNome} />
      </View>

      <Text style={styles.labelSecao}>DATA DE NASCIMENTO</Text>
      <TouchableOpacity style={styles.inputContainer} onPress={() => setMostraCalendario(true)}>
        <Text style={styles.input}>
          {dataNascimento.toLocaleDateString('pt-BR')}
        </Text>
      </TouchableOpacity>

      {mostraCalendario && (
        <DateTimePicker
          value={dataNascimento}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setMostraCalendario(false);
            if (selectedDate) setDataNascimento(selectedDate);
          }}
        />
      )}

      <Text style={styles.labelSecao}>PESO (KG)</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="EX: 5.5" placeholderTextColor={colors.cinza} value={peso} onChangeText={setPeso} keyboardType="numeric" />
      </View>

      <Text style={styles.labelSecao}>SEXO</Text>
      <View style={styles.botoesEspecie}>
        <TouchableOpacity 
          style={[styles.botaoEspecie, sexo === 'MACHO' && styles.botaoEspecieAtivo]} 
          onPress={() => setSexo('MACHO')}
        >
          <MaterialCommunityIcons name="gender-male" size={20} color={sexo === 'MACHO' ? colors.branco : colors.roxoMuitoEscuro} />
          <Text style={[styles.textoEspecie, sexo === 'MACHO' && { color: colors.branco }]}>MACHO</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.botaoEspecie, sexo === 'FÊMEA' && styles.botaoEspecieAtivo]} 
          onPress={() => setSexo('FÊMEA')}
        >
          <MaterialCommunityIcons name="gender-female" size={20} color={sexo === 'FÊMEA' ? colors.branco : colors.roxoMuitoEscuro} />
          <Text style={[styles.textoEspecie, sexo === 'FÊMEA' && { color: colors.branco }]}>FÊMEA</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.labelSecao}>DESCRIÇÃO</Text>
      <View style={[styles.inputContainer, styles.inputDescricaoContainer]}>
        <TextInput 
          style={[styles.input, styles.inputArea]} 
          placeholder="Descreva a personalidade do pet..." 
          placeholderTextColor={colors.cinza} 
          value={descricao} 
          onChangeText={setDescricao} 
          multiline={true} 
          numberOfLines={4} 
        />
      </View>

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

      <TouchableOpacity style={styles.botaoCadastrar} onPress={handleSalvar}>
        <Text style={styles.textoBotaoCadastrar}>
          {petParaEditar ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR E VER PREVENÇÃO'}
        </Text>
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
  
  inputDescricaoContainer: { height: 100, alignItems: 'flex-start', paddingTop: 15 },
  inputArea: { textAlignVertical: 'top', height: '100%' },
  
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