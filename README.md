# 🐾 ClyvoPaws — Prevenção e Cuidado Pet

Aplicativo mobile desenvolvido para o Challenge da FIAP, com foco na organização dos cuidados com animais de estimação.

O projeto permite gerenciar o perfil do tutor, cadastrar pets, agendar consultas e consultar medicamentos e informações preventivas. O aplicativo utiliza React Native com Expo e consome uma API REST desenvolvida em Java.

## 🔗 Links do projeto

- [Repositório Mobile](https://github.com/Jppcamilo/clyvopaws-mobile)
- [Repositório Backend — Java](https://github.com/LucasMatsubara/clyvopawsJavaChallenge)
- [API hospedada no Render](https://clyvopawsjavachallenge.onrender.com)
- [Vídeo de demonstração anterior](https://youtu.be/0Srws2ukES0)

> A demonstração da Sprint 4 será adicionada após a gravação e a validação das funcionalidades pendentes.

## 📱 Funcionalidades

### Conta e autenticação

- Cadastro e login de tutores pela API.
- Armazenamento do token JWT com Expo SecureStore.
- Restauração da sessão enquanto o token estiver válido.
- Verificação da expiração do token.
- Encerramento da sessão quando uma requisição autenticada recebe HTTP 401.
- Navegação condicionada ao estado da sessão.
- Edição de dados pessoais e exclusão da conta.
- Limpeza do cache e dos lembretes locais ao sair da conta.

### Gestão dos pets

- Cadastro, listagem, edição e exclusão.
- Associação dos pets ao tutor autenticado.
- Registro de nome, nascimento, peso, sexo, espécie, raça e descrição.
- Seleção de foto na galeria.
- Informações preventivas das raças presentes no catálogo local.
- Visualização dos agendamentos de cada pet.

### Consultas e lembretes

- Consulta dos horários disponíveis de veterinários.
- Agendamento com seleção de clínica, pet, horário e motivo.
- Visualização de agendamentos na Home e nos detalhes do pet.
- Calendário com marcações das consultas.
- Ativação manual de notificações locais para duas horas antes das consultas, quando houver antecedência suficiente.

### Medicamentos

- Listagem paginada dos medicamentos retornados pela API.
- Exibição das informações de tratamento.
- Estados de carregamento, erro e lista vazia.

### Rede clínica e assistência

- Exibição das clínicas cadastradas no aplicativo.
- Identificação da região do dispositivo mediante permissão.
- Acesso aos contatos das clínicas.
- Assistente de navegação com respostas predefinidas sobre o aplicativo.

### Identificação de pets por IA

O frontend possui um fluxo para enviar uma foto à API e receber sugestões de espécie e raça.

- Preparação e compressão da imagem antes do envio.
- Envio da foto como multipart/form-data.
- Tratamento de falhas e cancelamento da análise.
- Confirmação do tutor antes de aplicar a sugestão.
- Possibilidade de preencher os dados manualmente.

> A integração mobile está implementada. A validação completa depende da publicação e configuração do endpoint de IA no backend hospedado no Render.
>
> A identificação por imagem é uma sugestão e pode apresentar erros.

## 🛠️ Tecnologias

| Tecnologia | Utilização |
| --- | --- |
| React Native e Expo | Desenvolvimento mobile |
| TypeScript | Tipagem estática |
| React Navigation | Navegação por telas e abas |
| TanStack Query | Consultas, mutations e cache |
| Axios | Comunicação HTTP e interceptors |
| Expo SecureStore | Armazenamento do JWT |
| AsyncStorage | Persistência dos dados básicos do tutor |
| jwt-decode | Leitura da expiração do token |
| Expo Image Picker | Seleção de imagens da galeria |
| Expo Image Manipulator | Preparação das fotos enviadas à IA |
| Expo Notifications | Notificações locais de consultas |
| Expo Location | Obtenção da região do dispositivo |
| React Native Calendars | Calendário dos agendamentos |
| DateTimePicker | Seleção de datas |

O backend é mantido em um repositório separado, com Java, Spring Boot e banco de dados Oracle.

## 🧩 Organização do código

O aplicativo fica dentro da pasta `clyvo-paws`.

| Caminho | Responsabilidade |
| --- | --- |
| `clyvo-paws/App.tsx` | Inicialização, navegação, sessão e providers |
| `clyvo-paws/src/screens/` | Telas e apresentação dos dados |
| `clyvo-paws/src/components/` | Componentes reutilizáveis |
| `clyvo-paws/src/hooks/` | Estado e regras dos fluxos da aplicação |
| `clyvo-paws/src/services/` | Comunicação com a API e persistência da sessão |
| `clyvo-paws/src/types/` | Tipos compartilhados e contratos da API |
| `clyvo-paws/src/utils/` | Funções auxiliares de datas, JWT e notificações |
| `clyvo-paws/src/data/` | Catálogos locais |
| `clyvo-paws/src/theme/` | Cores da interface |

### Principais hooks

- `useLogin` e `useLogout`: entrada e saída da conta.
- `useCadastro`: cadastro do tutor.
- `usePerfil`: consulta, edição e exclusão do perfil.
- `useSessaoApp`: inicialização e acompanhamento da sessão.
- `useSessaoLocal`: acesso aos dados básicos do tutor.
- `useMeusPets`: listagem dos pets.
- `usePetForm`: cadastro, edição e identificação por IA.
- `usePetDetails`: detalhes, exclusão e lembretes do pet.
- `useConsultas`: horários disponíveis e agendamento.
- `useMedicamentos`: listagem paginada dos medicamentos.
- `useHome`: dados e interações da tela inicial.
- `useFotoGaleria`: seleção da foto do perfil.
- `useRedeClinica`: localização do dispositivo.
- `useChat`: respostas do assistente de navegação.

> Os hooks `useSessaoLocal` e `useMedicamentos` estão nos arquivos `useSessaolocal.ts` e `useMedicamento.ts`, respectivamente.

## 🔐 Gerenciamento da sessão

Após o login, o JWT é armazenado no SecureStore e os dados básicos do tutor são armazenados no AsyncStorage.

O aplicativo verifica a expiração do token ao restaurar a sessão, antes das requisições autenticadas e durante o uso. Também verifica novamente quando volta ao primeiro plano.

Os interceptors do Axios adicionam o token às requisições protegidas e tratam respostas HTTP 401. Quando a sessão é encerrada, as telas privadas deixam de ficar disponíveis.

O cache das consultas é separado por sessão para evitar reaproveitar dados da conta anterior.

**Não há renovação automática por refresh token nesta versão.** Quando o token expira, o usuário precisa entrar novamente. A leitura do JWT no aplicativo não substitui a validação realizada pelo backend.

## 🚀 Como executar

### Pré-requisitos

- Node.js e npm compatíveis com a versão do Expo utilizada no projeto.
- Git.
- Expo Go compatível com o SDK do projeto ou um ambiente de desenvolvimento nativo configurado.
- Acesso à internet e ao backend.

### 1. Clonar o repositório

```bash
git clone https://github.com/Jppcamilo/clyvopaws-mobile.git
```

### 2. Entrar na pasta do aplicativo

```bash
cd clyvopaws-mobile/clyvo-paws
```

> Execute os comandos de instalação e do Expo dentro de `clyvo-paws`, onde está o `package.json`.

### 3. Instalar as dependências

```bash
npm ci
```

### 4. Verificar a tipagem

```bash
npx tsc --noEmit
```

Quando o comando termina sem mensagens de erro, a verificação de tipos foi concluída com sucesso. Isso não substitui os testes das funcionalidades no dispositivo.

### 5. Iniciar o aplicativo

```bash
npx expo start
```

Abra o projeto pelo QR Code no dispositivo ou utilize um emulador compatível.

## 🌐 Configuração da API

A URL principal está em:

`clyvo-paws/src/services/api.ts`

```ts
const api = axios.create({
  baseURL: 'https://clyvopawsjavachallenge.onrender.com',
  timeout: 15000,
});
```

Os serviços utilizam caminhos relativos. Por exemplo:

```ts
api.post('/login', dados);
```

Essa chamada utiliza o endereço:

```text
https://clyvopawsjavachallenge.onrender.com/login
```

Não é necessário repetir o domínio em cada serviço.

### Rotas utilizadas pelo frontend

| Método | Rota | Finalidade |
| --- | --- | --- |
| POST | `/login` | Autenticação |
| POST | `/tutores` | Cadastro do tutor |
| GET | `/tutores/{id}` | Consulta do perfil |
| PUT | `/tutores/{id}` | Atualização do perfil |
| DELETE | `/tutores/{id}` | Exclusão da conta |
| GET | `/pets/tutor/{tutorId}` | Pets do tutor |
| GET | `/pets/{id}` | Detalhes do pet |
| POST | `/pets` | Cadastro do pet |
| PUT | `/pets/{id}` | Atualização do pet |
| DELETE | `/pets/{id}` | Exclusão do pet |
| GET | `/agendas/veterinario/{veterinarioId}` | Horários disponíveis |
| GET | `/agendamentos/tutor/{tutorId}` | Agendamentos do tutor |
| GET | `/agendamentos/pet/{petId}` | Agendamentos do pet |
| POST | `/agendamentos` | Criação do agendamento |
| GET | `/medicamentos?page=0&size=10` | Listagem paginada |
| POST | `/api/ia/analisar-pet` | Análise da foto, dependente da publicação do backend |

## 🧪 Roteiro de testes

1. Cadastrar uma conta e realizar login.
2. Fechar e abrir o aplicativo para verificar a restauração da sessão.
3. Editar o perfil e conferir os dados exibidos.
4. Alterar o e-mail e entrar novamente com o novo endereço.
5. Cadastrar, listar, editar e excluir um pet de teste.
6. Selecionar clínica, pet e horário disponível para agendar uma consulta.
7. Conferir o agendamento na Home e nos detalhes do pet.
8. Consultar a tela de medicamentos.
9. Ativar e verificar os lembretes em um dispositivo.
10. Sair da conta e verificar o retorno ao login.
11. Testar a identificação por foto após a publicação da IA.
12. Verificar o comportamento com sessão expirada e falha de conexão.

Use dados de teste para as operações de exclusão.

## 📌 Limitações e pendências

- **IA:** falta concluir a publicação e a validação da integração no Render.
- **Fotos:** o cadastro atualmente envia a URI da imagem selecionada. Não há upload permanente da foto de perfil ou do pet para um serviço de arquivos; essas imagens podem não funcionar em outro dispositivo.
- **Sessão:** tokens expirados exigem novo login; não há refresh automático.
- **Consultas:** dependem de agendas futuras e disponíveis cadastradas no banco.
- **Clínicas:** o vínculo entre clínicas e veterinários está definido no frontend e precisa corresponder aos IDs do banco.
- **Notificações:** são locais, dependem de permissão e precisam ser ativadas pelo usuário. São removidas no encerramento da sessão.
- **Assistente:** utiliza respostas predefinidas; não realiza atendimento veterinário.
- **Produtos:** o catálogo é demonstrativo, sem fluxo completo de compra.

## 🔄 Evolução na Sprint 4

- Separação das regras dos principais fluxos em hooks.
- Centralização das requisições em serviços.
- Organização dos tipos compartilhados.
- Verificação da validade do JWT e tratamento de sessão expirada.
- Navegação condicionada à autenticação.
- Limpeza do cache na troca de sessão.
- Melhorias nas validações, mensagens de erro e estados de carregamento.
- Integração do frontend com a API hospedada no Render.
- Preparação do fluxo de identificação de pets por imagem.

## 👥 Equipe

Projeto desenvolvido para o Challenge da FIAP — Análise e Desenvolvimento de Sistemas.

| Integrante | RM |
| --- | --- |
| João Pedro Pereira Camilo | 562005 |
| Lucas Matsubara | 565020 |
| Pamella Christiny | 565206 |
| Felipe Ribeiro Salles de Camargo | 565224 |