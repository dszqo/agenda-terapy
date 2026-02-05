# Agenda Terapia

Sistema completo de gerenciamento de agenda de pacientes de terapia com controle de sessões, visualização de horários e sincronização online.

## ✨ Funcionalidades

### Gerenciamento de Pacientes
- ✅ **Adicionar novos pacientes** com formulário completo
- ✅ **Editar informações** de pacientes existentes
- ✅ **Remover pacientes** com confirmação
- ✅ **26 pacientes reais** já cadastrados como exemplo

### Visualização
- 📅 **Grade de horários visual** (07:00 - 22:00)
  - Vista desktop: tabela completa semanal
  - Vista mobile: lista otimizada por dia
- 📋 **Lista de pacientes** agrupada por dia da semana
- 💳 **Controle de sessões pendentes** com botões +/-
- 📊 **Estatísticas em tempo real**
- 🔍 **Filtro por dia da semana**

### Sincronização de Dados
- 🔄 **Firebase (opcional)**: Sincronização automática entre dispositivos
- 💾 **LocalStorage**: Funciona offline, dados salvos no navegador
- 🔒 **Seguro**: Seus dados ficam privados

## 🚀 Como Usar

### Opção 1: Usar Localmente (Sem Sincronização)

O site funciona perfeitamente com **LocalStorage** (dados salvos apenas no navegador):

1. Baixe os arquivos
2. Abra `index.html` no navegador
3. Pronto! Seus dados serão salvos automaticamente no navegador

**Vantagens**: Simples, funciona offline
**Limitação**: Dados ficam apenas neste dispositivo

### Opção 2: Publicar no GitHub Pages (Recomendado)

Para ter um link permanente e acessar de qualquer lugar:

