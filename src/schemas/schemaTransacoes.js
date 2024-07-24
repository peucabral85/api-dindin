const joi = require('joi');

const schemaValidacoes = joi.object({
    descricao: joi.string().required().messages({
        'any.required': 'O campo descrição é obrigatório.',
        'string.empty': 'O campo descrição é obrigatório.',
        'string.base': 'O campo descrição deve ser uma string.'
    }),

    valor: joi.number().required().integer().positive().messages({
        'any.required': 'O campo valor é obrigatório.',
        'number.positive': 'O valor informado deve ser positivo.',
        'number.base': 'O valor informado precisa ser um número.',
        'number.integer': 'Por favor, informe o valor em centavos.'
    }),

    data: joi.date().required().iso().messages({
        'any.required': 'O campo data é obrigatório.',
        'date.format': 'Por favor, a data precisa estar no formato YYYY-MM-DD'
    }),

    categoria_id: joi.number().required().integer().positive().messages({
        'any.required': 'O campo categoria_id é obrigatório.',
        'number.positive': 'O valor informado no campo categoria_id deve ser positivo.',
        'number.base': 'O valor informado no campo categoria_id precisa ser um número.',
        'number.integer': 'O valor informado no campo categoria_id precisa ser um número inteiro.'
    }),

    tipo: joi.string().required().valid('entrada', 'saida').insensitive().messages({
        'any.required': 'O campo tipo é obrigatório.',
        'any.only': 'Por favor, informe um tipo de transação válida.',
        'string.base': 'O campo tipo deve ser uma string.'
    })

});

module.exports = schemaValidacoes;