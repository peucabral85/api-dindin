const knex = require('../connections/conexao');

const validarCategoria = async (categoria_id) => {
    try {
        const categoriaEncontrada = await knex('categorias').where({ id: categoria_id });

        return categoriaEncontrada;

    } catch (error) {
        throw error;
    }
}

const validarTransacao = async (idUsuario, idTransacao) => {
    try {
        const transacaoValidada = await knex('transacoes as t')
            .join('categorias as c', 't.categoria_id', 'c.id')
            .select('t.id', 't.tipo', 't.descricao', 't.valor', 't.data', 't.usuario_id', 't.categoria_id', 'c.descricao as nome_categoria')
            .where({ 't.usuario_id': idUsuario, 't.id': idTransacao });

        return transacaoValidada;

    } catch (error) {
        throw error;
    }
}

const cadastrarTransacao = async (req, res) => {
    try {
        const { descricao, valor, data, categoria_id, tipo } = req.body;
        const idToken = req.usuario.id;

        const categoriaEncontrada = await validarCategoria(categoria_id);

        if (!categoriaEncontrada[0]) {
            return res.status(404).json({ mensagem: "Categoria informada não encontrada." });
        }

        const cadastro = await knex('transacoes')
            .insert({ descricao, valor, data, categoria_id, usuario_id: idToken, tipo: knex.raw('lower(?)', [tipo]) })
            .returning('*');

        const cadastroOrdenado = {
            "id": cadastro[0].id,
            "tipo": cadastro[0].tipo,
            "descricao": cadastro[0].descricao,
            "valor": cadastro[0].valor,
            "data": cadastro[0].data,
            "usuario_id": cadastro[0].usuario_id,
            "categoria_id": cadastro[0].categoria_id,
            "categoria_nome": categoriaEncontrada[0].descricao
        }

        return res.status(201).json(cadastroOrdenado);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const detalharTransacao = async (req, res) => {
    try {
        const { id } = req.params;
        const idToken = req.usuario.id;

        const transacaoValidada = await validarTransacao(idToken, id);

        if (!transacaoValidada[0]) {
            return res.status(404).json({ mensagem: "Transação não encontrada ou não pertence ao usuário." });
        }

        return res.status(200).json(transacaoValidada[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const obterExtrato = async (req, res) => {
    try {
        const idToken = req.usuario.id;

        const somaExtrato = await knex('transacoes')
            .select(
                knex.raw(`coalesce(sum(valor) filter(where tipo = 'entrada'), 0) as "entrada"`),
                knex.raw(`coalesce(sum(valor) filter(where tipo = 'saida'), 0) as "saida"`))
            .where({ usuario_id: idToken })

        const totalExtrato = {
            "entrada": Number(somaExtrato[0].entrada),
            "saida": Number(somaExtrato[0].saida)
        }

        return res.status(200).json(totalExtrato);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const listarTransacoes = async (req, res) => {
    try {
        const idToken = req.usuario.id;
        const filtro = req.query.filtro;

        const transacao = await knex('transacoes as t')
            .join('categorias as c', 't.categoria_id', 'c.id')
            .select('t.id', 't.tipo', 't.descricao', 't.valor', 't.data',
                't.usuario_id', 't.categoria_id', 'c.descricao as categoria_nome')
            .where({ 't.usuario_id': idToken })
            .where((query) => {
                if (filtro) {
                    const filtrosCategoria = Array.isArray(filtro) ? filtro.map(f => f.toLowerCase()) : [filtro.toLowerCase()];
                    return query.whereIn(knex.raw('lower(c.descricao)'), filtrosCategoria);
                }
            });

        res.status(200).json(transacao);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const atualizarTransacao = async (req, res) => {
    try {
        const { id } = req.params;
        const { descricao, valor, data, categoria_id, tipo } = req.body;
        const IdToken = req.usuario.id;

        const transacaoValidada = await validarTransacao(IdToken, id);

        if (!transacaoValidada[0]) {
            return res.status(404).json({ mensagem: "Transação não encontrada ou não pertence ao usuário." });
        }

        const categoriaEncontrada = await validarCategoria(categoria_id);

        if (!categoriaEncontrada[0]) {
            return res.status(404).json({ mensagem: "Categoria informada não encontrada." });
        }

        await knex('transacoes')
            .update({ descricao, valor, data, categoria_id, tipo: knex.raw('lower(?)', [tipo]) })
            .where({ usuario_id: IdToken, id });

        return res.status(204).json();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const excluirTransacao = async (req, res) => {
    try {
        const { id } = req.params;
        const idToken = req.usuario.id;

        const transacaoValidada = await validarTransacao(idToken, id);

        if (!transacaoValidada[0]) {
            return res.status(404).json({ mensagem: "Transação não encontrada ou não pertence ao usuário." });
        }

        await knex('transacoes').del().where({ usuario_id: idToken, id });

        res.status(204).json();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

module.exports = {
    cadastrarTransacao,
    detalharTransacao,
    obterExtrato,
    listarTransacoes,
    atualizarTransacao,
    excluirTransacao
}