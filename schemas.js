const Joi = require("joi");

module.exports.catSchema = Joi.object({
  cat: Joi.object({
    name: Joi.string().required(),
    headline: Joi.string().required(),
    age: Joi.number().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().required(),
  }).required(),
});
