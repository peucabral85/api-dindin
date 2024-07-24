const knex = require('../connections/conexao');

const verificarEmailExistente = async (email) => {
    const emailValidado = await knex('usuarios')
        .where('email', 'ilike', email);

    return emailValidado;
}

const insertUsuario = async (nome, email, senhaCriptografada) => {
    const novoUsuario = await knex('usuarios')
        .insert({
            nome,
            email: knex.raw('lower(?)', [email]),
            senha: senhaCriptografada
        })
        .returning(['id', 'nome', 'email']);

    return novoUsuario[0];
}

const updateUsuario = async (nome, email, senha, id) => {
    await knex('usuarios')
        .update({
            nome,
            email: knex.raw('lower(?)', [email]),
            senha
        })
        .where({ id });
}

module.exports = {
    verificarEmailExistente,
    insertUsuario,
    updateUsuario
}