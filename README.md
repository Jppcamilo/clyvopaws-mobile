# 🐾 Clyvo VET - Prevenção e Cuidado Pet

O **Clyvo VET** é um aplicativo mobile desenvolvido para revolucionar o acompanhamento da saúde veterinária. Com um forte foco no **Pilar Preventivo**, o app permite que tutores gerenciem a saúde de seus pets de forma inteligente, recebendo diretrizes médicas e alertas de cuidados específicos baseados na genética e predisposição de cada raça.

---

## 🎥 Demonstração do Projeto

**[CLIQUE AQUI PARA ASSISTIR AO VÍDEO DE DEMONSTRAÇÃO NO YOUTUBE] (Insira seu link aqui)**

> *Vídeo narrado demonstrando todas as telas, fluxo de navegação, funcionamento dos formulários com manipulação de estado (useState) e a persistência de dados utilizando AsyncStorage (incluindo a restauração dos dados ao reiniciar o app).*

---

## 🚀 Principais Funcionalidades

- **Autenticação e Perfil do Tutor:** Cadastro de usuários com gestão de sessão local.
- **Gestão Inteligente de Pets (CRUD Completo com AsyncStorage):**
  - Cadastro detalhado com cálculo automático de idade, Peso, Sexo, Espécie e Raça usando formulários interativos.
  - Edição de dados e exclusão segura persistidos localmente.
  - Upload de fotos do pet diretamente da galeria do dispositivo.
- **Mapeamento Preventivo (Diferencial):** Sistema que cruza a espécie e raça do animal com um banco de dados clínico, exibindo automaticamente um **Plano Preventivo** logo após o cadastro ou na ficha do pet.
- **Dashboard Dinâmico (Home):** Tela inicial inteligente que exibe alertas e lembretes de saúde reais baseados nos dados salvos.
- **Calendário de Saúde:** Integração com calendário interativo.
- **Assistente Virtual:** Protótipo visual de chat integrado para suporte e triagem.

---

## 🛠️ Tecnologias Utilizadas

Projeto desenvolvido atendendo aos requisitos da disciplina de Mobile Application Development:

- **React Native** - Framework principal.
- **Expo** - Plataforma para desenvolvimento, build e testes rápidos.
- **TypeScript** - Tipagem estática para maior segurança.
- **AsyncStorage** - Persistência de dados locais (conforme exigência do Challenge).
- **React Navigation** - Navegação fluida entre as mais de 5 rotas da aplicação.
- **Bibliotecas Extras:**
  - `@expo/vector-icons` (MaterialCommunityIcons para iconografia)
  - `expo-image-picker` (Acesso à câmera/galeria)
  - `react-native-calendars` (Gestão de calendário visual)
  - `@react-native-community/datetimepicker` (Seleção nativa de datas)

---

## 📱 Como Executar o Projeto

Siga os passos abaixo para rodar o projeto localmente em seu ambiente de desenvolvimento.

### Pré-requisitos
- Node.js instalado.
- App do **Expo Go** instalado no seu smartphone (Android ou iOS), ou um emulador configurado no computador.

### Passo a Passo

1. **Clone o repositório**
   git clone <link-do-seu-repositorio-github-classroom>

2. **Acesse a pasta do projeto**
   cd clyvo-vet

3. **Instale as dependências**
   npm install

4. **Inicie o servidor do Expo**
   npx expo start

5. **Teste no dispositivo**
   - Abra a câmera do seu celular (ou o app Expo Go no Android) e escaneie o **QR Code** exibido no terminal.
   - Para rodar no emulador, pressione `a` (para Android) ou `i` (para iOS) no terminal.

---

## 👥 Equipe de Desenvolvimento (FIAP)

Projeto desenvolvido para o Challenge da FIAP - Curso de Análise e Desenvolvimento de Sistemas (Turmas de Fevereiro).

* **João Pedro Camilo** (RM 562005)
* **Lucas Matsubara** (RM 565020)
* **Pamella Christiny** (RM 565206)