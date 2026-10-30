import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { CoresTema } from '../theme/colors';
import { useEstilosTema } from '../hooks/useEstilosTema';
import { usePetDetails } from '../hooks/usePetDetails';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { calcularIdade } from '../utils/dateUtils';

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';


export default function PetDetailsScreen() {
  const { colors, styles, modo } = useEstilosTema(criarEstilos);
  const [mesCalendario, setMesCalendario] = React.useState(() => {
    const agora = new Date();
    return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-01`;
  });
  const {
    navigation, pet, carregandoPet, carregandoAgendamentos, isError, tentarNovamente,
    lembretes, veioDaNotificacao, consultaNotificada, atualizandoConsultaNotificada, datasMarcadas, racaInfo, deleteMutation, ativandoAlertas, ativarAlertas, handleExcluirPet
  } = usePetDetails();
  const ocupado = deleteMutation.isPending || ativandoAlertas;

  if (carregandoPet || carregandoAgendamentos) {
    return (
      <View style={styles.containerCentro}>
        <ActivityIndicator size="large" color={colors.destaque} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.containerCentro}>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: colors.roxoMuitoEscuro, textAlign: 'center' }}>Não foi possível carregar os dados.</Text>
          <TouchableOpacity accessibilityRole="button" onPress={() => { void tentarNovamente(); }} style={{ padding: 16 }}>
            <Text style={{ color: colors.destaque, fontWeight: 'bold' }}>TENTAR NOVAMENTE</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.botaoVoltarErro} onPress={() => navigation.goBack()}>
          <Text style={styles.textoBotaoVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.containerCentro}>
        <Text style={styles.textoVazio}>Pet não encontrado.</Text>
        <TouchableOpacity style={styles.botaoVoltarErro} onPress={() => navigation.goBack()}>
          <Text style={styles.textoBotaoVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

const fotoUri = pet.fotoUrl || 'https://img.freepik.com/vetores-gratis/desenho-de-gato-e-cachorro-desenhado-a-mao_23-2150379255.jpg?w=150';
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.roxoMuitoEscuro} />
        </TouchableOpacity>
        
        <View style={{ flexDirection: 'row' }}>
          
          <TouchableOpacity 
            style={styles.botaoEditar} 
            onPress={() => navigation.navigate('PetForm', { pet })}
            disabled={ocupado}
          >
            <MaterialCommunityIcons name="pencil-outline" size={24} color={colors.destaque} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.botaoDeletar} 
            onPress={handleExcluirPet}
            disabled={ocupado}
          >
            {deleteMutation.isPending ? (
              <ActivityIndicator color={colors.erro} />
            ) : (
              <MaterialCommunityIcons name="trash-can-outline" size={24} color={colors.erro} />
            )}
          </TouchableOpacity>
          
        </View>
      </View>

      <Text style={styles.nomePet}>{pet.nome}</Text>

      {veioDaNotificacao && (
        <View style={[styles.cardStatus, { marginBottom: 20 }]} accessibilityLiveRegion="polite">
          <Text style={styles.tituloCardStatus}>CONSULTA DO AVISO</Text>
          {atualizandoConsultaNotificada ? (
            <ActivityIndicator color={colors.destaque} />
          ) : consultaNotificada ? (
            <>
              <Text style={styles.subtituloCardStatus}>{consultaNotificada.titulo}</Text>
              <Text style={styles.textoDescricao}>
                {new Date(consultaNotificada.dataHora).toLocaleString('pt-BR')}
              </Text>
              {!!consultaNotificada.descricao && (
                <Text style={styles.textoDescricao}>{consultaNotificada.descricao}</Text>
              )}
            </>
          ) : (
            <Text style={styles.textoDescricao}>
              Esta consulta não está mais disponível. Confira os agendamentos abaixo.
            </Text>
          )}
        </View>
      )}
      
      <View style={styles.infoContainer}>
        <Image source={{ uri: fotoUri }} style={styles.imagemPet} />
        <View style={styles.dadosContainer}>
          <Text style={styles.dadoTexto}><Text style={styles.dadoLabel}>Idade:</Text> {calcularIdade(pet.dataNascimento)}</Text>
          <Text style={styles.dadoTexto}><Text style={styles.dadoLabel}>Raça:</Text> {pet.raca}</Text>
          <Text style={styles.dadoTexto}><Text style={styles.dadoLabel}>Peso:</Text> {pet.peso ? `${pet.peso} kg` : 'Não informado'}</Text>
          <Text style={styles.dadoTexto}><Text style={styles.dadoLabel}>Sexo:</Text> {pet.sexo || 'Não informado'}</Text>
        </View>
      </View>

      {racaInfo && (
        <TouchableOpacity 
          style={styles.botaoPreventivo}
          onPress={() => navigation.navigate('InfoRaca', { racaData: racaInfo })}
        >
          <MaterialCommunityIcons name="shield-check" size={24} color={colors.branco} style={{ marginRight: 10 }} />
          <Text style={styles.textoBotaoPreventivo}>VER PLANO PREVENTIVO</Text>
        </TouchableOpacity>
      )}

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>DESCRIÇÃO</Text>
        <Text style={styles.textoDescricao}>
          {pet.descricao ? pet.descricao : "Nenhuma descrição cadastrada para este pet."}
        </Text>
      </View>

      <View style={styles.secao}>
        <View style={styles.headerCalendario}>
          <Text style={styles.tituloSecao}>CALENDÁRIO</Text>
          <TouchableOpacity>
            <Text style={styles.textoAbrir}>Abrir {'>'}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.containerCalendarioEscuro}>
          <Calendar
            key={modo}
            current={mesCalendario}
            onMonthChange={(data) => setMesCalendario(data.dateString)}
            markedDates={datasMarcadas}
            theme={{
              backgroundColor: colors.superficieSecundaria,
              calendarBackground: colors.superficieSecundaria,
              textSectionTitleColor: colors.cinza,
              selectedDayBackgroundColor: colors.verdeEscuro,
              selectedDayTextColor: colors.branco,
              todayTextColor: colors.destaque,
              dayTextColor: colors.roxoMuitoEscuro,
              textDisabledColor: colors.cinza,
              dotColor: colors.destaque,
              selectedDotColor: colors.branco,
              arrowColor: colors.destaque,
              monthTextColor: colors.roxoMuitoEscuro,
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
            }}
          />
        </View>
      </View>

      <View style={styles.secao}>
        <View style={styles.headerTituloIcone}>
          <Text style={styles.tituloSecao}>STATUS DO PET</Text>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Ativar ou atualizar lembretes de consultas" accessibilityState={{ disabled: ocupado, busy: ativandoAlertas }} onPress={() => { void ativarAlertas(); }} disabled={ocupado} style={styles.botaoSininho}>
            <MaterialCommunityIcons name="bell-ring-outline" size={20} color={colors.roxoMuitoEscuro} />
            <Text style={styles.textoSininho}>{ativandoAlertas ? 'Ativando...' : 'Alertas'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardStatus}>
          <Text style={styles.tituloCardStatus}>VACINAS / LEMBRETES</Text>
          <Text style={styles.subtituloCardStatus}>{lembretes.length > 0 ? 'Agendamentos' : 'Sem agendamentos'}</Text>
          
          {lembretes && lembretes.length > 0 ? (
            lembretes.map((lembrete) => {
              const dataQuebrada = lembrete.data ? lembrete.data.split('-') : [];
              const dataFormatada = dataQuebrada.length === 3 ? `${dataQuebrada[2]}/${dataQuebrada[1]}` : '';

              return (
                <View key={lembrete.id} style={styles.itemLembrete}>
                  <View style={styles.bolinhaVerde} />
                  <Text style={styles.textoLembrete}>
                    {dataFormatada} - {lembrete.tarefa} ({lembrete.horario})
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={styles.itemLembrete}>
              <View style={styles.bolinhaVerde} />
              <Text style={styles.textoLembrete}>Nenhuma pendência</Text>
            </View>
          )}
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const criarEstilos = (colors: CoresTema) => StyleSheet.create({
  containerCentro: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: colors.superficie 
  },
  textoVazio: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: colors.roxoMuitoEscuro, 
    marginBottom: 20 
  },
  botaoVoltarErro: { 
    backgroundColor: colors.verdeMedio, 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20 
  },
  textoBotaoVoltar: { 
    color: colors.roxoMuitoEscuro, 
    fontWeight: 'bold' 
  },
  container: { 
    flex: 1, 
    backgroundColor: colors.superficie, 
    paddingHorizontal: 20, 
    paddingTop: 50 
  },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  botaoVoltar: { 
    backgroundColor: colors.verdeMedio, 
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  botaoEditar: { 
    backgroundColor: colors.verdeClaro, 
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 10 
  },
  
  botaoDeletar: { 
    backgroundColor: colors.erroSuave, 
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  
  nomePet: { 
    fontSize: 22, 
    fontWeight: '900', 
    color: colors.destaque, 
    textTransform: 'uppercase', 
    marginBottom: 15 
  },
  infoContainer: { 
    flexDirection: 'row', 
    marginBottom: 20 
  },
  imagemPet: { 
    width: 140, 
    height: 100, 
    borderRadius: 10, 
    marginRight: 15 
  },
  dadosContainer: { 
    justifyContent: 'center', 
    flex: 1 
  },
  dadoTexto: { 
    fontSize: 14, 
    color: colors.roxoMuitoEscuro, 
    marginBottom: 5, 
    fontWeight: 'bold' 
  },
  dadoLabel: { 
    fontWeight: '900' 
  },
  botaoPreventivo: { 
    flexDirection: 'row', 
    backgroundColor: colors.verdeEscuro, 
    paddingVertical: 12, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 25 
  },
  textoBotaoPreventivo: { 
    color: colors.branco, 
    fontWeight: '900', 
    fontSize: 14, 
    textTransform: 'uppercase' 
  },
  secao: { 
    marginBottom: 30 
  },
  headerCalendario: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  headerTituloIcone: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  botaoSininho: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.verdeClaro,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  textoSininho: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.roxoMuitoEscuro,
    marginLeft: 4,
  },
  tituloSecao: { 
    fontSize: 16, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro, 
    textTransform: 'uppercase' 
  },
  textoAbrir: { 
    color: colors.cinza, 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  textoDescricao: { 
    fontSize: 14, 
    color: colors.roxoMuitoEscuro, 
    fontWeight: 'bold', 
    lineHeight: 20 
  },
  containerCalendarioEscuro: { 
    backgroundColor: colors.superficieSecundaria, 
    borderRadius: 15, 
    overflow: 'hidden', 
    paddingBottom: 10, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0, 
      height: 2 
    }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84 
  },
  cardStatus: { 
    borderColor: colors.borda, 
    borderWidth: 1, 
    borderRadius: 15, 
    padding: 15, 
    backgroundColor: colors.superficie 
  },
  tituloCardStatus: { 
    fontSize: 14, 
    fontWeight: '900', 
    color: colors.roxoMuitoEscuro, 
    marginBottom: 5 
  },
  subtituloCardStatus: { 
    fontSize: 14, 
    fontWeight: '900', 
    color: colors.destaque, 
    marginBottom: 10 
  },
  itemLembrete: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 5 
  },
  bolinhaVerde: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: colors.verdeMedio, 
    marginRight: 10 
  },
  textoLembrete: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: colors.destaque 
  }
});
