const pool = require('../connections/conexao');

const validarCategoria = async (categoria_id) => {
    try {
        const categoriaEncontrada = await pool.query(`
        select * from categorias where id = $1`, [categoria_id]
        );

        return categoriaEncontrada;

    } catch (error) {
        throw error;
    }
}

const validarTransacao = async (idUsuario, idTransacao) => {
    try {
        const transacaoValidada = await pool.query(`
        select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as nome_categoria 
        from transacoes t
        inner join categorias c on t.categoria_id = c.id  
        where t.usuario_id = $1 and t.id = $2`, [idUsuario, idTransacao]
        );

        return transacaoValidada;

    } catch (error) {
        throw error;
    }
}

const cadastrarTransacao = async (req, res) => {
    try {
        const { descricao, valor, data, categoria_id, tipo } = req.body;
        const idToken = req.usuario.id;

        const { rows: categoriaEncontrada } = await validarCategoria(categoria_id);

        if (!categoriaEncontrada[0]) {
            return res.status(404).json({ mensagem: "Categoria informada não encontrada." });
        }

        const { rows: cadastro } = await pool.query(`
            insert into transacoes (descricao, valor, data, categoria_id, usuario_id, tipo)
            values ($1, $2, $3 , $4, $5, lower($6)) returning *
            `, [descricao, valor, data, categoria_id, idToken, tipo]
        );

        const cadastroOrdenado = {
            "id": cadastro[0].id,
            "tipo": cadastro[0].tipo,
            "descricao": cadastro[0].descricao,
            "valor": cadastro[0].valor,
            "data": cadastro[0].data,
            "usuario_id": cadastro[0].usuario_id,
            "categoria_id": cadastro[0].categoria_id,
            "categoria_nome": categoriaEncontrada[0].descricao
        }

        return res.status(201).json(cadastroOrdenado);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const detalharTransacao = async (req, res) => {
    try {
        const { id } = req.params;
        const idToken = req.usuario.id;

        const { rows: transacaoValidada } = await validarTransacao(idToken, id);

        if (!transacaoValidada[0]) {
            return res.status(404).json({ mensagem: "Transação não encontrada ou não pertence ao usuário." });
        }

        return res.status(200).json(transacaoValidada[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const obterExtrato = async (req, res) => {
    try {
        const idToken = req.usuario.id;

        const { rows: somaExtrato } = await pool.query(`
        select coalesce(sum(valor) filter(where tipo = 'entrada'),0) as "entrada",
        coalesce(sum(valor) filter(where tipo = 'saida'),0) as "saida"
        from transacoes where usuario_id = $1`, [idToken]
        );

        const totalExtrato = {
            "entrada": Number(somaExtrato[0].entrada),
            "saida": Number(somaExtrato[0].saida)
        }

        return res.status(200).json(totalExtrato);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const listarTransacoes = async (req, res) => {
    try {
        const parametros = [req.usuario.id];
        const filtro = req.query.filtro;

        let query = `select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, 
        t.categoria_id, c.descricao as categoria_nome from transacoes t 
        inner join categorias c on t.categoria_id = c.id
        where t.usuario_id = $1`;

        const filtroQuery = ` and lower(c.descricao) = any($2::text[])`;

        if (filtro) {
            const filtrosCategoria = Array.isArray(filtro) ? filtro : [filtro];
            query += filtroQuery
            parametros.push(filtrosCategoria.map(filtro => filtro.toLowerCase()));
        }

        const { rows: transacoesFiltradas } = await pool.query(query, parametros);

        res.status(200).json(transacoesFiltradas);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const atualizarTransacao = async (req, res) => {
    try {
        const { id } = req.params;
        const { descricao, valor, data, categoria_id, tipo } = req.body;
        const IdToken = req.usuario.id;

        const { rows: transacaoValidada } = await validarTransacao(IdToken, id);

        if (!transacaoValidada[0]) {
            return res.status(404).json({ mensagem: "Transação não encontrada ou não pertence ao usuário." });
        }

        const { rows: categoriaEncontrada } = await validarCategoria(categoria_id);

        if (!categoriaEncontrada[0]) {
            return res.status(404).json({ mensagem: "Categoria informada não encontrada." });
        }

        await pool.query(`
            update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = lower($5)
            where usuario_id = $6 and id = $7
            `, [descricao, valor, data, categoria_id, tipo, IdToken, id]
        );

        return res.status(204).json();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const excluirTransacao = async (req, res) => {
    try {
        const { id } = req.params;
        const idToken = req.usuario.id;

        const { rows: transacaoValidada } = await validarTransacao(idToken, id);

        if (!transacaoValidada[0]) {
            return res.status(404).json({ mensagem: "Transação não encontrada ou não pertence ao usuário." });
        }

        await pool.query(`
            delete from transacoes where usuario_id = $1 and id = $2`, [idToken, id]
        );

        res.status(204).json();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

module.exports = {
    cadastrarTransacao,
    detalharTransacao,
    obterExtrato,
    listarTransacoes,
    atualizarTransacao,
    excluirTransacao
}