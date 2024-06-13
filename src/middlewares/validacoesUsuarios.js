const validarCamposCadastro = (req, res, next) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "É obrigatório informar todos os dados." })
    }

    next();
}

const validarCamposLogin = (req, res, next) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "É obrigatório informar todos os dados." })
    }

    next();
}

module.exports = {
    validarCamposCadastro,
    validarCamposLogin
}