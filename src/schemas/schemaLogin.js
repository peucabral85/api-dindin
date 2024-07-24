const joi = require('joi');

const schemaLogin = joi.object({
    email: joi.string().required().email().messages({
        'any.required': 'O campo nome é obrigatório.',
        'string.empty': 'O campo nome é obrigatório.',
        'string.email': 'Informe um email com formato válido.',
        'string.base': 'O campo email deve ser uma string.'
    }),

    senha: joi.string().required().messages({
        'any.required': 'O campo senha é obrigatório.',
        'string.empty': 'O campo senha é obrigatório.',
        'string.base': 'O campo senha deve ser uma string.'
    })
});

module.exports = schemaLogin;