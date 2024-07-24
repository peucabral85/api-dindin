const knex = require('../connections/conexao');

const validarCategoria = async (categoria_id) => {
    const categoriaEncontrada = await knex('categorias').where({ id: categoria_id }).first();

    return categoriaEncontrada;

}

const validarTransacao = async (idUsuario, idTransacao) => {
    const transacaoValidada = await knex('transacoes as t')
        .join('categorias as c', 't.categoria_id', 'c.id')
        .select('t.id', 't.tipo', 't.descricao', 't.valor', 't.data', 't.usuario_id', 't.categoria_id', 'c.descricao as nome_categoria')
        .where({ 't.usuario_id': idUsuario, 't.id': idTransacao })
        .first();

    return transacaoValidada;
}

const insertTransacaoBD = async (descricao, valor, data, categoria_id, usuario_id, tipo) => {
    const cadastro = await knex('transacoes')
        .insert({ descricao, valor, data, categoria_id, usuario_id, tipo: knex.raw('lower(?)', [tipo]) })
        .returning('*');
    return cadastro[0];
}

const updateTransacaoBD = async (descricao, valor, data, categoria_id, tipo, usuario_id, id) => {
    return await knex('transacoes')
        .update({ descricao, valor, data, categoria_id, tipo: knex.raw('lower(?)', [tipo]) })
        .where({ usuario_id, id });
}

const deleteTransacaoBD = async (usuario_id, id) => {
    return await knex('transacoes').del().where({ usuario_id, id });
}

const somarExtrato = async (usuario_id) => {
    const somaExtrato = await knex('transacoes')
        .select(
            knex.raw(`coalesce(sum(valor) filter(where tipo = 'entrada'), 0) as "entrada"`),
            knex.raw(`coalesce(sum(valor) filter(where tipo = 'saida'), 0) as "saida"`))
        .where({ usuario_id });

    return somaExtrato;
}

const obterTransacao = async (usuario_id, filtro) => {
    const transacao = await knex('transacoes as t')
        .join('categorias as c', 't.categoria_id', 'c.id')
        .select('t.id', 't.tipo', 't.descricao', 't.valor', 't.data',
            't.usuario_id', 't.categoria_id', 'c.descricao as categoria_nome')
        .where({ 't.usuario_id': usuario_id })
        .where((query) => {
            if (filtro) {
                const filtrosCategoria = Array.isArray(filtro) ? filtro.map(f => f.toLowerCase()) : [filtro.toLowerCase()];
                return query.whereIn(knex.raw('lower(c.descricao)'), filtrosCategoria);
            }
        });

    return transacao;
}

module.exports = {
    validarCategoria,
    validarTransacao,
    insertTransacaoBD,
    updateTransacaoBD,
    deleteTransacaoBD,
    somarExtrato,
    obterTransacao
}