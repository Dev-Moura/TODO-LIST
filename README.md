# ✅ Listo

**Listo** é um gerenciador de tarefas minimalista inspirado no **Google Tasks**, desenvolvido com **React + Vite + Material UI**, com **autenticação real via Firebase** e **sincronização em tempo real** das tarefas por conta de usuário.

> *Listo* significa "pronto" — o objetivo é te ajudar a chegar lá com elegância.

---

## 🚀 Funcionalidades

- 🔐 **Login completo**: Google ou e-mail/senha (cadastro, login e recuperação de senha) via Firebase Auth.
- ☁️ **Sincronização em tempo real**: suas tarefas ficam salvas no Firestore e aparecem em qualquer dispositivo logado na mesma conta.
- 📥 **Migração automática**: tarefas antigas guardadas no navegador são importadas para a nuvem no primeiro login.
- 🗂️ **Visualizações**: todas as tarefas, por prioridade (Normal / Urgente / Imediato) ou concluídas.
- 🔍 **Busca global** por título e descrição (ignora acentos).
- ➕ **Criação rápida** pelo botão flutuante, com título, descrição e prioridade.
- ✏️ **Edição inline**: toque numa tarefa para expandir detalhes, editar ou excluir.
- ↩️ **Desfazer exclusão** pela snackbar de confirmação.
- 🌙 **Dark mode** persistente, seguindo também o tema do sistema.
- 📱 **Responsivo**: drawer lateral temporário no mobile, permanente no desktop.

---

## 💻 Tecnologias

| Camada | Tecnologia |
|---|---|
| UI | React 19 · Material UI 7 |
| Build | Vite |
| Rotas | React Router 7 |
| Backend | Firebase Authentication · Cloud Firestore |

---

## ⚡ Rodando localmente

### 1. Clonar e instalar

```bash
git clone https://github.com/Dev-Moura/listo.git
cd listo
npm install
```

### 2. Criar o projeto no Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/) e clique em **Adicionar projeto**.
2. No menu lateral, vá em **Build → Authentication → Get started** e habilite os provedores:
   - **Google**
   - **Email/senha**
3. Em **Build → Firestore Database → Create database**, crie o banco (modo de produção).
4. Em **Configurações do projeto → Seus apps**, registre um **App da Web** (`</>` icon) e copie as credenciais geradas.

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Preencha o `.env` com as credenciais copiadas:

```ini
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 4. Aplicar as regras do Firestore

No Console do Firebase (**Firestore → Rules**), cole o conteúdo de [`firestore.rules`](firestore.rules) e publique. Assim cada usuário só acessa as próprias tarefas.

### 5. Iniciar

```bash
npm run dev      # desenvolvimento → http://localhost:5173
npm run build    # build de produção em dist/
npm run preview  # serve o build localmente
```

> **Dica:** para testar o login com Google em `localhost`, nada extra é necessário — o domínio já vem autorizado no Firebase.

---

## ☁️ Deploy na Vercel

1. Faça push para o GitHub e importe o projeto na [Vercel](https://vercel.com/new).
2. A Vercel detecta o preset **Vite** automaticamente (`build`: `npm run build`, output: `dist`).
3. Adicione as **mesmas variáveis `VITE_FIREBASE_*`** em *Settings → Environment Variables* (elas são embutidas no build).
4. No Console do Firebase, adicione o domínio da Vercel (ex.: `listo.vercel.app`) em **Authentication → Settings → Authorized domains**.

O arquivo [`vercel.json`](vercel.json) já contém as rewrites de SPA para rotas como `/login`.

---

## 🗂️ Estrutura do projeto

```
listo/
├─ src/
│  ├─ components/
│  │  ├─ common/          # Logo, GoogleIcon
│  │  ├─ layout/          # AppHeader, AppSidebar, ProtectedRoute
│  │  └─ tasks/           # TaskItem, TaskDialog
│  ├─ constants/          # Definições de prioridade
│  ├─ context/            # AuthContext, ThemeContext
│  ├─ firebase/           # Inicialização do Firebase
│  ├─ hooks/              # useTasks (CRUD realtime no Firestore)
│  ├─ pages/              # LoginPage, TasksPage
│  ├─ theme/              # Temas claro/escuro (Material You)
│  ├─ utils/              # Migração do localStorage legado
│  ├─ App.jsx             # Providers + rotas
│  └─ main.jsx            # Entry point
├─ firestore.rules        # Regras de segurança de referência
├─ vercel.json            # Rewrites de SPA
└─ .env.example           # Modelo de credenciais
```

---

## 📄 Licença

MIT — use, estude e melhore à vontade.
