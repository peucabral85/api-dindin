const express = require('express');
const { serverPort } = require('./configs/configs');
const rotasUsuarios = require('./routes/usuarios');
const rotasTransacoes = require('./routes/transacoes');
const rotasCategorias = require('./routes/categorias');

const app = express();

app.use(express.json());
app.use(rotasUsuarios);
app.use(rotasTransacoes);
app.use(rotasCategorias);

app.listen(serverPort, () =>
    console.log(`Server rodando na porta ${serverPort}`));