# CSI606-2025-01 - Proposta de Trabalho Final

**Discente:** Kaique Rennan - 23.1.8046

# 📊 SalesPro — Dashboard de Análise de Vendas

Este projeto consiste no desenvolvimento de um **Dashboard Interativo de Análise de Vendas**, projetado para transformar dados brutos em _insights_ acionáveis. Meu objetivo é fornecer uma ferramenta para visualizar, monitorar e analisar o desempenho de vendas da organização, facilitando a tomada de decisões estratégicas.

---

## 🖥️ Tecnologias

| Camada       | Tecnologia                           |
| ------------ | ------------------------------------ |
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4 |
| **Backend**  | NestJS 11, Prisma ORM, TypeScript    |
| **Banco**    | PostgreSQL 15 (Docker)               |
| **Gráficos** | Chart.js + react-chartjs-2           |
| **HTTP**     | Axios                                |
| **Ícones**   | Lucide React                         |

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) >= 20
- [npm](https://www.npmjs.com/) >= 10
- [Docker](https://www.docker.com/) e Docker Compose

---

## 🚀 Como Rodar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/kaiquerennan/CSI606.git
cd CSI606
```

### 2. Subir o banco de dados

```bash
cd backend
docker compose up -d
```

> O PostgreSQL estará disponível em `localhost:5432` com usuário `postgres` e senha `postgres`.

### 3. Configurar variáveis de ambiente do backend

Crie o arquivo `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/meubanco?schema=public
```

### 4. Instalar dependências e rodar migrations do backend

```bash
cd backend
npm install
npx prisma migrate dev
```

### 5. Popular o banco com dados de exemplo e criar administrador

```bash
npx prisma db seed
```

> **Credenciais do admin:** `admin@salespro.com` / `admin123`

### 6. Iniciar o backend

```bash
npm run start:dev
```

> O backend estará rodando em `http://localhost:3334`.

### 7. Configurar variáveis de ambiente do frontend

Crie o arquivo `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3334
```

### 8. Instalar dependências e iniciar o frontend

```bash
cd frontend
npm install
npm run dev
```

> O frontend estará rodando em `http://localhost:3000`.

---

## 📁 Estrutura do Projeto

```
CSI606/
├── backend/                  # API NestJS
│   ├── src/
│   │   ├── admin/            # CRUD de administradores + login
│   │   ├── auth/             # Autenticação
│   │   ├── clientes/         # Módulo de clientes
│   │   ├── dashboard/        # Dados do dashboard principal
│   │   ├── prisma/           # Serviço Prisma
│   │   ├── produtos/         # Módulo de produtos
│   │   ├── relatorios/       # Relatórios e métricas
│   │   ├── users/            # Módulo de usuários (clientes)
│   │   └── vendas/           # Módulo de vendas
│   ├── prisma/
│   │   ├── schema.prisma     # Schema do banco de dados
│   │   ├── seed.ts           # Seed de dados de exemplo
│   │   └── migrations/       # Migrations do Prisma
│   └── docker-compose.yaml   # PostgreSQL
│
├── frontend/                 # Interface Next.js
│   └── src/
│       ├── app/
│       │   ├── login/        # Tela de login
│       │   ├── clientes/     # Gestão de clientes
│       │   ├── produtos/     # Gestão de produtos
│       │   ├── vendas/       # Listagem + nova venda
│       │   ├── relatorios/   # Relatórios com gráficos
│       │   └── administradores/ # CRUD de admins
│       ├── components/       # Sidebar, AppShell
│       └── lib/              # API client, Auth context
│
├── .editorconfig
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🔑 Funcionalidades

- **Login** — Acesso restrito a administradores cadastrados
- **Dashboard** — Visão geral com métricas e KPIs de vendas
- **Clientes** — Cadastro e gerenciamento de clientes
- **Produtos** — Cadastro e controle de estoque
- **Vendas** — Registro de vendas com busca de cliente/produto e controle de estoque
- **Relatórios** — Gráficos interativos (vendas por categoria, período, top produtos, etc.)
- **Administradores** — CRUD de usuários do sistema

---

## 1. Tema

O trabalho final tem como tema o desenvolvimento de um **Dashboard Interativo para Análise de Vendas**.

O foco é a **visualização e análise do desempenho de vendas**, fornecendo uma visão clara e consolidada das métricas mais importantes para a área comercial.

---

## 2. Escopo e Funcionalidades

Este projeto implementará as seguintes funcionalidades principais:

### Dados

| Categoria | Funcionalidade           | Descrição                                                                                                    |
| --------: | ------------------------ | ------------------------------------------------------------------------------------------------------------ |
|  **Data** | **Conexão e ETL Básico** | Conexão com a fonte de dados de vendas (banco de dados) e processamento (limpeza e transformação) dos dados. |

### Segmentação e Interatividade

|          Categoria | Funcionalidade             | Descrição                                                                                                                    |
| -----------------: | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
|    **Segmentação** | **Filtros e Detalhamento** | Análise de vendas segmentada por: **Categoria de Produto**, **Região Geográfica**, **Canal de Venda** e **Vendedor/Equipe**. |
| **Interatividade** | **Filtros Dinâmicos**      | Implementação de filtros (data, segmento) que atualizam o dashboard em tempo real, garantindo uma análise flexível.          |

### Relatórios

|      Categoria | Funcionalidade          | Descrição                                                                                     |
| -------------: | ----------------------- | --------------------------------------------------------------------------------------------- |
| **Relatórios** | **Exportação de Dados** | Funcionalidade para exportar visualizações ou tabelas de dados subjacentes (ex.: PDF ou CSV). |

---

## 3. Restrições

Para manter o foco e garantir a entrega dentro do prazo, as seguintes funcionalidades **não** serão consideradas neste projeto:

- **Previsão de Vendas:** Não serão incluídos modelos estatísticos ou de _Machine Learning_ para projeção de vendas futuras.
- **Integração de Escrita:** A ferramenta será estritamente _read-only_. Não haverá possibilidade de inserir, editar ou excluir dados na fonte de origem (CRM/ERP).
- **Aplicativo Móvel** O desenvolvimento será focado na **interface web** (desktop e tablet). Não haverá criação de um app móvel nativo.

## 4. Protótipos

Protótipos para as páginas (Principal e de relatórios) foram elaborados, e podem ser encontrados [aqui](https://www.figma.com/design/6zpmOL3MxSq4GYYT65mZMo/Prot%C3%B3tipo-Web?node-id=0-1&t=4pVHn5Hz0aKszpfG-1)
