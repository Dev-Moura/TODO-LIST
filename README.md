# Listo - Gerenciador de Tarefas

Listo é uma aplicação web de lista de tarefas inspirada no **Google Tasks**, desenvolvida com **React + Vite** e **Material UI**, com autenticação real via **Firebase Authentication** e sincronização de tarefas em tempo real por conta de usuário através do **Cloud Firestore**.

> **Listo** significa "pronto" em espanhol/italiano — o objetivo é te ajudar a chegar lá com elegância.

<!-- Adicione aqui o link da sua demo quando quiser:
## 🌐 Demo

👉 [https://seu-projeto.vercel.app](https://seu-projeto.vercel.app)
-->

## 🚀 Funcionalidades

- **Autenticação** - Login com Google ou e-mail/senha, cadastro e recuperação de senha (Implementado)
- **Sincronização em tempo real** - Tarefas salvas no Firestore aparecem em qualquer dispositivo logado na mesma conta (Implementado)
- **Migração automática** - Tarefas antigas guardadas no navegador são importadas para a nuvem no primeiro login (Implementado)
- **Visualizações** - Todas as tarefas, filtro por prioridade (Normal / Urgente / Imediato) ou concluídas (Implementado)
- **Busca global** - Pesquisa por título e descrição, ignorando acentos (Implementado)
- **Edição inline** - Toque numa tarefa para expandir detalhes, editar ou excluir com opção de desfazer (Implementado)
- **Dark mode** - Tema claro/escuro persistente, respeitando também a preferência do sistema (Implementado)

## 🛠️ Tecnologias

| Camada | Tecnologia |
| ------ | ---------- |
| UI | React 19 · Material UI 7 |
| Build | Vite |
| Rotas | React Router 7 |
| Autenticação | Firebase Authentication |
| Banco de dados | Cloud Firestore |

## ⚡ Instalação e Execução

Certifique-se de ter **Node.js 18+** instalado.

```bash
# Clonar o repositório
git clone https://github.com/Dev-Moura/listo.git
cd listo

# Instalar dependências
npm install

# Rodar em desenvolvimento (http://localhost:5173)
npm run dev
```

> A aplicação abre na tela de login. Para que o login funcione, configure o Firebase na próxima seção.

## 🔥 Configuração do Firebase

### 1. Criar o projeto

1. Acesse o [Console do Firebase](https://console.firebase.google.com/) e clique em **Adicionar projeto**
2. Em **Build → Authentication → Get started**, habilite os provedores:
   - **Google**
   - **Email/senha**
3. Em **Build → Firestore Database → Create database**, crie o banco em modo de produção
4. Em **Configurações do projeto → Seus apps → Web (`</>`)**, registre um app e copie as credenciais geradas

### 2. Variáveis de ambiente

Copie o modelo e preencha com as credenciais copiadas:

```bash
cp .env.example .env
```

**Variáveis principais:**

- `VITE_FIREBASE_API_KEY`: chave pública da API web
- `VITE_FIREBASE_AUTH_DOMAIN`: domínio de autenticação (`seu-projeto.firebaseapp.com`)
- `VITE_FIREBASE_PROJECT_ID`: id do projeto
- `VITE_FIREBASE_STORAGE_BUCKET`: bucket de storage
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: id do remetente
- `VITE_FIREBASE_APP_ID`: id do aplicativo web

O arquivo `.env` não é versionado por segurança.

### 3. Regras de segurança do Firestore

No Console (**Firestore Database → Rules**), publique o conteúdo de [`firestore.rules`](firestore.rules):

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Cada usuário só acessa as próprias tarefas.
    match /users/{userId}/tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

As tarefas ficam isoladas em `users/{uid}/tasks`, garantindo que cada usuário acesse apenas os seus dados.

## ☁️ Deploy na Vercel

1. Importe o repositório na [Vercel](https://vercel.com/new) — o preset **Vite** é detectado automaticamente
2. Adicione as mesmas variáveis `VITE_FIREBASE_*` em **Settings → Environment Variables** (elas são embutidas no build)
3. No Console do Firebase, adicione o domínio da Vercel (ex.: `listo.vercel.app`) em **Authentication → Settings → Authorized domains**

O arquivo [`vercel.json`](vercel.json) já contém o output directory (`dist`) e as rewrites de SPA para rotas como `/login`.

A cada push na `main`, um novo deploy é disparado automaticamente.

## 📜 Scripts disponíveis

| Comando | Descrição |
| ------- | --------- |
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |

## 📂 Estrutura do Projeto

```
listo/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── common/          # Logo, GoogleIcon
│   │   ├── layout/          # AppHeader, AppSidebar, ProtectedRoute
│   │   └── tasks/           # TaskItem, TaskDialog
│   ├── constants/           # Definições de prioridade
│   ├── context/             # AuthContext, ThemeContext
│   ├── firebase/            # Inicialização do Firebase
│   ├── hooks/               # useTasks (CRUD realtime no Firestore)
│   ├── pages/               # LoginPage, TasksPage
│   ├── theme/               # Temas claro/escuro (Material You)
│   ├── utils/               # Migração do localStorage legado
│   ├── App.jsx              # Providers + rotas
│   └── main.jsx             # Entry point
├── firestore.rules          # Regras de segurança de referência
├── vercel.json              # Output directory + rewrites de SPA
└── .env.example             # Modelo de credenciais
```

## 🧭 Fluxo da aplicação

1. ✅ Usuário acessa `/` e é redirecionado para `/login` caso não autenticado
2. ✅ Faz login com Google ou e-mail/senha
3. ✅ Na primeira vez, tasks locais antigas são importadas automaticamente para a nuvem
4. ✅ Cria, edita, conclui e exclui tarefas com sincronização instantânea entre dispositivos

---

Desenvolvido com ❤️ usando React + Firebase
