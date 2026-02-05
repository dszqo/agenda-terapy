# Guia de Configuração do Firebase

Este guia explica como configurar o Firebase para sincronizar seus dados entre dispositivos.

## Por que usar Firebase?

- ✅ **Sincronização automática** entre todos os seus dispositivos
- ✅ **Dados seguros na nuvem** (não perdem se limpar o cache do navegador)
- ✅ **Acesso de qualquer lugar** (computador, celular, tablet)
- ✅ **Gratuito** para uso pessoal (até 1GB de dados)

## Passo a Passo

### 1. Criar Conta no Firebase

1. Acesse [firebase.google.com](https://firebase.google.com)
2. Clique em **"Começar"** ou **"Get Started"**
3. Faça login com sua conta Google

### 2. Criar Novo Projeto

1. Clique em **"Adicionar projeto"** ou **"Add project"**
2. Nome do projeto: `agenda-terapia` (ou outro nome de sua preferência)
3. Clique em **"Continuar"**
4. **Desative** o Google Analytics (não é necessário)
5. Clique em **"Criar projeto"**
6. Aguarde a criação (leva alguns segundos)
7. Clique em **"Continuar"**

### 3. Configurar Realtime Database

1. No menu lateral, clique em **"Realtime Database"**
2. Clique em **"Criar banco de dados"** ou **"Create database"**
3. Localização: escolha **"United States"** (ou mais próxima)
4. Regras de segurança: escolha **"Iniciar em modo de teste"**
   - ⚠️ **Importante**: Isso permite acesso público temporário. Você pode configurar regras de segurança depois.
5. Clique em **"Ativar"**

### 4. Obter Credenciais do Firebase

1. No menu lateral, clique no ícone de **engrenagem ⚙️** e depois em **"Configurações do projeto"**
2. Role a página até a seção **"Seus aplicativos"**
3. Clique no ícone **"</>"** (Web)
4. Apelido do app: `agenda-terapia-web`
5. **NÃO** marque "Firebase Hosting"
6. Clique em **"Registrar app"**
7. Você verá um código JavaScript com as credenciais. **Copie apenas os valores** dentro de `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "agenda-terapia-xxxxx.firebaseapp.com",
  projectId: "agenda-terapia-xxxxx",
  storageBucket: "agenda-terapia-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx",
  databaseURL: "https://agenda-terapia-xxxxx-default-rtdb.firebaseio.com"
};
```

### 5. Configurar no Site

1. Abra o arquivo **`firebase-config.js`** no seu projeto
2. Substitua os valores `"SUBSTITUA_PELA_SUA_..."` pelas suas credenciais do Firebase
3. Salve o arquivo

**Exemplo:**

```javascript
// ANTES
const firebaseConfig = {
    apiKey: "SUBSTITUA_PELA_SUA_API_KEY",
    // ...
};

// DEPOIS
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "agenda-terapia-xxxxx.firebaseapp.com",
    projectId: "agenda-terapia-xxxxx",
    storageBucket: "agenda-terapia-xxxxx.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:xxxxxxxxxxxxx",
    databaseURL: "https://agenda-terapia-xxxxx-default-rtdb.firebaseio.com"
};
```

### 6. Fazer Upload para GitHub

1. Faça upload dos arquivos atualizados para o GitHub (incluindo o `firebase-config.js` modificado)
2. Aguarde alguns minutos para o GitHub Pages atualizar
3. Acesse seu site e pronto! Os dados agora sincronizam automaticamente.

## Verificar se Funcionou

1. Abra o site no navegador
2. Abra o **Console do Navegador** (F12 → Console)
3. Se ver a mensagem **"Firebase inicializado com sucesso!"**, está funcionando!
4. Se ver **"Firebase não configurado. Usando LocalStorage."**, verifique se as credenciais estão corretas.

## Configurar Regras de Segurança (Recomendado)

Por padrão, o banco de dados está em "modo de teste" (qualquer pessoa pode acessar). Para proteger seus dados:

1. No Firebase Console, vá em **"Realtime Database"** → **"Regras"**
2. Substitua as regras por:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

3. Clique em **"Publicar"**

**Nota**: Isso exigirá autenticação. Se quiser manter acesso público (apenas para você), mantenha as regras de teste, mas **anote o link do seu site e não compartilhe publicamente**.

## Alternativa: Usar Senha Simples

Se quiser proteger com senha sem configurar autenticação completa:

```json
{
  "rules": {
    ".read": "auth.uid === 'SEU_ID_UNICO'",
    ".write": "auth.uid === 'SEU_ID_UNICO'"
  }
}
```

Substitua `SEU_ID_UNICO` por um ID único que você criar.

## Problemas Comuns

### "Firebase não inicializado"
- Verifique se as credenciais estão corretas no `firebase-config.js`
- Certifique-se de que o `databaseURL` está presente

### "Permission denied"
- Verifique as regras de segurança no Firebase Console
- Certifique-se de que está em "modo de teste" ou configure autenticação

### Dados não sincronizam
- Abra o Console do navegador (F12) e veja se há erros
- Verifique sua conexão com a internet
- Certifique-se de que o Firebase foi inicializado corretamente

## Sem Firebase (Apenas LocalStorage)

Se preferir **não usar Firebase**, o site funciona perfeitamente com **LocalStorage**:

- ✅ Dados salvos automaticamente no navegador
- ✅ Funciona offline
- ⚠️ Dados ficam apenas no dispositivo atual
- ⚠️ Dados podem ser perdidos se limpar o cache do navegador

Nesse caso, você não precisa fazer nada! O site já está configurado para usar LocalStorage por padrão.

---

**Dúvidas?** Consulte a [documentação oficial do Firebase](https://firebase.google.com/docs/database/web/start).
