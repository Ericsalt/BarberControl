
const express = require('express');
const path = require('path');
const db = require('./database/db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API: consultar clientes
app.get('/api/clientes', (req, res) => {
    try {
        const clientes = db.prepare(
            'SELECT * FROM clientes ORDER BY id DESC'
        ).all();

        res.json(clientes);
    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao consultar clientes.'
        });
    }
});

// API: cadastrar cliente
app.post('/api/clientes', (req, res) => {
    try {
        const { nome, telefone, email } = req.body;

        if (!nome || !nome.trim() || !telefone || !telefone.trim()) {
            return res.status(400).json({
                erro: 'Nome e telefone são obrigatórios.'
            });
        }

        const resultado = db.prepare(`
            INSERT INTO clientes (nome, telefone, email)
            VALUES (?, ?, ?)
        `).run(
            nome.trim(),
            telefone.trim(),
            email ? email.trim() : null
        );

        res.status(201).json({
            mensagem: 'Cliente cadastrado com sucesso!',
            id: resultado.lastInsertRowid
        });

    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao cadastrar cliente.'
        });
    }
});

// API: consultar serviços
app.get('/api/servicos', (req, res) => {
    try {
        const servicos = db.prepare(
            'SELECT * FROM servicos ORDER BY id DESC'
        ).all();

        res.json(servicos);
    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao consultar serviços.'
        });
    }
});

// API: cadastrar serviço
app.post('/api/servicos', (req, res) => {
    try {
        const { nome, descricao, preco, duracao } = req.body;

        const valor = Number(preco);
        const tempo = Number(duracao);

        if (
            !nome || !nome.trim() ||
            !Number.isFinite(valor) || valor <= 0 ||
            !Number.isInteger(tempo) || tempo <= 0
        ) {
            return res.status(400).json({
                erro: 'Informe nome, preço e duração válidos.'
            });
        }

        const resultado = db.prepare(`
            INSERT INTO servicos
            (nome, descricao, preco, duracao)
            VALUES (?, ?, ?, ?)
        `).run(
            nome.trim(),
            descricao ? descricao.trim() : null,
            valor,
            tempo
        );

        res.status(201).json({
            mensagem: 'Serviço cadastrado com sucesso!',
            id: resultado.lastInsertRowid
        });

    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao cadastrar serviço.'
        });
    }
});

 // API: consultar agendamentos
app.get('/api/agendamentos', (req, res) => {
    try {
        const agendamentos = db.prepare(`
            SELECT
                a.id,
                c.nome AS cliente,
                s.nome AS servico,
                a.data,
                a.horario
            FROM agendamentos a
            INNER JOIN clientes c ON c.id = a.cliente_id
            INNER JOIN servicos s ON s.id = a.servico_id
            ORDER BY a.data, a.horario
        `).all();

        res.json(agendamentos);

    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao consultar agendamentos.'
        });
    }
});
// API: consultar indicadores do Dashboard
app.get('/api/dashboard', (req, res) => {
    try {
        const clientes = db.prepare(
            'SELECT COUNT(*) AS total FROM clientes'
        ).get().total;

        const servicos = db.prepare(
            'SELECT COUNT(*) AS total FROM servicos'
        ).get().total;

        const agendamentos = db.prepare(
            'SELECT COUNT(*) AS total FROM agendamentos'
        ).get().total;

        res.json({
            clientes,
            servicos,
            agendamentos
        });

    } catch (error) {
        console.error('Erro no Dashboard:', error);
        res.status(500).json({
            erro: 'Erro ao consultar indicadores.'
        });
    }
});

// API: cadastrar agendamento
app.post('/api/agendamentos', (req, res) => {
    try {
        const { cliente_id, servico_id, data, horario } = req.body;

        const clienteId = Number(cliente_id);
        const servicoId = Number(servico_id);

        if (
            !Number.isInteger(clienteId) || clienteId <= 0 ||
            !Number.isInteger(servicoId) || servicoId <= 0 ||
            !data || !/^\d{4}-\d{2}-\d{2}$/.test(data) ||
            !horario || !/^([01]\d|2[0-3]):[0-5]\d$/.test(horario)
        ) {
            return res.status(400).json({
                erro: 'Preencha todos os campos corretamente.'
            });
        }

        const cliente = db.prepare(
            'SELECT id FROM clientes WHERE id = ?'
        ).get(clienteId);

        const servico = db.prepare(
            'SELECT id FROM servicos WHERE id = ?'
        ).get(servicoId);

        if (!cliente || !servico) {
            return res.status(400).json({
                erro: 'Cliente ou serviço não encontrado.'
            });
        }

        const resultado = db.prepare(`
            INSERT INTO agendamentos
            (cliente_id, servico_id, data, horario)
            VALUES (?, ?, ?, ?)
        `).run(clienteId, servicoId, data, horario);

        res.status(201).json({
            mensagem: 'Agendamento realizado com sucesso!',
            id: resultado.lastInsertRowid
        });

    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({
                erro: 'Já existe um agendamento nesse horário.'
            });
        }

        res.status(500).json({
            erro: 'Erro ao cadastrar agendamento.'
        });
    }
});


// Arquivos públicos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`BarberControl rodando em http://localhost:${PORT}`);
});
