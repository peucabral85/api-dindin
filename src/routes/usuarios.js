const express = require('express');
const { cadastrarUsuario, logarUsuario, detalharUsuario, atualizarUsuario } = require('../controllers/usuarios');
const validarLogin = require('../middlewares/autenticacaoLogin');
const validarCorpoRequisicao = require('../middlewares/validarCorpoRequisicao');
const schemaUsuario = require('../schemas/schemaUsuarios');
const schemaLogin = require('../schemas/schemaLogin');

const rotas = express();

rotas.post('/usuario', validarCorpoRequisicao(schemaUsuario), cadastrarUsuario);
rotas.post('/login', validarCorpoRequisicao(schemaLogin), logarUsuario);

rotas.use(validarLogin);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', validarCorpoRequisicao(schemaUsuario), atualizarUsuario);

module.exports = rotas;