# 🐾 ClyvoPaws — Prevenção e Cuidado Pet

Aplicativo desenvolvido para o Challenge da FIAP, no curso de Análise e Desenvolvimento de Sistemas.

O ClyvoPaws reúne ferramentas para organizar os cuidados com animais de estimação: gerenciamento de pets, consultas, lembretes, medicamentos e identificação de espécie e raça por imagem.

O aplicativo utiliza React Native com Expo e uma API REST em Java integrada ao banco de dados Oracle.

## 🔗 Repositórios e serviços

- [Aplicativo Mobile](https://github.com/Jppcamilo/clyvopaws-mobile)
- [Backend Java](https://github.com/LucasMatsubara/clyvopawsJavaChallenge)
- [Serviço de IA](https://github.com/Jppcamilo/IA-Sprint3-IOT)
- [API Java no Render](https://clyvopawsjavachallenge.onrender.com)
- [Serviço de IA no Render](https://clyvopaws-ia.onrender.com)

## 📦 Distribuição e demonstração

| Entrega                            | Situação                                  |
|------------------------------------|-------------------------------------------|
| APK no Firebase App Distribution   | Publicado (versão 1.0.0, build 1)         |
| Acesso do professor à distribuição | Convite enviado pelo Firebase             |
| Vídeo da Sprint 4                  | Gravação pendente                         |

[Vídeo da demonstração anterior](https://youtu.be/uoStI_ok_UQ)

### Instalação do APK (Android)

O APK foi distribuído pelo Firebase App Distribution e é compatível apenas com dispositivos **Android**.

1. Abra o e-mail de convite do Firebase **no celular Android** e aceite o convite.
2. Instale o app pelo link do e-mail ou pelo aplicativo **Firebase App Tester**.
3. Se o Android solicitar, autorize a instalação de apps de fontes desconhecidas.
4. Conceda as permissões solicitadas (notificações e localização) para testar todos os fluxos.

> Link de convite: [LINK DO FIREBASE](https://appdistribution.firebase.dev/i/f62bd58ed0deb8e2)

> A API está hospedada no Render. Na primeira requisição, o servidor pode levar alguns segundos para responder.

### Geração do APK

O APK foi gerado com o EAS Build, usando o perfil `preview` do `eas.json`:

## 📱 Funcionalidades

### Conta e autenticação

- Cadastro e login de tutores.
- Edição do perfil e exclusão da conta.
- Armazenamento das credenciais de sessão com Expo SecureStore.
- Restauração da sessão ao reabrir o aplicativo.
- Renovação automática do JWT por refresh token.
- Tratamento de sessão expirada e falhas de conexão.
- Navegação condicionada à autenticação.
- Limpeza do cache e dos lembretes locais ao encerrar a sessão.

### Gestão dos pets

- Cadastro, listagem, edição e exclusão.
- Associação dos pets ao tutor autenticado.
- Registro de nome, espécie, raça, nascimento, peso, sexo e descrição.
- Seleção e envio de fotos.
- Consulta das informações preventivas disponíveis no catálogo de raças.
- Visualização dos agendamentos de cada pet.

### Fotos persistentes

- Envio das fotos do tutor e dos pets para a API Java.
- Preparação e compressão da imagem antes do upload.
- Armazenamento das imagens no banco Oracle pelo backend.
- Exibição das fotos por URLs retornadas pela API.

> Fotos antigas que foram salvas apenas como caminhos locais do celular precisam ser selecionadas e enviadas novamente.

### Consultas e notificações

- Consulta dos horários disponíveis.
- Agendamento com seleção de clínica, pet, horário e motivo.
- Visualização das consultas na Home e nos detalhes do pet.
- Calendário com marcações dos agendamentos.
- Ativação de lembretes pelo botão **Alertas**.
- Notificações locais programadas para duas horas antes da consulta.
- Abertura dos detalhes do pet relacionado à consulta ao tocar na notificação.

O lembrete só é programado quando o horário de envio ainda está no futuro. É necessário conceder as permissões solicitadas pelo aparelho.

### Identificação de pets por IA

- Seleção de uma foto do animal.
- Preparação e envio da imagem à API Java, que se comunica com o serviço de IA.
- Sugestão de espécie e raça provável.
- Exibição do resultado e de informações sobre a análise.
- Confirmação do tutor antes de aplicar a sugestão ao formulário.
- Tratamento de falhas e cancelamento da análise.
- Preenchimento manual disponível quando a análise não puder ser concluída.

> A identificação por imagem pode apresentar erros e não substitui a avaliação veterinária.

### Medicamentos e assistência

- Listagem paginada de medicamentos retornados pela API.
- Exibição de informações de tratamento.
- Consulta das clínicas e dos contatos disponíveis no aplicativo.
- Identificação da região do dispositivo mediante permissão.
- Assistente de navegação com respostas predefinidas sobre o aplicativo.

### Catálogo e carrinho

- Busca de produtos pelo nome.
- Filtros por categoria.
- Tela de detalhes com foto e preço.
- Adição de produtos ao carrinho.
- Alteração de quantidades e remoção de itens.
- Opção de esvaziar o carrinho com confirmação.
- Cálculo dos subtotais e do total estimado.
- Contador de itens compartilhado entre as telas.
- Persistência local do carrinho, separada por conta.

O carrinho é demonstrativo e utiliza produtos e preços do catálogo local. Não realiza pedidos, pagamentos, controle de estoque ou entregas.

Os itens ficam salvos no aparelho e não são sincronizados entre dispositivos.

### Aparência e informações do aplicativo

- Temas claro e escuro.
- Persistência da preferência de aparência.
- Tela **Sobre o aplicativo**, acessível pela área de ajuda.
- Informações do projeto e dos integrantes.
- Exibição da versão e do commit associado ao código da build.

## 🛠️ Tecnologias

| Tecnologia | Utilização |
| --- | --- |
| React Native e Expo SDK 58 | Aplicativo mobile |
| TypeScript | Tipagem estática |
| React Navigation | Navegação entre telas e abas |
| TanStack Query | Consultas, mutations e cache |
| Axios | Comunicação HTTP e interceptors |
| Expo SecureStore | Persistência das credenciais da sessão |
| AsyncStorage | Preferência de tema e carrinho local |
| Expo Image Picker | Seleção de imagens |
| Expo Image Manipulator | Preparação e compressão das fotos |
| Expo Notifications | Lembretes locais |
| Expo Location | Localização mediante permissão |
| React Native Calendars | Calendário dos agendamentos |
| DateTimePicker | Seleção de datas |

O backend utiliza Java, Spring Boot e Oracle. A identificação por imagem utiliza um serviço separado de IA.

## 🧩 Organização do código

O aplicativo está dentro da pasta `clyvo-paws`.

| Caminho | Responsabilidade |
| --- | --- |
| `App.tsx` | Inicialização, providers e navegação |
| `src/screens/` | Telas e apresentação dos dados |
| `src/components/` | Componentes reutilizáveis |
| `src/hooks/` | Estado e lógica dos fluxos da aplicação |
| `src/services/` | API, persistência e serviços compartilhados |
| `src/types/` | Tipos e contratos da aplicação |
| `src/utils/` | Funções auxiliares |
| `src/data/` | Catálogos locais e informações do projeto |
| `src/theme/` | Paletas, estado e configuração dos temas |

As telas utilizam hooks para coordenar os fluxos. Os serviços concentram as requisições e a persistência, reduzindo a lógica diretamente nos componentes visuais.

Exemplos:

- `usePetForm`: cadastro, edição e identificação do pet por IA.
- `usePerfil`: consulta e atualização do perfil.
- `useSessaoApp`: acompanhamento da sessão.
- `useCatalogo`: busca e filtros dos produtos.
- `useCarrinho`: estado compartilhado e operações do carrinho.
- `fotoService`: preparação e upload de fotos.
- `sessaoService`: armazenamento e renovação da sessão.
- `notificacaoService`: permissões e agendamento dos lembretes.
- `carrinhoService`: persistência, validações e cálculos em centavos.

## 🔐 Gerenciamento da sessão

O login retorna um token de acesso e um refresh token. As credenciais e os dados básicos necessários à sessão são armazenados no Expo SecureStore.

O aplicativo verifica a validade da sessão ao iniciar, antes das requisições protegidas e ao retornar ao primeiro plano. Quando necessário, solicita um novo token de acesso ao backend.

Os interceptors adicionam o JWT às requisições autenticadas. Em caso de HTTP 401, o aplicativo pode renovar a sessão e repetir a requisição uma única vez, evitando tentativas infinitas.

Quando a renovação é recusada ou a sessão não pode mais ser utilizada, o usuário precisa entrar novamente. Falhas temporárias de conexão durante a renovação são tratadas sem apagar automaticamente uma sessão ainda recuperável.

O cache e a navegação acompanham as mudanças de sessão para evitar a exibição de dados da conta anterior.

## 🚀 Como executar

### Pré-requisitos

- Git.
- Node.js e npm compatíveis com o SDK do projeto.
- Dispositivo ou emulador compatível.
- Expo Go compatível para os fluxos suportados, ou uma build de desenvolvimento.
- Acesso à internet para as funcionalidades integradas ao backend.

### Instalação

```bash
git clone https://github.com/Jppcamilo/clyvopaws-mobile.git
cd clyvopaws-mobile/clyvo-paws
npm ci
```

> Execute os comandos do aplicativo dentro de `clyvo-paws`, onde está o `package.json`.

### Verificações

```bash
npx tsc --noEmit
npx expo-doctor@latest
```

A verificação de tipos e o diagnóstico das dependências não substituem os testes no aparelho.

### Inicialização

```bash
npx expo start
```

Para reiniciar o servidor de desenvolvimento limpando o cache:

```bash
npx expo start -c
```

As permissões e o comportamento das notificações devem ser conferidos também no APK que será distribuído.

## 🌐 Configuração da API

A configuração compartilhada está em:

`clyvo-paws/src/services/httpAuth.ts`

```ts
export const API_CONFIG = {
  baseURL: 'https://clyvopawsjavachallenge.onrender.com',
  timeout: 30000,
};
```

Os serviços utilizam rotas relativas, combinadas com essa URL base. Não é necessário repetir o domínio em cada requisição.

`src/services/api.ts` configura os interceptors das chamadas autenticadas.

### Principais rotas

| Método | Rota | Finalidade |
| --- | --- | --- |
| POST | `/login` | Login |
| POST | `/auth/refresh` | Renovação da sessão |
| POST | `/auth/logout` | Encerramento da sessão |
| POST | `/tutores` | Cadastro do tutor |
| GET / PUT / DELETE | `/tutores/{id}` | Consulta, atualização e exclusão do tutor |
| GET | `/pets/tutor/{tutorId}` | Pets do tutor |
| POST | `/pets` | Cadastro do pet |
| GET / PUT / DELETE | `/pets/{id}` | Consulta, atualização e exclusão do pet |
| GET | `/fotos/{id}` | Exibição de uma foto armazenada |
| GET | `/agendas/veterinario/{veterinarioId}` | Horários disponíveis |
| GET | `/agendamentos/tutor/{tutorId}` | Agendamentos do tutor |
| GET | `/agendamentos/pet/{petId}` | Agendamentos do pet |
| POST | `/agendamentos` | Agendamento de consulta |
| GET | `/medicamentos` | Listagem paginada |
| POST | `/api/ia/analisar-pet` | Análise da foto do animal |

O catálogo e o carrinho funcionam no frontend, sem rotas de compra no backend.

## 🧪 Roteiro de validação

- Cadastrar uma conta e realizar login.
- Fechar e abrir o aplicativo para conferir a restauração da sessão.
- Verificar a renovação do JWT e o comportamento com falha de conexão.
- Editar os dados e a foto do tutor.
- Cadastrar, editar e excluir um pet de teste.
- Conferir a persistência das fotos após reabrir o aplicativo.
- Analisar uma foto por IA e confirmar a sugestão no formulário.
- Agendar uma consulta e conferir sua exibição.
- Ativar um lembrete, verificar o recebimento e tocar na notificação.
- Consultar os medicamentos.
- Buscar produtos, filtrar categorias e abrir os detalhes.
- Adicionar, alterar e remover itens do carrinho.
- Reabrir o aplicativo e conferir a restauração do carrinho.
- Trocar de conta e verificar a separação dos dados.
- Alternar os temas claro e escuro.
- Conferir a versão e o commit na tela Sobre.
- Sair da conta e verificar o retorno ao login.

Utilize contas e registros de teste para as operações de exclusão.

## 📌 Limitações e observações

- Consultas dependem de horários futuros disponíveis no backend.
- O vínculo entre clínicas e veterinários definido no frontend deve corresponder aos IDs do banco.
- Os lembretes são locais, precisam de permissão e são ativados pelo usuário.
- Ao sair da conta, os lembretes locais são removidos. Ative-os novamente quando necessário.
- Após alterações nas consultas, utilize **Alertas** para atualizar os lembretes do pet.
- A IA depende da disponibilidade do serviço e do provedor do modelo.
- O assistente utiliza respostas predefinidas e não realiza atendimento veterinário.
- O carrinho possui limite de 99 unidades por produto e não representa estoque real.
- Desinstalar o aplicativo ou apagar seus dados pode remover o carrinho e as preferências locais.

## 👥 Equipe

FIAP — Análise e Desenvolvimento de Sistemas.

| Integrante | RM |
| --- | --- |
| João Pedro Pereira Camilo | 562005 |
| Lucas Matsubara | 565020 |
| Pamella Christiny | 565206 |
| Felipe Ribeiro Salles de Camargo | 565224 |
