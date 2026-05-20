import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { colors } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type Props = {
  visivel: boolean;
  fecharModal: () => void;
  nomeTutor: string;
  fotoTutor?: string | null;
};

export default function PopPerfil({ visivel, fecharModal, nomeTutor, fotoTutor }: Props) {
  const navigation = useNavigation<any>();

  const irParaDadosPessoais = () => {
    fecharModal();
    navigation.navigate('Profile');
  };

  const imagemExibicao = fotoTutor 
    ? { uri: fotoTutor } 
    : { uri: 'https://img.freepik.com/vetores-gratis/homem-jovem-com-telefone-inteligente_23-2148506899.jpg' };

  return (
    <Modal visible={visivel} transparent={true} animationType="slide">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={fecharModal}>
        <View style={styles.bottomSheet} onStartShouldSetResponder={() => true}>
          <View style={styles.handleBar} />
          
          <View style={styles.headerPerfil}>
            <Image source={imagemExibicao} style={styles.fotoTutor} />
            <View style={styles.infoTutor}>
              <Text style={styles.nomeTutor}>{nomeTutor}</Text>
              <Text style={styles.tagTutor}>TUTOR</Text>
            </View>
            <TouchableOpacity style={styles.botaoContas}>
              <Text style={styles.textoBotaoContas}>CONTAS</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divisor} />

          <TouchableOpacity style={styles.opcaoMenu} onPress={irParaDadosPessoais}>
            <Text style={styles.textoOpcao}>DADOS PESSOAIS</Text>
            <View style={styles.iconeFundo}>
              <MaterialCommunityIcons name="cog" size={20} color={colors.roxoMuitoEscuro} />
            </View>
          </TouchableOpacity>

          <View style={styles.divisor} />

          <TouchableOpacity style={styles.opcaoMenu} onPress={() => {
            fecharModal();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }}>
            <Text style={styles.textoOpcao}>SAIR</Text>
            <View style={styles.iconeFundo}>
              <MaterialCommunityIcons name="logout" size={20} color={colors.roxoMuitoEscuro} />
            </View>
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
    justifyContent: 'flex-end' },
  bottomSheet: { 
    backgroundColor: colors.branco, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 20, 
    minHeight: 300 },
  handleBar: { 
    width: 60, 
    height: 5, 
    backgroundColor: '#E0E0E0', 
    borderRadius: 5, 
    alignSelf: 'center', 
    marginBottom: 20 },
  headerPerfil: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20 },
  fotoTutor: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    marginRight: 15, 
    backgroundColor: '#E0E0E0' },
  infoTutor: { 
    flex: 1 },
  nomeTutor: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro },
  tagTutor: { 
    fontSize: 12, 
    color: colors.verdeMedio, 
    fontWeight: 'bold' },
  botaoContas: { 
    backgroundColor: colors.verdeMedio, 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 20 },
  textoBotaoContas: { 
    color: colors.roxoMuitoEscuro, 
    fontWeight: '900', 
    fontSize: 12 },
  divisor: { 
    height: 1, 
    backgroundColor: '#E0E0E0', 
    marginVertical: 10 },
  opcaoMenu: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 10 },
  textoOpcao: { 
    fontSize: 16, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro },
  iconeFundo: { 
    backgroundColor: colors.verdeMedio,
     padding: 8, 
    borderRadius: 20 }
});