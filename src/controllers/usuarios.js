const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verificarEmailExistente, insertUsuario, updateUsuario } = require('../services/usuarios');

const cadastrarUsuario = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        const emailValidado = await verificarEmailExistente(email);

        if (emailValidado.length > 0) {
            return res.status(409).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." })
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await insertUsuario(nome, email, senhaCriptografada);

        return res.status(201).json(novoUsuario);

    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const logarUsuario = async (req, res) => {
    try {
        const { email, senha } = req.body;

        const usuarioLogado = await verificarEmailExistente(email);

        if (usuarioLogado.length < 1) {
            return res.status(401).json({ mensagem: "Usuário e/ou senha inválido(s)." });
        }

        const senhaValida = await bcrypt.compare(senha, usuarioLogado[0].senha);

        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Usuário e/ou senha inválido(s)." })
        }

        const token = jwt.sign({ id: usuarioLogado[0].id }, process.env.PASS_JWT, { expiresIn: '8h' });

        const { senha: senhaUsuario, ...usuario } = usuarioLogado[0];

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

        if (emailValidado.length > 0 && emailValidado[0].id !== idToken) {
            return res.status(409).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        await updateUsuario(nome, email, senhaCriptografada, idToken);

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