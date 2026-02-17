# CSI606-2025-02 - Trabalho Final - Resultados

**Discente:** Kaique Rennan - 23.1.8046

---

## Resumo

Este trabalho consiste no desenvolvimento do **SalesPro**, um Dashboard Interativo de Análise de Vendas construído como uma aplicação web fullstack. O sistema permite que administradores autenticados gerenciem clientes, produtos e vendas, além de visualizar relatórios com gráficos interativos sobre o desempenho comercial. O backend foi desenvolvido com **NestJS** e **Prisma ORM** conectado a um banco **PostgreSQL**, enquanto o frontend utiliza **Next.js 16** com **React 19**, **Tailwind CSS 4** e **Chart.js** para visualização de dados.

---

## 1. Funcionalidades implementadas

- **Autenticação de Administradores:** Tela de login com validação de e-mail e senha. Somente administradores cadastrados têm acesso ao sistema.
- **Dashboard Principal:** Visão geral com KPIs (total de vendas, receita, clientes, produtos), gráficos de vendas por mês, status de pedidos e listagem dos últimos pedidos.
- **Gestão de Clientes:** Listagem com busca e filtro por status (ativo/inativo), visualização detalhada e navegação para perfil individual.
- **Gestão de Produtos:** Listagem com busca por nome, categoria ou grupo, filtro por status, paginação e opção de cadastro de novos produtos.
- **Módulo de Vendas:** Listagem de todas as vendas com detalhes (cliente, itens, valor, status), modal de detalhamento e possibilidade de cancelamento (com devolução automática de estoque).
- **Relatórios:** Página com 4 abas (Visão Geral, Vendas, Produtos, Clientes) contendo gráficos interativos — barras (receita mensal, dia da semana), linhas (vendas diárias), rosca (categorias, status de pedidos) — e tabelas com ranking de produtos, clientes, estoque baixo e receita por categoria.
- **CRUD de Administradores:** Listagem, criação, edição e exclusão de administradores do sistema.
- **Sidebar Responsiva:** Navegação lateral com destaque da rota ativa, informações do admin logado e botão de logout.

---

## 2. Funcionalidades previstas e não implementadas

- **Exportação de Dados (PDF/CSV):** Prevista na proposta, porém não implementada por questão de tempo. Os relatórios são exibidos apenas na interface web.
- **Filtros por Região Geográfica e Canal de Venda:** Ficou limitada a categoria de produto e período. Filtros por região e canal não foram implementados.

---

## 3. Outras funcionalidades implementadas

- **Tela de nova venda:** Mão estava previsto no início, mas foi implementada uma página para realizar novas vendas com busca de cliente, busca de produto controle de quantidade e cálculo automático de totais.

- **Controle de Estoque Automático:** Ao registrar uma venda, o estoque dos produtos é decrementado automaticamente. Ao cancelar, o estoque é devolvido.
- **Avatar Dinâmico:** O nome do administrador logado é exibido em todas as telas com avatar gerado automaticamente via API ui-avatars.
- **Logo Personalizada:** Substituição do ícone padrão por imagem customizada na sidebar.

---

## 4. Principais desafios e dificuldades

- **Configuração do Prisma:** Esse projeto foi criado bem no meio da migração do Prisma para a versão 7, então foi difícil de configurar. Muita coisa ainda estava mudando, vários exemplos não funcionavam mais e a documentação nem sempre ajudava do jeito esperado.
- **Conectar no Banco:** Tive dificuldade no início tentando vincular o docker ao PostgreSQL. Entre erros de autenticação e tabelas que "não existiam", perdi um bom tempo só garantindo que o NestJS conseguisse falar com o banco de dados.
- **Rodar o Seed:** Tive muita dificuldade para fazer o script de seed (popular o banco com dados de teste) funcionar. O comando falhava o tempo todo por conflitos de configuração com o TypeScript, e precisei mudar coisas no package.json até conseguir inserir os dados iniciais.
- **Dificuldade com o CSS**: Fazer a Sidebar ficar fixa sem quebrar o resto do layout deu trabalho. Tive bastante problemas com margens, espaços em branco aleatórios e a responsividade do Flexbox no Next.js.

---

## 5. Instruções para instalação e execução

### Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose

### Passo a passo

```bash
# 1. Clonar o repositório
git clone https://github.com/kaiquerennan/CSI606.git
cd CSI606

# 2. Subir todos os serviços (banco, backend e frontend)
docker compose up --build -d

# 3. Rodar as migrations do banco de dados
docker compose exec backend npx prisma migrate deploy

# 4. Popular o banco com dados de exemplo + admin
docker compose exec backend npx tsx prisma/seed.ts
```

Após esses passos, a aplicação estará disponível em:

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3334

Para parar todos os serviços:

```bash
docker compose down
```

Para parar e **remover os dados do banco**:

```bash
docker compose down -v
```

### Credenciais de acesso

| Campo      | Valor                |
| ---------- | -------------------- |
| **E-mail** | `admin@salespro.com` |
| **Senha**  | `admin123`           |

---

## 6. Referências

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma ORM Documentation](https://www.prisma.io/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [react-chartjs-2](https://react-chartjs-2.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
