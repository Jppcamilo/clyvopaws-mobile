# 🐾 Clyvo VET - Prevenção e Cuidado Pet

O **Clyvo VET** é um aplicativo mobile completo desenvolvido para revolucionar o acompanhamento da saúde veterinária. Com foco no **Pilar Preventivo**, o app permite que tutores gerenciem a saúde de seus pets de forma inteligente, acompanhando tratamentos, medicações ativas e lembretes médicos conectados a uma API robusta em tempo real.

---

## 🔗 Ecossistema do Projeto

Este repositório contém apenas o **Front-end (Mobile)** da aplicação. O projeto consome uma API REST desenvolvida pela nossa equipe.
* **Repositório Back-end (Java/Spring Boot):** [CLIQUE PARA SER DIRECIONADO PARA O REPOSITÓRIO DO BACKEND](https://github.com/LucasMatsubara/clyvopawsJavaChallenge)

---

## 🎥 Demonstração do Projeto

**[CLIQUE AQUI PARA ASSISTIR AO VÍDEO DE DEMONSTRAÇÃO NO YOUTUBE](https://youtu.be/0Srws2ukES0)**

> *Vídeo demonstrando o funcionamento do aplicativo e suas integrações de ponta a ponta para o desafio proposto.*

---

## 🚀 Principais Funcionalidades

- **Autenticação Segura (JWT):** Login e cadastro integrado via API com Spring Security e persistência de tokens locais para sessões ativas.
- **Gestão Integrada de Pets (CRUD):** 
  - Cadastro detalhado vinculando o animal diretamente ao perfil do tutor logado no banco de dados em nuvem (Oracle).
  - Upload de imagens e gestão das informações preventivas do animal.
- **Prontuário e Tratamento Digital:** 
  - Integração com a API de Consultas e Medicamentos.
  - Tela inteligente de "Meus Medicamentos" que lista as prescrições médicas ativas de cada pet e exibe alertas caso o tratamento esteja vazio.
- **Dashboard Dinâmico (Home):** 
  - Tela inicial alimentada por chamadas assíncronas que lista lembretes e agendamentos médicos do dia para os animais do tutor.
- **Assistente Virtual Interativo:** 
  - Chatbot dinâmico que captura o contexto do usuário logado e oferece respostas interativas sobre dúvidas clínicas, vacinas e agendamentos simulando um ambiente de triagem.

---

## 🛠️ Tecnologias Utilizadas (Ecossistema Full Stack)

Este projeto de front-end mobile consome e reflete um robusto back-end relacional.

- **React Native & Expo** - Desenvolvimento mobile nativo e ágil.
- **TypeScript** - Segurança de tipagem estática em toda a aplicação.
- **Axios & React Query (@tanstack/react-query)** - Gestão de estados assíncronos, cacheamento inteligente e comunicação HTTP com a API.
- **Expo Secure Store & AsyncStorage** - Armazenamento criptografado de tokens JWT e gestão de dados do tutor no dispositivo.
- **Bibliotecas Extras Nativa e de UI:**
  - `@expo/vector-icons` - UI limpa e amigável (MaterialCommunityIcons).
  - `expo-image-picker` - Acesso nativo à câmera e galeria do dispositivo para fotos dos pets.
  - `react-native-calendars` - Gestão visual interativa do calendário de saúde.
  - `@react-native-community/datetimepicker` - Seleção nativa de datas para formulários de agendamento e nascimento.

---

## 📱 Como Executar o Projeto (Front-End)

Siga os passos abaixo para rodar o projeto localmente em seu ambiente de desenvolvimento.

### Pré-requisitos
- Node.js instalado.
- App do **Expo Go** instalado no seu smartphone (Android ou iOS), ou um emulador configurado.
- *Nota: Para o funcionamento completo, certifique-se de que o servidor back-end Java está rodando localmente na mesma rede e ajuste a `baseURL` no arquivo `src/services/api.ts`.*

### Passo a Passo

1. **Clone o repositório**
   `git clone <link-do-seu-repositorio-github>`

2. **Acesse a pasta do projeto**
   `cd clyvo-vet`

3. **Instale as dependências**
   `npm install`

4. **Inicie o servidor do Expo**
   `npx expo start`

5. **Teste no dispositivo**
   - Escaneie o **QR Code** exibido no terminal com a câmera do seu celular (iOS) ou app Expo Go (Android).

---

## 👥 Equipe de Desenvolvimento (FIAP)

Projeto desenvolvido para o Challenge da FIAP - Curso de Análise e Desenvolvimento de Sistemas.

* **João Pedro Pereira Camilo** (RM 562005)
* **Lucas Matsubara** (RM 565020)
* **Pamella Christiny** (RM 565206)
* **Felipe Ribeiro Salles de Camargo** (RM565224)
