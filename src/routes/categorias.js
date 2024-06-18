const express = require('express');
const listarCategorias = require('../controllers/categorias');

const rotas = express();

rotas.get('/categorias', listarCategorias);

module.exports = rotas;