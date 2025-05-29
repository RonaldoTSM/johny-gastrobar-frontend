
# 🍽️ Johny GastroBar - Sistema de Gestão

Sistema completo de gestão para restaurantes e bares, desenvolvido em React com TypeScript. O sistema oferece uma interface moderna e intuitiva para gerenciar todos os aspectos operacionais do estabelecimento.

![Dashboard Preview](https://via.placeholder.com/800x400/1f2937/ffffff?text=Johny+GastroBar+Dashboard)

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Banco de Dados](#-estrutura-do-banco-de-dados)
- [API Endpoints](#-api-endpoints)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)

## 🎯 Visão Geral

O Johny GastroBar é um sistema de gestão completo desenvolvido para restaurantes e bares, oferecendo controle total sobre:

- **Gestão de Funcionários** - Controle completo da equipe com diferentes tipos de funcionários
- **Cardápio Digital** - Gerenciamento de itens, preços e categorias
- **Sistema de Mesas** - Controle de mesas e sua disponibilidade
- **Pedidos em Tempo Real** - Gestão completa de pedidos com status
- **Sistema de Pagamentos** - Controle financeiro e métodos de pagamento
- **Reservas** - Agendamento e controle de reservas
- **Feedback dos Clientes** - Sistema de avaliação e comentários
- **Dashboard Analítico** - Métricas e relatórios em tempo real

## ✨ Funcionalidades

### 👥 Gestão de Funcionários
- **4 Tipos Específicos de Funcionários:**
  - **Garçom**: Setor de atendimento específico
  - **Cozinheiro**: Especialidade culinária
  - **Bartender**: Especialidade do bar
  - **Gerente**: Nível de acesso e limite de desconto
- Hierarquia com supervisores
- Múltiplos telefones por funcionário
- Controle de dependentes
- Endereço completo
- Histórico de contratação

### 🍽️ Cardápio
- **6 Categorias de Itens:**
  - Bebidas
  - Pratos Principais
  - Entradas
  - Sobremesas
  - Petiscos
  - Outros
- Controle de preços
- Sistema de busca avançada
- Estatísticas de vendas

### 🏪 Mesas
- Capacidade configurável
- Localização específica
- Status em tempo real
- Controle de disponibilidade

### 📋 Pedidos
- Criação de pedidos por mesa
- Múltiplos itens com quantidades
- Sistema de desconto
- Status de entrega e pagamento
- Vinculação com garçom e gerente

### 💰 Pagamentos
- Múltiplos métodos de pagamento
- Controle de valor total
- Histórico de transações
- Relatórios financeiros

### 📅 Reservas
- Agendamento por data e hora
- Controle de número de pessoas
- Observações especiais
- Vinculação com mesas

### ⭐ Feedback
- Avaliação da comida (1-5 estrelas)
- Avaliação do atendimento (1-5 estrelas)
- Comentários textuais
- Vinculação com pedidos e mesas

## 🛠️ Tecnologias

### Frontend
- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI modernos
- **React Query** - Gerenciamento de estado servidor
- **React Hook Form** - Formulários performáticos
- **Lucide React** - Ícones modernos

### Backend API
- **Endpoint Base**: `http://localhost:8088/api`
- **Formato**: REST API
- **Dados**: JSON

## 🗄️ Estrutura do Banco de Dados

### Funcionários
```sql
-- Tabela principal de funcionários
CREATE TABLE funcionarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  salario DECIMAL(10,2) NOT NULL,
  data_contratacao DATE NOT NULL,
  rua VARCHAR(255) NOT NULL,
  numero VARCHAR(10) NOT NULL,
  bairro VARCHAR(100) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  cep VARCHAR(8) NOT NULL,
  id_supervisor INTEGER REFERENCES funcionarios(id),
  especificacao VARCHAR(50) NOT NULL -- 'Garcom', 'Cozinheiro', 'Bartender', 'Gerente'
);

-- Especializações por tipo
CREATE TABLE garcons (
  id_funcionario INTEGER PRIMARY KEY REFERENCES funcionarios(id),
  setor_atendimento VARCHAR(100) NOT NULL
);

CREATE TABLE cozinheiros (
  id_funcionario INTEGER PRIMARY KEY REFERENCES funcionarios(id),
  especialidade_culinaria VARCHAR(100) NOT NULL
);

CREATE TABLE bartenders (
  id_funcionario INTEGER PRIMARY KEY REFERENCES funcionarios(id),
  especialidade_bar VARCHAR(100) NOT NULL
);

CREATE TABLE gerentes (
  id_funcionario INTEGER PRIMARY KEY REFERENCES funcionarios(id),
  nivel_acesso VARCHAR(50) NOT NULL,
  limite_desconto DECIMAL(5,2) NOT NULL
);
```

### Sistema de Pedidos
```sql
-- Itens do cardápio
CREATE TABLE itens (
  id_item SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- 'Bebida', 'Prato Principal', etc.
  preco DECIMAL(10,2) NOT NULL
);

-- Mesas
CREATE TABLE mesas (
  id_mesa SERIAL PRIMARY KEY,
  capacidade INTEGER NOT NULL,
  localizacao VARCHAR(255) NOT NULL
);

-- Pedidos
CREATE TABLE pedidos (
  id_pedido SERIAL PRIMARY KEY,
  id_garcom INTEGER REFERENCES funcionarios(id),
  id_gerente INTEGER REFERENCES funcionarios(id),
  id_mesa INTEGER REFERENCES mesas(id_mesa),
  data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  entregue BOOLEAN DEFAULT FALSE,
  pago BOOLEAN DEFAULT FALSE,
  desconto DECIMAL(5,2) DEFAULT 0
);

-- Itens do pedido
CREATE TABLE itens_do_pedido (
  id_pedido INTEGER REFERENCES pedidos(id_pedido),
  id_item INTEGER REFERENCES itens(id_item),
  quantidade INTEGER NOT NULL,
  PRIMARY KEY (id_pedido, id_item)
);
```

## 🔌 API Endpoints

### Funcionários
```
GET    /api/funcionarios          # Lista todos os funcionários
GET    /api/funcionarios/{id}     # Busca funcionário por ID
POST   /api/funcionarios          # Cria novo funcionário
PUT    /api/funcionarios/{id}     # Atualiza funcionário
DELETE /api/funcionarios/{id}     # Remove funcionário
```

### Itens
```
GET    /api/itens                 # Lista todos os itens
GET    /api/itens/{id}            # Busca item por ID
POST   /api/itens                 # Cria novo item
PUT    /api/itens/{id}            # Atualiza item
DELETE /api/itens/{id}            # Remove item
```

### Mesas
```
GET    /api/mesas                 # Lista todas as mesas
GET    /api/mesas/{id}            # Busca mesa por ID
POST   /api/mesas                 # Cria nova mesa
PUT    /api/mesas/{id}            # Atualiza mesa
DELETE /api/mesas/{id}            # Remove mesa
```

### Pedidos
```
GET    /api/pedidos               # Lista todos os pedidos
GET    /api/pedidos/{id}          # Busca pedido por ID
GET    /api/pedidos/nao-pagos     # Lista pedidos não pagos
POST   /api/pedidos               # Cria novo pedido
PUT    /api/pedidos/{id}          # Atualiza pedido
DELETE /api/pedidos/{id}          # Remove pedido
```

### Pagamentos
```
GET    /api/pagamentos            # Lista todos os pagamentos
GET    /api/pagamentos/{id}       # Busca pagamento por ID
GET    /api/pagamentos/por-pedido/{id} # Busca por pedido
POST   /api/pagamentos            # Registra pagamento
PUT    /api/pagamentos/{id}       # Atualiza pagamento
```

### Reservas
```
GET    /api/reservas              # Lista todas as reservas
GET    /api/reservas/{id}         # Busca reserva por ID
GET    /api/reservas/por-data     # Busca por data específica
POST   /api/reservas              # Cria nova reserva
PUT    /api/reservas/{id}         # Atualiza reserva
DELETE /api/reservas/{id}         # Remove reserva
```

### Feedbacks
```
GET    /api/feedbacks             # Lista todos os feedbacks
GET    /api/feedbacks/{id}        # Busca feedback por ID
POST   /api/feedbacks             # Cria novo feedback
PUT    /api/feedbacks/{id}        # Atualiza feedback
DELETE /api/feedbacks/{id}        # Remove feedback
```

### Dashboard (Analíticos)
```
GET    /api/dashboard/financeiro  # Métricas financeiras
GET    /api/dashboard/vendas/top-itens-mais-vendidos  # Top itens vendidos
GET    /api/dashboard/vendas/top-itens-mais-rentaveis # Top itens rentáveis
GET    /api/dashboard/pedidos/contagem-criados       # Contagem de pedidos
GET    /api/dashboard/pedidos/contagem-por-status    # Status dos pedidos
GET    /api/dashboard/reservas/hoje                  # Reservas de hoje
GET    /api/dashboard/reservas/amanha                # Reservas de amanhã
GET    /api/dashboard/qualidade/metricas-feedback    # Métricas de qualidade
```

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Backend API rodando na porta 8088

### Passos

1. **Clone o repositório**
```bash
git clone <URL_DO_REPOSITORIO>
cd johny-gastrobar
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure a API**
```bash
# Certifique-se que a API está rodando em http://localhost:8088
# Verifique o arquivo src/lib/api.ts para configurações
```

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse o sistema**
```
http://localhost:5173
```

## ⚙️ Configuração

### API Configuration
O arquivo `src/lib/api.ts` contém as configurações da API:

```typescript
const API_BASE_URL = 'http://localhost:8088/api';
```

Para alterar a URL da API, modifique esta constante.

### Tipos TypeScript
Todos os tipos estão definidos em `src/types/api.ts`, incluindo:
- Interfaces para todas as entidades
- Tipos específicos para cada funcionalidade
- Validações de formulário

## 📱 Uso

### Dashboard
- Acesse métricas em tempo real
- Visualize gráficos de vendas
- Monitore reservas e pedidos

### Gestão de Funcionários
1. Navegue para "Funcionários"
2. Clique em "Novo Funcionário"
3. Selecione o tipo (Garçom, Cozinheiro, Bartender, Gerente)
4. Preencha os campos específicos que aparecem
5. Adicione telefones e dependentes conforme necessário

### Criação de Pedidos
1. Vá para "Pedidos"
2. Clique em "Novo Pedido"
3. Selecione a mesa
4. Adicione itens com quantidades
5. Defina garçom responsável
6. Aplique desconto se necessário (com autorização de gerente)

### Sistema de Pagamentos
1. Acesse "Pagamentos"
2. Selecione o pedido
3. Escolha o método de pagamento
4. Confirme o valor total

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── dashboard/      # Componentes do dashboard
│   ├── funcionarios/   # Componentes de funcionários
│   ├── itens/          # Componentes de itens
│   ├── mesas/          # Componentes de mesas
│   ├── pedidos/        # Componentes de pedidos
│   ├── pagamentos/     # Componentes de pagamentos
│   ├── reservas/       # Componentes de reservas
│   └── feedbacks/      # Componentes de feedbacks
├── pages/              # Páginas principais
├── services/           # Serviços de API
├── lib/                # Utilitários e configurações
├── types/              # Definições TypeScript
└── hooks/              # Hooks customizados
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- 📧 Email: suporte@johnygastrobar.com
- 💬 Discord: [Servidor da Comunidade]
- 📱 WhatsApp: +55 (11) 99999-9999

---

**Desenvolvido com ❤️ para o Johny GastroBar**
