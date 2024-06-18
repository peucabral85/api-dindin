const pool = require('../connections/conexao');

const listarCategorias = async (req, res) => {
    const { rows: categorias } = await pool.query('select * from categorias');

    return res.status(200).json(categorias);
}

module.exports = listarCategorias;