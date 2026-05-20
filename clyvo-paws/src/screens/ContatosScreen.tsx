import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
 
export default function ContatosScreen() {
  const navigation = useNavigation<any>();
 
  const abrirLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Erro ao abrir link', err));
  };
 
  return (
    <View style={styles.containerPrincipal}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
       
        <View style={styles.header}>
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
          </TouchableOpacity>
        </View>
 
        <Text style={styles.titulo}>Demais contatos</Text>
 
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Central de serviços</Text>
          <Text style={styles.textoExplicativo}>
            Para dúvidas de reembolso, rede referenciada, carteirinha e outros utilize o{' '}
            <Text style={styles.linkTexto} onPress={() => abrirLink('https://wa.me/')}>WhatsApp</Text>
          </Text>
 
          <View style={styles.cardContato}>
            <Text style={styles.labelContato}>Capitais e áreas metropolitanas</Text>
            <TouchableOpacity onPress={() => abrirLink('tel:40045900')}>
              <Text style={styles.numeroTelefone}>4004 5900</Text>
            </TouchableOpacity>
 
            <View style={styles.espaco} />
 
            <Text style={styles.labelContato}>Demais regiões</Text>
            <TouchableOpacity onPress={() => abrirLink('tel:08009700500')}>
              <Text style={styles.numeroTelefone}>0800 970 0500</Text>
            </TouchableOpacity>
          </View>
        </View>
 
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>SAC</Text>
          <Text style={styles.textoExplicativo}>Reclamações e informações institucionais</Text>
 
          <View style={styles.cardContato}>
            <Text style={styles.labelContato}>Ligação gratuita</Text>
            <TouchableOpacity onPress={() => abrirLink('tel:08007220504')}>
              <Text style={styles.numeroTelefone}>0800 722 0504</Text>
            </TouchableOpacity>
          </View>
        </View>
 
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Pessoa com deficiência</Text>
          <Text style={styles.textoExplicativo}>Audição e fala</Text>
 
          <View style={styles.cardContato}>
            <Text style={styles.labelContato}>Utilize o WhatsApp</Text>
            <TouchableOpacity onPress={() => abrirLink('https://wa.me/551130049723')}>
              <Text style={styles.numeroTelefone}>11 3004 9723</Text>
            </TouchableOpacity>
 
            <View style={styles.espaco} />
 
            <Text style={styles.labelContato}>Iniciar chat</Text>
            <TouchableOpacity onPress={() => abrirLink('https://wa.me/551130049723')}>
              <Text style={styles.linkTextoCard}>Clique aqui</Text>
            </TouchableOpacity>
          </View>
        </View>
 
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Fale comigo - Canal de denúncia</Text>
          <Text style={styles.textoExplicativo}>
            Sua denúncia em sigilo e seu anonimato assegurado 24h. Caso queira fazer a denúncia por escrito,{' '}
            <Text style={styles.linkTexto} onPress={() => abrirLink('https://google.com')}>clique aqui</Text>
          </Text>
        </View>
 
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
 
const styles = StyleSheet.create({
  containerPrincipal: { 
    flex: 1, 
    backgroundColor: colors.branco, 
    paddingHorizontal: 20, 
    paddingTop: 50 },
  scrollContainer: { 
    flexGrow: 1 },
  header: { 
    marginBottom: 20, 
    alignItems: 'flex-start' },
  botaoVoltar: { 
    backgroundColor: colors.verdeMedio, 
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    justifyContent: 'center', 
    alignItems: 'center' },
  titulo: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro, 
    marginBottom: 25 },
  secao: { 
    marginBottom: 30 },
  tituloSecao: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro, 
    marginBottom: 5 },
  textoExplicativo: { 
    fontSize: 14, 
    color: colors.roxoMuitoEscuro, 
    lineHeight: 22, 
    fontWeight: '500', 
    marginBottom: 15 },
  linkTexto: { 
    color: colors.verdeEscuro, 
    fontWeight: 'bold', 
    textDecorationLine: 'underline' },
  cardContato: { 
    backgroundColor: colors.branco, 
    borderColor: '#EAEAEA', 
    borderWidth: 1, 
    borderRadius: 15, 
    padding: 20, 
    elevation: 1, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 2 },
  labelContato: { 
    fontSize: 14, 
    color: colors.roxoMuitoEscuro, 
    marginBottom: 2, 
    fontWeight: '500' },
  numeroTelefone: { 
    fontSize: 16, 
    color: colors.verdeEscuro, 
    fontWeight: 'bold', 
    textDecorationLine: 'underline' },
  linkTextoCard: { 
    fontSize: 16, 
    color: colors.verdeEscuro, 
    fontWeight: 'bold', 
    textDecorationLine: 'underline' },
  espaco: { 
    height: 20 }
});
 