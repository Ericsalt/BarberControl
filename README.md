# BarberControl

Sistema web para gerenciamento administrativo de uma barbearia, desenvolvido como projeto acadêmico de Análise e Desenvolvimento de Sistemas.

O BarberControl reúne funcionalidades de consulta e cadastro de clientes, serviços e agendamentos, além de um painel com informações resumidas.

## Funcionalidades

- **Dashboard:** visualização resumida de informações do sistema.
- **Clientes:** cadastro e consulta de clientes.
- **Serviços:** cadastro e consulta de serviços, com preço e duração.
- **Agendamentos:** cadastro e consulta de agendamentos vinculados a clientes e serviços.
- **Validações:** campos obrigatórios e validação dos dados enviados à API.
- **Conflito de horário:** o banco de dados impede mais de um agendamento para a mesma data e horário.

## Tecnologias utilizadas

| Camada | Tecnologia |
|---|---|
| Interface | HTML, CSS e JavaScript |
| Servidor | Node.js |
| Framework do servidor | Express |
| Banco de dados | SQLite |
| Biblioteca de acesso ao banco | better-sqlite3 |

## Requisitos para executar

- Node.js instalado (inclui npm).
- Git, caso queira clonar o repositório.

## Como executar localmente

1. Clone o repositório:

   ```bash
   git clone https://github.com/Ericsalt/BarberControl.git
   ```

2. Entre na pasta do projeto:

   ```bash
   cd BarberControl
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Inicie a aplicação:

   ```bash
   npm start
   ```

5. Abra no navegador:

   http://localhost:3000

O servidor Express atende a interface e as rotas da API pela porta `3000`. O arquivo do banco de dados está em `database/barbercontrol.db`.

## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/clientes` | Lista os clientes |
| POST | `/api/clientes` | Cadastra um cliente |
| GET | `/api/servicos` | Lista os serviços |
| POST | `/api/servicos` | Cadastra um serviço |
| GET | `/api/agendamentos` | Lista os agendamentos |
| POST | `/api/agendamentos` | Cadastra um agendamento |
| GET | `/api/dashboard` | Retorna informações para o painel |

## Estrutura principal do projeto

```text
BarberControl/
├── database/
│   ├── barbercontrol.db
│   └── db.js
├── public/
│   ├── index.html
│   ├── clientes.html
│   ├── servicos.html
│   ├── agendamentos.html
│   ├── css/
│   └── js/
├── evidencias/
├── server.js
└── package.json
```

A estrutura acima destaca os diretórios e arquivos centrais; outros arquivos auxiliares podem existir no projeto.

## Banco de dados

O banco SQLite contém as tabelas:

- `clientes`
- `servicos`
- `agendamentos`

A tabela `agendamentos` possui chaves estrangeiras para clientes e serviços. Também há uma restrição de unicidade sobre a combinação de `data` e `horario`, evitando dois agendamentos no mesmo horário.

## Publicação e demonstração

Este é um projeto com backend Node.js e banco SQLite. **GitHub Pages não executa o servidor Express nem hospeda o banco SQLite para operações da aplicação.** Por isso, a URL do GitHub Pages não representa uma implantação funcional deste sistema full-stack.

Para testar todas as funcionalidades, execute o projeto localmente conforme as instruções acima. Para disponibilizá-lo na internet, é necessário um serviço de hospedagem que execute aplicações Node.js e ofereça armazenamento persistente para o banco de dados.

## Repositório

https://github.com/Ericsalt/BarberControl

## Contexto acadêmico

Projeto desenvolvido no contexto do Projeto Integrado do curso de Análise e Desenvolvimento de Sistemas (ADS).
