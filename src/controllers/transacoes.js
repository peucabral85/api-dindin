const pool = require('../connections/conexao');

const cadastrarTransacao = async (req, res) => {
    try {
        const { descricao, valor, data, categoria_id, tipo } = req.body;
        const idToken = req.usuario.id;

        const categoriaEncontrada = await pool.query(`
            select * from categorias where id = $1
            `, [categoria_id]
        );

        if (categoriaEncontrada.rowCount < 1) {
            return res.status(403).json({ mensagem: "Categoria informada não encontrada." });
        }

        const cadastro = await pool.query(`
            insert into transacoes (descricao, valor, data, categoria_id, usuario_id, tipo)
            values ($1, $2, $3, $4, $5, lower($6)) returning *
            `, [descricao, valor, data, categoria_id, idToken, tipo]
        );

        return res.status(201).json(cadastro.rows[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const detalharTransacao = async (req, res) => {
    try {
        const { id } = req.params;
        const idToken = req.usuario.id;

        const transacaoValidada = await pool.query(`
        select * from transacoes where usuario_id = $1 and id = $2`, [idToken, id]);

        if (transacaoValidada.rowCount < 1) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
        }

        return res.status(200).json(transacaoValidada.rows[0]);
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

        let query = `select t.*, c.descricao as categoria_nome from transacoes t 
        inner join categorias c on t.categoria_id = c.id
        where t.usuario_id = $1`;

        const filtroQuery = ` and c.descricao = any($2::text[])`;

        if (filtro) {
            const filtrosCategoria = Array.isArray(filtro) ? filtro : [filtro];
            query += filtroQuery
            parametros.push(filtrosCategoria);
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

        const transacaoValidada = await pool.query(`
            select * from transacoes where usuario_id = $1 and id = $2`, [IdToken, id]
        );

        if (transacaoValidada.rowCount < 1) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
        }

        const categoriaEncontrada = await pool.query(`
            select * from categorias where id = $1
            `, [categoria_id]
        );

        if (categoriaEncontrada.rowCount < 1) {
            return res.status(403).json({ mensagem: "Categoria informada não encontrada." });
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

        const transacaoValidada = await pool.query(`
            select * from transacoes where usuario_id = $1 and id = $2`, [idToken, id]
        );

        if (transacaoValidada.rowCount < 1) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
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