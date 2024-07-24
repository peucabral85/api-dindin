const listarCategoriasBd = require('../services/categorias');

const listarCategorias = async (req, res) => {
    const categorias = await listarCategoriasBd();

    return res.status(200).json(categorias);
}

module.exports = listarCategorias;