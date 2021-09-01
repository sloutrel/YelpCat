const mongoose = require('mongoose');
const Review = require('./review');
const Animal = require('./animal');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CenterSchema = new Schema(
  {
    name: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    email: String,
    phone: String,
    description: String,
    address: String,
    location: String,
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
    images: [ImageSchema],
    yearEst: Number,
    animals: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Animal',
      },
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  opts
);

CenterSchema.virtual('properties.popUpMarkup').get(function () {
  return `<strong><a href="/centers/${this._id}">${this.name}</a></strong>`;
});

CenterSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
    await Animal.deleteMany({
      _id: {
        $in: doc.animals,
      },
    });
  }
});

module.exports = mongoose.model('Center', CenterSchema);
