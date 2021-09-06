const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const AnimalSchema = new Schema(
  {
    // headline: String,
    name: String,
    url: String,
    age: Number,
    price: Number,
    description: String,
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Center',
    },
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    images: [
      {
        url: String,
        filename: String,
      },
    ],
    center: {
      type: Schema.Types.ObjectId,
      ref: 'Center',
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    species: String,
    breed: String,
  },
  opts
);

AnimalSchema.virtual('properties.popUpMarkup').get(function () {
  return `<strong><a href="${this.url}">${this.name} - ${this.breed}</a></strong>`;
});

module.exports = mongoose.model('Animal', AnimalSchema);
