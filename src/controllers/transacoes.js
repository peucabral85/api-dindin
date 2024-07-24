const { validarCategoria, validarTransacao, insertTransacaoBD, somarExtrato,
    updateTransacaoBD, deleteTransacaoBD, obterTransacao } = require('../services/transacoes');

const cadastrarTransacao = async (req, res) => {
    try {
        const { descricao, valor, data, categoria_id, tipo } = req.body;
        const idToken = req.usuario.id;

        const categoriaEncontrada = await validarCategoria(categoria_id);

        if (!categoriaEncontrada) {
            return res.status(404).json({ mensagem: "Categoria informada não encontrada." });
        }

        const cadastro = await insertTransacaoBD(descricao, valor, data, categoria_id, idToken, tipo);

        const cadastroOrdenado = {
            "id": cadastro.id,
            "tipo": cadastro.tipo,
            "descricao": cadastro.descricao,
            "valor": cadastro.valor,
            "data": cadastro.data,
            "usuario_id": cadastro.usuario_id,
            "categoria_id": cadastro.categoria_id,
            "categoria_nome": categoriaEncontrada.descricao
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

        if (!transacaoValidada) {
            return res.status(404).json({ mensagem: "Transação não encontrada ou não pertence ao usuário." });
        }

        return res.status(200).json(transacaoValidada);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const obterExtrato = async (req, res) => {
    try {
        const idToken = req.usuario.id;

        const somaExtrato = await somarExtrato(idToken);

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

        const transacao = await obterTransacao(idToken, filtro);

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

        if (!transacaoValidada) {
            return res.status(404).json({ mensagem: "Transação não encontrada ou não pertence ao usuário." });
        }

        const categoriaEncontrada = await validarCategoria(categoria_id);

        if (!categoriaEncontrada) {
            return res.status(404).json({ mensagem: "Categoria informada não encontrada." });
        }

        await updateTransacaoBD(descricao, valor, data, categoria_id, tipo, IdToken, id);

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

        if (!transacaoValidada) {
            return res.status(404).json({ mensagem: "Transação não encontrada ou não pertence ao usuário." });
        }

        await deleteTransacaoBD(idToken, id);

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