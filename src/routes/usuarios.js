const express = require('express');
const { cadastrarUsuario, logarUsuario } = require('../controllers/usuarios');
const { validarCamposCadastro, validarCamposLogin } = require('../middlewares/validacoesUsuarios');

const rotas = express();

rotas.post('/usuario', validarCamposCadastro, cadastrarUsuario);
rotas.post('/login', validarCamposLogin, logarUsuario);

module.exports = rotas;