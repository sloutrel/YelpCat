const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!',
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error('string.escapeHTML', { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.animalSchema = Joi.object({
  animal: Joi.object({
    name: Joi.string().required().escapeHTML(),
    headline: Joi.string().required().escapeHTML(),
    age: Joi.number().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    // image: Joi.string().required(),
    species: Joi.string().required().escapeHTML(),
    breed: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.centerSchema = Joi.object({
  center: Joi.object({
    name: Joi.string().required().escapeHTML(),
    email: Joi.string().required().escapeHTML(),
    phone: Joi.string().required().escapeHTML(),
    yearEst: Joi.number().required().min(1900),
    description: Joi.string().required().escapeHTML(),
    geo: Joi.string().required().escapeHTML(),
    address: Joi.string().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    // images: Joi.string(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
