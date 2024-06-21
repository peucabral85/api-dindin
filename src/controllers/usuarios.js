const pool = require('../connections/conexao');
const { jwtSecret } = require('../configs/configs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const verificarEmailExistente = async (email) => {
    const emailValidado = await pool.query('select * from usuarios where email ilike $1', [email]);

    return emailValidado;
}

const cadastrarUsuario = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        const emailValidado = await verificarEmailExistente(email);

        if (emailValidado.rowCount > 0) {
            return res.status(409).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." })
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const { rows: novoUsuario } = await pool.query(
            `insert into usuarios (nome, email, senha) values ($1, $2, $3) returning id, nome, email
            `, [nome, email, senhaCriptografada]
        );

        return res.status(201).json(novoUsuario[0]);

    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const logarUsuario = async (req, res) => {
    try {
        const { email, senha } = req.body;

        const usuarioLogado = await verificarEmailExistente(email);

        if (usuarioLogado.rowCount < 1) {
            return res.status(401).json({ mensagem: "Usuário e/ou senha inválido(s)." });
        }

        const senhaValida = await bcrypt.compare(senha, usuarioLogado.rows[0].senha);

        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Usuário e/ou senha inválido(s)." })
        }

        const token = jwt.sign({ id: usuarioLogado.rows[0].id }, jwtSecret, { expiresIn: '8h' });

        const { senha: senhaUsuario, ...usuario } = usuarioLogado.rows[0];

        return res.status(200).json({ usuario, token });

    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const detalharUsuario = (req, res) => {
    const { id, nome, email } = req.usuario;

    const resultado = {
        id,
        nome,
        email
    }

    return res.status(200).json(resultado);
}

const atualizarUsuario = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const idToken = req.usuario.id;

        const emailValidado = await verificarEmailExistente(email);

        if (emailValidado.rowCount > 0 && emailValidado.rows[0].id !== idToken) {
            return res.status(409).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        await pool.query(`
            update usuarios
            set nome = $1, email = $2, senha = $3
            where id = $4`, [nome, email, senhaCriptografada, idToken]
        );

        return res.status(204).json();

    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

module.exports = {
    cadastrarUsuario,
    logarUsuario,
    detalharUsuario,
    atualizarUsuario
}