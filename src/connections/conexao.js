const knex = require('knex')({
    client: process.env.CLIENT_DB,
    connection: {
        host: process.env.HOST_DB,
        port: process.env.PORT_DB,
        user: process.env.USER_DB,
        password: process.env.PASS_DB,
        database: process.env.NAME_DB
    }
});

module.exports = knex;