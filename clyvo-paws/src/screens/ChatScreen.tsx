import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useChat } from '../hooks/useChat';

export default function ChatScreen() {
  const {
    navigation, textoInput, setTextoInput, mensagens, opcoesRapidas, enviarMensagem
  } = useChat();

  return (
    <KeyboardAvoidingView
      style={styles.containerPrincipal}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
        <View style={styles.headerTextos}>
          <Text style={styles.titulo}>Atendimento Clyvo</Text>
          <Text style={styles.subtitulo}>Assistente Virtual: 24 Horas</Text>
          <Text style={styles.subtitulo}>Orientações sobre o aplicativo</Text>
        </View>
        <TouchableOpacity>
          <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
      </View>
 
      <View style={styles.linhaDivisoria} />
 
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {mensagens.map((msg) => (
          <View key={msg.id} style={msg.remetente === 'bot' ? styles.linhaBot : styles.linhaUser}>
           
            {msg.remetente === 'bot' && (
              <View style={styles.iconeBot}>
                <MaterialCommunityIcons name="robot-outline" size={20} color={colors.branco} />
              </View>
            )}
 
            <View style={msg.remetente === 'bot' ? styles.balaoBot : styles.balaoUser}>
              <Text style={msg.remetente === 'bot' ? styles.textoBot : styles.textoUser}>
                {msg.texto}
              </Text>
              <Text style={styles.horaMensagem}>{msg.hora}</Text>
            </View>
          </View>
        ))}
 
        <View style={styles.containerOpcoes}>
          {opcoesRapidas.map((opcao, index) => (
            <TouchableOpacity
              key={index}
              style={styles.botaoOpcao}
              onPress={() => enviarMensagem(opcao)}
            >
              <Text style={styles.textoBotaoOpcao}>{opcao}</Text>
            </TouchableOpacity>
          ))}
        </View>
       
        <View style={{ height: 20 }} />
      </ScrollView>
 
      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem"
          placeholderTextColor={colors.cinza}
          value={textoInput}
          onChangeText={setTextoInput}
          onSubmitEditing={() => enviarMensagem(textoInput)}
        />
        <TouchableOpacity
          style={styles.botaoEnviar}
          onPress={() => enviarMensagem(textoInput)}
          disabled={!textoInput.trim()}
        >
          <MaterialCommunityIcons name="send" size={24} color={colors.verdeEscuro} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
 
const styles = StyleSheet.create({
  containerPrincipal: { 
    flex: 1, 
    backgroundColor: colors.branco, 
    paddingTop: 50 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingBottom: 10 
  },
  botaoVoltar: { 
    padding: 5 
  },
  headerTextos: { 
    flex: 1, 
    alignItems: 'center' 
  },
  titulo: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro 
  },
  subtitulo: { 
    fontSize: 10, 
    color: colors.cinza, 
    fontWeight: 'bold' 
  },
  linhaDivisoria: { 
    height: 1, 
    backgroundColor: '#EAEAEA', 
    width: '100%' 
  },
  scrollContainer: { 
    padding: 15, 
    paddingBottom: 30 
  },
  linhaBot: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    marginBottom: 10, 
    maxWidth: '85%' 
  },
  iconeBot: { 
    backgroundColor: colors.verdeEscuro, 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 8, 
    marginBottom: 5 
  },
  balaoBot: { 
    backgroundColor: '#F0F4F8', 
    padding: 12, 
    borderRadius: 15, 
    borderBottomLeftRadius: 5 
  },
  textoBot: { 
    fontSize: 14, 
    color: colors.roxoMuitoEscuro, 
    lineHeight: 20 
  },
  linhaUser: { 
    alignSelf: 'flex-end', 
    marginBottom: 10, 
    maxWidth: '80%' 
  },
  balaoUser: { 
    backgroundColor: colors.verdeClaro, 
    padding: 12, 
    borderRadius: 15, 
    borderBottomRightRadius: 5 
  },
  textoUser: { 
    fontSize: 14, 
    color: colors.roxoMuitoEscuro, 
    lineHeight: 20, 
    fontWeight: '500' 
  },
  horaMensagem: { 
    fontSize: 10, 
    color: colors.cinza, 
    alignSelf: 'flex-end', 
    marginTop: 4 
  },
  containerOpcoes: { 
    marginTop: 15, 
    alignItems: 'center' 
  },
  botaoOpcao: { 
    backgroundColor: colors.verdeEscuro, 
    width: '90%', 
    paddingVertical: 12,
    borderRadius: 25, 
    alignItems: 'center', 
    marginBottom: 8 
  },
  textoBotaoOpcao: { 
    color: colors.branco, 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  footer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingVertical: 10,
    borderTopWidth: 1, 
    borderColor: '#EAEAEA', 
    backgroundColor: colors.branco 
  },
  input: {
    flex: 1, 
    backgroundColor: '#F5F5F5', 
    borderRadius: 25, 
    paddingHorizontal: 20, 
    height: 50, 
    fontSize: 14, 
    color: colors.roxoMuitoEscuro 
  },
  botaoEnviar: { 
    padding: 10, 
    marginLeft: 5 
  }
});