import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';
import { colors } from '../theme/colors';
import api from '../services/api';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const emailLimpo = email.trim().toLowerCase();

const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      const response = await api.post('/login', credentials, {
        headers: {
          Authorization: false
        }
      });
      return response.data;
    },
    onSuccess: async (data) => {
      if (data.token) {
        await SecureStore.setItemAsync('clyvo_token', data.token);
      }

      const tutorDados = {
        id: data.id,
        nomeCompleto: data.nomeCompleto,
        fotoUrl: data.fotoUrl
      };
      await AsyncStorage.setItem('@tutor_clyvo', JSON.stringify(tutorDados));

      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    },
    onError: (error: any) => {
      console.error('Erro no login:', error);

      let mensagemAmigavel = 'E-mail ou senha incorretos. Verifique seus dados.';

      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          mensagemAmigavel = 'E-mail ou senha inválidos.';
        } else if (status === 500) {
          mensagemAmigavel = 'E-mail ou senha inválidos.';
        }
      } else {
        mensagemAmigavel = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
      }

      Alert.alert('Atenção', mensagemAmigavel);
    }
  });

const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha o e-mail e a senha!');
      return;
    }

    try {
      await SecureStore.deleteItemAsync('clyvo_token');
      delete api.defaults.headers.common['Authorization'];
    } catch (e) {
      console.log('Nenhum token velho para limpar');
    }
    const emailLimpo = email.trim().toLowerCase(); 
    
    console.log(`Tentando logar com -> E-mail: '${emailLimpo}' | Senha: '${senha}'`);

    loginMutation.mutate({ 
      username: emailLimpo, 
      password: senha 
    });
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
        placeholder="E-MAIL..." 
        value={email} 
        placeholderTextColor={colors.roxoMuitoEscuro}
        onChangeText={setEmail} 
        keyboardType="email-address" 
        autoCapitalize="none" 
        autoCorrect={false} 
        textAlign='center'
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

        <TouchableOpacity 
          style={styles.botaoLogar} 
          onPress={handleLogin}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <ActivityIndicator color={colors.roxoMuitoEscuro} />
          ) : (
            <Text style={styles.textoBotaoLogar}>LOGAR</Text>
          )}
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
    top: -230,
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
    paddingTop: 130
  },
  logoContainer: { 
    paddingVertical: 10, 
    marginBottom: 40, 
    alignItems: 'center', 
  },
  logoTexto: { 
    fontSize: 32, 
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