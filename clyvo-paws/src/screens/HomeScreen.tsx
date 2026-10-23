import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useHome } from '../hooks/useHome';
import PopPerfil from '../components/PopPerfil';
import PopPets from '../components/PopPets';

export default function HomeScreen() {
  const {
    navigation, modalPerfilVisivel, setModalPerfilVisivel, modalPetsVisivel,
    setModalPetsVisivel, nomeTutor, fotoTutor, listaPets, agendamentosGerais,
    carregandoAgendamentos, carregandoPets, isError, tentarNovamente, formatarData, imagemExibicao
  } = useHome();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setModalPerfilVisivel(true)}>
          <Image source={imagemExibicao} style={styles.fotoPerfil} />
        </TouchableOpacity>
        <View style={styles.containerSaudacao}>
          <Text style={styles.labelMenu}>Menu Principal</Text>
          <Text style={styles.tituloNome}>Olá, {nomeTutor}</Text>
        </View>
      </View>

      <View style={styles.secaoLembretes}>
        {carregandoAgendamentos || carregandoPets ? (
           <View style={[styles.secaoVazia, { backgroundColor: 'transparent' }]}>
             <ActivityIndicator size="small" color={colors.verdeEscuro} />
           </View>
        ) : isError ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: colors.roxoMuitoEscuro, textAlign: 'center' }}>Não foi possível carregar os dados.</Text>
          <TouchableOpacity accessibilityRole="button" onPress={() => { void tentarNovamente(); }} style={{ padding: 16 }}>
            <Text style={{ color: colors.verdeEscuro, fontWeight: 'bold' }}>TENTAR NOVAMENTE</Text>
          </TouchableOpacity>
        </View>
        ) : agendamentosGerais.length > 0 ? (
          <>
            <Text style={styles.tituloSecao}>LEMBRETES</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
              {agendamentosGerais.map((ag) => {
                 const petDoAgendamento = listaPets.find((p) => p.id === ag.petId);
                 const nomePet = petDoAgendamento?.nome || ag.consulta?.nomePet || 'Meu Pet';
                 const fotoUri = petDoAgendamento?.fotoUrl || 'https://img.freepik.com/vetores-gratis/desenho-de-gato-e-cachorro-desenhado-a-mao_23-2150379255.jpg?w=150';

                 return (
                  <View key={ag.id} style={styles.cardAgendamentoHome}>
                    <Image source={{ uri: fotoUri }} style={styles.fotoMiniPet} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.nomePetCard}>{nomePet}</Text>
                      <Text style={styles.tituloAgendamento} numberOfLines={2}>
                        {ag.titulo}
                      </Text>
                      <View style={styles.linhaDataHora}>
                        <MaterialCommunityIcons name="calendar-clock" size={14} color={colors.verdeMedio} />
                        <Text style={styles.textoDataHora}>{formatarData(ag.dataHora)}</Text>
                      </View>
                    </View>
                  </View>
                 );
              })}
            </ScrollView>
          </>
        ) : (
          <View style={styles.secaoVazia}>
            <Text style={styles.textoVazio}>Nenhum agendamento encontrado.</Text>
          </View>
        )}
      </View>

      <Text style={styles.tituloSecao}>MAIS ACESSADOS</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollIcones}>
        <TouchableOpacity style={styles.itemIconeScroll} onPress={() => navigation.navigate('RedeClinica')}>
          <View style={styles.circuloIcone}>
              <MaterialCommunityIcons name="home-outline" size={30} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.legendaIcone}>REDE{"\n"}CLINICA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemIconeScroll} onPress={() => setModalPetsVisivel(true)} disabled={carregandoPets || isError}>
          <View style={styles.circuloIcone}>
            <MaterialCommunityIcons name="paw" size={30} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.legendaIcone}>MEUS PETS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemIconeScroll} onPress={() => navigation.navigate('MeusMedicamentos')}>
          <View style={styles.circuloIcone}>
            <MaterialCommunityIcons name="file-document-outline" size={30} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.legendaIcone}>MEUS{"\n"}MEDICAMENTOS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemIconeScroll} onPress={() => navigation.navigate('Consultas')}>
          <View style={styles.circuloIcone}>
            <MaterialCommunityIcons name="calendar-clock" size={30} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.legendaIcone}>AGENDAR{"\n"}CONSULTA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemIconeScroll} onPress={() => navigation.navigate('Servicos')}>
          <View style={styles.circuloIcone}>
            <MaterialCommunityIcons name="dots-horizontal" size={30} color={colors.roxoMuitoEscuro} />
          </View>
          <Text style={styles.legendaIcone}>VER{"\n"}SERVIÇOS</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.bannerPets} onPress={() => setModalPetsVisivel(true)} disabled={carregandoPets || isError}>
        <View style={styles.textoBanner}>
          <Text style={styles.tituloBanner}>PETS</Text>
          <Text style={styles.subtituloBanner}>VEJA SEUS PETS E{"\n"}CADASTRE ELES AQUI</Text>
        </View>
        <View style={styles.circuloSeta}>
          <MaterialCommunityIcons name="arrow-right" size={24} color={colors.roxoMuitoEscuro} />
        </View>
      </TouchableOpacity>

      <View style={styles.containerDuplo}>
        <TouchableOpacity style={styles.boxPequeno} onPress={() => navigation.navigate('RedeClinica')}>
          <MaterialCommunityIcons name="home-city-outline" size={24} color={colors.roxoMuitoEscuro} />
          <Text style={styles.tituloBox}>CLINICAS{"\n"}PERTO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boxPequeno} onPress={() => navigation.navigate('MeusMedicamentos')}>
          <MaterialCommunityIcons name="pill" size={24} color={colors.roxoMuitoEscuro} />
          <Text style={styles.tituloBox}>MEDICAMENTOS</Text>
        </TouchableOpacity>
      </View>

      <PopPerfil visivel={modalPerfilVisivel} fecharModal={() => setModalPerfilVisivel(false)} nomeTutor={nomeTutor} fotoTutor={fotoTutor} />
      <PopPets visivel={modalPetsVisivel} fecharModal={() => setModalPetsVisivel(false)} listaPets={listaPets} />
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.branco, paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  fotoPerfil: { width: 90, height: 90, borderRadius: 45, marginRight: 20, backgroundColor: '#E0E0E0' },
  containerSaudacao: { justifyContent: 'center' },
  labelMenu: { color: colors.verdeMedio, fontWeight: 'bold', fontSize: 17 },
  tituloNome: { fontSize: 25, fontWeight: '900', color: colors.roxoMuitoEscuro },
  secaoLembretes: { marginBottom: 30 },
  secaoVazia: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 15, alignItems: 'center' },
  textoVazio: { color: colors.cinza, fontWeight: 'bold' },
  tituloSecao: { fontSize: 18, fontWeight: '900', color: colors.roxoMuitoEscuro, marginBottom: 15 },
  cardAgendamentoHome: { flexDirection: 'row', backgroundColor: colors.branco, borderColor: colors.roxoMuitoEscuro, borderWidth: 1, borderRadius: 15, padding: 15, marginRight: 15, width: 250, alignItems: 'center' },
  fotoMiniPet: { width: 45, height: 45, borderRadius: 22.5, marginRight: 12 },
  tituloAgendamento: { fontSize: 14, fontWeight: '900', color: colors.roxoMuitoEscuro, marginBottom: 4 },
  linhaDataHora: { flexDirection: 'row', alignItems: 'center' },
  textoDataHora: { fontSize: 12, fontWeight: 'bold', color: colors.verdeMedio, marginLeft: 5 },
  scrollIcones: { flexDirection: 'row', marginBottom: 40, marginHorizontal: -20, paddingHorizontal: 20 },
  itemIconeScroll: { alignItems: 'center', width: 85, marginRight: 10 },
  circuloIcone: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.verdeEscuro, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  legendaIcone: { textAlign: 'center', fontSize: 10, fontWeight: '900', color: colors.roxoMuitoEscuro },
  bannerPets: { backgroundColor: colors.verdeEscuro, borderRadius: 20, padding: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  textoBanner: { flex: 1 },
  tituloBanner: { backgroundColor: colors.verdeClaro, alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 4, borderRadius: 15, fontSize: 16, fontWeight: '900', color: colors.roxoMuitoEscuro, marginBottom: 10 },
  subtituloBanner: { color: colors.verdeClaro, fontSize: 10, fontWeight: '900' },
  circuloSeta: { backgroundColor: colors.verdeMedio, width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  containerDuplo: { flexDirection: 'row', justifyContent: 'space-between' },
  boxPequeno: { backgroundColor: colors.verdeEscuro, width: '47%', borderRadius: 15, padding: 15, height: 100, justifyContent: 'space-between' },
  tituloBox: { color: colors.verdeClaro, fontSize: 12, fontWeight: '900' },
  nomePetCard: { fontSize: 12, fontWeight: '900', color: colors.verdeMedio, textTransform: 'uppercase', marginBottom: 2 }
});