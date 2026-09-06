const Joi = require('joi');

const articleValidation = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required()
});

module.exports = articleValidation;