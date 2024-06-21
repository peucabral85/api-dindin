const express = require('express');
const { cadastrarTransacao, detalharTransacao, obterExtrato, listarTransacoes, atualizarTransacao, excluirTransacao } = require('../controllers/transacoes');
const validarLogin = require('../middlewares/autenticacaoLogin');
const validarCamposTransacao = require('../middlewares/validacoesTransacoes');

const rotas = express();

rotas.use(validarLogin);

rotas.get('/transacao/extrato', obterExtrato);
rotas.get('/transacao', listarTransacoes);
rotas.get('/transacao/:id', detalharTransacao);
rotas.put('/transacao/:id', validarCamposTransacao, atualizarTransacao);
rotas.delete('/transacao/:id', excluirTransacao);
rotas.post('/transacao', validarCamposTransacao, cadastrarTransacao);

module.exports = rotas;