# Johny GastroBar - Sistema de Gestão (Frontend)

Este repositório contém o código-fonte da interface do usuário (frontend) para o sistema de gestão "Johny GastroBar". Esta aplicação web moderna é desenvolvida com React, TypeScript e Tailwind CSS, e consome a API REST fornecida pelo backend para exibir dados e interagir com as funcionalidades do sistema.

## Visão Geral do Projeto e Funcionalidades

O frontend do Johny GastroBar oferece uma interface de usuário intuitiva e responsiva para as seguintes funcionalidades principais do sistema de gestão:

* **Dashboard Analítico:** Visualização de métricas chave de desempenho do estabelecimento.
* **Gestão de Funcionários:** Cadastro, visualização, edição e remoção de funcionários e suas especializações.
* **Gerenciamento do Cardápio (Itens):** Criação, atualização e listagem de itens do cardápio.
* **Controle de Mesas:** Cadastro e visualização das mesas do estabelecimento.
* **Gestão de Pedidos:** Lançamento, acompanhamento e atualização de status de pedidos.
* **Registro de Pagamentos:** Interface para registrar pagamentos de pedidos.
* **Sistema de Reservas:** Agendamento e gerenciamento de reservas de mesas.
* **Coleta de Feedbacks:** Interface para clientes submeterem avaliações de pedidos.
* **Registro de Autorizações:** Interface para gerentes registrarem autorizações.

## Tecnologias Utilizadas

-   React 18
-   TypeScript
-   Vite (Build Tool)
-   Tailwind CSS (Estilização)
-   shadcn/ui (Componentes UI)
-   React Router DOM (Gerenciamento de Rotas)
-   TanStack React Query (Gerenciamento de Estado do Servidor)
-   React Hook Form (Formulários)
-   Lucide React (Ícones)
-   Zod (Validação de Schemas)
-   Axios (ou Fetch API, para chamadas HTTP - conforme definido em `src/lib/api.ts`)

## Repositórios do Projeto

-   **Frontend (Este Repositório):** [https://github.com/RonaldoTSM/johny-gastrobar-frontend](https://github.com/RonaldoTSM/johny-gastrobar-frontend)
-   **Backend:** [https://github.com/RonaldoTSM/johny-gastrobar-backend](https://github.com/RonaldoTSM/johny-gastrobar-backend)

## Pré-requisitos para Execução

-   Node.js 18+
-   npm ou yarn (gerenciador de pacotes JavaScript)
-   O [Backend do Johny GastroBar](https://github.com/RonaldoTSM/johny-gastrobar-backend) deve estar em execução e acessível.

## Configuração e Instalação

1.  **Clone este repositório:**
    ```bash
    git clone [https://github.com/RonaldoTSM/johny-gastrobar-frontend.git](https://github.com/RonaldoTSM/johny-gastrobar-frontend.git)
    cd johny-gastrobar-frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```
    ou se estiver usando yarn:
    ```bash
    yarn install
    ```

3.  **Configuração da API Backend:**
  * Verifique o arquivo de configuração da API do frontend (provavelmente em `src/lib/api.ts` ou similar).
  * Certifique-se de que a constante `API_BASE_URL` está apontando para o endereço correto do backend em execução. Exemplo:
      ```typescript
      const API_BASE_URL = 'http://localhost:8088/api'; // Porta do backend
      ```

## Executando o Frontend

1.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    ou se estiver usando yarn:
    ```bash
    yarn dev
    ```
2.  Abra seu navegador e acesse a URL fornecida pelo servidor de desenvolvimento.

## Interação com a API Backend

Este frontend interage com a API REST fornecida pelo [Backend do Johny GastroBar](https://github.com/RonaldoTSM/johny-gastrobar-backend). Todos os dados são obtidos e enviados através de requisições HTTP para os endpoints definidos no backend. Para detalhes específicos dos endpoints da API, consulte o README do repositório backend ou o relatório técnico do projeto.

## Estrutura do Projeto Frontend (Visão Geral)

A estrutura de pastas principal em `src/` geralmente inclui:
-   `components/`: Componentes React reutilizáveis.
-   `pages/`: Componentes que representam as diferentes páginas da aplicação.
-   `services/` ou `lib/`: Lógica de chamada à API, configuração do cliente HTTP.
-   `types/`: Definições de tipos TypeScript para os dados da API e da aplicação.
-   `hooks/`: Hooks customizados do React.
    *(Ajuste esta seção para refletir a estrutura real do seu projeto frontend).*

---
