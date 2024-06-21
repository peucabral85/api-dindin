const express = require('express');
const { cadastrarUsuario, logarUsuario, detalharUsuario, atualizarUsuario } = require('../controllers/usuarios');
const { validarCamposCadastro, validarCamposLogin } = require('../middlewares/validacoesUsuarios');
const validarLogin = require('../middlewares/autenticacaoLogin');

const rotas = express();

rotas.get('/usuario', validarLogin, detalharUsuario);
rotas.put('/usuario', validarLogin, validarCamposCadastro, atualizarUsuario);
rotas.post('/usuario', validarCamposCadastro, cadastrarUsuario);
rotas.post('/login', validarCamposLogin, logarUsuario);

module.exports = rotas;