1. **Criar Repositório no GitHub**
   - Acesse [github.com](https://github.com) e faça login
   - Clique em **"New repository"**
   - Nome: `agenda-terapia`
   - Deixe como **Public**
   - Clique em **"Create repository"**

2. **Fazer Upload dos Arquivos**
   - Clique em **"uploading an existing file"**
   - Arraste todos os arquivos desta pasta
   - Clique em **"Commit changes"**

3. **Ativar GitHub Pages**
   - Vá em **Settings** → **Pages**
   - Source: **"Deploy from a branch"**
   - Branch: **"main"** / **"/ (root)"**
   - Clique em **Save**

4. **Acessar o Site**
   - Após 2-3 minutos: `https://seu-usuario.github.io/agenda-terapia/`

### Opção 3: Com Sincronização Firebase (Avançado)

Para sincronizar dados entre todos os seus dispositivos:

1. Siga o **[Guia de Configuração do Firebase](FIREBASE_SETUP.md)**
2. Configure suas credenciais no arquivo `firebase-config.js`
3. Faça upload para o GitHub Pages
4. Pronto! Seus dados sincronizam automaticamente

## 📱 Uso no Celular

O site é **totalmente responsivo** e otimizado para mobile:

- Grade de horários adaptada para tela pequena
- Botões grandes e fáceis de tocar
- Scroll suave e natural
- Funciona perfeitamente em qualquer navegador mobile

**Dica**: Adicione à tela inicial do celular para acesso rápido:
- **iPhone**: Safari → Compartilhar → Adicionar à Tela de Início
- **Android**: Chrome → Menu (⋮) → Adicionar à tela inicial

## 🎨 Como Usar as Funcionalidades

### Adicionar Paciente

1. Clique no botão **"+ Adicionar Paciente"** no topo
2. Preencha as informações:
   - Nome do paciente
   - Dia da semana
   - Horário
   - Saldo de sessões (positivo = crédito, negativo = dívida)
   - Observações (opcional)
3. Clique em **"Salvar"**

### Editar Paciente

- **Na grade de horários**: Clique no ícone ✏️ no card do paciente
- **Na lista de pacientes**: Clique no botão "✏️ Editar"

### Remover Paciente

- **Na grade de horários**: Clique no ícone 🗑️ no card do paciente
- **Na lista de pacientes**: Clique no botão "🗑️ Remover"
- Confirme a remoção

### Controlar Sessões

1. Vá na aba **"💳 Sessões Pendentes"**
2. Use os botões **+** e **-** para ajustar o saldo
   - **Positivo** (+1, +2...): Paciente tem crédito
   - **Zero** (0): Sessão pendente
   - **Negativo** (-1, -2...): Paciente deve sessões

### Filtrar por Dia

- Clique nos botões de dias da semana (Seg, Ter, Qua...)
- Clique em **"Todos"** para ver a semana completa

## 📁 Estrutura do Projeto

```
agenda-terapia/
├── index.html              # Estrutura HTML principal
├── styles.css              # Estilos visuais (desktop + mobile)
├── app.js                  # Lógica da aplicação
├── data.js                 # Dados dos pacientes
├── storage.js              # Gerenciamento de armazenamento
├── firebase-config.js      # Configuração do Firebase (opcional)
├── README.md               # Este arquivo
└── FIREBASE_SETUP.md       # Guia de configuração do Firebase
```

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Grid, Flexbox, Gradientes, Responsividade
- **JavaScript (Vanilla)**: Sem frameworks, puro e rápido
- **LocalStorage**: Persistência local de dados
- **Firebase Realtime Database** (opcional): Sincronização online

## 🎯 Status dos Pacientes

O sistema usa cores para indicar o status:

| Cor | Status | Significado |
|-----|--------|-------------|
| 🟢 Verde | Ativo | Paciente tem crédito de sessões |
| 🟡 Amarelo | Pendente | Saldo zero, precisa pagar |
| 🔴 Vermelho | Devendo | Paciente deve sessões |

## 🔒 Privacidade e Segurança

- **Dados locais**: Por padrão, seus dados ficam apenas no seu navegador
- **Firebase (opcional)**: Se configurado, dados ficam em banco privado na nuvem
- **Sem rastreamento**: Não coletamos nenhuma informação pessoal
- **Código aberto**: Todo o código está disponível para auditoria

## 📝 Personalização

### Adicionar Mais Horários

Edite `app.js`, função `renderDesktopSchedule`:

```javascript
// Altere o range de horários
for (let hour = 6; hour <= 23; hour++) {  // 06:00 - 23:00
```

### Mudar Cores

Edite `styles.css`:

```css
/* Gradiente de fundo */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Cor principal */
.btn-primary { background: #667eea; }
```

### Adicionar Campos Personalizados

Edite `data.js` para adicionar novos campos aos pacientes:

```javascript
{ 
    id: 1, 
    name: "Maria Silva", 
    day: "monday", 
    time: "10:00", 
    balance: 0, 
    notes: "",
    phone: "11 99999-9999",  // Novo campo
    email: "maria@email.com"  // Novo campo
}
```

## 🐛 Problemas Comuns

### Dados não salvam

- **Verifique se o navegador permite LocalStorage**
- Alguns navegadores em modo privado/anônimo não salvam dados
- Tente em outro navegador

### Site não carrega

- Verifique se todos os arquivos estão na mesma pasta
- Abra o Console do navegador (F12) para ver erros

### Firebase não funciona

- Consulte o [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- Verifique se as credenciais estão corretas
- Certifique-se de que o Realtime Database está ativado

## 📞 Suporte

Para dúvidas sobre:

- **GitHub Pages**: [docs.github.com/pt/pages](https://docs.github.com/pt/pages)
- **Firebase**: [firebase.google.com/docs](https://firebase.google.com/docs)
- **HTML/CSS/JavaScript**: [developer.mozilla.org](https://developer.mozilla.org)

## 📄 Licença

Este projeto é de uso livre para fins pessoais e profissionais.

---

**Desenvolvido para gerenciamento profissional de agenda terapêutica** 🩺

**Versão 2.0** - Com gerenciamento completo de pacientes e sincronização online
