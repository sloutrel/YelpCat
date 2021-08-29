const mongoose = require("mongoose");
const Review = require("./review");
const Animal = require("./animal");
const Schema = mongoose.Schema;

const CenterSchema = new Schema({
  name: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  email: String,
  phone: String,
  description: String,
  address: String,
  location: String,
  image: String,
  yearEst: Number,
  animals: [
    {
      type: Schema.Types.ObjectId,
      ref: "Animal",
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CenterSchema.post("findOneAndDelete", async function (doc) {
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

module.exports = mongoose.model("Center", CenterSchema);
