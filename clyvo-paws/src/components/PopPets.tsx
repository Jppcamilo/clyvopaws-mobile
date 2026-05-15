import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CardPet from './CardPet';
import { Pet } from '../types';

type Props = {
  visivel: boolean;
  fecharModal: () => void;
  listaPets: Pet[];
};

export default function PopPets({ visivel, fecharModal, listaPets }: Props) {
  return (
    <Modal visible={visivel} transparent={true} animationType="slide">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={fecharModal}>
        
        <View style={styles.bottomSheet} onStartShouldSetResponder={() => true}>
          <View style={styles.handleBar} />
          
          <View style={styles.header}>
            <TouchableOpacity style={styles.botaoVoltar} onPress={fecharModal}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
            </TouchableOpacity>
            <Text style={styles.titulo}>Meus PETS</Text>
          </View>
          
          <Text style={styles.descricao}>
            Veja os dados rápidos dos seus animais cadastrados ou adicione um novo integrante à família.
          </Text>

          <ScrollView style={styles.listaScroll} showsVerticalScrollIndicator={false}>

            {listaPets.map(pet => (
              <CardPet key={pet.id} pet={pet} />
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.botaoCadastrar}>
            <Text style={styles.textoBotaoCadastrar}>CADASTRAR</Text>
          </TouchableOpacity>

        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: colors.branco,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    height: '80%',
  },
  handleBar: {
    width: 60,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  botaoVoltar: {
    backgroundColor: colors.verdeMedio,
    borderRadius: 20,
    padding: 8,
    marginRight: 15,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
  },
  descricao: {
    fontSize: 12,
    color: colors.cinza,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  listaScroll: {
    flex: 1,
    marginBottom: 15,
  },
  botaoCadastrar: {
    backgroundColor: colors.verdeMedio,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  textoBotaoCadastrar: {
    color: colors.roxoMuitoEscuro,
    fontWeight: '900',
    fontSize: 16,
  }
});