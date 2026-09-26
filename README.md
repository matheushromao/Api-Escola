# API Escola

API REST para gerenciamento de alunos, desenvolvida com **Node.js**, **Express** e **Prisma ORM** sobre um banco **MySQL/MariaDB**.

O projeto segue uma arquitetura em camadas (Routes → Controller → Service → Prisma) e conta com um sistema de exceções personalizadas para padronizar as respostas de erro.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Como executar](#como-executar)
- [Modelo de dados](#modelo-de-dados)
- [Endpoints](#endpoints)
- [Tratamento de erros](#tratamento-de-erros)
- [Códigos de status HTTP](#códigos-de-status-http)

---

## Funcionalidades

- Cadastro de alunos com validação de dados (Zod)
- Listagem paginada de alunos
- Ordenação da listagem por campo e direção via query string
- Contagem total de alunos cadastrados
- Busca de aluno por id
- Atualização parcial de aluno (nome e/ou email)
- Remoção de aluno
- Exceções personalizadas com status HTTP adequado para cada situação

---

## Tecnologias

| Tecnologia | Uso no projeto |
|---|---|
| [Node.js](https://nodejs.org/) | Ambiente de execução JavaScript |
| [Express 5](https://expressjs.com/) | Servidor HTTP e roteamento |
| [Prisma 7](https://www.prisma.io/) | ORM, migrations e acesso ao banco |
| `@prisma/adapter-mariadb` | Adapter de conexão com MySQL/MariaDB |
| [Zod](https://zod.dev/) | Validação dos dados de entrada |
| [dotenv](https://github.com/motdotla/dotenv) | Carregamento das variáveis de ambiente |
| [Nodemon](https://nodemon.io/) | Reinício automático em desenvolvimento |

---

## Arquitetura

Cada requisição percorre as camadas abaixo, e cada camada tem uma responsabilidade bem definida:

```
Requisição HTTP
      │
      ▼
   Routes        → define a URL e o verbo HTTP de cada operação
      │
      ▼
 Middlewares     → valida o corpo da requisição (ex.: ValidarAluno com Zod)
      │
      ▼
  Controller     → lê a requisição, chama o Service e decide COMO responder (try...catch)
      │
      ▼
   Service       → regras de negócio e acesso ao Prisma; decide O QUE deu errado (throw)
      │
      ▼
    Prisma       → comunicação com o banco de dados
```

**Princípio central:** o Service lança exceções (`throw`) quando algo está errado, e o Controller as captura (`catch`) e devolve a resposta com o `statusCode` e a `message` da exceção. Erros inesperados, que não possuem `statusCode`, são respondidos com **500 Internal Server Error**.

---

## Estrutura de pastas

```
Api-Escola/
├── prisma/
│   ├── migrations/              # Histórico de migrations do banco
│   └── schema.prisma            # Definição do modelo de dados
├── src/
│   ├── controllers/
│   │   └── AlunoController.js   # Recebe as requisições e monta as respostas
│   ├── database/
│   │   └── prisma.js            # Instância do Prisma Client
│   ├── errors/
│   │   ├── ApiError.js                 # Classe base das exceções
│   │   ├── AlunoInvalidoError.js       # 400 - dados inválidos
│   │   ├── AlunoNaoEncontradoError.js  # 404 - aluno inexistente
│   │   ├── EmailDuplicadoError.js      # 409 - email já cadastrado
│   │   ├── OrdenacaoInvalidaError.js   # 400 - orderBy/order inválidos
│   │   └── PaginacaoInvalidaError.js   # 400 - page/pageSize inválidos
│   ├── middlewares/
│   │   └── ValidarAluno.js      # Validação do corpo no cadastro
│   ├── routes/
│   │   └── AlunoRoutes.js       # Rotas de /alunos
│   ├── schemas/
│   │   └── AlunoSchema.js       # Schema Zod do aluno
│   ├── services/
│   │   └── AlunoService.js      # Regras de negócio e acesso ao banco
│   └── index.js                 # Ponto de entrada da aplicação
├── prisma.config.js
├── package.json
└── .env                         # Variáveis de ambiente (não versionado)
```

---

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior
- Servidor **MySQL** ou **MariaDB** em execução
- [Git](https://git-scm.com/)

### 1. Clonar o repositório

```bash
git clone https://github.com/matheushromao/Api-Escola.git
cd Api-Escola
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Usada pelo Prisma CLI (migrations)
DATABASE_URL="mysql://usuario:senha@localhost:3306/escola"

# Usadas pelo adapter na aplicação
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=senha
DB_NAME=escola

# Porta do servidor
PORT=3000
```

> O arquivo `.env` está no `.gitignore` e **não deve** ser enviado ao repositório.

### 4. Criar as tabelas e gerar o Prisma Client

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Iniciar o servidor

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

---

## Modelo de dados

```prisma
model Aluno {
  id        Int      @id @default(autoincrement())
  nome      String
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | Int | Identificador gerado automaticamente |
| `nome` | String | Nome do aluno (mínimo de 3 caracteres) |
| `email` | String | Email do aluno, **único** no sistema |
| `createdAt` | DateTime | Data de criação do registro |
| `updatedAt` | DateTime | Data da última atualização |

---

## Endpoints

| Verbo | Rota | Descrição |
|---|---|---|
| `GET` | `/alunos` | Lista alunos com paginação, ordenação e total |
| `GET` | `/alunos/:id` | Busca um aluno pelo id |
| `POST` | `/alunos` | Cadastra um novo aluno |
| `PATCH` | `/alunos/:id` | Atualiza nome e/ou email de um aluno |
| `DELETE` | `/alunos/:id` | Remove um aluno |

### `GET /alunos`

Lista os alunos de forma paginada e ordenada, informando também o total de registros no banco.

**Query params (todos opcionais):**

| Parâmetro | Padrão | Descrição |
|---|---|---|
| `page` | `1` | Número da página (inteiro positivo) |
| `pageSize` | `10` | Quantidade de alunos por página (inteiro positivo) |
| `orderBy` | `id` | Campo de ordenação: `id`, `nome`, `email`, `createdAt` ou `updatedAt` |
| `order` | `asc` | Direção: `asc` (crescente) ou `desc` (decrescente); não diferencia maiúsculas |

**Exemplos:**

```http
GET /alunos
GET /alunos?orderBy=nome&order=asc
GET /alunos?orderBy=createdAt&order=desc
GET /alunos?page=2&pageSize=5&orderBy=email&order=asc
```

**Resposta `200 OK`:**

```json
{
  "alunos": [
    {
      "id": 1,
      "nome": "Ana Souza",
      "email": "ana@email.com",
      "createdAt": "2026-09-24T10:00:00.000Z",
      "updatedAt": "2026-09-24T10:00:00.000Z"
    }
  ],
  "total": 42
}
```

> `total` representa todos os alunos cadastrados, e não apenas os da página atual. Com ele, o cliente pode calcular o número de páginas: `Math.ceil(total / pageSize)`.

**Erros possíveis:** `400` para paginação ou ordenação inválida.

---

### `GET /alunos/:id`

Busca um único aluno pelo id.

```http
GET /alunos/1
```

**Resposta `200 OK`:**

```json
{
  "aluno": {
    "id": 1,
    "nome": "Ana Souza",
    "email": "ana@email.com",
    "createdAt": "2026-09-24T10:00:00.000Z",
    "updatedAt": "2026-09-24T10:00:00.000Z"
  }
}
```

**Erros possíveis:** `400` para id não numérico e `404` para aluno inexistente.

---

### `POST /alunos`

Cadastra um novo aluno. `nome` e `email` são obrigatórios.

```http
POST /alunos
Content-Type: application/json

{
  "nome": "Ana Souza",
  "email": "ana@email.com"
}
```

**Resposta `201 Created`:**

```json
{
  "aluno": {
    "id": 1,
    "nome": "Ana Souza",
    "email": "ana@email.com",
    "createdAt": "2026-09-24T10:00:00.000Z",
    "updatedAt": "2026-09-24T10:00:00.000Z"
  }
}
```

**Resposta `400 Bad Request`** (validação do Zod):

```json
{
  "error": [
    { "campo": "nome", "message": "Nome muito pequeno!" },
    { "campo": "email", "message": "E-mail inválido!" }
  ]
}
```

---

### `PATCH /alunos/:id`

Atualiza parcialmente um aluno. É possível enviar apenas `nome`, apenas `email` ou ambos. Os campos enviados passam pelas mesmas regras do cadastro, e campos desconhecidos são ignorados.

```http
PATCH /alunos/1
Content-Type: application/json

{
  "nome": "Ana Maria Souza"
}
```

**Resposta `200 OK`:**

```json
{
  "aluno": {
    "id": 1,
    "nome": "Ana Maria Souza",
    "email": "ana@email.com",
    "createdAt": "2026-09-24T10:00:00.000Z",
    "updatedAt": "2026-09-26T14:30:00.000Z"
  }
}
```

**Erros possíveis:**

| Status | Situação |
|---|---|
| `400` | Id inválido, corpo vazio, nenhum campo válido ou dados fora do formato |
| `404` | Aluno não encontrado |
| `409` | O email informado já pertence a outro aluno |

---

### `DELETE /alunos/:id`

Remove um aluno.

```http
DELETE /alunos/1
```

**Resposta `204 No Content`:** sem corpo, pois o recurso deixou de existir.

**Erros possíveis:** `400` para id inválido e `404` para aluno inexistente.

---

## Tratamento de erros

Todas as exceções personalizadas herdam da classe base `ApiError`, que armazena a mensagem e o status HTTP:

```js
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
```

| Exceção | Status | Quando é lançada |
|---|---|---|
| `AlunoInvalidoError` | 400 | Dados obrigatórios ausentes, formato inválido, id inválido ou update sem campos válidos |
| `PaginacaoInvalidaError` | 400 | `page` ou `pageSize` não são inteiros positivos |
| `OrdenacaoInvalidaError` | 400 | `orderBy` fora da lista permitida ou `order` diferente de `asc`/`desc` |
| `AlunoNaoEncontradoError` | 404 | Nenhum aluno corresponde ao id informado |
| `EmailDuplicadoError` | 409 | Tentativa de usar um email já cadastrado para outro aluno |

Todas as respostas de erro seguem o formato:

```json
{
  "error": "Aluno não encontrado!"
}
```

Erros inesperados (ex.: banco de dados indisponível) não possuem `statusCode` e são respondidos com status **500**, por meio do padrão `e.statusCode || 500` nos Controllers.

---

## Códigos de status HTTP

| Código | Significado | Uso na API |
|---|---|---|
| `200` | OK | Consulta ou atualização realizada com sucesso |
| `201` | Created | Aluno cadastrado |
| `204` | No Content | Aluno removido |
| `400` | Bad Request | Dados enviados pelo cliente são inválidos |
| `404` | Not Found | Aluno não existe |
| `409` | Conflict | Email já cadastrado |
| `500` | Internal Server Error | Erro inesperado no servidor |

---

## Autor

Desenvolvido por **SEU NOME** como projeto da disciplina de desenvolvimento back-end.

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SEU-USUARIO)