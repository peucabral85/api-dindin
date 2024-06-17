const express = require('express');
const { serverPort } = require('./configs/configs');
const rotasUsuarios = require('./routes/usuarios');
const rotasTransacoes = require('./routes/transacoes');

const app = express();

app.use(express.json());
app.use(rotasUsuarios);
app.use(rotasTransacoes);

app.listen(serverPort, () =>
    console.log(`Server is running on port ${serverPort}`));