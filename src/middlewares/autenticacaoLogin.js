const knex = require('../connections/conexao');
const jwt = require('jsonwebtoken');

const validarLogin = async (req, res, next) => {
    try {

        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
        }

        const token = authorization.split(' ')[1];

        const { id } = jwt.verify(token, process.env.PASS_JWT);

        const usuarioEncontrado = await knex('usuarios').where({ id }).first();

        if (!usuarioEncontrado) {
            return res.status(401).json({ mensagem: "Acesso não autorizado!" });
        }

        req.usuario = usuarioEncontrado;

        next();

    } catch (error) {
        if (error.message === 'jwt expired' || error.message === 'invalid token' || error.message === 'invalid signature') {
            return res.status(401).json({ mensagem: 'Autenticação falhou. Por favor, verifique as credenciais e tente novamente!' });
        }

        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

module.exports = validarLogin;