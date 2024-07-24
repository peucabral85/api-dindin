const knex = require('../connections/conexao');

const listarCategoriasBd = async () => {
    return knex('categorias');
}

module.exports = listarCategoriasBd;