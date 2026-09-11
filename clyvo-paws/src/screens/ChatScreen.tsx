import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
 
type Mensagem = {
  id: string;
  texto: string;
  remetente: 'bot' | 'user';
  hora: string;
};
 
export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const [textoInput, setTextoInput] = useState('');
  const [nomeTutor, setNomeTutor] = useState('TUTOR');
 
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { id: '1', texto: 'Olá TUTOR, sou o Assistente Virtual da Clyvo VET.', remetente: 'bot', hora: '20:34' },
    { id: '2', texto: 'Seu protocolo de atendimento é: 0062462026518071266.', remetente: 'bot', hora: '20:34' },
    { id: '3', texto: 'Como posso te ajudar?', remetente: 'bot', hora: '20:34' },
    { id: '4', texto: 'Escolha uma das opções abaixo ou digite o que deseja:', remetente: 'bot', hora: '20:34' }
  ]);
 
  // 1. Carrega o nome real do tutor logado
  useEffect(() => {
    const carregarNomeTutor = async () => {
      try {
        const dadosSalvos = await AsyncStorage.getItem('@tutor_clyvo');
        if (dadosSalvos) {
          const tutor = JSON.parse(dadosSalvos);
          const nomeReal = tutor.nomeCompleto || tutor.nome || 'Tutor';
          const primeiroNome = nomeReal.split(' ')[0].toUpperCase();
          
          setNomeTutor(primeiroNome);

          // Atualiza a saudação inicial do bot com o nome real
          setMensagens((prev) =>
            prev.map((msg) =>
              msg.id === '1'
                ? { ...msg, texto: `Olá ${primeiroNome}, sou o Assistente Virtual da Clyvo VET.` }
                : msg
            )
          );
        }
      } catch (error) {
        console.error('Erro ao carregar nome no chat:', error);
      }
    };
    carregarNomeTutor();
  }, []);

  const opcoesRapidas = [
    'AGENDAR CONSULTA',
    'DÚVIDA SOBRE SINTOMAS',
    'REDE CLÍNICA PARCEIRA',
    'CARTEIRINHA DE VACINAÇÃO',
    'FALAR COM ESPECIALISTA VETERINÁRIO'
  ];

  // 2. Lógica para o Bot responder interativamente
  const gerarRespostaBot = (textoUsuario: string) => {
    setTimeout(() => {
      let respostaTexto = `Entendido, ${nomeTutor}! Nossa equipe analisará sua solicitação em breve.`;
      const txt = textoUsuario.toLowerCase();

      if (txt.includes('agendar')) {
        respostaTexto = 'Para agendar uma consulta, você pode acessar a opção "AGENDAR CONSULTA" diretamente na tela de Serviços ou na sua Home!';
      } else if (txt.includes('sintoma')) {
        respostaTexto = 'Se o seu pet apresentar sintomas graves, recomendamos levá-lo imediatamente a uma de nossas clínicas parceiras na aba "Rede Clínica".';
      } else if (txt.includes('rede') || txt.includes('clinica')) {
        respostaTexto = 'Você pode visualizar todas as clínicas credenciadas e mais próximas na seção "Rede Clínica".';
      } else if (txt.includes('vacina')) {
        respostaTexto = 'A carteirinha e o histórico de vacinação do seu pet estão disponíveis no perfil detalhado dele em "Meus Pets".';
      } else if (txt.includes('especialista') || txt.includes('veterinario')) {
        respostaTexto = 'Nosso atendimento com especialistas veterinários funciona de segunda a sexta, das 08h às 20h.';
      }

      const respostaBot: Mensagem = {
        id: (Date.now() + 1).toString(),
        texto: respostaTexto,
        remetente: 'bot',
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMensagens((prev) => [...prev, respostaBot]);
    }, 1000); // Responde após 1 segundo para simular digitação
  };
 
  const enviarMensagem = (texto: string) => {
    if (!texto.trim()) return;
 
    const novaMensagem: Mensagem = {
      id: Date.now().toString(),
      texto: texto,
      remetente: 'user',
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
 
    setMensagens((prev) => [...prev, novaMensagem]);
    setTextoInput('');

    // Dispara a resposta inteligente do bot
    gerarRespostaBot(texto);
  };
 
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
          <Text style={styles.subtitulo}>Especialista: 2ª a 6ª das 08h às 20h</Text>
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
 
        {/* Renderiza as opções rápidas apenas no início ou quando desejar */}
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