const express = require('express');
const { cadastrarTransacao, detalharTransacao, obterExtrato, listarTransacoes, atualizarTransacao, excluirTransacao } = require('../controllers/transacoes');
const validarLogin = require('../middlewares/autenticacaoLogin');
const validarCorpoRequisicao = require('../middlewares/validarCorpoRequisicao');
const schemaValidacoes = require('../schemas/schemaTransacoes');

const rotas = express();

rotas.use(validarLogin);

rotas.get('/transacao/extrato', obterExtrato);
rotas.get('/transacao', listarTransacoes);
rotas.get('/transacao/:id', detalharTransacao);
rotas.put('/transacao/:id', validarCorpoRequisicao(schemaValidacoes), atualizarTransacao);
rotas.delete('/transacao/:id', excluirTransacao);
rotas.post('/transacao', validarCorpoRequisicao(schemaValidacoes), cadastrarTransacao);

module.exports = rotas;