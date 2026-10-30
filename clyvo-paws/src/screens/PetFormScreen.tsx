import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { CoresTema } from '../theme/colors';
import { useEstilosTema } from '../hooks/useEstilosTema';
import { usePetForm } from '../hooks/usePetForm';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function PetFormScreen() {
  const { colors, styles, modo } = useEstilosTema(criarEstilos);
  const {
    navigation, petParaEditar, nome, setNome, dataNascimento, setDataNascimento,
    mostraCalendario, setMostraCalendario, peso, setPeso, sexo, setSexo, descricao,
    setDescricao, foto, especie, racaSelecionada, setRacaSelecionada, racasDisponiveis,
    fotoParaIA, analisandoFoto, escolhendoFoto, salvando, ocupado, escolherFoto,
    identificarComIA, alterarEspecie, handleSalvar
  } = usePetForm();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
          disabled={salvando}
          accessibilityLabel="Voltar"
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.roxoMuitoEscuro}
          />
        </TouchableOpacity>

        <Text style={styles.titulo}>
          {petParaEditar ? 'EDITAR PET' : 'CADASTRAR PET'}
        </Text>
      </View>

      <Text style={styles.labelSecao}>FOTO DO PET</Text>

      <View style={styles.boxFoto}>
        <TouchableOpacity
          style={[
            styles.botaoUpload,
            ocupado && styles.botaoDesabilitado,
          ]}
          onPress={escolherFoto}
          disabled={ocupado}
          accessibilityLabel="Escolher foto do pet"
        >
          {escolhendoFoto ? (
            <ActivityIndicator color={colors.roxoMuitoEscuro} />
          ) : (
            <MaterialCommunityIcons
              name="upload"
              size={20}
              color={colors.roxoMuitoEscuro}
            />
          )}
        </TouchableOpacity>

        {foto ? (
          <Image source={{ uri: foto }} style={styles.imagemPet} />
        ) : (
          <View style={styles.placeholderImagem}>
            <MaterialCommunityIcons
              name="camera-plus"
              size={40}
              color={colors.cinza}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.botaoIA,
          (!fotoParaIA || ocupado) && styles.botaoDesabilitado,
        ]}
        onPress={identificarComIA}
        disabled={!fotoParaIA || ocupado}
        accessibilityRole="button"
      >
        {analisandoFoto ? (
          <ActivityIndicator color={colors.branco} />
        ) : (
          <MaterialCommunityIcons
            name="auto-fix"
            size={22}
            color={colors.branco}
          />
        )}

        <Text style={styles.textoBotaoIA}>
          {analisandoFoto
            ? 'ANALISANDO FOTO...'
            : 'IDENTIFICAR COM IA'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.ajudaIA}>
        {fotoParaIA
          ? 'A IA sugere a espécie e a raça. Você confere antes de aplicar.'
          : 'Selecione uma foto na galeria para usar a identificação.'}
      </Text>

      <Text style={styles.labelSecao}>NOME DO PET</Text>

      <View style={styles.inputContainer}>
        <TextInput keyboardAppearance={modo}
          style={styles.input}
          placeholder="EX: REX"
          placeholderTextColor={colors.cinza}
          value={nome}
          onChangeText={setNome}
          editable={!salvando}
        />
      </View>

      <Text style={styles.labelSecao}>DATA DE NASCIMENTO</Text>

      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setMostraCalendario(true)}
        disabled={salvando}
      >
        <Text style={styles.input}>
          {dataNascimento.toLocaleDateString('pt-BR')}
        </Text>
      </TouchableOpacity>

      {mostraCalendario && (
        <DateTimePicker
          themeVariant={modo}
          accentColor={colors.destaque}
          textColor={colors.roxoMuitoEscuro}
          value={dataNascimento}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(_event, selectedDate) => {
            setMostraCalendario(false);

            if (selectedDate) {
              setDataNascimento(selectedDate);
            }
          }}
        />
      )}

      <Text style={styles.labelSecao}>PESO (KG)</Text>

      <View style={styles.inputContainer}>
        <TextInput keyboardAppearance={modo}
          style={styles.input}
          placeholder="EX: 5.5"
          placeholderTextColor={colors.cinza}
          value={peso}
          onChangeText={setPeso}
          keyboardType="decimal-pad"
          editable={!salvando}
        />
      </View>

      <Text style={styles.labelSecao}>SEXO</Text>

      <View style={styles.botoesEspecie}>
        <TouchableOpacity
          style={[
            styles.botaoEspecie,
            sexo === 'MACHO' && styles.botaoEspecieAtivo,
          ]}
          onPress={() => setSexo('MACHO')}
          disabled={salvando}
        >
          <MaterialCommunityIcons
            name="gender-male"
            size={20}
            color={
              sexo === 'MACHO'
                ? colors.branco
                : colors.roxoMuitoEscuro
            }
          />
          <Text
            style={[
              styles.textoEspecie,
              sexo === 'MACHO' && styles.textoAtivo,
            ]}
          >
            MACHO
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botaoEspecie,
            sexo === 'FEMEA' && styles.botaoEspecieAtivo,
          ]}
          onPress={() => setSexo('FEMEA')}
          disabled={salvando}
        >
          <MaterialCommunityIcons
            name="gender-female"
            size={20}
            color={
              sexo === 'FEMEA'
                ? colors.branco
                : colors.roxoMuitoEscuro
            }
          />
          <Text
            style={[
              styles.textoEspecie,
              sexo === 'FEMEA' && styles.textoAtivo,
            ]}
          >
            FÊMEA
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.labelSecao}>DESCRIÇÃO</Text>

      <View style={[styles.inputContainer, styles.inputDescricaoContainer]}>
        <TextInput keyboardAppearance={modo}
          style={[styles.input, styles.inputArea]}
          placeholder="Descreva a personalidade do pet..."
          placeholderTextColor={colors.cinza}
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={4}
          editable={!salvando}
        />
      </View>

      <Text style={styles.labelSecao}>ESPÉCIE</Text>

      <View style={styles.botoesEspecie}>
        <TouchableOpacity
          style={[
            styles.botaoEspecie,
            especie === 'CACHORRO' && styles.botaoEspecieAtivo,
          ]}
          onPress={() => alterarEspecie('CACHORRO')}
          disabled={ocupado}
        >
          <MaterialCommunityIcons
            name="dog"
            size={24}
            color={
              especie === 'CACHORRO'
                ? colors.branco
                : colors.roxoMuitoEscuro
            }
          />
          <Text
            style={[
              styles.textoEspecie,
              especie === 'CACHORRO' && styles.textoAtivo,
            ]}
          >
            CACHORRO
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botaoEspecie,
            especie === 'GATO' && styles.botaoEspecieAtivo,
          ]}
          onPress={() => alterarEspecie('GATO')}
          disabled={ocupado}
        >
          <MaterialCommunityIcons
            name="cat"
            size={24}
            color={
              especie === 'GATO'
                ? colors.branco
                : colors.roxoMuitoEscuro
            }
          />
          <Text
            style={[
              styles.textoEspecie,
              especie === 'GATO' && styles.textoAtivo,
            ]}
          >
            GATO
          </Text>
        </TouchableOpacity>
      </View>

      {especie && (
        <>
          <Text style={styles.labelSecao}>RAÇA</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollRacas}
          >
            {racasDisponiveis.map((item) => {
              const selecionada =
                (racaSelecionada?.nome ?? '').trim().toLocaleLowerCase('pt-BR') ===
                item.nome.trim().toLocaleLowerCase('pt-BR');

              return (
                <TouchableOpacity
                  key={item.nome}
                  style={[
                    styles.tagRaca,
                    selecionada && styles.tagRacaAtiva,
                  ]}
                  onPress={() => setRacaSelecionada(item)}
                  disabled={ocupado}
                >
                  <Text
                    style={[
                      styles.textoRaca,
                      selecionada && styles.textoAtivo,
                    ]}
                  >
                    {item.nome}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput keyboardAppearance={modo}
              style={styles.input}
              placeholder="Digite ou ajuste a raça"
              placeholderTextColor={colors.cinza}
              value={racaSelecionada?.nome ?? ''}
              maxLength={50}
              editable={!ocupado}
              onChangeText={(texto) => {
                setRacaSelecionada(
                  texto.trim() ? { nome: texto } : null,
                );
              }}
            />
          </View>

          <Text style={styles.ajudaIA}>
            Selecione uma opção acima ou informe a raça manualmente.
          </Text>
        </>
      )}

      <TouchableOpacity
        style={[
          styles.botaoCadastrar,
          ocupado && styles.botaoDesabilitado,
        ]}
        onPress={handleSalvar}
        disabled={ocupado}
      >
        {salvando ? (
          <ActivityIndicator color={colors.roxoMuitoEscuro} />
        ) : (
          <Text style={styles.textoBotaoCadastrar}>
            {petParaEditar ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR PET'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const criarEstilos = (colors: CoresTema) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.superficie,
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  botaoVoltar: {
    backgroundColor: colors.verdeMedio,
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  titulo: {
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
    color: colors.roxoMuitoEscuro,
  },
  labelSecao: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.destaque,
    marginBottom: 5,
    marginTop: 10,
  },
  boxFoto: {
    borderColor: colors.borda,
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  botaoUpload: {
    backgroundColor: colors.verdeClaro,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  imagemPet: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  placeholderImagem: {
    width: 150,
    height: 100,
    borderRadius: 10,
    backgroundColor: colors.superficieSecundaria,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.cinza,
  },
  botaoIA: {
    backgroundColor: colors.verdeEscuro,
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  textoBotaoIA: {
    color: colors.branco,
    fontWeight: 'bold',
    fontSize: 14,
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  ajudaIA: {
    color: colors.cinza,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 14,
  },
  inputContainer: {
    borderColor: colors.borda,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 50,
    justifyContent: 'center',
  },
  input: {
    color: colors.roxoMuitoEscuro,
    fontWeight: 'bold',
    fontSize: 14,
  },
  inputDescricaoContainer: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  inputArea: {
    textAlignVertical: 'top',
    height: '100%',
  },
  botoesEspecie: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  botaoEspecie: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.borda,
    borderWidth: 1,
    height: 50,
    borderRadius: 25,
  },
  botaoEspecieAtivo: {
    backgroundColor: colors.verdeEscuro,
    borderColor: colors.verdeEscuro,
  },
  textoEspecie: {
    fontWeight: 'bold',
    color: colors.roxoMuitoEscuro,
    marginLeft: 8,
  },
  textoAtivo: {
    color: colors.branco,
  },
  scrollRacas: {
    marginBottom: 12,
  },
  tagRaca: {
    borderColor: colors.verdeMedio,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    justifyContent: 'center',
  },
  tagRacaAtiva: {
    backgroundColor: colors.verdeMedio,
  },
  textoRaca: {
    color: colors.roxoMuitoEscuro,
    fontWeight: 'bold',
    fontSize: 12,
  },
  botaoCadastrar: {
    backgroundColor: colors.verdeClaro,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  textoBotaoCadastrar: {
    color: colors.roxoMuitoEscuro,
    fontWeight: '900',
    fontSize: 16,
  },
});
