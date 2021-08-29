const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnimalSchema = new Schema({
  headline: String,
  name: String,
  age: Number,
  price: Number,
  description: String,
  location: String,
  image: String,
  center: [
    {
      type: Schema.Types.ObjectId,
      ref: "Center",
    },
  ],
  species: String,
  breed: String,
});

module.exports = mongoose.model("Animal", AnimalSchema);
