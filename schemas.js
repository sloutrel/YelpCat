const Joi = require("joi");

module.exports.animalSchema = Joi.object({
  animal: Joi.object({
    name: Joi.string().required(),
    headline: Joi.string().required(),
    age: Joi.number().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().required(),
    species: Joi.string().required(),
    breed: Joi.string().required(),
  }).required(),
});

module.exports.centerSchema = Joi.object({
  center: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    yearEst: Joi.number().required().min(1900),
    description: Joi.string().required(),
    address: Joi.string(),
    location: Joi.string().required(),
    image: Joi.string(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
