const express = require('express');
const { serverPort } = require('./configs/configs');

const app = express();

app.use(express.json());

app.listen(serverPort, () =>
    console.log(`Server is running on port ${serverPort}`));