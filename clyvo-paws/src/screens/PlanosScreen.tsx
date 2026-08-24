import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

const planosDeCobertura = [
  {
    id: '1',
    nome: 'Plano Bronze',
    cor: '#CD7F32',
    preco: 'R$ 29,90/mês',
    beneficios: ['Acesso básico ao app', 'Suporte em horário comercial', 'Cadastro de 1 perfil'],
  },
  {
    id: '2',
    nome: 'Plano Prata',
    cor: '#A6A6A6',
    preco: 'R$ 59,90/mês',
    beneficios: ['Acesso completo', 'Suporte 24 horas', 'Cadastro de até 3 perfis', 'Descontos exclusivos'],
  },
  {
    id: '3',
    nome: 'Plano Ouro',
    cor: '#FFD700',
    preco: 'R$ 99,90/mês',
    beneficios: ['Todos os benefícios Prata', 'Consultas e agendamentos ilimitados', 'Perfis ilimitados', 'Atendimento prioritário'],
  }
];

export default function PlanosScreen() {
  const navigation = useNavigation<any>();
  const [modalVisivel, setModalVisivel] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState<any>(null);

  const handleSelecionarPlano = (plano: any) => {
    setPlanoSelecionado(plano);
    setModalVisivel(true);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
          </TouchableOpacity>
          <Text style={styles.titulo}>COBERTURA DE PLANOS</Text>
        </View>

        <Text style={styles.subtitulo}>
          ESCOLHA O PLANO IDEAL PARA VOCÊ E DESBLOQUEIE NOVAS FUNCIONALIDADES NA SUA CONTA
        </Text>

        {planosDeCobertura.map((plano) => (
          <View key={plano.id} style={[styles.card, { borderColor: plano.cor }]}>
            <View style={[styles.cardHeader, { backgroundColor: plano.cor }]}>
              <Text style={styles.planName}>{plano.nome}</Text>
              <Text style={styles.planPrice}>{plano.preco}</Text>
            </View>
            
            <View style={styles.cardBody}>
              {plano.beneficios.map((beneficio, index) => (
                <Text key={index} style={styles.benefit}>• {beneficio}</Text>
              ))}
              
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: plano.cor }]}
                onPress={() => handleSelecionarPlano(plano)}
              >
                <Text style={styles.buttonText}>SELECIONAR {plano.nome}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {planoSelecionado && (
              <>
                <Text style={styles.modalTitle}>PLANO SELECIONADO!</Text>
                <Text style={styles.modalText}>
                  Você escolheu o <Text style={{ fontWeight: 'bold', color: planoSelecionado.cor }}>{planoSelecionado.nome}</Text>.
                </Text>
                <Text style={styles.modalText}>
                  No futuro, as funcionalidades deste plano ({planoSelecionado.preco}) serão liberadas aqui.
                </Text>
                
                <TouchableOpacity 
                  style={[styles.closeButton, { backgroundColor: planoSelecionado.cor }]}
                  onPress={() => setModalVisivel(false)}
                >
                  <Text style={styles.closeButtonText}>ENTENDI</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.branco,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  botaoVoltar: {
    backgroundColor: colors.verdeMedio,
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
    marginLeft: 15,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
  subtitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 30,
    textTransform: 'uppercase',
  },
  card: {
    width: '100%',
    backgroundColor: colors.branco,
    borderRadius: 16, 
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 16,
    alignItems: 'center',
  },
  planName: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.branco,
    textTransform: 'uppercase',
  },
  planPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.branco,
    marginTop: 4,
  },
  cardBody: {
    padding: 16,
  },
  benefit: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.roxoMuitoEscuro,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.branco,
    fontWeight: '900',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: colors.branco,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 15,
    color: colors.roxoMuitoEscuro,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.branco,
    fontWeight: '900',
    fontSize: 14,
  },
});