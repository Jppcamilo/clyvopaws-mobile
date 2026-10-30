import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import type { CoresTema } from '../theme/colors';
import { useEstilosTema } from '../hooks/useEstilosTema';
import { useLogin } from '../hooks/useLogin';

export default function LoginScreen() {
  const { colors, styles, modo } = useEstilosTema(criarEstilos);
  const {
    navigation,
    email,
    setEmail,
    senha,
    setSenha,
    loginMutation,
    handleLogin,
  } = useLogin();

  const carregando = loginMutation.isPending;

  return (
    <View style={styles.container}>
      <View style={styles.bgDiagonal} />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoTexto}>CLYVOPAWS</Text>
        </View>

        <TextInput keyboardAppearance={modo}
          style={styles.input}
          placeholder="E-MAIL..."
          placeholderTextColor={colors.roxoMuitoEscuro}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textAlign="center"
          editable={!carregando}
          accessibilityLabel="E-mail"
        />

        <TextInput keyboardAppearance={modo}
          style={styles.input}
          placeholder="SENHA..."
          placeholderTextColor={colors.roxoMuitoEscuro}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          textAlign="center"
          editable={!carregando}
          returnKeyType="go"
          onSubmitEditing={() => {
            if (!carregando) {
              void handleLogin();
            }
          }}
          accessibilityLabel="Senha"
        />

        <TouchableOpacity
          style={[
            styles.botaoLogar,
            carregando && styles.botaoDesabilitado,
          ]}
          onPress={handleLogin}
          disabled={carregando}
          accessibilityRole="button"
          accessibilityLabel="Entrar na conta"
        >
          {carregando ? (
            <ActivityIndicator color={colors.roxoMuitoEscuro} />
          ) : (
            <Text style={styles.textoBotaoLogar}>LOGAR</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.textoAviso}>
          CASO NÃO POSSUA LOGIN CLIQUE{'\n'}NO BOTÃO ABAIXO
        </Text>

        <TouchableOpacity
          style={[
            styles.botaoCadastrar,
            carregando && styles.botaoDesabilitado,
          ]}
          onPress={() => navigation.navigate('Register')}
          disabled={carregando}
          accessibilityRole="button"
          accessibilityLabel="Criar uma conta"
        >
          <Text style={styles.textoBotaoCadastrar}>
            CADASTRAR
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const criarEstilos = (colors: CoresTema) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.superficie,
  },

  bgDiagonal: {
    position: 'absolute',
    top: -230,
    left: -100,
    width: 600,
    height: 450,
    backgroundColor: colors.verdeMedio,
    transform: [{ rotate: '-20deg' }],
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 130,
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
    letterSpacing: 2,
  },

  input: {
    borderColor: colors.borda,
    borderWidth: 1,
    borderRadius: 25,
    height: 60,
    marginBottom: 25,
    color: colors.roxoMuitoEscuro,
    fontWeight: '900',
    fontSize: 16,
    backgroundColor: colors.superficie,
  },

  botaoLogar: {
    backgroundColor: colors.verdeClaro,
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 30,
  },

  botaoDesabilitado: {
    opacity: 0.6,
  },

  textoBotaoLogar: {
    color: colors.roxoMuitoEscuro,
    fontWeight: '900',
    fontSize: 18,
    textTransform: 'uppercase',
  },

  textoAviso: {
    textAlign: 'center',
    color: colors.roxoMuitoEscuro,
    fontWeight: '900',
    fontSize: 12,
    marginBottom: 20,
  },

  botaoCadastrar: {
    backgroundColor: colors.verdeClaro,
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
  },

  textoBotaoCadastrar: {
    color: colors.roxoMuitoEscuro,
    fontWeight: '900',
    fontSize: 18,
    textTransform: 'uppercase',
  },
});
