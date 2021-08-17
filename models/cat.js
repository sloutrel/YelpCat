const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CatSchema = new Schema({
  headline: String,
  name: String,
  age: Number,
  price: Number,
  description: String,
  location: String,
  image: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = mongoose.model("Cat", CatSchema);
