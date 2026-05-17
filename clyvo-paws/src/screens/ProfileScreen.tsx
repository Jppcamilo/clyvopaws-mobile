import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const navigation = useNavigation();

  const [nome, setNome] = useState('João Pedro Camilo');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    const carregarDadosPerfil = async () => {
      try {
        const dadosSalvos = await AsyncStorage.getItem('@tutor_clyvo');
        if (dadosSalvos) {
          const tutor = JSON.parse(dadosSalvos);
          setNome(tutor.nome);
          setEmail(tutor.email);
          setCpf(tutor.cpf);
          setTelefone(tutor.telefone);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil', error);
      }
    };
    carregarDadosPerfil();
  }, []);

  const handleSalvar = async () => {
    if (!nome.trim() || !email.trim()) {
      Alert.alert('Atenção', 'Nome e E-mail são obrigatórios!');
      return;
    }

    const dadosTutor = { nome, email, cpf, telefone };

    try {
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

      <Text style={styles.descricao}>
        Mantenha seus dados atualizados para garantir a continuidade do cuidado do seu pet.
      </Text>

      <Text style={styles.labelSecao}>NOME COMPLETO</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="account-outline" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeInput} />
        <TextInput 
          style={styles.input} 
          value={nome}
          onChangeText={setNome}
          placeholder="Seu nome completo"
          placeholderTextColor={colors.cinza}
        />
      </View>

      <Text style={styles.labelSecao}>E-MAIL</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="email-outline" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeInput} />
        <TextInput 
          style={styles.input} 
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          placeholderTextColor={colors.cinza}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.labelSecao}>CPF</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="card-account-details-outline" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeInput} />
        <TextInput 
          style={styles.input} 
          value={cpf}
          onChangeText={setCpf}
          placeholder="000.000.000-00"
          placeholderTextColor={colors.cinza}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.labelSecao}>TELEFONE</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="phone-outline" size={20} color={colors.roxoMuitoEscuro} style={styles.iconeInput} />
        <TextInput 
          style={styles.input} 
          value={telefone}
          onChangeText={setTelefone}
          placeholder="(00) 00000-0000"
          placeholderTextColor={colors.cinza}
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
        <Text style={styles.textoBotaoSalvar}>SALVAR ALTERAÇÕES</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.branco,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
  },
  botaoVoltar: {
    backgroundColor: colors.verdeMedio,
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
  },
  descricao: {
    fontSize: 14,
    color: colors.cinza,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  labelSecao: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.verdeMedio,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.roxoMuitoEscuro,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
  },
  iconeInput: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: colors.roxoMuitoEscuro,
    fontWeight: 'bold',
    fontSize: 14,
  },
  botaoSalvar: {
    backgroundColor: colors.verdeEscuro,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  textoBotaoSalvar: {
    color: colors.branco,
    fontWeight: '900',
    fontSize: 16,
  }
});