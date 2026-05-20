import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem('@tutor_clyvo');
      
      if (dadosSalvos) {
        const tutor = JSON.parse(dadosSalvos);
        
        if (tutor.email.toLowerCase() === email.toLowerCase().trim() && tutor.senha === senha) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        } else {
          Alert.alert('Erro', 'E-mail ou senha incorretos.');
        }
      } else {
        Alert.alert('Erro', 'Nenhum usuário cadastrado. Por favor, cadastre-se primeiro.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bgDiagonal} />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoTexto}>CLYVOPAWS</Text>
        </View>

        <TextInput 
          style={styles.input} 
          placeholder="EMAIL..." 
          placeholderTextColor={colors.roxoMuitoEscuro} 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
          autoCapitalize="none"
          textAlign="center"
        />

        <TextInput 
          style={styles.input} 
          placeholder="SENHA..." 
          placeholderTextColor={colors.roxoMuitoEscuro} 
          value={senha} 
          onChangeText={setSenha} 
          secureTextEntry
          textAlign="center"
        />

        <TouchableOpacity style={styles.botaoLogar} onPress={handleLogin}>
          <Text style={styles.textoBotaoLogar}>LOGAR</Text>
        </TouchableOpacity>

        <Text style={styles.textoAviso}>
          CASO NÃO POSSUA LOGIN CLIQUE{"\n"}NO BOTÃO ABAIXO
        </Text>

        <TouchableOpacity style={styles.botaoCadastrar} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.textoBotaoCadastrar}>CADASTRAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, backgroundColor: colors.branco 
  },
  bgDiagonal: { 
    position: 'absolute', 
    top: -150, 
    left: -100, 
    width: 600, 
    height: 450, 
    backgroundColor: colors.verdeMedio, 
    transform: [{ rotate: '-20deg' }] 
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    paddingHorizontal: 30, 
    paddingTop: 100 
  },
    logoContainer: { 
      borderColor: '#3b82f6', 
    borderWidth: 1, 
    paddingVertical: 10, 
    marginBottom: 40, 
    alignItems: 'center', 
    backgroundColor: colors.branco 
  },
  logoTexto: { fontSize: 32, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro, 
    textTransform: 'uppercase', 
    letterSpacing: 2 
  },
  input: { 
    borderColor: colors.roxoMuitoEscuro, 
    borderWidth: 1, 
    borderRadius: 25, 
    height: 60, 
    marginBottom: 25, 
    color: colors.roxoMuitoEscuro, 
    fontWeight: '900', 
    fontSize: 16, 
    textTransform: 'uppercase', 
    backgroundColor: colors.branco 
  },
  botaoLogar: { 
    backgroundColor: colors.verdeClaro, 
    borderRadius: 25, 
    paddingVertical: 18, 
    alignItems: 'center', 
    marginBottom: 30 
  },
  textoBotaoLogar: { 
    color: colors.roxoMuitoEscuro, 
    fontWeight: '900', 
    fontSize: 18, 
    textTransform: 'uppercase' 
  },
  textoAviso: { 
    textAlign: 'center', 
    color: colors.roxoMuitoEscuro, 
    fontWeight: '900', 
    fontSize: 12, marginBottom: 20 
  },
  botaoCadastrar: { 
    backgroundColor: colors.verdeClaro, 
    borderRadius: 25, 
    paddingVertical: 18, 
    alignItems: 'center' 
  },
  textoBotaoCadastrar: { 
    color: colors.roxoMuitoEscuro, 
    fontWeight: '900', 
    fontSize: 18, textTransform: 'uppercase' 
  }
});