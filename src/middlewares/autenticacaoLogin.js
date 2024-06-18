const pool = require('../connections/conexao');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../configs/configs');

const validarLogin = async (req, res, next) => {
    try {

        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
        }

        const token = authorization.split(' ')[1];

        const { id } = jwt.verify(token, jwtSecret);

        const usuarioEncontrado = await pool.query(`select * from usuarios where id = $1`, [id]);

        if (usuarioEncontrado.rowCount < 1) {
            return res.status(401).json({ mensagem: "Acesso não autorizado!" });
        }

        req.usuario = usuarioEncontrado.rows[0];

        next();

    } catch (error) {
        if (error.message === 'jwt expired') {
            return res.status(401).json({ mensagem: 'Token expirado. Faça login novamente!' });
        }

        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

module.exports = validarLogin;