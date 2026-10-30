import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import type { CoresTema } from '../theme/colors';
import { useEstilosTema } from '../hooks/useEstilosTema';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CardPet from './CardPet';
import type { Pet } from '../types';
import { useNavigation } from '@react-navigation/native';

type Props = {
  visivel: boolean;
  fecharModal: () => void;
  listaPets: Pet[];
};

export default function PopPets({ visivel, fecharModal, listaPets }: Props) {
  const { colors, styles, modo } = useEstilosTema(criarEstilos);
  const navigation = useNavigation<any>();

  const irParaCadastro = () => {
    fecharModal();
    navigation.navigate('PetForm');
  };

  const irParaDetalhesPet = (petId: Pet['id']) => {
    fecharModal(); 
    navigation.navigate('PetDetails', { petId: petId }); 
  };

  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={fecharModal}>
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={fecharModal}
          accessibilityRole="button"
          accessibilityLabel="Fechar lista de pets"
        />
        <View style={styles.bottomSheet} accessibilityViewIsModal>
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
            {listaPets.length === 0 && (
              <Text style={styles.descricao}>
                Você ainda não cadastrou nenhum pet. Toque em CADASTRAR para adicionar o primeiro.
              </Text>
            )}
            {listaPets.map(pet => (
              <TouchableOpacity 
                key={pet.id} 
                activeOpacity={0.7} 
                onPress={() => irParaDetalhesPet(pet.id)}
                accessibilityRole="button"
                accessibilityLabel={`Ver detalhes de ${pet.nome}`}
              >
                <CardPet pet={pet} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.botaoCadastrar} onPress={irParaCadastro}>
            <Text style={styles.textoBotaoCadastrar}>CADASTRAR</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const criarEstilos = (colors: CoresTema) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: colors.superficie,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    height: '80%',
  },
  handleBar: {
    width: 60,
    height: 5,
    backgroundColor: colors.superficieSecundaria,
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

