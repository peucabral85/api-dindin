require('dotenv').config();
const express = require('express');
const rotasUsuarios = require('./routes/usuarios');
const rotasTransacoes = require('./routes/transacoes');
const rotasCategorias = require('./routes/categorias');

const app = express();

app.use(express.json());
app.use(rotasUsuarios);
app.use(rotasTransacoes);
app.use(rotasCategorias);

app.listen(process.env.PORT, () =>
    console.log(`Server rodando na porta ${process.env.PORT}`));