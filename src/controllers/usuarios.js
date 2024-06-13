const pool = require('../connections/conexao');
const { jwtSecret } = require('../configs/configs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {

        const emailValidado = await pool.query(
            `select * from usuarios where email ilike $1
            `, [email]
        );

        if (emailValidado.rowCount > 0) {
            return res.status(400).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." })
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await pool.query(
            `insert into usuarios (nome, email, senha) values ($1, $2, $3) returning id, nome, email
            `, [nome, email, senhaCriptografada]
        );

        return res.status(201).json(novoUsuario.rows[0]);

    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const logarUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuarioLogado = await pool.query('select * from usuarios where email = $1', [email]);

        if (usuarioLogado.rowCount < 1) {
            return res.status(401).json({ mensagem: "Usuário e/ou senha inválido(s)." });
        }

        const senhaValida = await bcrypt.compare(senha, usuarioLogado.rows[0].senha);

        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Usuário e/ou senha inválido(s)." })
        }

        const token = jwt.sign({ id: usuarioLogado.rows[0].id }, jwtSecret, { expiresIn: '1h' });

        const { senha: senhaUsuario, ...usuario } = usuarioLogado.rows[0];

        return res.status(200).json({ usuario, token });

    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

module.exports = {
    cadastrarUsuario,
    logarUsuario
}