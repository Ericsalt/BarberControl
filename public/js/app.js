
// Elementos da tela de clientes
const formulario = document.getElementById('formCliente');
const listaClientes = document.getElementById('listaClientes');

// Consultar clientes no banco de dados
async function carregarClientes() {
    if (!listaClientes) return;

    try {
        const resposta = await fetch('/api/clientes');
        const clientes = await resposta.json();

        listaClientes.innerHTML = '';

        if (clientes.length === 0) {
            listaClientes.innerHTML = `
                <tr>
                    <td colspan="3">Nenhum cliente cadastrado.</td>
                </tr>
            `;
            return;
        }

        clientes.forEach(cliente => {
            const linha = document.createElement('tr');

            const nome = document.createElement('td');
            const telefone = document.createElement('td');
            const email = document.createElement('td');

            nome.textContent = cliente.nome;
            telefone.textContent = cliente.telefone;
            email.textContent = cliente.email || '-';

            linha.append(nome, telefone, email);
            listaClientes.appendChild(linha);
        });

    } catch (erro) {
        console.error('Erro ao carregar clientes:', erro);
    }
}

// Cadastrar cliente
if (formulario) {
    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const email = document.getElementById('email').value.trim();

        try {
            const resposta = await fetch('/api/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome,
                    telefone,
                    email
                })
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                alert(resultado.erro || 'Não foi possível cadastrar.');
                return;
            }

            alert('Cliente cadastrado com sucesso!');

            formulario.reset();

            await carregarClientes();

        } catch (erro) {
            alert('Erro de conexão com o servidor.');
            console.error(erro);
        }
    });

    carregarClientes();
}

// GERENCIAMENTO DE SERVIÇOS

const formularioServico = document.getElementById('formServico');
const listaServicos = document.getElementById('listaServicos');

// Consultar serviços
async function carregarServicos() {
    if (!listaServicos) return;

    try {
        const resposta = await fetch('/api/servicos');

        if (!resposta.ok) {
            throw new Error('Falha ao consultar serviços.');
        }

        const servicos = await resposta.json();

        listaServicos.innerHTML = '';

        if (servicos.length === 0) {
            listaServicos.innerHTML = `
                <tr>
                    <td colspan="4">Nenhum serviço cadastrado.</td>
                </tr>
            `;
            return;
        }

        servicos.forEach(servico => {
            const linha = document.createElement('tr');

            const nome = document.createElement('td');
            const descricao = document.createElement('td');
            const preco = document.createElement('td');
            const duracao = document.createElement('td');

            nome.textContent = servico.nome;
            descricao.textContent = servico.descricao || '-';

            preco.textContent = Number(servico.preco)
                .toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

            duracao.textContent = `${servico.duracao} min`;

            linha.append(nome, descricao, preco, duracao);

            listaServicos.appendChild(linha);
        });

    } catch (erro) {
        console.error('Erro ao carregar serviços:', erro);
    }
}

// Cadastrar serviço
if (formularioServico) {
    formularioServico.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const nome = document.getElementById('nomeServico').value.trim();
        const preco = document.getElementById('preco').value;
        const duracao = document.getElementById('duracao').value;
        const descricao = document.getElementById('descricao').value.trim();

        try {
            const resposta = await fetch('/api/servicos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome,
                    preco,
                    duracao,
                    descricao
                })
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                alert(resultado.erro || 'Erro ao cadastrar serviço.');
                return;
            }

            alert('Serviço cadastrado com sucesso!');

            formularioServico.reset();

            await carregarServicos();

        } catch (erro) {
            alert('Erro de conexão com o servidor.');
            console.error(erro);
        }
    });

    carregarServicos();
}

// GERENCIAMENTO DE AGENDAMENTOS

const formularioAgendamento =
    document.getElementById('formAgendamento');

const listaAgendamentos =
    document.getElementById('listaAgendamentos');

const campoCliente = document.getElementById('cliente');
const campoServico = document.getElementById('servico');

