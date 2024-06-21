const validarCamposTransacao = (req, res, next) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: "É obrigatório informar todos os dados." });
    }

    if (valor <= 0 || isNaN(valor)) {
        return res.status(400).json({ mensagem: "Valor informado é inválido." });
    }

    if (tipo.toLowerCase() !== "entrada" && tipo.toLowerCase() !== 'saida') {
        return res.status(400).json({ mensagem: 'Informe um tipo de transação válida.' });
    }

    next();
}

module.exports = validarCamposTransacao;