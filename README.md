# 📋 TurmaBoard API

> **Hackathon Pós-Tech — "Inovação no auxílio aos professores do ensino público"**

**TurmaBoard** é um sistema de quadros estilo Kanban/Trello voltado para professores do ensino público organizarem suas tarefas e gerenciarem dúvidas dos alunos.

---

## 🏗️ Arquitetura

| Serviço | Porta | Descrição |
|---|---|---|
| **API** | `3000` | Node.js + Express + Mongoose |
| **MongoDB** | `27017` | Banco de dados |
| **Mongo Express** | `8081` | Interface web para gerenciar o MongoDB |

---

## 🚀 Como rodar

### Pré-requisitos

- [Docker](https://www.docker.com/) e **Docker Compose** instalados.

### Subir tudo com um comando

```bash
docker compose up --build
```

Isso irá:
1. Subir o MongoDB
2. Subir o Mongo Express (UI)
3. Buildar e subir a API
4. Executar o **seed** automaticamente (cria dados demo)

### Verificar se está rodando

```bash
curl http://localhost:3000/health
```

### Acessar o Mongo Express

Abra no navegador: [http://localhost:8081](http://localhost:8081)

### Parar tudo

```bash
docker compose down
```

Para remover também os volumes (dados do MongoDB):

```bash
docker compose down -v
```

---

## 🔑 Autenticação Demo (Mock)

Não há autenticação real. O sistema usa **duas contas demo fixas**:

| Perfil | Email | Senha | Header |
|---|---|---|---|
| **Professor** | professor@demo.com | professor123 | `x-demo-user: teacher` |
| **Aluno** | aluno@demo.com | aluno123 | `x-demo-user: student` |

### Como funciona

1. Faça o "login demo" para ver os dados do usuário:
```bash
curl http://localhost:3000/demo/login?as=teacher
curl http://localhost:3000/demo/login?as=student
```

2. Em **todas as requisições protegidas**, envie o header:
```
x-demo-user: teacher
# ou
x-demo-user: student
```

Se o header não for enviado ou for inválido → retorna `401`.

---

## 📚 Dados do Seed

Ao subir o container, o seed cria automaticamente:

- **1 Professor Demo** (`professor@demo.com`)
- **1 Aluno Demo** (`aluno@demo.com`)
- **2 Turmas**: `9ºA` (joinCode: `TURMA1`) e `8ºB` (joinCode: `TURMA2`)
- Aluno matriculado na turma `9ºA`
- **2 Tarefas** do professor (uma geral, uma vinculada à 9ºA)
- **1 Dúvida** do aluno na turma `9ºA`

---

## 📡 Endpoints

### Health Check

```
GET /health
```

### Demo Auth

```
GET /demo/login?as=teacher|student
```

### Classes (Turmas)

| Método | Rota | Perfil | Descrição |
|---|---|---|---|
| `POST` | `/classes` | TEACHER | Criar turma |
| `GET` | `/classes` | AUTH | Listar turmas (professor: suas turmas; aluno: turmas que participa) |
| `POST` | `/classes/join` | STUDENT | Entrar na turma via joinCode |
| `GET` | `/classes/:classId` | AUTH | Detalhes da turma |

### Tasks (Tarefas do Professor)

| Método | Rota | Perfil | Descrição |
|---|---|---|---|
| `GET` | `/tasks` | TEACHER | Listar tarefas (filtros: `?classId=&status=`) |
| `POST` | `/tasks` | TEACHER | Criar tarefa |
| `PATCH` | `/tasks/:taskId` | TEACHER | Atualizar tarefa |
| `DELETE` | `/tasks/:taskId` | TEACHER | Remover tarefa |

### Questions (Dúvidas)

| Método | Rota | Perfil | Descrição |
|---|---|---|---|
| `GET` | `/classes/:classId/questions` | AUTH | Listar dúvidas da turma |
| `POST` | `/classes/:classId/questions` | STUDENT | Criar dúvida |
| `PATCH` | `/questions/:questionId` | AUTH | Atualizar status (aluno: RESOLVED; professor: ANSWERED) |
| `POST` | `/questions/:questionId/replies` | TEACHER | Responder dúvida |
| `GET` | `/questions/:questionId/replies` | AUTH | Listar respostas de uma dúvida |

---

## 🧪 Exemplos com cURL

### Login Demo

```bash
# Professor
curl http://localhost:3000/demo/login?as=teacher

# Aluno
curl http://localhost:3000/demo/login?as=student
```

### Turmas

```bash
# Criar turma (professor)
curl -X POST http://localhost:3000/classes \
  -H "Content-Type: application/json" \
  -H "x-demo-user: teacher" \
  -d '{"name": "7ºC"}'

# Listar turmas do professor
curl http://localhost:3000/classes \
  -H "x-demo-user: teacher"

# Listar turmas do aluno
curl http://localhost:3000/classes \
  -H "x-demo-user: student"

# Aluno entra na turma via joinCode
curl -X POST http://localhost:3000/classes/join \
  -H "Content-Type: application/json" \
  -H "x-demo-user: student" \
  -d '{"joinCode": "TURMA2"}'

# Detalhes de uma turma (substitua o ID)
curl http://localhost:3000/classes/<CLASS_ID> \
  -H "x-demo-user: teacher"
```

### Tarefas

```bash
# Listar tarefas
curl http://localhost:3000/tasks \
  -H "x-demo-user: teacher"

# Listar tarefas filtradas por status
curl "http://localhost:3000/tasks?status=TODO" \
  -H "x-demo-user: teacher"

# Criar tarefa
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "x-demo-user: teacher" \
  -d '{"title": "Preparar simulado", "description": "Simulado de matemática para o 9ºA"}'

# Atualizar status da tarefa
curl -X PATCH http://localhost:3000/tasks/<TASK_ID> \
  -H "Content-Type: application/json" \
  -H "x-demo-user: teacher" \
  -d '{"status": "DONE"}'

# Deletar tarefa
curl -X DELETE http://localhost:3000/tasks/<TASK_ID> \
  -H "x-demo-user: teacher"
```

### Dúvidas

```bash
# Listar dúvidas de uma turma
curl http://localhost:3000/classes/<CLASS_ID>/questions \
  -H "x-demo-user: student"

# Criar dúvida (aluno)
curl -X POST http://localhost:3000/classes/<CLASS_ID>/questions \
  -H "Content-Type: application/json" \
  -H "x-demo-user: student" \
  -d '{"title": "Dúvida sobre frações", "description": "Como somar frações com denominadores diferentes?"}'

# Professor responde dúvida
curl -X POST http://localhost:3000/questions/<QUESTION_ID>/replies \
  -H "Content-Type: application/json" \
  -H "x-demo-user: teacher" \
  -d '{"content": "Primeiro encontre o MMC dos denominadores..."}'

# Listar respostas de uma dúvida
curl http://localhost:3000/questions/<QUESTION_ID>/replies \
  -H "x-demo-user: teacher"

# Aluno marca dúvida como resolvida
curl -X PATCH http://localhost:3000/questions/<QUESTION_ID> \
  -H "Content-Type: application/json" \
  -H "x-demo-user: student" \
  -d '{"status": "RESOLVED"}'
```

---

## 📁 Estrutura do Projeto

```
src/
├── app.js                        # Express app setup
├── server.js                     # Entry point
├── seed.js                       # Seed de dados demo
├── config/
│   ├── db.js                     # Conexão MongoDB
│   └── env.js                    # Variáveis de ambiente
├── controllers/
│   ├── classes.controller.js
│   ├── demoAuth.controller.js
│   ├── questions.controller.js
│   └── tasks.controller.js
├── middlewares/
│   ├── demoAuth.js               # Autenticação demo via header
│   ├── errorHandler.js           # Tratamento centralizado de erros
│   ├── roles.js                  # RBAC (Role-Based Access Control)
│   └── validate.js               # Validação via Zod
├── models/
│   ├── Class.js
│   ├── ClassMember.js
│   ├── Question.js
│   ├── QuestionReply.js
│   ├── Task.js
│   └── User.js
├── routes/
│   ├── classes.routes.js
│   ├── demoAuth.routes.js
│   ├── questions.routes.js
│   └── tasks.routes.js
├── schemas/
│   └── index.js                  # Schemas Zod
└── utils/
    ├── generateJoinCode.js
    └── response.js               # Padronização de respostas JSON
```

---

## 🛡️ Regras de Acesso (RBAC)

| Recurso | TEACHER | STUDENT |
|---|---|---|
| Tarefas (CRUD) | ✅ Apenas as próprias | ❌ |
| Criar turma | ✅ | ❌ |
| Listar turmas | ✅ Próprias | ✅ Onde é membro |
| Entrar em turma (join) | ❌ | ✅ Via joinCode |
| Criar dúvida | ❌ | ✅ Em turmas que participa |
| Ver dúvidas | ✅ De suas turmas | ✅ De turmas que participa |
| Responder dúvida | ✅ De suas turmas | ❌ |
| Marcar dúvida como resolvida | ❌ | ✅ Apenas as próprias |

---

## 📄 Licença

MIT
