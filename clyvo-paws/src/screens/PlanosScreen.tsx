import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

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
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cobertura de Planos</Text>
      <Text style={styles.subtitle}>Escolha o plano ideal para você e desbloqueie novas funcionalidades.</Text>

      {planosDeCobertura.map((plano) => (
        <View key={plano.id} style={[styles.card, { borderColor: plano.cor }]}>
          <View style={[styles.header, { backgroundColor: plano.cor }]}>
            <Text style={styles.planName}>{plano.nome}</Text>
            <Text style={styles.planPrice}>{plano.preco}</Text>
          </View>
          
          <View style={styles.body}>
            {plano.beneficios.map((beneficio, index) => (
              <Text key={index} style={styles.benefit}>• {beneficio}</Text>
            ))}
            
            <TouchableOpacity style={[styles.button, { backgroundColor: plano.cor }]}>
              <Text style={styles.buttonText}>Selecionar {plano.nome}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  planPrice: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 4,
  },
  body: {
    padding: 16,
  },
  benefit: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});