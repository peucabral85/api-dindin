const config = require('../configs/configs');

// configurando banco de dados
const { Pool } = require('pg');
const pool = new Pool({
    host: config.dbHost,
    port: config.dbPort,
    database: config.dbName,
    user: config.dbUser,
    password: config.dbPassword
});

module.exports = pool;