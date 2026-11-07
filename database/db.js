
const Database = require('better-sqlite3');
const path = require('path');

// Criar conexão com o banco
const db = new Database(
    path.join(__dirname, 'barbercontrol.db')
);

// Criar tabela de clientes
db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        telefone TEXT NOT NULL,
        email TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Criar tabela de serviços
db.exec(`
    CREATE TABLE IF NOT EXISTS servicos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        preco REAL NOT NULL,
        duracao INTEGER NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Habilitar integridade dos relacionamentos
db.pragma('foreign_keys = ON');

// Criar tabela de agendamentos
db.exec(`
    CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        servico_id INTEGER NOT NULL,
        data DATE NOT NULL,
        horario TEXT NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        FOREIGN KEY (servico_id) REFERENCES servicos(id),

        UNIQUE(data, horario)
    )
`);


console.log('Banco de dados conectado com sucesso!');

module.exports = db;