// Carregar clientes e serviços nos campos
async function carregarOpcoesAgendamento() {
    if (!formularioAgendamento) return;

    try {
        const [resClientes, resServicos] = await Promise.all([
            fetch('/api/clientes'),
            fetch('/api/servicos')
        ]);

        if (!resClientes.ok || !resServicos.ok) {
            throw new Error('Erro ao carregar opções.');
        }

        const clientes = await resClientes.json();
        const servicos = await resServicos.json();

        campoCliente.innerHTML =
            '<option value="">Selecione um cliente</option>';

        campoServico.innerHTML =
            '<option value="">Selecione um serviço</option>';

        clientes.forEach(cliente => {
            const opcao = document.createElement('option');
            opcao.value = cliente.id;
            opcao.textContent = cliente.nome;
            campoCliente.appendChild(opcao);
        });

        servicos.forEach(servico => {
            const opcao = document.createElement('option');
            opcao.value = servico.id;
            opcao.textContent = servico.nome;
            campoServico.appendChild(opcao);
        });

    } catch (erro) {
        console.error('Erro ao carregar opções:', erro);
    }
}

// Consultar agendamentos
async function carregarAgendamentos() {
    if (!listaAgendamentos) return;

    try {
        const resposta = await fetch('/api/agendamentos');

        if (!resposta.ok) {
            throw new Error('Erro ao consultar agendamentos.');
        }

        const agendamentos = await resposta.json();

        listaAgendamentos.innerHTML = '';

        if (agendamentos.length === 0) {
            listaAgendamentos.innerHTML = `
                <tr>
                    <td colspan="4">
                        Nenhum agendamento cadastrado.
                    </td>
                </tr>
            `;
            return;
        }

        agendamentos.forEach(item => {
            const linha = document.createElement('tr');

            const cliente = document.createElement('td');
            const servico = document.createElement('td');
            const data = document.createElement('td');
            const horario = document.createElement('td');

            cliente.textContent = item.cliente;
            servico.textContent = item.servico;

            const [ano, mes, dia] = item.data.split('-');
            data.textContent = `${dia}/${mes}/${ano}`;

            horario.textContent = item.horario;

            linha.append(cliente, servico, data, horario);

            listaAgendamentos.appendChild(linha);
        });

    } catch (erro) {
        console.error('Erro ao carregar agendamentos:', erro);
    }
}

// Cadastrar agendamento
if (formularioAgendamento) {

    formularioAgendamento.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const dados = {
            cliente_id: campoCliente.value,
            servico_id: campoServico.value,
            data: document.getElementById('data').value,
            horario: document.getElementById('horario').value
        };

        try {
            const resposta = await fetch('/api/agendamentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                alert(resultado.erro || 'Erro ao realizar agendamento.');
                return;
            }

            alert('Agendamento realizado com sucesso!');

            formularioAgendamento.reset();

            await carregarAgendamentos();

        } catch (erro) {
            alert('Erro de conexão com o servidor.');
            console.error(erro);
        }
    });

    carregarOpcoesAgendamento();
    carregarAgendamentos();
}

// ========================================
// DASHBOARD - INDICADORES AUTOMÁTICOS
// ========================================

async function carregarDashboard() {
    const totalClientes = document.getElementById('totalClientes');
    const totalServicos = document.getElementById('totalServicos');
    const totalAgendamentos = document.getElementById('totalAgendamentos');

    // Executa somente na página inicial
    if (!totalClientes || !totalServicos || !totalAgendamentos) {
        return;
    }

    try {
        const resposta = await fetch('/api/dashboard');

        if (!resposta.ok) {
            throw new Error('Erro ao consultar indicadores.');
        }

        const dados = await resposta.json();

        totalClientes.textContent = dados.clientes;
        totalServicos.textContent = dados.servicos;
        totalAgendamentos.textContent = dados.agendamentos;

    } catch (erro) {
        console.error('Erro ao carregar Dashboard:', erro);
    }
}

// Atualizar indicadores ao abrir a página
carregarDashboard();

